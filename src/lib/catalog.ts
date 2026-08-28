import catalogJson from "../data/catalog.json";
import manifestJson from "../data/manifest.json";
import statsJson from "../data/stats.json";
import type { WebMovie } from "../types/catalog";
import { assertPublicContract } from "./validate";

const { manifest, catalog, statsFile } = assertPublicContract(
  manifestJson,
  catalogJson,
  statsJson,
);

export function getManifest() {
  return manifest;
}

export function getMovies() {
  return catalog.movies;
}

export function getMovieBySlug(slug: string): WebMovie | undefined {
  return catalog.movies.find((movie) => movie.slug === slug);
}

export function getStats() {
  return statsFile.stats;
}
