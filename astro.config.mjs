import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL || undefined;
const base = process.env.BASE_PATH || undefined;

export default defineConfig({
  site,
  base,
  integrations: site ? [sitemap()] : [],
});
