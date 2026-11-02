import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL || undefined;

export default defineConfig({
  site,
  integrations: site ? [sitemap()] : [],
});
