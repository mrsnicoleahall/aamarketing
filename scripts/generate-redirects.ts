/**
 * Generate Redirects Mapping
 *
 * Takes extracted routes.json and a route-mapping.json config to produce
 * redirect files for static hosting (_redirects for Cloudflare/Netlify).
 *
 * Usage:
 *   npx tsx scripts/generate-redirects.ts
 *
 * Expects:
 *   scripts/output/routes.json (from extract-routes.ts)
 *   scripts/route-mapping.json (manual mapping, see template below)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const SCRIPTS_DIR = join(import.meta.dirname || __dirname);
const OUTPUT_DIR = join(SCRIPTS_DIR, "output");
const ROUTES_FILE = join(OUTPUT_DIR, "routes.json");
const MAPPING_FILE = join(SCRIPTS_DIR, "route-mapping.json");
const REDIRECTS_FILE = join(OUTPUT_DIR, "_redirects");
const REDIRECTS_JSON_FILE = join(OUTPUT_DIR, "redirects.json");

interface Route {
  url: string;
  path: string;
  lastmod?: string;
  type: string;
}

interface RouteMapping {
  exact: Record<string, string>;
  patterns: { from: string; to: string }[];
  defaults: Record<string, string>;
}

function createDefaultMapping(): RouteMapping {
  return {
    exact: {
      "/": "/",
      "/about": "/about",
      "/about-us": "/about",
      "/contact": "/contact",
      "/contact-us": "/contact",
      "/privacy-policy": "/privacy-policy",
      "/privacy": "/privacy-policy",
      "/services": "/services",
    },
    patterns: [
      { from: "/blog/(.*)", to: "/blog/$1" },
      { from: "/category/(.*)", to: "/blog/category/$1" },
      { from: "/tag/(.*)", to: "/blog" },
      { from: "/\\d{4}/\\d{2}/\\d{2}/(.*)", to: "/blog/$1" },
      { from: "/\\d{4}/\\d{2}/(.*)", to: "/blog/$1" },
      { from: "/\\d{4}/(.*)", to: "/blog/$1" },
    ],
    defaults: {
      page: "/",
      post: "/blog",
      category: "/blog",
      tag: "/blog",
      archive: "/blog",
      unknown: "/",
    },
  };
}

function resolveRedirect(route: Route, mapping: RouteMapping): string | null {
  // Check exact matches first
  if (mapping.exact[route.path]) {
    const target = mapping.exact[route.path];
    return route.path === target ? null : target;
  }

  // Check pattern matches
  for (const pattern of mapping.patterns) {
    const regex = new RegExp(`^${pattern.from}$`);
    const match = route.path.match(regex);
    if (match) {
      let target = pattern.to;
      match.slice(1).forEach((group, i) => {
        target = target.replace(`$${i + 1}`, group);
      });
      // Clean trailing slashes
      target = target.replace(/\/+$/, "") || "/";
      return route.path === target ? null : target;
    }
  }

  // Fall back to default for route type
  const defaultTarget = mapping.defaults[route.type] || "/";
  return route.path === defaultTarget ? null : defaultTarget;
}

function main() {
  if (!existsSync(ROUTES_FILE)) {
    console.error(`Routes file not found: ${ROUTES_FILE}`);
    console.error("Run extract-routes.ts first.");
    process.exit(1);
  }

  const routes: Route[] = JSON.parse(readFileSync(ROUTES_FILE, "utf-8"));

  let mapping: RouteMapping;
  if (existsSync(MAPPING_FILE)) {
    mapping = JSON.parse(readFileSync(MAPPING_FILE, "utf-8"));
    console.log("Using custom route mapping from route-mapping.json");
  } else {
    mapping = createDefaultMapping();
    // Write the default mapping for the user to customize
    writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2));
    console.log(`Created default route-mapping.json — customize it and re-run.`);
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });

  const redirects: { from: string; to: string; status: number }[] = [];

  for (const route of routes) {
    const target = resolveRedirect(route, mapping);
    if (target) {
      redirects.push({ from: route.path, to: target, status: 301 });
    }
  }

  // Generate _redirects file (Cloudflare Pages / Netlify format)
  const redirectsContent = redirects
    .map((r) => `${r.from}  ${r.to}  ${r.status}`)
    .join("\n");

  writeFileSync(REDIRECTS_FILE, redirectsContent);
  writeFileSync(REDIRECTS_JSON_FILE, JSON.stringify(redirects, null, 2));

  console.log(`\nGenerated ${redirects.length} redirects`);
  console.log(`  _redirects: ${REDIRECTS_FILE}`);
  console.log(`  redirects.json: ${REDIRECTS_JSON_FILE}`);
  console.log(`\nCopy _redirects to your public/ directory before building.`);
}

main();
