import { describe, expect, it } from "vitest";

import { hexToRgb, rgbToHex } from "../src/color";

describe("hexToRgb", () => {
  it("parses #rrggbb and #rgb", () => {
    expect(hexToRgb("#2f7d54")).toEqual([47, 125, 84]);
    expect(hexToRgb("2f7d54")).toEqual([47, 125, 84]);
    expect(hexToRgb("#fff")).toEqual([255, 255, 255]);
  });

  it("returns undefined for invalid input", () => {
    expect(hexToRgb(undefined)).toBeUndefined();
    expect(hexToRgb("")).toBeUndefined();
    expect(hexToRgb("#12345")).toBeUndefined();
    expect(hexToRgb("red")).toBeUndefined();
  });
});

describe("rgbToHex", () => {
  it("formats RGB arrays as lowercase hex", () => {
    expect(rgbToHex([47, 125, 84])).toBe("#2f7d54");
    expect(rgbToHex([0, 0, 0])).toBe("#000000");
    expect(rgbToHex([255, 255, 255])).toBe("#ffffff");
  });

  it("returns undefined for anything else", () => {
    expect(rgbToHex(undefined)).toBeUndefined();
    expect(rgbToHex("#2f7d54")).toBeUndefined();
    expect(rgbToHex([1, 2])).toBeUndefined();
    expect(rgbToHex([1, 2, 999])).toBeUndefined();
  });

  it("round-trips with hexToRgb", () => {
    expect(rgbToHex(hexToRgb("#d23b34"))).toBe("#d23b34");
  });
});
