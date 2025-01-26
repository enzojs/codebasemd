import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import ignore from "ignore";
import { parseArgs } from "./utils/parse-args";
import { readIgnorePatterns } from "./utils/ig-patterns";
import type { BiomeConfig } from "./types/BiomeConfig";
import { alwaysIgnore, outputFilename } from "./utils/defaul";
import { EXTENSION_TO_LANG } from "./utils/ext-map";

export async function codemap() {
  const argv = parseArgs(process.argv.slice(2));

  // Where to scan?
  const sourceDir = path.resolve(argv["source-code-path"] as string);

  // Should we read .gitignore?
  const useGitignore = Boolean(argv.gitignore);
  // Should we read biome.json?
  const useBiomeIgnore = Boolean(argv["biome-ignore"]);

  let gitignorePatterns: string[] = [];
  if (useGitignore) {
    const gitignorePath = path.join(sourceDir, ".gitignore");
    if (fs.existsSync(gitignorePath)) {
      gitignorePatterns = readIgnorePatterns(gitignorePath);
    }
  }

  let biomePatterns: string[] = [];
  if (useBiomeIgnore) {
    const biomePath = path.join(sourceDir, "biome.json");
    if (fs.existsSync(biomePath)) {
      try {
        const raw = fs.readFileSync(biomePath, "utf-8");
        const biomeConfig = JSON.parse(raw) as BiomeConfig;
        if (
          biomeConfig.files?.ignore &&
          Array.isArray(biomeConfig.files.ignore)
        ) {
          biomePatterns = biomeConfig.files.ignore;
        }
      } catch (err) {
        console.warn("Could not parse biome.json:", err);
      }
    }
  }

  // Combine ignore patterns from both sources
  const allIgnorePatterns = [
    ...gitignorePatterns,
    ...biomePatterns,
    ...alwaysIgnore,
  ];

  // Use 'ignore' to handle .gitignore style patterns
  const ig = ignore();
  ig.add(allIgnorePatterns);

  // Use fast-glob to collect all possible files (only files, not directories)
  const allFiles = await fg(["**/*"], {
    cwd: sourceDir,
    dot: false,
    onlyFiles: true,
  });

  // Filter out ignored paths
  const filteredFiles = allFiles.filter((file) => {
    // The 'ignore' library expects forward slashes for matching
    return !ig.ignores(file.replace(/\\/g, "/"));
  });

  // Build the Markdown output
  let markdownOutput = "";
  for (const relPath of filteredFiles) {
    const absolutePath = path.join(sourceDir, relPath);
    let fileContent = "";

    try {
      fileContent = fs.readFileSync(absolutePath, "utf-8");
    } catch (err) {
      console.warn(`Could not read file ${relPath}:`, err);
      continue;
    }

    // Determine the language from extension
    const ext = path.extname(relPath).slice(1).toLowerCase();
    const lang = EXTENSION_TO_LANG[ext] || "";

    markdownOutput += `File: ./${relPath}\n`;
    if (ext === "md") {
      markdownOutput += `${fileContent}\n`;
    } else {
      markdownOutput += `\`\`\`${lang}\n`;
      markdownOutput += fileContent;
      markdownOutput += "\n```\n";
    }
    markdownOutput += `End of file: ./${relPath}\n\n`;
  }

  // Write output to codebase.md
  const outputPath = path.join(sourceDir, outputFilename);
  fs.writeFileSync(outputPath, markdownOutput, "utf-8");

  console.log(`Created codebase.md at: ${outputPath}`);
}
