import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import * as fs from "fs/promises";
async function clipLink(url) {
  const response = await fetch(url);
  const html = await response.text();
  const dom = new JSDOM(html);
  const title = dom.window.document.title || "Untitled";
  const date = new Date().toISOString().split("T")[0];
  const filename = `${date} - ${title.replace(/[^a-z0-9\s]/gi, " ").trim()}.md`;
  const frontmatter = `---
title: ${title}
date: ${date}
type: link
url: ${url}
---`;
  await fs.writeFile(filename, frontmatter);
  console.log(`Created: ${filename}`);
}
const url = process.argv[2];
if (!url) {
  console.error("Please provide a URL");
  process.exit(1);
}
clipLink(url).catch(console.error);
//# sourceMappingURL=index.js.map
