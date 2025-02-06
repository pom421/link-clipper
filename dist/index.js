"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const jsdom_1 = require("jsdom");
const fs = __importStar(require("fs/promises"));
async function clipLink(url) {
    const response = await (0, node_fetch_1.default)(url);
    const html = await response.text();
    const dom = new jsdom_1.JSDOM(html);
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
