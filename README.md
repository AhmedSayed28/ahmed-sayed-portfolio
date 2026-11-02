# The Human API — Ahmed Sayed Ahmed

A static, content-driven portfolio for Ahmed Sayed Ahmed, built with Astro and strict TypeScript. It presents his quality engineering background and current direction in Java backend development.

## Run locally

Requires Node.js 22.23.4 or newer (or a supported newer even-numbered release).

```sh
npm install
npm run dev
```

Astro prints the local URL, normally `http://localhost:4321/`.

## Check and build

```sh
npm run check
npm run build
npm run preview
```

The static output is in `dist/`. No backend, database, account, or CMS is required.

## Edit the portfolio

- Personal details, social URLs, contact email, and optional portrait path: `src/data/profile.ts`. Put a real photo in `public/images/` and set `portrait` to `/images/filename.ext`. The illustrated placeholder remains until then. `showEmail` controls the email link. No phone number is published.
- Text and biography: `src/data/copy.ts` and `src/data/biography.ts`.
- Employment roles: `src/data/experience.ts`. Dates are intentionally absent until verified.
- Skill groups: `src/data/skills.ts`.
- Testimonials: `curated_portfolio_testimonials.json` is the only content file to edit. `homepageOrder` controls the six home cards and `allTestimonialsOrder` controls `/kind-words/`; keep each record's `isFeatured` and `displayOrder` in sync with those arrays. Set `visible: false` to hide a record. Student cards display `author.displayName` and `quote.englishTranslation`, while `quote.original` preserves Arabic feedback privately in the source. Student names are temporary pseudonyms (`isPseudonym: true`) and are disclosed on both pages; replace them only after identity and publication permission are confirmed. Professional names, roles, full recommendation text, and LinkedIn URLs remain in the same data file.
- Section visibility, title, and description: `src/data/siteConfig.ts`. Disabling a section also removes its navigation link; disabling Work removes its project detail routes.
- Colors, type, and spacing: `src/styles/tokens.css` and `src/styles/global.css`.

### Projects

Each project is one Markdown file in `src/content/projects/`. Its frontmatter is checked against the schema in `src/content.config.ts`. Copy `shopping-cart.md` to add a project, give the file a unique slug, and fill in its fields. Published visible entries appear in `order`; entries marked `featured` appear first. A project detail page is generated at `/projects/<slug>/`.

Set `visible: false` to hide a draft. Set `status: in-progress` to keep it out of published pages. To remove a project entirely, delete its Markdown file. The home page and routes update from the collection automatically.

`specimen` is optional. The current `shopping-cart` specimen is an illustrative diagram, not an API response. Future diagrams can be added as variants in `BusinessSpecimen.astro` without changing the case file layout. `coverImage` and `demoUrl` are optional; add them only when real assets or URLs exist.

## Publication setup

GitHub Pages deployment is configured in `.github/workflows/deploy-pages.yml`. The workflow builds with `SITE_URL=https://ahmed-sayed.me`, preserves the custom domain through `public/CNAME`, and deploys the static output from `dist/`. Astro emits canonical URLs and a sitemap through `@astrojs/sitemap`.

## Dependencies

- `astro`: static pages, components, and content collections.
- `@astrojs/sitemap`: sitemap generation when a final site URL is configured.
- `@astrojs/check` and `typescript`: local type and Astro template validation.
- `zod`: typed validation of project frontmatter.

The status badge uses a small native browser script. Everything else renders as static HTML and CSS. Fonts are loaded from Google Fonts with system fallbacks.
