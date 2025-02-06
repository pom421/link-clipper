import * as fs from "fs/promises";
import * as path from "path";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import TurndownService from "turndown";

export interface ClipperConfig {
  outputDir: string;
  imagesDir: string;
}

export interface ClippedPage {
  markdown: string;
  images: string[];
  title: string;
  originalUrl: string;
}

export class WebClipper {
  private config: ClipperConfig;
  private turndownService: TurndownService;

  constructor(config: ClipperConfig) {
    this.config = config;
    this.turndownService = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      bulletListMarker: "-",
    });

    // Créer les répertoires nécessaires
    this.initDirectories();
  }

  private async initDirectories(): Promise<void> {
    await fs.mkdir(this.config.outputDir, { recursive: true });
    await fs.mkdir(this.config.imagesDir, { recursive: true });
  }

  private async downloadImage(
    imageUrl: string,
    filename: string
  ): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      const buffer = await response.arrayBuffer();
      const imagePath = path.join(this.config.imagesDir, filename);
      await fs.writeFile(imagePath, Buffer.from(buffer));
      return imagePath;
    } catch (error) {
      console.error(
        `Erreur lors du téléchargement de l'image ${imageUrl}:`,
        error
      );
      return "";
    }
  }

  private async processImages(dom: JSDOM): Promise<string[]> {
    const images = Array.from(dom.window.document.getElementsByTagName("img"));
    const downloadedImages: string[] = [];

    for (const img of images) {
      const src = img.src;
      if (!src) continue;

      const filename = `${Date.now()}-${path.basename(src)}`;
      const localPath = await this.downloadImage(src, filename);

      if (localPath) {
        img.src = path.relative(this.config.outputDir, localPath);
        downloadedImages.push(localPath);
      }
    }

    return downloadedImages;
  }

  public async clipPage(url: string): Promise<ClippedPage> {
    // Télécharger la page
    const response = await fetch(url, {
      agent: new (require("https").Agent)({ rejectUnauthorized: false }),
    });
    const html = await response.text();

    // Parser le HTML
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Télécharger les images
    const images = await this.processImages(dom);

    // Extraire le titre
    const title = document.title || "Untitled Page";

    // Convertir en Markdown
    const markdown = this.turndownService.turndown(document.body);

    // Créer le fichier Markdown
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const markdownFilename = `${timestamp}-${title.replace(
      /[^a-z0-9]/gi,
      "-"
    )}.md`;
    const markdownPath = path.join(this.config.outputDir, markdownFilename);

    // Ajouter les métadonnées en haut du fichier
    const content = `---
title: ${title}
source: ${url}
date: ${new Date().toISOString()}
---

${markdown}`;

    await fs.writeFile(markdownPath, content, "utf-8");

    return {
      markdown: content,
      images,
      title,
      originalUrl: url,
    };
  }
}
