import minimist from "minimist";

/**
 * Parse command line flags using minimist.
 * Supported flags:
 *   --source-code-path=<string>
 *   --no-gitignore
 *   --no-biome-ignore
 *   --ignore=<patterns>     Comma-separated patterns to ignore
 *   --max-lines=<number>    Ignore files exceeding this line count
 *   --help
 */
export function parseArgs(args: string[]): {
  "source-code-path": string;
  gitignore: boolean;
  "biome-ignore": boolean;
  additionalIgnore?: string[];
  maxLines?: number;
} {
  const parsed = minimist(args, {
    string: ["source-code-path", "ignore", "max-lines"],
    boolean: ["gitignore", "biome-ignore", "help"],
    default: {
      gitignore: true,
      "biome-ignore": true,
      "source-code-path": ".",
    },
  });

  if (parsed.help) {
    console.log(`
Usage: codemap [options]

Options:
  --help                 Show this help message
  --source-code-path     Path to the source directory (default ".")
  --no-gitignore         Include files normally excluded by .gitignore
  --no-biome-ignore      Include files normally excluded by biome.json
  --ignore               Comma-separated patterns to ignore (e.g. --ignore="test/*,*.spec.*")
  --max-lines <number>   Automatically skip any file exceeding this line count
`);
    process.exit(0);
  }

  // Convert --ignore into an array of patterns
  let additionalIgnore: string[] | undefined;
  if (parsed.ignore) {
    // Could be a single string or multiple repeated flags
    if (Array.isArray(parsed.ignore)) {
      // If user did something like --ignore=foo --ignore=bar
      additionalIgnore = parsed.ignore
        .flatMap((val: string) => val.split(","))
        .map((val) => val.trim())
        .filter(Boolean);
    } else {
      // Single string: --ignore=foo,bar
      additionalIgnore = parsed.ignore
        .split(",")
        .map((val: string) => val.trim())
        .filter(Boolean);
    }
  }

  // Convert --max-lines into a number if provided
  let maxLines: number | undefined;
  if (parsed["max-lines"]) {
    const possibleNum = Number(parsed["max-lines"]);
    if (!Number.isNaN(possibleNum) && possibleNum > 0) {
      maxLines = possibleNum;
    }
  }

  return {
    "source-code-path": parsed["source-code-path"] || ".",
    gitignore: parsed.gitignore,
    "biome-ignore": parsed["biome-ignore"],
    additionalIgnore,
    maxLines,
  };
}
