import { copyFileSync, mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const PUBLIC_FILENAMES = ["manifest.json", "catalog.json", "stats.json"];

const FORBIDDEN_FILENAMES = new Set(["copies.json", "personal.json"]);
const DATABASE_PATTERN = /\.(db|sqlite3?)$/i;

export class SyncError extends Error {
  constructor(message) {
    super(message);
    this.name = "SyncError";
  }
}

function assertSafeSource(sourceDir) {
  const resolved = path.resolve(sourceDir);

  if (!statSync(resolved, { throwIfNoEntry: false })?.isDirectory()) {
    throw new SyncError(`source is not a directory: ${resolved}`);
  }

  const segments = resolved.split(path.sep).filter(Boolean);

  if (segments.some((segment) => segment === "private")) {
    throw new SyncError("refusing path that includes a private directory");
  }

  if (path.basename(resolved) !== "public") {
    throw new SyncError(
      "source must be the public directory (…/exports/web/public)",
    );
  }

  const names = readdirSync(resolved);

  for (const name of names) {
    if (FORBIDDEN_FILENAMES.has(name)) {
      throw new SyncError(`refusing forbidden filename: ${name}`);
    }

    if (DATABASE_PATTERN.test(name)) {
      throw new SyncError(`refusing database file: ${name}`);
    }
  }

  const extra = names.filter((name) => !PUBLIC_FILENAMES.includes(name));

  if (extra.length > 0) {
    throw new SyncError(`unexpected files in source: ${extra.join(", ")}`);
  }

  for (const name of PUBLIC_FILENAMES) {
    if (!names.includes(name)) {
      throw new SyncError(`missing required file: ${name}`);
    }
  }

  return resolved;
}

function assertSchemaVersion(filePath) {
  const payload = JSON.parse(readFileSync(filePath, "utf8"));

  if (payload.schema_version !== 1) {
    throw new SyncError(
      `${path.basename(filePath)} schema_version must be 1, got ${String(payload.schema_version)}`,
    );
  }
}

export function syncCatalogData(sourceDir, destDir) {
  const source = assertSafeSource(sourceDir);
  const dest = path.resolve(destDir);

  mkdirSync(dest, { recursive: true });

  for (const name of PUBLIC_FILENAMES) {
    const from = path.join(source, name);
    assertSchemaVersion(from);
    copyFileSync(from, path.join(dest, name));
  }

  return {
    source,
    dest,
    files: [...PUBLIC_FILENAMES],
  };
}

function isCli() {
  const self = fileURLToPath(import.meta.url);
  const invoked = process.argv[1] && path.resolve(process.argv[1]);
  return invoked === self;
}

if (isCli()) {
  const sourceArg = process.argv[2];

  if (!sourceArg) {
    console.error(
      "Usage: node scripts/sync-catalog-data.mjs <path-to-movie-catalog>/exports/web/public",
    );
    process.exit(1);
  }

  const dest = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "data");

  try {
    const result = syncCatalogData(sourceArg, dest);
    console.log(`Synced ${result.files.join(", ")} -> ${result.dest}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
