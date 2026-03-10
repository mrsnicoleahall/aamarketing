# Attorney Assistant — Marketing Website

Production-ready static marketing website for Attorney Assistant, built with **Astro**, **HubSpot**, **Tailwind CSS**, and **TypeScript**.

## Why Astro?

Astro was chosen as the SSG because it:

- **Ships zero JavaScript by default** — pages are pure static HTML
- **Generates one HTML file per route** (`/about/index.html`, `/blog/my-post/index.html`)
- **First-class content site support** — built-in sitemap, RSS, and image optimization
- **Islands architecture** — add interactivity only where needed without a full SPA
- **Fast builds** — parallel data fetching and incremental compilation
- **Strong TypeScript support** — end-to-end type safety

## Architecture Overview

```
HubSpot API ──▶ Astro SSG ──static HTML──▶ GitHub Pages
```

On every build (triggered by git push), Astro fetches testimonial data via the HubSpot API, generates static HTML pages, and deploys them.

## Quick Start

### Prerequisites

- Node.js 20+
- npm 10+

### 1. Clone & Install

```bash
git clone <repo-url>
cd attorney-assistant
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```
HUBSPOT_ACCESS_TOKEN=your_hubspot_access_token
SITE_URL=https://attorneyassistant.com
```

### 3. Run Locally

```bash
npm run dev
```

- Site: http://localhost:4321

### 4. Build for Production

```bash
npm run build
npm run preview  # Preview the build locally
```

Output goes to `dist/`.

## Project Structure

```
├── .github/workflows/     # CI/CD pipeline
├── .storybook/            # Storybook configuration
├── docs/                  # Architecture documentation
├── public/
│   ├── brand/logos/        # Brand logo assets
│   └── wp-content/        # Migrated WordPress images
├── scripts/               # WordPress migration tools
├── src/
│   ├── components/        # Astro components (Header, Footer, BlogCard, etc.)
│   ├── layouts/           # Page layouts
│   ├── lib/
│   │   └── hubspot.ts     # HubSpot client and fetch helpers
│   ├── pages/             # File-based routing
│   │   ├── blog/
│   │   ├── services/
│   │   ├── landing/[slug].astro
│   │   ├── signaturegenerator.astro
│   │   ├── styleguide.astro
│   │   ├── rss.xml.ts
│   │   └── ...
│   ├── stories/           # Storybook stories
│   └── styles/
│       └── global.css     # Tailwind + design tokens
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

## Content Management

### Adding a Blog Post

Blog posts are managed as Astro MDX files or fetched from HubSpot at build time.

### Adding a Page

Static pages (About, Services, etc.) are Astro files in `src/pages/`. To add a new static page:

1. Create `src/pages/your-page.astro`
2. Import and use `BaseLayout`
3. Add content directly in the template

## Deployment

### GitHub Actions (default)

The CI/CD pipeline in `.github/workflows/deploy.yml`:
1. Installs dependencies
2. Builds the static site
3. Deploys to GitHub Pages

**Required GitHub Secrets:**

| Secret | Description |
|--------|-------------|
| `HUBSPOT_ACCESS_TOKEN` | HubSpot private app read token |
| `SITE_URL` | Production URL (defaults to `https://attorneyassistant.com`) |
| `FTP_SERVER` | FTP deployment server |
| `FTP_USERNAME` | FTP username |
| `FTP_PASSWORD` | FTP password |

Set these at **Settings** → **Secrets and variables** → **Actions** in your GitHub repo.

## Brand Assets

| Token | Value |
|-------|-------|
| Black | `#0b0000` |
| White | `#ffffff` |
| Gold | `#ffaa2b` |
| Blue | `#50a7dd` |
| Steel | `#588aa5` |
| Heading Font | Poppins |
| Body Font | Roboto |

Design tokens are defined in `tailwind.config.mjs` and available as `brand-*` classes.

## Development

```bash
npm run dev        # Astro dev server on :4321
npm run build      # Production build
npm run preview    # Preview production build
npm run storybook  # Storybook on :6006
```
