/**
 * Parse WordPress XML export to JSON files for migration.
 * Blog posts are NOT imported (already in HubSpot). This extracts
 * images, routes, pages, authors, and categories.
 *
 * Usage: npm run migrate:parse-xml
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { parseStringPromise } from "xml2js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const XML_PATH = join(__dirname, "../.legacy/attorneyassistant.WordPress.2026-03-05.xml");
const OUTPUT_DIR = join(__dirname, "output");

const WP_UPLOADS_PREFIX = "https://attorneyassistant.com/wp-content/uploads/";
const LOCAL_UPLOADS_PREFIX = "/wp-content/uploads/";

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

function writeJSON(filename: string, data: any) {
  const path = join(OUTPUT_DIR, filename);
  writeFileSync(path, JSON.stringify(data, null, 2));
  console.log(`  ✓  ${filename} (${Array.isArray(data) ? data.length + " items" : "written"})`);
}

function cdata(val: any): string {
  if (!val) return "";
  if (Array.isArray(val)) val = val[0];
  if (typeof val === "string") return val;
  if (val._ !== undefined) return String(val._);
  return String(val);
}

function rewriteImageUrls(html: string): string {
  if (!html) return html;
  return html.replace(
    new RegExp(WP_UPLOADS_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
    LOCAL_UPLOADS_PREFIX
  );
}

interface WPItem {
  title: string[];
  link: string[];
  "wp:post_id": string[];
  "wp:post_date": string[];
  "wp:post_name": string[];
  "wp:post_type": string[];
  "wp:status": string[];
  "wp:attachment_url"?: string[];
  "content:encoded": string[];
  "excerpt:encoded": string[];
  "dc:creator": string[];
  category?: any[];
}

async function main() {
  console.log("Parsing WordPress XML export...\n");

  const xml = readFileSync(XML_PATH, "utf-8");
  const result = await parseStringPromise(xml, { explicitArray: true });

  const channel = result.rss.channel[0];
  const items: WPItem[] = channel.item || [];

  // ── Authors ──
  const wpAuthors = channel["wp:author"] || [];
  const authors = wpAuthors.map((a: any) => ({
    id: cdata(a["wp:author_id"]),
    login: cdata(a["wp:author_login"]),
    email: cdata(a["wp:author_email"]),
    displayName: cdata(a["wp:author_display_name"]),
    firstName: cdata(a["wp:author_first_name"]),
    lastName: cdata(a["wp:author_last_name"]),
  }));
  writeJSON("wp-xml-authors.json", authors);

  // ── Categories ──
  const wpTerms = channel["wp:term"] || [];
  const categories = wpTerms
    .filter((t: any) => cdata(t["wp:term_taxonomy"]) === "category")
    .map((t: any) => ({
      id: cdata(t["wp:term_id"]),
      slug: cdata(t["wp:term_slug"]),
      name: cdata(t["wp:term_name"]),
      parent: cdata(t["wp:term_parent"]) || null,
    }));
  writeJSON("wp-xml-categories.json", categories);

  // ── Separate items by post_type ──
  const pages: any[] = [];
  const posts: any[] = [];
  const attachments: any[] = [];
  const routes: any[] = [];

  for (const item of items) {
    const postType = cdata(item["wp:post_type"]);
    const status = cdata(item["wp:status"]);
    const slug = cdata(item["wp:post_name"]);
    const link = cdata(item.link);
    const title = cdata(item.title);
    const id = cdata(item["wp:post_id"]);

    if (postType === "attachment") {
      const url = cdata(item["wp:attachment_url"]);
      if (url) {
        attachments.push({
          id,
          title,
          url,
          localPath: url.replace(WP_UPLOADS_PREFIX, ""),
        });
      }
      continue;
    }

    if (status !== "publish") continue;

    const content = rewriteImageUrls(cdata(item["content:encoded"]));
    const excerpt = rewriteImageUrls(cdata(item["excerpt:encoded"]));
    const cats = (item.category || [])
      .filter((c: any) => c.$.domain === "category")
      .map((c: any) => cdata(c));

    if (postType === "page") {
      pages.push({
        id,
        title,
        slug,
        link,
        content,
        excerpt,
        author: cdata(item["dc:creator"]),
        date: cdata(item["wp:post_date"]),
      });

      routes.push({
        source: new URL(link).pathname,
        type: "page",
        slug,
        title,
      });
    }

    if (postType === "post") {
      posts.push({
        id,
        title,
        slug,
        link,
        excerpt,
        author: cdata(item["dc:creator"]),
        date: cdata(item["wp:post_date"]),
        categories: cats,
      });

      routes.push({
        source: new URL(link).pathname,
        destination: `/blog/${slug}/`,
        type: "post",
        title,
      });
    }
  }

  writeJSON("wp-xml-pages.json", pages);
  writeJSON("wp-xml-posts.json", posts);
  writeJSON("wp-xml-images.json", attachments);
  writeJSON("wp-xml-routes.json", routes);

  console.log("\nDone!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
