# Link clipper

A ts node module to get information of an url and generate a md file with only front matter.

## Installation

```shell
npm install link-clipper
```

## Usage

```typescript
import { clipLink } from "@pom421/link-clipper";

async function main() {
  const filePath = await clipLink("https://example.com", {
    outputDir: "./clipped-links",
  });
  console.log(`File created: ${filePath}`);
}
```

## Release

```shell
// run changeset to document your new release
npx changeset

// commit your files

// version package.json and publish on npmjs
npm run local-release
```
