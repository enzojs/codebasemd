# CodeBaseMD - CLI tool to merge your codebase into a single markdown file

Effortlessly consolidate your entire codebase into a single, well-structured Markdown file with this CLI tool. Designed to make large codebases more LLM-friendly, CodeBaseMD provides a streamlined way to improve context when working with AI tools, perfect for developers leveraging AI-driven coding assistance.

## Run

npm
```bash
npx codebasemd
```

bun
```bash
bunx codebasemd
```

## Help

```bash
bunx codebasemd --help
```

## Installing as dev dependency

```bash
bun add codebasemd --dev
```

```bash
bun run codebasemd
```

## Development

Install the dependencies:
```bash
bun install
```

Build:
```bash
bun run build
```

Use local build:
```bash
bun run gen
```

## bun?

[Bun](https://github.com/oven-sh/bun) is a fast JavaScript all-in-one toolkit.

## npm, pnpm, yarn etc?

It should work, just run the `npx` equivalent
```bash
npx codebasemd
```

## What is bunx?

(https://bun.sh/docs/cli/bunx)[https://bun.sh/docs/cli/bunx]

## TODO

- Implement tests
- Support more configuration options
- truncate large files `--truncate=<middle|top|bottom>` `--truncate-percent=10` will truncate 10% starting from `--truncate` arg only when the file exceeds `--max-lines` arg

## Contribute

(https://github.com/enzojs/codebasemd)[https://github.com/enzojs/codebasemd]
