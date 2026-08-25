import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { SyncError, syncCatalogData } from "../scripts/sync-catalog-data.mjs";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function validPublicFiles() {
  return {
    "manifest.json": {
      schema_version: 1,
      exported_at: "2026-01-01T00:00:00+00:00",
      movie_count: 1,
      files: ["catalog.json", "stats.json"],
    },
    "catalog.json": {
      schema_version: 1,
      movies: [
        {
          tmdb_id: 1,
          slug: "test-1999-1",
          title: "Test",
          copies: [],
        },
      ],
    },
    "stats.json": {
      schema_version: 1,
      stats: { movie_count: 1 },
    },
  };
}

function writeDir(root, files) {
  mkdirSync(root, { recursive: true });
  for (const [name, payload] of Object.entries(files)) {
    const content =
      typeof payload === "string" ? payload : `${JSON.stringify(payload, null, 2)}\n`;
    writeFileSync(path.join(root, name), content);
  }
}

describe("syncCatalogData", () => {
  it("copies only the three public files from a public directory", () => {
    const tmp = mkdtempSync(path.join(os.tmpdir(), "sync-ok-"));
    const source = path.join(tmp, "public");
    const dest = path.join(tmp, "dest");
    writeDir(source, validPublicFiles());

    const result = syncCatalogData(source, dest);

    expect(result.files).toEqual(["manifest.json", "catalog.json", "stats.json"]);
  });

  it("refuses a private directory", () => {
    const tmp = mkdtempSync(path.join(os.tmpdir(), "sync-private-"));
    const source = path.join(tmp, "private");
    writeDir(source, {
      ...validPublicFiles(),
      "copies.json": { schema_version: 1, copies: [] },
    });

    expect(() => syncCatalogData(source, path.join(tmp, "dest"))).toThrow(SyncError);
    expect(() => syncCatalogData(source, path.join(tmp, "dest"))).toThrow(/private/i);
  });

  it("refuses exports/web instead of exports/web/public", () => {
    const tmp = mkdtempSync(path.join(os.tmpdir(), "sync-web-"));
    const source = path.join(tmp, "web");
    writeDir(source, validPublicFiles());

    expect(() => syncCatalogData(source, path.join(tmp, "dest"))).toThrow(
      /public directory/,
    );
  });

  it("refuses copies.json even inside a public folder", () => {
    const tmp = mkdtempSync(path.join(os.tmpdir(), "sync-copies-"));
    const source = path.join(tmp, "public");
    writeDir(source, {
      ...validPublicFiles(),
      "copies.json": { schema_version: 1, copies: [] },
    });

    expect(() => syncCatalogData(source, path.join(tmp, "dest"))).toThrow(
      /copies\.json/,
    );
  });

  it("refuses sqlite files", () => {
    const tmp = mkdtempSync(path.join(os.tmpdir(), "sync-db-"));
    const source = path.join(tmp, "public");
    writeDir(source, {
      ...validPublicFiles(),
      "movies.db": "not a real database",
    });

    expect(() => syncCatalogData(source, path.join(tmp, "dest"))).toThrow(
      /database file/,
    );
  });

  it("refuses schema_version other than 1", () => {
    const tmp = mkdtempSync(path.join(os.tmpdir(), "sync-version-"));
    const source = path.join(tmp, "public");
    const files = validPublicFiles();
    files["catalog.json"].schema_version = 2;
    writeDir(source, files);

    expect(() => syncCatalogData(source, path.join(tmp, "dest"))).toThrow(
      /schema_version must be 1/,
    );
  });

  it("syncs the live movie-catalog public snapshot when present", () => {
    const live = path.join(
      repoRoot,
      "..",
      "movie-catalog",
      "exports",
      "web",
      "public",
    );
    const dest = path.join(mkdtempSync(path.join(os.tmpdir(), "sync-live-")), "data");

    const result = syncCatalogData(live, dest);
    expect(result.files).toHaveLength(3);
  });
});
