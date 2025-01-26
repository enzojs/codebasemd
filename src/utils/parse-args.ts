import minimist from "minimist";

/**
 * Parse command line flags using minimist.
 * Supported flags:
 * --source-code-path=<string>
 * --no-gitignore
 * --no-biome-ignore
 */
export function parseArgs(args: string[]): Record<string, string | boolean> {
  const parsed = minimist(args, {
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
       –help                 Show this help message
       –source-code-path     Path to the source directory (default ".")
       –no-gitignore         This will include files in .gitignore patterns to your codebase.md
       –no-biome-ignore      This will include files in biome.json file.ignore[] patterns to your codebase.md
    `);
    process.exit(0);
  }

  return {
    "source-code-path": parsed["source-code-path"] || ".",
    gitignore: parsed.gitignore,
    "biome-ignore": parsed["biome-ignore"],
  };
}
