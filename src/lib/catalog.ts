import catalogJson from "../data/catalog.json";
import manifestJson from "../data/manifest.json";
import statsJson from "../data/stats.json";
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

export function getStats() {
  return statsFile.stats;
}
