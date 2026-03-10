/**
 * Creates columns on the Testimonials HubDB table and publishes the draft.
 *
 * Usage: npm run setup:testimonials
 * Requires HUBSPOT_ACCESS_TOKEN in .env
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envFile = readFileSync(join(__dirname, "../.env"), "utf-8");
for (const line of envFile.split("\n")) {
  const match = line.match(/^([^#=]+)=(.+)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

const TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
const TABLE_ID = "199622291";
const BASE = "https://api.hubapi.com";

if (!TOKEN) {
  console.error("Missing HUBSPOT_ACCESS_TOKEN in .env");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

interface ColumnDef {
  name: string;
  label: string;
  type: string;
}

const desiredColumns: ColumnDef[] = [
  { name: "client_name", label: "Client Name", type: "TEXT" },
  { name: "company", label: "Company", type: "TEXT" },
  { name: "role", label: "Role", type: "TEXT" },
  { name: "quote", label: "Quote", type: "TEXT" },
  { name: "headshot_url", label: "Headshot URL", type: "TEXT" },
  { name: "rating", label: "Rating", type: "NUMBER" },
  { name: "featured", label: "Featured", type: "BOOLEAN" },
];

async function getTable() {
  const res = await fetch(`${BASE}/cms/v3/hubdb/tables/${TABLE_ID}/draft`, { headers });
  if (!res.ok) throw new Error(`Failed to get table: ${res.status} ${await res.text()}`);
  return res.json();
}

async function updateTable(columns: any[]) {
  const res = await fetch(`${BASE}/cms/v3/hubdb/tables/${TABLE_ID}/draft`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ columns }),
  });
  if (!res.ok) throw new Error(`Failed to update table: ${res.status} ${await res.text()}`);
  return res.json();
}

async function publishTable() {
  const res = await fetch(`${BASE}/cms/v3/hubdb/tables/${TABLE_ID}/draft/publish`, {
    method: "POST",
    headers,
  });
  if (!res.ok) throw new Error(`Failed to publish table: ${res.status} ${await res.text()}`);
  console.log("  ✓  Table published");
}

async function main() {
  console.log(`Setting up Testimonials HubDB table (${TABLE_ID})...\n`);

  // Get current table to check existing columns
  const table = await getTable();
  const existingNames = new Set((table.columns || []).map((c: any) => c.name));

  // Merge: keep existing columns (stripped to writable fields), add missing ones
  const columns = (table.columns || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    label: c.label,
    type: c.type,
  }));
  let added = 0;

  for (const col of desiredColumns) {
    if (existingNames.has(col.name)) {
      console.log(`  ⏭  Column "${col.name}" already exists`);
    } else {
      columns.push({ name: col.name, label: col.label, type: col.type });
      console.log(`  +  Adding column "${col.name}" (${col.type})`);
      added++;
    }
  }

  if (added > 0) {
    await updateTable(columns);
    console.log(`\n  ✓  Updated table with ${added} new column(s)`);
  } else {
    console.log("\n  All columns already exist");
  }

  console.log("");
  await publishTable();
  console.log("\nDone!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
