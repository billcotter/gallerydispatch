# Architecture

This is the current technical architecture for The Gallery Dispatch
website. Purpose and curatorial principles live in
[`PROJECT-VISION.md`](../PROJECT-VISION.md). Direction of travel lives
in [`docs/trajectory.md`](trajectory.md). Wave-specific work lives in
[`docs/milestones/`](milestones/).

Working repository name: `gallerydispatch`. Public site name is
not chosen yet.

---

## Repositories

```text
~/Projects/movie-catalog/          Film source of truth and publisher
~/Projects/gallerydispatch/        Public website (this repository)
```

`movie-catalog` owns SQLite, scan/enrich/probe, personal state, and
JSON publishing. This repository owns presentation, accessibility,
information architecture, and the committed *public* snapshot.

This site never reads `data/movies.db`, never reads
`exports/web/private/`, never copies `.env` or backups, and never
writes back to `movie-catalog`.

Catalog-side boundary: `movie-catalog` ADR 006.

---

## Film public contract (live)

Authoritative names come from `movie-catalog` publish tests, not from
remembered aliases.

Command:

```text
python -m movie_catalog publish
```

Website input:

```text
exports/web/public/manifest.json
exports/web/public/catalog.json
exports/web/public/stats.json
```

Never consume:

```text
exports/web/private/manifest.json
exports/web/private/copies.json
exports/web/private/personal.json
```

Wrappers use `"schema_version": 1`.

- Identity: `tmdb_id` (never SQLite `movies.id`)
- Slug field: `slug`
- Availability: `available`
- Catalog wrapper: `{ schema_version, movies }`
- Stats wrapper: `{ schema_version, stats }`
- Manifest `files`: `["catalog.json", "stats.json"]`

Public copy fields (available locations only): `container`,
`resolution`, `video_codec`, `audio_codecs`, `hdr`,
`duration_seconds`.

Public stats include `movie_count`, `available_movie_count`,
`unavailable_movie_count`, `available_copy_count`, `year_min`,
`year_max`, plus named-count lists for genres, languages, countries,
codecs, and HDR.

Sync copies those three public files into `src/data/` (W1, after
scaffold). Production builds do not read the Python repository.

---

## Site shape

Astro, TypeScript, `output: 'static'`. Package manager: pnpm
(`packageManager` in `package.json` is `pnpm@10.33.0`). No adapter, no
SSR, no React / Vue / Svelte, no Tailwind, no CMS, no API server.

v1 Film routes:

| Route | Role |
| --- | --- |
| `/` | Home (W1 contract-proof public stats snapshot, plus a Film CTA; not the long-term editorial homepage) |
| `/about/` | Purpose, Film, and TMDB provenance |
| `/movies/` | Film browse: poster-forward cards, static alphabetic in-page index |
| `/movies/[slug]/` | Film detail |
| `/genres/[genre]/` | Genre archive (later) |
| `/countries/[country]/` | Country archive (later) |
| `/stats/` | Collection facts (later) |

Navigation is Home · Film · About. `/movies/` is the stable Film
namespace.

Film browse (CURRENT):

- Native TMDB `<img>` with `srcset` (`w185` / `w342` / `w500`); no
  `astro:assets` pipeline
- Browse posters `loading="lazy"`; missing posters use a reserved 2:3
  fallback
- Presentation sort/group ignores a leading English A / An / The;
  displayed titles are unchanged; non-English articles are not stripped
- In-page `nav` named “Film index”; only populated letter/`#` sections
- One “Back to Film index” (`#film-index`) and “Back to top” (`#top`)
  pair per letter section
- Detail pages return to the specific Film card via
  `/movies/#film-{slug}` (“Back to {title} in Film”); breadcrumb stays
  `Film > Title` → `/movies/`; detail pages also include “Back to top”
- Narrow browse is a centered single column below `28rem`; narrow
  detail stacks poster above content and centers identity, not long-form
  text
- Zero client JavaScript on Home, Film browse, and Film detail
- Sticky/fixed header and hamburger menus are not used

Film detail hierarchy (CURRENT): identity, descriptive metadata, TMDB
audience rating as external reception, Sources. Copy, availability,
codecs, HDR, backdrop, and tagline are not shown.

---

## Platform vs Film

Shared: site header/footer, platform tokens, skip link, focus treatment.

Film-specific: `FilmCard`, Film detail record, TMDB poster URLs,
alphabetic Film index.

Do not invent a universal `CulturalObject`.

---

## Accessibility

- Institutional compatibility: WCAG 2.1 AA
- Project design target: WCAG 2.2 AA
- Native HTML first; ARIA only when necessary
- Landmarks, skip link, one `h1`, visible `:focus-visible`, keyboard
  access, `aria-current="page"`, no color-only state, contrast-safe
  tokens, `prefers-reduced-motion`
- W5 verifies; it does not introduce the shell

---

## Performance budgets (v1)

Numeric budgets live here, not in the vision document.

| Surface | Target |
| --- | --- |
| Home extra client JS | 0 |
| Film detail extra JS | 0 |
| `/movies/` filter enhancement | ≤ 4 KB minified JS, no framework |
| Site CSS | ≤ 20 KB uncompressed for v1 tokens + layout |
| Fonts | System stack in W1 |
| CLS | < 0.1 |
| LCP | ≤ 2.5 s typical broadband (TMDB images may dominate) |
| INP | ≤ 200 ms on `/movies/` filter |
| Lighthouse (home, one film, `/movies/`) | Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 90, Best Practices ≥ 90 |

Performance is visitor experience and stewardship, not a vanity score.

---

## CSS

Plain CSS plus custom-property tokens. Token names are platform-level
(`--color-bg`, `--color-accent`), not Film-only. Dark cinema values
are allowed as a Film-v1 theme.

---

## Dependencies and stewardship risks

Accepted and documented:

- Astro / Vite / TypeScript as build tooling
- TMDB metadata, hotlinked images, and audience ratings (attributed on
  Film and About; not original cataloguing by this site)
- Later: a static host

Do not hide these. Do not add a UI framework or Tailwind unless a
later milestone proves a visitor-facing need.
