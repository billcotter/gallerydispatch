import { describe, expect, it } from "vitest";

import { getMovies, getStats } from "../src/lib/catalog";
import {
  CatalogContractError,
  assertPublicContract,
} from "../src/lib/validate";

function validContract() {
  return {
    manifest: {
      schema_version: 1,
      exported_at: "2026-01-01T00:00:00+00:00",
      movie_count: 1,
      files: ["catalog.json", "stats.json"],
    },
    catalog: {
      schema_version: 1,
      movies: [
        {
          tmdb_id: 42,
          slug: "example-2001-42",
          title: "Example",
          copies: [{ container: "mkv" }],
        },
      ],
    },
    stats: {
      schema_version: 1,
      stats: {
        movie_count: 1,
        available_movie_count: 1,
        unavailable_movie_count: 0,
        available_copy_count: 1,
        year_min: 2001,
        year_max: 2001,
        genres: [],
        original_languages: [],
        production_countries: [],
        video_codecs: [],
        hdr: [],
      },
    },
  };
}

describe("assertPublicContract", () => {
  it("accepts a valid public snapshot", () => {
    const payload = validContract();
    payload.catalog.movies[0].copies = [{ container: "mkv" }];
    const result = assertPublicContract(
      payload.manifest,
      payload.catalog,
      payload.stats,
    );
    expect(result.catalog.movies).toHaveLength(1);
  });

  it("fails when schema_version is not 1", () => {
    const payload = validContract();
    payload.catalog.schema_version = 2;

    expect(() =>
      assertPublicContract(payload.manifest, payload.catalog, payload.stats),
    ).toThrow(CatalogContractError);
    expect(() =>
      assertPublicContract(payload.manifest, payload.catalog, payload.stats),
    ).toThrow(/schema_version must be 1/);
  });

  it("fails when catalog.movies is not an array", () => {
    const payload = validContract();

    expect(() =>
      assertPublicContract(payload.manifest, {
        ...payload.catalog,
        movies: { not: "an array" },
      }, payload.stats),
    ).toThrow(/movies must be an array/);
  });

  it("fails when slugs are duplicated", () => {
    const payload = validContract();
    payload.catalog.movies.push({
      tmdb_id: 43,
      slug: "example-2001-42",
      title: "Other",
      copies: [],
    });

    expect(() =>
      assertPublicContract(payload.manifest, payload.catalog, payload.stats),
    ).toThrow(/duplicate slug/);
  });

  it("fails when a forbidden operator key is present", () => {
    const payload = validContract();
    const movie = {
      ...payload.catalog.movies[0],
      path: "/Volumes/Media/film.mkv",
    };

    expect(() =>
      assertPublicContract(
        payload.manifest,
        { ...payload.catalog, movies: [movie] },
        payload.stats,
      ),
    ).toThrow(/forbidden public key "path"/);
  });

  it("fails when manifest.files lists unexpected artifacts", () => {
    const payload = validContract();
    payload.manifest.files = ["catalog.json", "copies.json"];

    expect(() =>
      assertPublicContract(payload.manifest, payload.catalog, payload.stats),
    ).toThrow(/manifest.files/);
  });
});

describe("live snapshot via catalog.ts", () => {
  it("loads the committed public catalog", () => {
    const movies = getMovies();
    const stats = getStats();

    expect(movies.length).toBeGreaterThan(0);
    expect(stats.movie_count).toBe(movies.length);
    expect(new Set(movies.map((movie) => movie.slug)).size).toBe(movies.length);
  });
});
