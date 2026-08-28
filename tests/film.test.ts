import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { getMovieBySlug, getMovies } from "../src/lib/catalog";
import {
  compareFilmsForBrowse,
  formatAudienceRating,
  formatJoinedList,
  formatReleaseDate,
  formatRuntime,
  getFilmBrowseSectionId,
  getFilmBrowseSectionKey,
  getFilmBrowseSections,
  getFilmBrowseTitle,
  getFilmCardHref,
  getFilmCardId,
  getFilmCardReturnLabel,
  getFilmPosterSources,
  getFilmStaticPaths,
  getFilmsForBrowse,
  getImdbUrl,
  getTmdbFilmUrl,
  shouldShowOriginalTitle,
} from "../src/lib/film";

describe("getMovieBySlug", () => {
  it("returns the film for a known live slug", () => {
    const movies = getMovies();
    const sample = movies[0];

    expect(sample).toBeDefined();
    expect(getMovieBySlug(sample.slug)).toEqual(sample);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getMovieBySlug("not-a-published-film-0")).toBeUndefined();
  });
});

describe("browse sorting", () => {
  it("sorts titles case-insensitively", () => {
    const films = [
      { title: "bravo", year: 2000, tmdb_id: 2 },
      { title: "Alpha", year: 2000, tmdb_id: 1 },
    ];

    const sorted = [...films].sort(compareFilmsForBrowse);

    expect(sorted.map((film) => film.title)).toEqual(["Alpha", "bravo"]);
  });

  it("breaks title ties by year, then tmdb_id", () => {
    const films = [
      { title: "Same", year: 2001, tmdb_id: 9 },
      { title: "Same", year: 1990, tmdb_id: 5 },
      { title: "Same", year: 1990, tmdb_id: 1 },
    ];

    const sorted = [...films].sort(compareFilmsForBrowse);

    expect(sorted).toEqual([
      { title: "Same", year: 1990, tmdb_id: 1 },
      { title: "Same", year: 1990, tmdb_id: 5 },
      { title: "Same", year: 2001, tmdb_id: 9 },
    ]);
  });

  it('places "if." with I titles rather than after Z', () => {
    const browse = getFilmsForBrowse();
    const ifFilm = browse.find((film) => film.slug === "if-1968-14794");
    const ikiru = browse.find((film) => film.slug === "ikiru-1952-3782");
    const zFilm = browse.find((film) => film.slug === "z-1969-2721");

    expect(ifFilm).toBeDefined();
    expect(ikiru).toBeDefined();
    expect(zFilm).toBeDefined();

    const ifIndex = browse.indexOf(ifFilm!);
    const ikiruIndex = browse.indexOf(ikiru!);
    const zIndex = browse.indexOf(zFilm!);

    expect(ifIndex).toBeLessThan(zIndex);
    expect(Math.abs(ifIndex - ikiruIndex)).toBeLessThan(10);
  });

  it("ignores leading English articles only for browse order", () => {
    const films = [
      { title: "The Killing", year: 1956, tmdb_id: 1 },
      { title: "Kansas City", year: 1996, tmdb_id: 2 },
      { title: "A Clockwork Orange", year: 1971, tmdb_id: 3 },
    ];
    const sorted = [...films].sort(compareFilmsForBrowse);

    expect(sorted.map((film) => film.title)).toEqual([
      "A Clockwork Orange",
      "Kansas City",
      "The Killing",
    ]);
  });
});

describe("article-aware browse titles", () => {
  it("strips English A/An/The without changing the display title", () => {
    expect(getFilmBrowseTitle("The Killing")).toBe("Killing");
    expect(getFilmBrowseTitle("The Third Man")).toBe("Third Man");
    expect(getFilmBrowseTitle("A Clockwork Orange")).toBe("Clockwork Orange");
    expect(getFilmBrowseTitle("An American in Paris")).toBe("American in Paris");
    expect(getFilmBrowseTitle("the killing")).toBe("killing");
  });

  it("does not strip non-English articles", () => {
    expect(getFilmBrowseTitle("Le Samourai")).toBe("Le Samourai");
    expect(getFilmBrowseTitle("La Strada")).toBe("La Strada");
    expect(getFilmBrowseTitle("Les Dames du bois de Boulogne")).toBe(
      "Les Dames du bois de Boulogne",
    );
    expect(getFilmBrowseTitle("El Sur")).toBe("El Sur");
    expect(getFilmBrowseTitle("Il Sorpasso")).toBe("Il Sorpasso");
    expect(getFilmBrowseTitle("L'Avventura")).toBe("L'Avventura");
  });

  it("assigns section keys from the same normalized title used for sorting", () => {
    expect(getFilmBrowseSectionKey("The Killing")).toBe("K");
    expect(getFilmBrowseSectionKey("The Third Man")).toBe("T");
    expect(getFilmBrowseSectionKey("A Clockwork Orange")).toBe("C");
    expect(getFilmBrowseSectionKey("An American in Paris")).toBe("A");
    expect(getFilmBrowseSectionKey("8½")).toBe("#");
    expect(getFilmBrowseSectionKey("if.")).toBe("I");
    expect(getFilmBrowseSectionKey("Le Samourai")).toBe("L");
    expect(getFilmBrowseSectionId("K")).toBe("films-k");
    expect(getFilmBrowseSectionId("#")).toBe("films-hash");
  });
});

describe("Film browse sections", () => {
  it("places every current Film in exactly one section", () => {
    const movies = getMovies();
    const sections = getFilmBrowseSections();
    const assigned = sections.flatMap((section) => section.films);
    const slugs = assigned.map((film) => film.slug);

    expect(assigned).toHaveLength(movies.length);
    expect(new Set(slugs).size).toBe(movies.length);

    for (const movie of movies) {
      const matches = assigned.filter((film) => film.slug === movie.slug);
      expect(matches).toHaveLength(1);
      expect(getFilmBrowseSectionKey(matches[0].title)).toBe(
        getFilmBrowseSectionKey(movie.title),
      );
    }
  });

  it("includes a # section for numeric titles and omits empty letters", () => {
    const sections = getFilmBrowseSections();
    const keys = sections.map((section) => section.key);

    expect(keys[0]).toBe("#");
    expect(keys).not.toContain("X");
    expect(
      sections.find((section) => section.key === "#")?.films.some(
        (film) => film.slug === "812-1963-422",
      ),
    ).toBe(true);
  });

  it("puts The Killing under K and keeps the displayed title", () => {
    const killing = getMovieBySlug("the-killing-1956-247");
    const kSection = getFilmBrowseSections().find((section) => section.key === "K");

    expect(killing?.title).toBe("The Killing");
    expect(getFilmBrowseSectionKey(killing!.title)).toBe("K");
    expect(kSection?.films.some((film) => film.slug === killing!.slug)).toBe(true);
  });

  it("builds card fragment IDs from the publisher slug", () => {
    expect(getFilmCardId("solaris-1972-593")).toBe("film-solaris-1972-593");
    expect(getFilmCardHref("solaris-1972-593")).toBe(
      "/movies/#film-solaris-1972-593",
    );
    expect(getFilmCardReturnLabel("Solaris")).toBe("Back to Solaris in Film");
    expect(getFilmCardReturnLabel("The Killing")).toBe(
      "Back to The Killing in Film",
    );
  });

  it("gives every current Film a unique card fragment that detail returns can target", () => {
    const movies = getMovies();
    const sections = getFilmBrowseSections();
    const ids = movies.map((movie) => getFilmCardId(movie.slug));
    const reserved = new Set([
      "top",
      "main-content",
      "film-index",
      ...sections.map((section) => section.id),
    ]);

    expect(movies).toHaveLength(772);
    expect(new Set(ids).size).toBe(movies.length);
    expect(ids.every((id) => id.startsWith("film-"))).toBe(true);

    for (const movie of movies) {
      const id = getFilmCardId(movie.slug);
      expect(id).toBe(`film-${movie.slug}`);
      expect(getFilmCardHref(movie.slug)).toBe(`/movies/#${id}`);
      expect(getFilmCardReturnLabel(movie.title)).toBe(
        `Back to ${movie.title} in Film`,
      );
      expect(reserved.has(id)).toBe(false);
    }
  });

  it("keeps Solaris's card inside the S section", () => {
    const sSection = getFilmBrowseSections().find(
      (section) => section.key === "S",
    );

    expect(getFilmBrowseSectionKey("Solaris")).toBe("S");
    expect(getFilmBrowseSectionId("S")).toBe("films-s");
    expect(
      sSection?.films.some((film) => film.slug === "solaris-1972-593"),
    ).toBe(true);
    expect(getFilmCardId("solaris-1972-593")).toBe("film-solaris-1972-593");
  });
});

describe("live snapshot coverage", () => {
  it("keeps all live slugs unique", () => {
    const slugs = getMovies().map((movie) => movie.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("covers every current public film in browse order and static paths", () => {
    const movies = getMovies();
    const browse = getFilmsForBrowse();
    const paths = getFilmStaticPaths();
    const browseSlugs = new Set(browse.map((film) => film.slug));
    const pathSlugs = new Set(paths.map((path) => path.params.slug));

    expect(browse).toHaveLength(movies.length);
    expect(paths).toHaveLength(movies.length);

    for (const movie of movies) {
      expect(browseSlugs.has(movie.slug)).toBe(true);
      expect(pathSlugs.has(movie.slug)).toBe(true);
      expect(getMovieBySlug(movie.slug)?.tmdb_id).toBe(movie.tmdb_id);
    }
  });

  it("still generates routes for sparse records without overviews", () => {
    const sparse = getMovies().filter((movie) => movie.overview === null);

    expect(sparse.length).toBeGreaterThan(0);

    const pathSlugs = new Set(
      getFilmStaticPaths().map((path) => path.params.slug),
    );

    for (const movie of sparse) {
      expect(movie.slug.length).toBeGreaterThan(0);
      expect(pathSlugs.has(movie.slug)).toBe(true);
      expect(getMovieBySlug(movie.slug)).toEqual(movie);
    }
  });
});

describe("getFilmPosterSources", () => {
  it("returns w185, w342, and w500 URLs from poster_path", () => {
    const poster = getFilmPosterSources("/example.jpg");

    expect(poster).toEqual({
      src: "https://image.tmdb.org/t/p/w342/example.jpg",
      srcset:
        "https://image.tmdb.org/t/p/w185/example.jpg 185w, https://image.tmdb.org/t/p/w342/example.jpg 342w, https://image.tmdb.org/t/p/w500/example.jpg 500w",
    });
  });

  it("returns null when poster_path is missing", () => {
    expect(getFilmPosterSources(null)).toBeNull();
    expect(getFilmPosterSources("")).toBeNull();
  });

  it("matches live poster presence for browse films", () => {
    const browse = getFilmsForBrowse();
    const withPoster = browse.filter((film) => film.poster_path);
    const withoutPoster = browse.filter((film) => !film.poster_path);

    expect(browse).toHaveLength(getMovies().length);
    expect(withoutPoster).toHaveLength(11);

    for (const film of withPoster) {
      const poster = getFilmPosterSources(film.poster_path);
      expect(poster?.srcset).toContain("/w185");
      expect(poster?.srcset).toContain("/w342");
      expect(poster?.srcset).toContain("/w500");
    }

    for (const film of withoutPoster) {
      expect(getFilmPosterSources(film.poster_path)).toBeNull();
    }
  });
});

describe("Film browse sources", () => {
  it("does not introduce client directives, pagination, or header chrome", () => {
    const card = readFileSync("src/components/FilmCard.astro", "utf8");
    const browse = readFileSync("src/pages/movies/index.astro", "utf8");
    const detail = readFileSync("src/pages/movies/[slug].astro", "utf8");
    const header = readFileSync("src/components/SiteHeader.astro", "utf8");
    const layout = readFileSync("src/layouts/BaseLayout.astro", "utf8");

    expect(card).not.toMatch(/client:/);
    expect(browse).not.toMatch(/client:/);
    expect(detail).not.toMatch(/client:/);
    expect(header).not.toMatch(/client:/);
    expect(layout).not.toMatch(/client:/);
    expect(browse).not.toMatch(/role="list"/);
    expect(detail).not.toMatch(/target="_blank"/);
    expect(browse).not.toMatch(/pagination|page=/i);
    expect(header).not.toMatch(/position:\s*(sticky|fixed)/);
    expect(layout).not.toMatch(/position:\s*(sticky|fixed)/);
    expect(header).not.toMatch(/hamburger|disclosure|menu-toggle/i);
  });

  it("wires page-top, Film index, and card fragment targets in markup", () => {
    const card = readFileSync("src/components/FilmCard.astro", "utf8");
    const browse = readFileSync("src/pages/movies/index.astro", "utf8");
    const detail = readFileSync("src/pages/movies/[slug].astro", "utf8");
    const layout = readFileSync("src/layouts/BaseLayout.astro", "utf8");

    expect(layout).toContain('id="top"');
    expect(browse).toContain('id="film-index"');
    expect(browse).toContain('href="#film-index"');
    expect(browse).toContain("Back to Film index");
    expect(browse).toContain('href="#top"');
    expect(browse).toContain("Back to top");
    expect(card).toContain("getFilmCardId");
    expect(card).toContain("id={cardId}");
    expect(detail).toContain("getFilmCardHref");
    expect(detail).toContain("getFilmCardReturnLabel");
    expect(detail).toContain('href="#top"');
    expect(detail).toContain("Back to top");
  });
});

describe("original title presentation", () => {
  it("shows original title only when it differs from the display title", () => {
    expect(shouldShowOriginalTitle("Solaris", "Солярис")).toBe(true);
    expect(
      shouldShowOriginalTitle(
        "Amelie",
        "Le Fabuleux Destin d'Amélie Poulain",
      ),
    ).toBe(true);
  });

  it("omits original title when it matches or is missing", () => {
    expect(
      shouldShowOriginalTitle("10 Rillington Place", "10 Rillington Place"),
    ).toBe(false);
    expect(shouldShowOriginalTitle("Horse Feathers", null)).toBe(false);
  });
});

describe("Film detail formatters", () => {
  it("formats runtime as human-readable minutes", () => {
    expect(formatRuntime(167)).toBe("167 minutes");
    expect(formatRuntime(1)).toBe("1 minute");
    expect(formatRuntime(null)).toBeNull();
    expect(formatRuntime(0)).toBeNull();
  });

  it("formats a valid release date and omits invalid values", () => {
    expect(formatReleaseDate("1972-03-20")).toBe("March 20, 1972");
    expect(formatReleaseDate(null)).toBeNull();
    expect(formatReleaseDate("1972")).toBeNull();
  });

  it("joins descriptive lists and omits empty ones", () => {
    expect(formatJoinedList(["Drama", "Science Fiction"])).toBe(
      "Drama, Science Fiction",
    );
    expect(formatJoinedList([])).toBeNull();
    expect(formatJoinedList(["", "  "])).toBeNull();
  });

  it("formats TMDB audience rating with scale and vote count", () => {
    expect(formatAudienceRating(7.763, 1869)).toEqual({
      statement: "7.8 / 10 · 1,869 ratings",
    });
    expect(formatAudienceRating(8, 1)).toEqual({
      statement: "8.0 / 10 · 1 rating",
    });
  });

  it("omits reception when rating or vote data is not valid", () => {
    expect(formatAudienceRating(null, 100)).toBeNull();
    expect(formatAudienceRating(7.5, null)).toBeNull();
    expect(formatAudienceRating(7.5, 0)).toBeNull();
  });

  it("builds TMDB and IMDb URLs without using raw IDs as required data", () => {
    expect(getTmdbFilmUrl(593)).toBe("https://www.themoviedb.org/movie/593");
    expect(getImdbUrl("tt0069293")).toBe("https://www.imdb.com/title/tt0069293/");
    expect(getImdbUrl(null)).toBeNull();
  });
});

describe("sparse and missing-poster records", () => {
  it("does not throw when formatting a sparse Film", () => {
    const horse = getMovieBySlug("horse-feathers-1932-13912");

    expect(horse).toBeDefined();
    expect(shouldShowOriginalTitle(horse!.title, horse!.original_title)).toBe(
      false,
    );
    expect(formatRuntime(horse!.runtime)).toBeNull();
    expect(formatReleaseDate(horse!.release_date)).toBeNull();
    expect(formatJoinedList(horse!.genres)).toBeNull();
    expect(
      formatAudienceRating(horse!.tmdb_rating, horse!.tmdb_vote_count),
    ).toBeNull();
    expect(getFilmPosterSources(horse!.poster_path)).toBeNull();
    expect(getImdbUrl(horse!.imdb_id)).toBeNull();
    expect(getTmdbFilmUrl(horse!.tmdb_id)).toContain(String(horse!.tmdb_id));
  });

  it("can use w500 as the detail poster source without changing browse default", () => {
    const detail = getFilmPosterSources("/example.jpg", { srcSize: "w500" });
    const browse = getFilmPosterSources("/example.jpg");

    expect(detail?.src).toBe("https://image.tmdb.org/t/p/w500/example.jpg");
    expect(browse?.src).toBe("https://image.tmdb.org/t/p/w342/example.jpg");
  });
});
