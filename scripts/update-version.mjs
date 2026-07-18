#!/usr/bin/env node
/**
 * Sync the version across all files.
 *
 * Usage: node scripts/update-version.mjs [new_version]
 *
 * The VERSION file in the project root is the source of truth. Synced targets:
 * package.json, package-lock.json; the bundle embeds the version at build time
 * (rollup replaces __VERSION__ from the VERSION file).
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const newVersion = process.argv[2];
if (newVersion) {
  if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
    console.error(`Not a x.y.z version: ${newVersion}`);
    process.exit(1);
  }
  writeFileSync("VERSION", `${newVersion}\n`);
}
const version = readFileSync("VERSION", "utf-8").trim();

for (const file of ["package.json", "package-lock.json"]) {
  if (!existsSync(file)) continue;
  const data = JSON.parse(readFileSync(file, "utf-8"));
  data.version = version;
  if (data.packages?.[""]) data.packages[""].version = version;
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Updated ${file} → ${version}`);
}

console.log("Rebuilding bundle …");
execSync("npm run build", { stdio: "inherit" });
