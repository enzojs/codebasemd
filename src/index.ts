#!/usr/bin/env node

import { codemap } from "./codemap";

codemap()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
