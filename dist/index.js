import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import * as fs from "fs/promises";
import * as path from "path";
export async function clipLink(url, options) {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const title = dom.window.document.title || "Untitled";
    const date = new Date().toISOString().split("T")[0];
    // remove any characters that are not alphanumeric, whitespace, or within the Unicode range for Latin-1 Supplement and Latin Extended-A characters.
    const filename = `${date} - ${title.trim()}.md`;
    const outputDir = options?.outputDir ?? ".";
    const fullPath = path.resolve(outputDir, filename);
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
const url = "https://www.welcometothejungle.com/fr/companies/communaute-beta-gouv/jobs/developpeur-fullstack-senior-pour-aquapreneur_paris?q=81cd036f43f8f7569a69a323083f5b84&o=a551e3b5-c1fb-462c-a048-235ad276fb48";
clipLink(url, { outputDir: "clippings" })
    .then((filename) => console.log("filename " + filename))
    .catch(console.error);
//# sourceMappingURL=index.js.map