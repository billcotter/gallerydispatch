# Cultural Archive (web)

Public website for a personal cultural archive. Film is the first
collection.

This repository is the website. It is not the catalog.

- Source of truth: sibling `movie-catalog` SQLite database
- Website input: `movie-catalog/exports/web/public/` only
- Vision: [`PROJECT-VISION.md`](PROJECT-VISION.md)
- Architecture: [`docs/architecture.md`](docs/architecture.md)
- Trajectory: [`docs/trajectory.md`](docs/trajectory.md)
- W1 (complete): [`docs/milestones/W1.md`](docs/milestones/W1.md)
- W2 (complete): [`docs/milestones/W2.md`](docs/milestones/W2.md)

Working title: Cultural Archive. Public name is not final.

## Boundary

Do not copy `exports/web/` wholesale. Do not import
`exports/web/private/`, SQLite databases, backups, or `.env`.

The site never writes back to `movie-catalog`.

## Prerequisites

- Node.js `>= 22.12`
- pnpm `10.33.0` (see `packageManager` in `package.json`)

Syncing a fresh snapshot later also requires a local `movie-catalog`
checkout and `python -m movie_catalog publish`. Production builds do
not run Python.

## Commands

```text
pnpm install
pnpm sync -- ../movie-catalog/exports/web/public
pnpm dev
pnpm check
pnpm test
pnpm build
pnpm preview
```

`pnpm sync` copies only `manifest.json`, `catalog.json`, and
`stats.json` from movie-catalog's public export directory. It refuses
`private/`, `copies.json`, `personal.json`, SQLite files, and extra
filenames.

## W2 status

W2 is complete: Film browse at `/movies/`, Film detail at
`/movies/[slug]/`, poster-forward cards, alphabetic in-page index, zero
client JavaScript. See [`docs/milestones/W2.md`](docs/milestones/W2.md).
