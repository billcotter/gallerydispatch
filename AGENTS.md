# Agent notes

This is a static cultural-archive website. Film JSON is consumed from
the sibling `movie-catalog` public publish contract only.

Do not add React, Vue, Svelte, Tailwind, SSR adapters, SQLite, or
private catalog artifacts. See `PROJECT-VISION.md` and
`docs/architecture.md`.

## Development

Start the local server with the project script:

```
pnpm dev
```

Stop it with Ctrl-C. Use package scripts rather than a global Astro
binary.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
