# Project vision

The website is a personal cultural archive and a professional
web-curation platform.

It exists to select, organize, connect, interpret, and publish cultural
works — not to mirror an inventory. It should also practice website
stewardship at a standard that would be defensible in a museum,
library, archive, or university setting.

Film is the first collection. It is not the permanent scope of the
platform.

This document states purpose, values, and enduring boundaries.
Current technical facts live in `docs/architecture.md`. Direction of
travel lives in `docs/trajectory.md`. Implementation waves live in
milestone documents.

---

## How to read related documents

- **CURRENT** — implemented, or an authoritative contract already in
  force.
- **DIRECTION** — a trajectory we intend to preserve, not yet built.
- **CANDIDATE** — a pattern or technology worth evaluating later.
- **DEFERRED** — a decision intentionally not made.

This vision stays durable. It does not name providers, lock schemas, or
schedule tickets.

---

## Purpose

The platform should:

1. Present a serious, ongoing engagement with the arts through
   selection, organization, connection, interpretation, and
   publication.
2. Make cultural material curated, accessible, and discoverable.
3. Demonstrate website management and digital-curation practice,
   including collection development, metadata, taxonomy, information
   architecture, provenance, rights awareness, editorial judgment,
   cultural relationships, and digital stewardship.
4. Demonstrate sound architecture: semantic HTML, accessibility, SEO,
   performance, privacy, maintainability, and durable public contracts.
5. Serve as a structured learning project for thinking like a website
   curator, not only a developer.

The site is a real archive. Its design and documentation demonstrate
professional skill. Those qualities can later serve as portfolio
evidence. Professional demonstration is an outcome, not the
visitor-facing identity.

Do not architect this as a résumé site, portfolio website, inventory
dashboard, or showcase-first product. Avoid “enterprise-grade”
language.

Success is not “pages exist.” Success is that a visitor can understand
the collection, and that a professional reader can see why the site is
built this way.

---

## Two audiences

### Project and documentation

This document should remain readable by the site owner, a collaborator,
a future maintainer, a hiring manager, and a museum or university web
professional.

### Public archive visitors

The live site is for people encountering the collection, not for people
reading the repository.

Visitors may include casual cultural visitors, film enthusiasts,
students and researchers, arts professionals, people arriving from
search, people with different levels of subject knowledge, and people
using assistive technologies.

Do not invent elaborate personas in v1.

> Curatorial decisions should account for visitors with different levels
> of subject knowledge, different discovery paths, and different access
> needs.

This affects terminology, metadata density, explanatory copy, taxonomy,
navigation, accessibility, search, and contextual information.

Do not assume expert knowledge. Do not oversimplify cultural content.

---

## What this is not

This is not a media server, streaming product, admin dashboard, CMS,
recommendation engine, or a complete inventory of everything owned.

v1 implements Film as the first collection only. Music, Books, Art, and
Publications are named so Film work does not trap the platform in a
movie-shaped design. Theater is deferred; it is not assumed as the next
collection.

---

## Architectural boundary

### Film source: `movie-catalog`

The Python application `movie-catalog` remains film-specific. It owns
SQLite as source of truth, film identity, TMDB cache, physical copy
metadata, technical probe metadata, personal state, and the public
publishing snapshot.

The website must not read SQLite, must not consume private publish
artifacts, and must not write back to `movie-catalog`.

### Public contract the website may consume

```text
exports/web/public/
  manifest.json
  catalog.json
  stats.json
```

That snapshot is a disposable public contract. The catalog can be
republished. The website must not treat the JSON files as a second
source of truth.

**CURRENT:** `schema_version` 1 publishes cataloged films. That is the
valid build input today.

**DIRECTION:** public Film membership should become an explicit
curatorial selection, not an automatic copy of ownership, watch state,
or personal rating.

### Future collections

Music, Books, Art, and Publications may arrive from other publishers or
data sources. The web platform should unify navigation and
presentation. It should not force every collection into a movie-shaped
backend schema.

> Shared site shell; distinct domain models.

Do not invent a universal `CulturalObject` until a second collection
proves the need. Different domains have different attribution, rights,
dating, edition, and provenance requirements. Flattening them too early
would hide those differences.

---

## Four quality pillars

Provenance, uncertainty, audience diversity, longevity, and stewardship
run through these four pillars. They are not a fifth pillar.

### 1. Accessible by design

Targets:

- WCAG 2.1 AA for institutional compatibility
- WCAG 2.2 AA as the project design target

> Native semantic HTML first; ARIA where necessary.

ARIA is part of accessibility. It is not a substitute for the right
HTML element, and accessibility is not “ARIA compliance.”

Accessibility includes semantic HTML, keyboard interaction, focus
management, accessible names, text alternatives, color and contrast,
responsive reflow, zoom, reduced motion, forms, assistive-technology
behavior, accessible content structure, and ARIA only when native HTML
cannot communicate the required role, state, or relationship.

Do not add redundant roles to `<header>`, `<nav>`, `<main>`,
`<footer>`, or `<button>`.

Design accessibility into the shell from W1. Later verification
remediates; it does not introduce landmarks, skip links, or focus
styles for the first time.

### 2. Semantic and discoverable

Prefer static HTML, meaningful document structure, descriptive and
stable URLs, canonical URLs, useful titles and descriptions, a sitemap,
structured data, and internal links that help humans.

SEO should follow information architecture and clarity. Do not generate
thin taxonomy pages or routes merely because a database facet exists.

Taxonomy may be editorial as well as organizational: a landing can
carry context and still offer complete browsing. That is not the same
as a required global `/archive/` route.

Where provenance or uncertainty matters to understanding, make it
visible rather than smoothing it away.

### 3. Fast by default

Use Astro static generation and progressive enhancement.

Prefer minimal JavaScript, no unnecessary framework runtime, efficient
CSS, controlled fonts, lazy images where appropriate, reserved image
dimensions or aspect ratios, and low layout shift.

> Performance is part of visitor experience and long-term web
> stewardship, not a vanity score.

Measurable budgets live in architecture and milestone documents so this
vision does not go stale. Regressions should be reviewed, not hidden.

### 4. Curatorially extensible

Film is first. The global shell, navigation, design tokens, editorial
patterns, metadata presentation, accessibility system, and taxonomy
approach should later support Music, Books, Art, and Publications
without flattening their differences.

Share platform patterns where they are genuinely common. Use
domain-specific components and models where semantics differ.

---

## Curatorial philosophy

Website curation, in this project, means deciding what deserves
emphasis and what to omit; shaping navigation; choosing taxonomy that
aids discovery; keeping terminology consistent; giving objects context;
respecting provenance; distinguishing facts from editorial
interpretation; avoiding clutter because a field exists; balancing
discoverability and simplicity; considering diverse audiences; treating
accessibility as part of interpretation; treating performance and
clarity as part of the visit; and documenting both curatorial and
technical choices.

> The site should not expose metadata merely because the database
> contains it.

> Metadata should retain its provenance, and uncertainty should not be
> silently converted into certainty.

Known, unknown, missing, inferred, externally sourced, and editorially
supplied are different states. The website should not silently
transform one into another.

Owned, watched, liked, rated, and selected are also different states.
They must not be treated as equivalent.

Illustrative, not a catalog of movie-catalog internals: missing HDR
classification is not automatically SDR; missing language is not
invented; unavailable does not mean deleted; unprobed does not mean
bad; a third-party rating is not the site owner’s rating; a high
personal rating is not automatic archive selection.

The same honesty applies later to art provenance, uncertain dates,
authorship, editions, and publications.

Distinguish:

- database fact
- editorial choice
- operator information
- visitor-facing context

These editorial emphases are not synonyms:

- **Featured** — intentional emphasis, independent of chronology.
- **Latest** — chronological editorial publication (for Dispatches).
- **Recently added** — recently added to a collection.
- **From the Archive** — deliberately resurfaced older material.
- **Popular** — audience attention, if evidence later exists.

Analytics may inform website-management and discovery questions. They
never determine cultural significance, Featured, or From the Archive.

Technical copy details support the Film archive. They must not dominate
film interpretation. Copies are not ranked. Unavailable films remain
legitimate public records, not broken pages.

---

## External metadata and curator-owned decisions

External datasets can supply factual metadata and reduce clerical work.
They do not perform curation.

Curator-owned responsibilities include whether a work belongs in the
archive, how it is related, how taxonomy is presented, what is
emphasized, and what is written interpretively.

Do not call third-party APIs as live page-render dependencies. Prefer
collection-specific acquisition, then a public snapshot, then the
static site.

---

## Dispatches

**DIRECTION:** an editorial layer called Dispatches — reviews, notes,
essays, reflections, concert or exhibition responses, and
cross-collection writing.

Structured records provide breadth. Dispatches provide voice and
depth. A Dispatch may relate to one work or many.

Dispatches are not required for Film browse. They are not a CMS
commitment.

---

## Professional standard

> Technical decisions should be defensible in a university, museum,
> library, archive, or cultural-institution web environment.

Evaluate against accessibility, semantics, privacy, maintainability,
documentation, progressive enhancement, performance, responsible
third-party metadata, content governance, provenance, honest
uncertainty, audience diversity, rights awareness, and long-term
stewardship.

The site need not look like an institutional template. It should
demonstrate institutional-quality reasoning.

> Prefer durable, portable web architecture over unnecessary platform
> dependence.

Where appropriate, favor static HTML, stable URLs, documented data
contracts, standards-based HTML/CSS/JS, minimal dependencies, portable
public snapshots, explicit provenance, reproducible builds, and
avoiding coupling that does not provide visitor value.

This is not an anti-cloud or anti-framework rule. Choose dependencies
intentionally. Some external dependencies remain legitimate — including
TMDB metadata and images, static hosting, and build tooling — and
should be documented as dependencies and stewardship risks, not hidden.

---

## Public and private data

Public, intentionally (CURRENT contract):

- catalog membership as published in `schema_version` 1
- film metadata suitable for a public archive
- logical availability
- approved anonymous technical copy summaries
- public collection statistics

Private:

- filesystem paths, drives, filenames, folders
- exact file sizes
- probe errors and operator probe state
- personal watched / rating / notes
- SQLite internal IDs
- enrichment operations and scan history
- credentials and backups

Public collection presentation is a publishing choice. Operational
infrastructure stays private. Watched and rated state remain private
and are not a substitute for selection.

Third-party metadata, especially TMDB, must be attributed and not
presented as original cataloguing by this site. Re-verify TMDB terms
when implementing attribution.

---

## Film v1

Film is the first concrete collection and the reference implementation
for later domains.

The first Film experience should emphasize poster-forward browsing;
title and year; overview; genre; country; language; runtime; TMDB/IMDb
references; collection availability; restrained technical copy
summaries; genre and country discovery; and public statistics.

The current public snapshot is a valid membership set for that
implementation. It is not the permanent definition of public Film.

Do not describe the site as a media server. Do not add director browse
until directors exist in the public contract. Do not invent “recently
added” without a published date field.

Film object URLs should remain stable under `/movies/` so later
Collections navigation does not require rewriting permalinks.

---

## Future collections

Not in v1. Named so the shell stays honest. These are sketches, not
schemas:

- **Film:** films, and later possibly directors, countries, languages,
  genres, periods
- **Music:** composers, works, recordings, performers, ensembles,
  conductors, releases, periods or forms
- **Books:** works, editions, authors, fiction/nonfiction, genres or
  forms, subjects, periods
- **Art:** artworks, artists, institutions, exhibitions, media,
  movements, periods
- **Publications:** left undefined until the actual use is clearer

Theater may be reconsidered later. It is not a primary next collection.

When a second collection exists, add it as its own model and publisher
contract. Do not stretch Film JSON to pretend it is music or art.

---

## Site identity and navigation

A final public name is not chosen here.

The name should eventually support several cultural domains; should not
imply streaming or a media server; should be distinct from
`movie-catalog`; should work as a page-title suffix; and should be
credible in a professional or cultural context without becoming a
résumé brand.

W1 navigation (no dead links):

```text
Home
About
```

Film is added when `/movies/` exists.

Later navigation lists only collections that actually exist. Do not
create empty Music, Books, Art, or Publications links.

Keep `/movies/` stable for Film.

The long-term Home should feel like a cultural publication’s front
page, not a database dashboard. That is DIRECTION, not the W1 page.

---

## Visual and design philosophy

Editorial cultural archive, not a SaaS dashboard: image-forward,
restrained metadata, strong typography, accessible contrast, responsive
layout, platform-level design tokens, low visual noise. Technical
information is visually secondary.

v1 uses plain CSS and CSS custom properties. That choice supports
learning CSS fundamentals, accessibility control, semantic markup
clarity, editorial design control, low complexity, portability, and
maintainability. It is not an SEO technique.

Do not introduce Tailwind unless a later milestone finds a concrete
need.

The dark cinema look is a Film-v1 theme. Token names should stay
platform-level so a later collection can theme without renaming the
system.

---

## Accessibility workflow

Build and test throughout: semantic review during implementation,
keyboard testing, accessibility-tree inspection, automated audits,
contrast checks, screen-reader spot testing, zoom and reflow testing,
and reduced-motion testing.

Later verification remediates; it is not the first accessibility pass.

---

## SEO philosophy

Rooted in meaningful content, semantic structure, useful navigation,
stable URLs, descriptive metadata, internal links, useful taxonomy,
fast pages, and accessibility.

Avoid thin taxonomy pages, keyword stuffing, and routes created only
because a facet exists in JSON.

---

## Documentation hierarchy

| Document | Role |
| --- | --- |
| PROJECT-VISION.md | Purpose, values, curatorial philosophy, enduring boundaries |
| docs/architecture.md | Current technical architecture and implemented constraints |
| docs/trajectory.md | Direction of travel, staged evolution, deferred decisions, learning trajectory |
| Milestone documents | What is being built next, gates, and learning goals |
| Tests / CI | Evidence that implementation matches the decisions |
| Optional later learning log | Retrospective notes about what can now be explained |

Do not turn this vision into a changelog, technical reference, backlog,
legal terms archive, or performance dashboard.

---

## Learning mission

This is intentionally a learning project.

The goal is not “learn Astro.” It is to understand why professional
website and digital-curation decisions are made and to be able to
explain them.

Learning includes collection development, metadata, taxonomy,
information architecture, semantic HTML, accessibility, SEO,
performance, provenance, rights awareness, editorial judgment, cultural
relationships, content strategy, analytics interpretation, and digital
stewardship.

> Generated implementation should not replace understanding.

Pause at meaningful decision points to understand the problem, why the
chosen solution fits, alternatives considered, accessibility and
curatorial implications, and how to explain the decision later. Do not
turn every coding task into a tutorial.

---

## Decision framework

Before adding a feature, dependency, taxonomy, or component, ask:

**Visitor**

- Does it improve visitor understanding?
- Who is the intended visitor for this information?
- Does it assume specialist knowledge that needs explanation?

**Curation**

- Is it curatorially meaningful, or does it merely expose more metadata?
- Where did this information come from?
- Are we turning uncertainty into false certainty?
- Does omitting it misrepresent the object?
- What should deliberately remain out?
- Are we conflating owned, watched, rated, and selected?

**Accessibility**

- Can native HTML express it?
- Is it usable by keyboard and assistive technology, including names,
  structure, contrast, motion, and reflow?

**Architecture**

- Does it preserve the public/private boundary?
- Does it require unnecessary client JavaScript?
- Does it make future collection domains easier or harder?
- Does it call a third-party API at page-render time?

**Stewardship**

- Would this be defensible in a museum, university, or archive context?
- Does the dependency provide enough visitor value to justify its
  maintenance and platform cost?
- Will this remain understandable to a future maintainer?
- Does it improve long-term stewardship (durable routes, portable
  contracts, documented dependencies)?

If the answer to “can I explain why we chose it?” is no, pause.

---

## Success criteria

The project succeeds if it demonstrates:

- an accessible visitor experience
- semantic, durable HTML
- strong static performance
- responsible metadata publishing
- clear public/private boundaries
- useful cultural discovery
- thoughtful information hierarchy
- maintainable architecture
- professional documentation
- a clear path to additional collection domains
- respectful treatment of metadata provenance
- honest representation of uncertainty
- durable and portable web architecture
- usability for visitors with different levels of subject knowledge
- thoughtful digital stewardship
- editorial judgment distinct from inventory and from popularity
- the ability to explain not only what was built, but why

---

## Explicit non-goals for now

v1 will not include:

- Music, Books, Art, Publications, or Theater implementation
- CMS, authentication, accounts, or required comments/likes/shares
- streaming or player
- personal-state editing or personalization
- recommendation engine or “AI curator” features
- admin dashboard
- direct SQLite access, API server, or SSR as the default architecture
- live third-party APIs during page render
- mobile app
- a generalized cultural-object backend
- a heavy JS framework (React, Vue, Svelte)
- Tailwind
- image ingestion
- a generalized search service
- analytics by default
- empty collection navigation
- popularity as a substitute for Featured or From the Archive

Do not expand implementation merely because the vision is broader.

---

## Relationship to `movie-catalog`

`movie-catalog` is the Film collection source and publisher. Its public
web contract is `exports/web/public`. Website code does not belong in
that repository. Direction for a later selection state belongs in a
future movie-catalog ADR, not in a silent website filter.

---

## How this document should change

Amend this file when purpose, pillars, or boundaries change.

Do not record tickets, numeric performance budgets, legal boilerplate,
hosting vendor details, or provider bake-offs here.

Date material revisions in git. Review when a collection strategy or
public-membership rule changes; not after every pull request.
