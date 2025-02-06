import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import * as fs from "fs/promises";
import * as path from "path";

export interface ClipOptions {
  outputDir: string;
}

export async function clipLink(url: string, options?: ClipOptions): Promise<string> {
  const response = await fetch(url);
  const html = await response.text();
  const dom = new JSDOM(html);
  const title = dom.window.document.title || "Untitled";

  const date = new Date().toISOString().split("T")[0];
  const filename = `${date} - ${title.replace(/[^a-z0-9\s]/gi, " ").trim()}.md`;
  const outputDir = options?.outputDir ?? ".";
  const fullPath = path.join(outputDir, filename);

  const frontmatter = `---
title: ${title}
date: ${date}
type: link
url: ${url}
---`;

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(fullPath, frontmatter);
  return fullPath;
}

// const url = process.argv[2];
// if (!url) {
//   console.error("Please provide a URL");
//   process.exit(1);
// }

// const url = "https://code.visualstudio.com/docs/getstarted/keybindings#_keyboard-shortcuts-editor";

// clipLink(url, { outputDir: "clippings" }).catch(console.error);
