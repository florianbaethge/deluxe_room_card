import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/** VERSION is the source of truth; everything else must match it. */
describe("version consistency", () => {
  const version = readFileSync("VERSION", "utf-8").trim();

  it("is a semver x.y.z", () => {
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("matches package.json", () => {
    const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
    expect(pkg.version).toBe(version);
  });

  it("is embedded in the committed bundle", () => {
    const bundle = readFileSync("dist/deluxe-room-card.js", "utf-8");
    expect(bundle).toContain(version);
    expect(bundle).not.toContain("__VERSION__");
  });
});
