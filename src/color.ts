/** Hex ↔ RGB helpers for ha-form's color_rgb selector.
 *
 * The config stores CSS-friendly hex strings; the native color picker
 * (selector: color_rgb) speaks [r, g, b] arrays.
 */

export type Rgb = [number, number, number];

/** "#rrggbb" (or "#rgb") → [r, g, b]; undefined for anything else. */
export function hexToRgb(hex?: string): Rgb | undefined {
  if (!hex) return undefined;
  const value = hex.trim().replace(/^#/, "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return undefined;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

/** [r, g, b] → "#rrggbb"; undefined for anything that is not an RGB array. */
export function rgbToHex(rgb?: unknown): string | undefined {
  if (!Array.isArray(rgb) || rgb.length !== 3) return undefined;
  if (!rgb.every((c) => typeof c === "number" && c >= 0 && c <= 255))
    return undefined;
  return (
    "#" + rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")
  );
}
