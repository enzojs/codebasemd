import fs from "node:fs";

/**
 * Reads a file line by line, ignoring empty lines and lines starting with '#'.
 */
export function readIgnorePatterns(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}
