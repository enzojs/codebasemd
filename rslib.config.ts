import { defineConfig } from "@rslib/core";

export default defineConfig({
  performance: {
    removeConsole: false,
    printFileSize: {
      detail: true,
      compressed: true,
      total: true,
    },
  },
  output: {
    minify: {
      js: true,
      jsOptions: {
        minimizerOptions: {
          compress: true,
          minify: true,
        },
      },
    },
  },
  lib: [
    {
      autoExternal: false,
      format: "esm",
      bundle: true,
      syntax: "esnext",
    },
  ],
});
