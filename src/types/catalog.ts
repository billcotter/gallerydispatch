export type NamedCount = {
  name: string;
  count: number;
};

export type PublicCopy = {
  container: string | null;
  resolution: string | null;
  video_codec: string | null;
  audio_codecs: string[];
  hdr: string | null;
  duration_seconds: number | null;
};

export type WebMovie = {
  tmdb_id: number;
  imdb_id: string | null;
  slug: string;
  title: string;
  year: number;
  original_title: string | null;
  original_language: string | null;
  spoken_languages: string[];
  production_countries: string[];
  origin_country: string[];
  release_date: string | null;
  runtime: number | null;
  genres: string[];
  overview: string | null;
  tagline: string | null;
  tmdb_rating: number | null;
  tmdb_vote_count: number | null;
  available: boolean;
  poster_path: string | null;
  backdrop_path: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  copies: PublicCopy[];
};

export type PublishManifest = {
  schema_version: 1;
  exported_at: string;
  movie_count: number;
  files: ["catalog.json", "stats.json"];
};

export type WebCatalog = {
  schema_version: 1;
  movies: WebMovie[];
};

export type PublicStats = {
  movie_count: number;
  available_movie_count: number;
  unavailable_movie_count: number;
  available_copy_count: number;
  year_min: number | null;
  year_max: number | null;
  genres: NamedCount[];
  original_languages: NamedCount[];
  production_countries: NamedCount[];
  video_codecs: NamedCount[];
  hdr: NamedCount[];
};

export type PublicStatsFile = {
  schema_version: 1;
  stats: PublicStats;
};
