# Agent notes

This is a static website for The Gallery Dispatch. Film JSON is
consumed from the sibling `movie-catalog` public publish contract only.

Do not add React, Vue, Svelte, Tailwind, SSR adapters, SQLite, or
private catalog artifacts. See `PROJECT-VISION.md`,
`docs/architecture.md`, and `docs/trajectory.md` for future-direction
context.

Linked Astro and Tailwind documentation below is upstream reference
material. It is not permission to add a UI framework, Tailwind, SSR, or
content collections unless a milestone explicitly changes the stack.

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
