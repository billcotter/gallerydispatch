import type { WebMovie } from "../types/catalog";
import { getMovies } from "./catalog";

export type BrowseFilm = Pick<WebMovie, "title" | "year" | "tmdb_id">;

const ENGLISH_ARTICLE = /^(the|an|a)\s+/i;
const LETTER_KEYS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function getFilmBrowseTitle(title: string): string {
  return title.trim().replace(ENGLISH_ARTICLE, "");
}

export function getFilmBrowseSectionKey(title: string): string {
  const first = getFilmBrowseTitle(title).charAt(0);
  return /^[A-Za-z]$/.test(first) ? first.toUpperCase() : "#";
}

export function getFilmBrowseSectionId(sectionKey: string): string {
  return sectionKey === "#" ? "films-hash" : `films-${sectionKey.toLowerCase()}`;
}

export function getFilmCardId(slug: string): string {
  return `film-${slug}`;
}

export function getFilmCardHref(slug: string): string {
  return `/movies/#${getFilmCardId(slug)}`;
}

export function getFilmCardReturnLabel(title: string): string {
  return `Back to ${title} in Film`;
}

export function compareFilmsForBrowse(a: BrowseFilm, b: BrowseFilm): number {
  const titleOrder = getFilmBrowseTitle(a.title).localeCompare(
    getFilmBrowseTitle(b.title),
    "en",
    { sensitivity: "base" },
  );

  if (titleOrder !== 0) {
    return titleOrder;
  }

  if (a.year !== b.year) {
    return a.year - b.year;
  }

  return a.tmdb_id - b.tmdb_id;
}

export function getFilmsForBrowse(): WebMovie[] {
  return [...getMovies()].sort(compareFilmsForBrowse);
}

export type FilmBrowseSection = {
  key: string;
  id: string;
  heading: string;
  films: WebMovie[];
};

export function getFilmBrowseSections(): FilmBrowseSection[] {
  const grouped = new Map<string, WebMovie[]>();

  for (const film of getFilmsForBrowse()) {
    const key = getFilmBrowseSectionKey(film.title);
    const films = grouped.get(key) ?? [];
    films.push(film);
    grouped.set(key, films);
  }

  return ["#", ...LETTER_KEYS]
    .filter((key) => grouped.has(key))
    .map((key) => ({
      key,
      id: getFilmBrowseSectionId(key),
      heading: key,
      films: grouped.get(key) ?? [],
    }));
}

export function getFilmStaticPaths() {
  return getMovies().map((movie) => ({
    params: { slug: movie.slug },
    props: { movie },
  }));
}

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export const FILM_POSTER_SIZES = ["w185", "w342", "w500"] as const;

export type FilmPosterSources = {
  src: string;
  srcset: string;
};

function tmdbPosterPath(posterPath: string): string {
  return posterPath.startsWith("/") ? posterPath : `/${posterPath}`;
}

export function getFilmPosterSources(
  posterPath: string | null,
  options?: { srcSize?: (typeof FILM_POSTER_SIZES)[number] },
): FilmPosterSources | null {
  if (!posterPath) {
    return null;
  }

  const path = tmdbPosterPath(posterPath);
  const srcSize = options?.srcSize ?? "w342";

  return {
    src: `${TMDB_IMAGE_BASE}/${srcSize}${path}`,
    srcset: FILM_POSTER_SIZES.map(
      (size) => `${TMDB_IMAGE_BASE}/${size}${path} ${size.slice(1)}w`,
    ).join(", "),
  };
}

export function shouldShowOriginalTitle(
  title: string,
  originalTitle: string | null,
): boolean {
  if (!originalTitle) {
    return false;
  }

  return (
    originalTitle.trim().localeCompare(title.trim(), undefined, {
      sensitivity: "base",
    }) !== 0
  );
}

export function formatRuntime(runtime: number | null): string | null {
  if (runtime == null || !Number.isFinite(runtime) || runtime <= 0) {
    return null;
  }

  const minutes = Math.round(runtime);
  return minutes === 1 ? "1 minute" : `${minutes} minutes`;
}

export function formatReleaseDate(releaseDate: string | null): string | null {
  if (!releaseDate) {
    return null;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(releaseDate)) {
    return null;
  }

  const date = new Date(`${releaseDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatJoinedList(values: string[]): string | null {
  const items = values.map((value) => value.trim()).filter(Boolean);
  return items.length > 0 ? items.join(", ") : null;
}

export type FilmAudienceRating = {
  statement: string;
};

export function formatAudienceRating(
  rating: number | null,
  voteCount: number | null,
): FilmAudienceRating | null {
  if (
    rating == null ||
    voteCount == null ||
    !Number.isFinite(rating) ||
    !Number.isFinite(voteCount) ||
    voteCount < 1
  ) {
    return null;
  }

  const score = (Math.round(rating * 10) / 10).toFixed(1);
  const votes = Math.round(voteCount);
  const votesLabel =
    votes === 1 ? "1 rating" : `${new Intl.NumberFormat("en").format(votes)} ratings`;

  return {
    statement: `${score} / 10 · ${votesLabel}`,
  };
}

export function getTmdbFilmUrl(tmdbId: number): string {
  return `https://www.themoviedb.org/movie/${tmdbId}`;
}

export function getImdbUrl(imdbId: string | null): string | null {
  if (!imdbId) {
    return null;
  }

  return `https://www.imdb.com/title/${imdbId}/`;
}
