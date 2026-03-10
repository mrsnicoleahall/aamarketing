/**
 * Extract Routes from WordPress Sitemap
 *
 * Fetches a WordPress sitemap.xml and extracts all URLs into a structured routes.json file.
 *
 * Usage:
 *   npx tsx scripts/extract-routes.ts https://old-site.com/sitemap.xml
 *   npm run migrate:extract-routes -- https://old-site.com/sitemap.xml
 */

import { parseStringPromise } from "xml2js";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUTPUT_DIR = join(import.meta.dirname || __dirname, "output");
const OUTPUT_FILE = join(OUTPUT_DIR, "routes.json");

interface Route {
  url: string;
  path: string;
  lastmod?: string;
  type: "page" | "post" | "category" | "tag" | "archive" | "unknown";
}

function classifyRoute(path: string): Route["type"] {
  if (path.match(/^\/(category|tag)\//)) {
    return path.startsWith("/category") ? "category" : "tag";
  }
  if (path.match(/^\/(20\d{2})\//)) return "archive";
  if (
    path.match(
      /^\/(blog|news|articles|insights)\//,
    )
  )
    return "post";
  if (
    path === "/" ||
    path.match(
      /^\/(about|services|contact|privacy|terms|team|careers|faq)/,
    )
  )
    return "page";
  // Heuristic: paths with a single segment are likely pages, deeper paths are likely posts
  const segments = path.split("/").filter(Boolean);
  return segments.length <= 1 ? "page" : "post";
}

async function fetchSitemap(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

async function parseSitemap(xml: string): Promise<Route[]> {
  const result = await parseStringPromise(xml);

  // Handle sitemap index (multiple sitemaps)
  if (result.sitemapindex) {
    const sitemapUrls: string[] = result.sitemapindex.sitemap.map(
      (s: any) => s.loc[0],
    );
    const allRoutes: Route[] = [];
    for (const sitemapUrl of sitemapUrls) {
      console.log(`  Fetching sub-sitemap: ${sitemapUrl}`);
      const subXml = await fetchSitemap(sitemapUrl);
      const subRoutes = await parseSitemap(subXml);
      allRoutes.push(...subRoutes);
    }
    return allRoutes;
  }

  // Handle regular sitemap
  if (!result.urlset?.url) return [];

  return result.urlset.url.map((entry: any) => {
    const fullUrl = entry.loc[0];
    const url = new URL(fullUrl);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    return {
      url: fullUrl,
      path,
      lastmod: entry.lastmod?.[0],
      type: classifyRoute(path),
    };
  });
}

async function main() {
  const sitemapUrl = process.argv[2];
  if (!sitemapUrl) {
    console.error("Usage: npx tsx scripts/extract-routes.ts <sitemap-url>");
    console.error("Example: npx tsx scripts/extract-routes.ts https://example.com/sitemap.xml");
    process.exit(1);
  }

  console.log(`Fetching sitemap from: ${sitemapUrl}`);
  const xml = await fetchSitemap(sitemapUrl);

  console.log("Parsing sitemap...");
  const routes = await parseSitemap(xml);

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, JSON.stringify(routes, null, 2));

  console.log(`\nExtracted ${routes.length} routes:`);
  const summary = routes.reduce(
    (acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  Object.entries(summary).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });

  console.log(`\nOutput written to: ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
