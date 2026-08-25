// @ts-check
import { defineConfig } from 'astro/config';

// Static HTML at build time. No adapter, no SSR, no on-demand routes.
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
});
