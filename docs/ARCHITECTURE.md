# Architecture Documentation

## System Overview

Attorney Assistant's marketing website is a statically generated site using the Jamstack architecture pattern. Testimonial data is fetched from HubSpot at build time by Astro, and the site is deployed as static HTML.

```
┌──────────────┐     ┌─────────────┐     ┌──────────────────┐
│              │     │             │     │                  │
│  HubSpot API │────▶│  Astro SSG  │────▶│  Static Hosting  │
│              │     │  (Build)    │     │  (GitHub Pages)  │
└──────────────┘     └─────────────┘     └──────────────────┘
                           │
                           ├── HTML pages
                           ├── sitemap.xml
                           ├── rss.xml
                           └── robots.txt
```

## Content Model

### Page Types

| Type | Description | Route Pattern |
|------|-------------|---------------|
| **Blog Post** | Articles managed as Astro/MDX content | `/blog/{slug}` |
| **Landing Page** | Campaign pages with flexible sections | `/landing/{slug}` |
| **Static Page** | Standard pages (About, Contact, etc.) | `/{slug}` |
| **Service Page** | Service-specific pages | `/services/{slug}` |

### HubSpot-Managed Data

- **Testimonials** — fetched via HubSpot API at build time (`src/lib/hubspot.ts`)

## Data Flow

### Build-Time Data Fetching

1. **Astro build starts** — `npm run build` triggers the Astro compiler
2. **Pages request data** — Each `.astro` page's frontmatter runs `fetch*` functions from `src/lib/hubspot.ts`
3. **HubSpot API responds** — Testimonial data is fetched and resolved
4. **HTML renders** — Astro templates produce complete HTML with all data embedded
5. **Static files output** — Final HTML, CSS, and assets go to `dist/`

### Dynamic Routes

Pages with `[slug]` patterns use `getStaticPaths()`:

```
src/pages/blog/[slug].astro
  → getStaticPaths() returns slug list
  → Astro generates /blog/post-1/index.html, /blog/post-2/index.html
```

## Build Process

```
npm run build
  │
  ├── 1. Astro resolves all page routes
  │     ├── Static routes: /, /about, /services, /contact, /privacy-policy
  │     ├── Dynamic routes: /blog/[slug], /blog/category/[slug], /landing/[slug]
  │     └── API routes: /rss.xml
  │
  ├── 2. getStaticPaths() fetches slugs for dynamic routes
  │
  ├── 3. Each page fetches its content (HubSpot API for testimonials)
  │
  ├── 4. Astro renders HTML with Tailwind CSS
  │
  ├── 5. @astrojs/sitemap generates sitemap-index.xml
  │
  └── 6. Output to dist/
        ├── index.html
        ├── about/index.html
        ├── blog/index.html
        ├── blog/post-slug/index.html
        ├── blog/category/cat-slug/index.html
        ├── services/index.html
        ├── services/intake-360/index.html
        ├── services/impact-assistants/index.html
        ├── contact/index.html
        ├── privacy-policy/index.html
        ├── rss.xml
        ├── sitemap-index.xml
        └── robots.txt
```

## Deployment Process

### GitHub Actions Pipeline

```
Push to main
  │
  ├── Install dependencies (npm ci)
  ├── Build site (npm run build)
  │     └── Fetches testimonials from HubSpot API during build
  ├── Upload artifact
  └── Deploy to GitHub Pages
```

### Environment Variables

| Variable | Where Set | Purpose |
|----------|-----------|---------|
| `HUBSPOT_ACCESS_TOKEN` | GitHub Secrets + `.env` | HubSpot private app read token |
| `SITE_URL` | GitHub Secrets + `.env` | Canonical site URL for sitemap/RSS |
| `FTP_SERVER` | GitHub Secrets | FTP deployment server |
| `FTP_USERNAME` | GitHub Secrets | FTP deployment username |
| `FTP_PASSWORD` | GitHub Secrets | FTP deployment password |

## Redirect Strategy

### WordPress Migration Redirects

The migration produces a `_redirects` file mapping old WordPress URLs to new routes:

```
/2024/01/15/old-post-slug  /blog/old-post-slug  301
/category/legal-tips        /blog/category/legal-tips  301
/about-us                   /about  301
```

### URL Patterns

| Old WordPress Pattern | New Route |
|----------------------|-----------|
| `/2024/01/post-slug` | `/blog/post-slug` |
| `/category/slug` | `/blog/category/slug` |
| `/tag/slug` | `/blog` |
| `/about-us` | `/about` |
| `/contact-us` | `/contact` |

## Styling Architecture

### Design Tokens

Brand colors and fonts are defined in `tailwind.config.mjs`:

```
brand-black: #0b0000
brand-white: #ffffff
brand-gold:  #ffaa2b
brand-blue:  #50a7dd
brand-steel: #588aa5

font-heading: Poppins
font-body:    Roboto
```

### CSS Layers

Global styles use Tailwind's `@layer` system:

- **Base:** Font imports, root variables, default element styles
- **Components:** `.container-narrow`, `.container-wide`, `.btn-primary`, `.btn-secondary`, `.prose-brand`
- **Utilities:** Standard Tailwind utilities

### Component Styling

Components use Tailwind utility classes directly in templates. No CSS modules or scoped styles — keeping styling co-located and predictable.

## Error Handling

- All HubSpot fetch calls are wrapped in `try/catch` blocks
- If HubSpot is unreachable during build, pages render with empty content (build doesn't fail)
- The site is fully functional even without HubSpot configured

## Performance

- **Zero client-side JavaScript** by default (Astro's static output)
- **Google Fonts loaded via CSS** with `display=swap`
- **Images lazy-loaded** with `loading="lazy"`
- **Static HTML** served directly from CDN edge — no server rendering
