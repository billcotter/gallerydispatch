# Trajectory

Direction of travel for The Gallery Dispatch.

Purpose and durable values live in [`PROJECT-VISION.md`](../PROJECT-VISION.md).
Current architecture lives in [`architecture.md`](architecture.md).
What is being built next lives in [`milestones/`](milestones/).

This document is shorter than the vision. It records CURRENT facts,
DIRECTION we intend to preserve, CANDIDATE ideas to evaluate later, and
DEFERRED decisions we refuse to pretend we have made.

---

## 1. How to read this document

- **CURRENT** — implemented, or an authoritative contract already in
  force. Do not rewrite it to match a later wish.
- **DIRECTION** — a trajectory we intend to preserve. Document it; do
  not implement it from this file alone.
- **CANDIDATE** — worth evaluating later. Not chosen.
- **DEFERRED** — intentionally undecided. Do not invent a solution to
  fill the gap.

If Vision and this file ever conflict on purpose or values, Vision
wins. If this file and architecture conflict on what exists today,
architecture wins.

---

## 2. Current foundation

**CURRENT**

- W1 and W2 are complete.
- The website is a sibling repository, not a subdirectory of
  `movie-catalog`.
- Stack: Astro static output, TypeScript, pnpm, Vitest, plain CSS with
  platform tokens, zero client JavaScript.
- Film input is the public JSON contract only:
  `manifest.json`, `catalog.json`, `stats.json`.
- Film browse and detail exist under `/movies/` and `/movies/[slug]/`.
  Browse is poster-forward, with static alphabetic in-page navigation
  and an English A/An/The presentation key that does not change displayed
  titles.

See [`milestones/W1.md`](milestones/W1.md),
[`milestones/W2.md`](milestones/W2.md), and
[`architecture.md`](architecture.md).

---

## 3. Curatorial model

**DIRECTION**

The archive is about:

- **Selection** — what belongs in the public archive
- **Interpretation** — context, writing, and emphasis
- **Relationships** — how works, people, and collections connect
- **Publication** — how that material is presented on the web

It is not a media server, not a complete inventory, and not a résumé
site. Professional demonstration is an outcome of doing the work well.

---

## 4. Film as reference implementation

**CURRENT / DIRECTION**

Film is collection one. Later collections should learn from Film
patterns — public snapshot, distinct domain model, accessible
presentation — without inheriting movie-shaped fields.

Film permalinks stay under `/movies/`.

**DIRECTION**

The next Film-curation need is people and credits, not more inventory
fields:

- director
- writing credits (preserve source role distinctions; do not flatten
  every credit into “writer”)
- principal cast (source order can be retained while public pages later
  choose how many names to show)
- person pages and explicit relationship browsing

Prefer transparent reasons over opaque recommendation:

- More by Alfred Hitchcock
- Featuring Toshiro Mifune
- Related Dispatches
- Music in this Film

rather than a generic “More Like This.”

This requires a deliberate `movie-catalog` public-contract expansion.
It is not a website-only invention. Exact schema, person URLs, cast
counts, stills, trailers, and profile images are not locked here.

**DEFERRED / RESEARCH**

Stills and trailers.

---

## 5. Selection vs inventory

**CURRENT**

`schema_version` 1 publishes cataloged films. The W1 snapshot is a
valid public membership set for Film work now.

**DIRECTION**

Public Film membership should become an explicit curatorial selection.
Owned, watched, liked, rated, and selected are different states.

**DEFERRED**

No schema change yet. Do not invent a silent website-side filter that
pretends selection already exists. A later `movie-catalog` ADR may add
an explicit selected state.

---

## 6. Future collection strategy

**DIRECTION**

Likely collections:

- Film
- Music
- Books
- Art
- Publications

**DEFERRED**

Theater is not assumed as the next major collection.

Add a collection to navigation only when it exists. No dead links, no
empty shells, no shared `CulturalObject`.

---

## 7. Domain models as sketches, not schemas

**CANDIDATE sketches**

- Film: films; later possibly directors, countries, languages, genres,
  periods
- Music: composers, works, recordings, performers, ensembles,
  conductors, releases, periods or forms
- Books: works, editions, authors, fiction/nonfiction, genres or forms,
  subjects, periods
- Art: artworks, artists, institutions, exhibitions, media, movements,
  periods
- Publications: undefined until the actual use is clearer

These are not database schemas and not permission to build empty
routes.

---

## 8. External metadata and provenance

**DIRECTION**

Acquisition pattern:

```text
external source → collection-specific publisher → public snapshot → Astro
```

Do not call third-party APIs as live page-render dependencies.

**CURRENT**

TMDB is the Film metadata source already used by `movie-catalog`.

**CANDIDATE**

Other APIs or datasets for Music, Books, Art, or Publications. Do not
bake provider choices into this document.

---

## 9. Rights and imagery

**DIRECTION**

Provenance, attribution, and licensing awareness belong in collection
design. Imagery is not automatically free to reuse because a URL
exists.

**CANDIDATE**

IIIF, where a later collection actually needs image interoperability.

**DEFERRED**

Host, CDN, and image-pipeline vendor.

---

## 10. Dispatches

**DIRECTION**

An editorial layer: reviews, notes, essays, reflections, and
cross-collection writing. Structured records provide breadth;
Dispatches provide voice.

**DEFERRED**

No CMS commitment, no route tree, no requirement that Film browse wait
for Dispatches.

---

## 11. Taxonomy and discovery

**DIRECTION**

A taxonomy landing may combine context, featured material, related
Dispatches, and complete browsing. That is richer than a thin facet
index and is not the same as a required global `/archive/`.

**CANDIDATE**

On-site search (for example Pagefind) after enough content exists to
search.

---

## 12. Cross-collection relationships

**DIRECTION**

Later, explicit typed relationships (inspired by, connected to,
adaptation of, and similar curator-owned links).

For Film, the first relationship layer to evaluate is people/credits:
director, writing, and principal cast, presented as named connections
rather than a recommendation engine.

**DEFERRED**

No graph database. No implied-relationship engine in v1 Film. No person
pages until the public contract can supply them.

---

## 13. Editorial homepage

**CURRENT**

The W1 Home page is a contract-proof snapshot of public Film stats. It
is not the long-term editorial homepage.

**DIRECTION**

Home should eventually feel like a cultural publication’s front page.
These modules are distinct:

| Module | Meaning |
| --- | --- |
| Featured | Intentional emphasis, independent of chronology |
| Latest Dispatches | Chronological editorial publication |
| From the Archive | Deliberately resurfaced older material |
| Recently Added | Recently added to a collection |
| Popular | Audience attention, if evidence later exists |

Do not treat these as synonyms. Do not auto-fill Featured from
popularity.

---

## 14. Analytics as evidence

**CANDIDATE**

Analytics may later inform website-management questions: what is
popular, what is discovered, what is explored, and whether taxonomy
helps.

**DIRECTION**

Analytics never determine cultural significance, Featured, or From the
Archive.

**DEFERRED**

Provider, implementation, and whether analytics ship at all.

---

## 15. Accessibility, SEO, and performance as ongoing gates

**CURRENT / DIRECTION**

WCAG 2.1 AA institutional compatibility, WCAG 2.2 AA design target,
native HTML first, ARIA only when needed.

Semantic structure, stable URLs, and meaningful content remain the SEO
basis.

Numeric performance budgets live in architecture and milestones, not
here. Every later wave keeps these as gates, not as a single late
cleanup.

---

## 16. Learning trajectory

**DIRECTION**

Every milestone should include implementation and professional /
curatorial learning. Typical competencies:

- collection development
- provenance and rights awareness
- editorial judgment
- cultural relationships
- analytics interpretation
- digital stewardship
- semantic HTML, accessibility, SEO, and performance

Generated code must not replace understanding.

---

## 17. Staged evolution

Do not lock the whole future to a fixed W-number plan. Approximate
order:

1. **CURRENT:** W1 foundation complete.
2. **CURRENT:** Film browse and detail (W2).
3. Film people/credits and person pages next, after a catalog contract
   exists — not a website fiction.
4. Taxonomy and discovery later.
5. SEO and attribution later.
6. Dispatches later.
7. A second collection later, when a real publisher and model exist.
8. Explicit Film selection-state later, via `movie-catalog`.

W-numbers in existing milestone files remain historical labels. New
work gets a milestone document when it is actually next.

---

## 18. Deferred decisions and anti-goals

**DEFERRED**

- public site name and domain
- host
- Music / Books / Art sources
- Publications model
- CMS
- analytics provider
- fonts
- collection schemas
- comments, likes, and shares
- Theater as a collection
- stills and trailers

**Anti-goals**

- no `CulturalObject`
- no generalization of `movie-catalog` into a multi-domain backend
- no empty collection shells
- no required community features
- no live third-party APIs in page rendering
- no premature CMS, SSR, or UI-framework switch
- no treating owned / watched / rated as selected
- no treating Popular as Featured or From the Archive
