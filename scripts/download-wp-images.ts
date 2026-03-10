/**
 * Download WordPress media attachments to public/wp-content/uploads/.
 * Resume-safe: skips files that already exist.
 *
 * Usage: npm run migrate:download-images
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT_FILE = join(__dirname, "output/wp-xml-images.json");
const OUTPUT_BASE = join(__dirname, "../public/wp-content/uploads");
const DELAY_MS = 100;

interface Attachment {
  id: string;
  title: string;
  url: string;
  localPath: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  if (!existsSync(INPUT_FILE)) {
    console.error("No wp-xml-images.json found. Run migrate:parse-xml first.");
    process.exit(1);
  }

  const attachments: Attachment[] = JSON.parse(readFileSync(INPUT_FILE, "utf-8"));
  console.log(`Found ${attachments.length} attachments to download.\n`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < attachments.length; i++) {
    const att = attachments[i];
    const destPath = join(OUTPUT_BASE, att.localPath);

    if (existsSync(destPath)) {
      skipped++;
      continue;
    }

    const dir = dirname(destPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    try {
      const res = await fetch(att.url);
      if (!res.ok) {
        console.error(`  ✗  [${res.status}] ${att.url}`);
        failed++;
        continue;
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      writeFileSync(destPath, buffer);
      downloaded++;

      if ((downloaded + skipped) % 25 === 0 || i === attachments.length - 1) {
        console.log(`  Progress: ${i + 1}/${attachments.length} (${downloaded} downloaded, ${skipped} skipped, ${failed} failed)`);
      }

      await sleep(DELAY_MS);
    } catch (err: any) {
      console.error(`  ✗  ${att.url}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone! Downloaded: ${downloaded}, Skipped: ${skipped}, Failed: ${failed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
