/**
 * Export WordPress Content via REST API
 *
 * Fetches posts and pages from a WordPress site's REST API
 * and outputs structured JSON files that can be imported into Sanity.
 *
 * Usage:
 *   npx tsx scripts/export-wp-content.ts https://old-site.com
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUTPUT_DIR = join(import.meta.dirname || __dirname, "output");

interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  modified: string;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: any;
}

interface WPCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface SanityBlogPost {
  _type: "blogPost";
  title: string;
  slug: { _type: "slug"; current: string };
  excerpt: string;
  publishedDate: string;
  wpId: number;
  htmlContent: string;
}

interface SanityCategory {
  _type: "category";
  title: string;
  slug: { _type: "slug"; current: string };
  description: string;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

async function fetchAllPages<T>(baseUrl: string): Promise<T[]> {
  const items: T[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const separator = baseUrl.includes("?") ? "&" : "?";
    const url = `${baseUrl}${separator}page=${page}&per_page=100`;
    console.log(`  Fetching: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 400) break; // No more pages
      throw new Error(`API error: ${response.status}`);
    }

    const data = (await response.json()) as T[];
    items.push(...data);

    const totalPages = parseInt(response.headers.get("x-wp-totalpages") || "1");
    hasMore = page < totalPages;
    page++;
  }

  return items;
}

async function main() {
  const siteUrl = process.argv[2];
  if (!siteUrl) {
    console.error("Usage: npx tsx scripts/export-wp-content.ts <wordpress-site-url>");
    console.error("Example: npx tsx scripts/export-wp-content.ts https://example.com");
    process.exit(1);
  }

  const apiBase = `${siteUrl.replace(/\/+$/, "")}/wp-json/wp/v2`;
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Fetch categories
  console.log("Fetching categories...");
  const wpCategories = await fetchAllPages<WPCategory>(`${apiBase}/categories`);

  const sanityCategories: SanityCategory[] = wpCategories
    .filter((c) => c.slug !== "uncategorized")
    .map((c) => ({
      _type: "category",
      title: stripHtml(c.name),
      slug: { _type: "slug", current: c.slug },
      description: stripHtml(c.description),
    }));

  writeFileSync(
    join(OUTPUT_DIR, "wp-categories.json"),
    JSON.stringify(sanityCategories, null, 2),
  );
  console.log(`  Exported ${sanityCategories.length} categories`);

  // Fetch posts
  console.log("Fetching posts...");
  const wpPosts = await fetchAllPages<WPPost>(`${apiBase}/posts?_embed`);

  const sanityPosts: SanityBlogPost[] = wpPosts.map((p) => ({
    _type: "blogPost",
    title: stripHtml(p.title.rendered),
    slug: { _type: "slug", current: p.slug },
    excerpt: stripHtml(p.excerpt.rendered),
    publishedDate: p.date,
    wpId: p.id,
    htmlContent: p.content.rendered,
  }));

  writeFileSync(
    join(OUTPUT_DIR, "wp-posts.json"),
    JSON.stringify(sanityPosts, null, 2),
  );
  console.log(`  Exported ${sanityPosts.length} posts`);

  // Fetch pages
  console.log("Fetching pages...");
  const wpPages = await fetchAllPages<WPPost>(`${apiBase}/pages`);

  const sanityPages = wpPages.map((p) => ({
    _type: "staticPage",
    title: stripHtml(p.title.rendered),
    slug: { _type: "slug", current: p.slug },
    wpId: p.id,
    htmlContent: p.content.rendered,
  }));

  writeFileSync(
    join(OUTPUT_DIR, "wp-pages.json"),
    JSON.stringify(sanityPages, null, 2),
  );
  console.log(`  Exported ${sanityPages.length} pages`);

  // Summary
  console.log(`\nExport complete!`);
  console.log(`  Categories: ${sanityCategories.length}`);
  console.log(`  Posts: ${sanityPosts.length}`);
  console.log(`  Pages: ${sanityPages.length}`);
  console.log(`\nOutput directory: ${OUTPUT_DIR}`);
  console.log(`\nNote: HTML content is preserved in htmlContent fields.`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
