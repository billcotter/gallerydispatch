import type {
  PublishManifest,
  PublicStatsFile,
  WebCatalog,
} from "../types/catalog";

export const EXPECTED_SCHEMA_VERSION = 1;

export const MANIFEST_FILES = ["catalog.json", "stats.json"] as const;

/** Keys that must never appear on public movies or copies. */
export const FORBIDDEN_PUBLIC_KEYS = new Set([
  "id",
  "drive",
  "folder_name",
  "path",
  "filename",
  "extension",
  "filesize_gb",
  "modified_date",
  "last_seen",
  "probe_status",
  "probe_error",
  "probed_at",
  "probed_filename",
  "probed_filesize_bytes",
  "bit_rate_kbps",
  "watched",
  "watched_at",
  "personal_rating",
  "notes",
  "tmdb_enrichment_status",
  "tmdb_enrichment_error",
  "tmdb_last_updated",
  "movie_id",
]);

export class CatalogContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatalogContractError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertRecord(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new CatalogContractError(`${label} must be an object`);
  }

  return value;
}

function assertSchemaVersion(record: Record<string, unknown>, label: string) {
  if (record.schema_version !== EXPECTED_SCHEMA_VERSION) {
    throw new CatalogContractError(
      `${label} schema_version must be ${EXPECTED_SCHEMA_VERSION}, got ${String(record.schema_version)}`,
    );
  }
}

function assertNoForbiddenKeys(record: Record<string, unknown>, label: string) {
  for (const key of Object.keys(record)) {
    if (FORBIDDEN_PUBLIC_KEYS.has(key)) {
      throw new CatalogContractError(
        `${label} contains forbidden public key "${key}"`,
      );
    }
  }
}

function sameStringList(actual: unknown, expected: readonly string[]): boolean {
  return (
    Array.isArray(actual) &&
    actual.length === expected.length &&
    actual.every((item, index) => item === expected[index])
  );
}

export function assertPublicContract(
  manifestValue: unknown,
  catalogValue: unknown,
  statsValue: unknown,
): {
  manifest: PublishManifest;
  catalog: WebCatalog;
  statsFile: PublicStatsFile;
} {
  const manifest = assertRecord(manifestValue, "manifest");
  const catalog = assertRecord(catalogValue, "catalog");
  const statsFile = assertRecord(statsValue, "stats");

  assertSchemaVersion(manifest, "manifest");
  assertSchemaVersion(catalog, "catalog");
  assertSchemaVersion(statsFile, "stats");

  if (!sameStringList(manifest.files, MANIFEST_FILES)) {
    throw new CatalogContractError(
      `manifest.files must be ${JSON.stringify(MANIFEST_FILES)}`,
    );
  }

  if (!Array.isArray(catalog.movies)) {
    throw new CatalogContractError("catalog.movies must be an array");
  }

  if (!isRecord(statsFile.stats)) {
    throw new CatalogContractError("stats.stats must be an object");
  }

  const slugs = new Set<string>();

  for (const [index, movieValue] of catalog.movies.entries()) {
    const movie = assertRecord(movieValue, `movies[${index}]`);
    const label = `movies[${index}]`;

    assertNoForbiddenKeys(movie, label);

    if (typeof movie.slug !== "string" || movie.slug.length === 0) {
      throw new CatalogContractError(`${label} is missing a slug`);
    }

    if (slugs.has(movie.slug)) {
      throw new CatalogContractError(`duplicate slug "${movie.slug}"`);
    }

    slugs.add(movie.slug);

    if (!Array.isArray(movie.copies)) {
      throw new CatalogContractError(`${label}.copies must be an array`);
    }

    for (const [copyIndex, copyValue] of movie.copies.entries()) {
      const copy = assertRecord(copyValue, `${label}.copies[${copyIndex}]`);
      assertNoForbiddenKeys(copy, `${label}.copies[${copyIndex}]`);
    }
  }

  return {
    manifest: manifest as PublishManifest,
    catalog: catalog as WebCatalog,
    statsFile: statsFile as PublicStatsFile,
  };
}
