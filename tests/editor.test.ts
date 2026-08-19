import { beforeEach, describe, expect, it } from "vitest";

import "../src/deluxe-room-card-editor";
import type { DeluxeRoomCardEditor } from "../src/deluxe-room-card-editor";
import type { DeluxeRoomCardConfig } from "../src/types";
import { entity, makeHass } from "./helpers";

const base: DeluxeRoomCardConfig = {
  type: "custom:deluxe-room-card",
  title: "Living room",
};

async function mountEditor(
  config: DeluxeRoomCardConfig = base,
): Promise<DeluxeRoomCardEditor> {
  const editor = document.createElement("deluxe-room-card-editor");
  editor.hass = makeHass([entity("light.lamp", "off")], {
    areas: { wz: { area_id: "wz", name: "Living room" } },
    entities: {
      "light.lamp": { entity_id: "light.lamp", area_id: "wz" },
    },
  });
  editor.setConfig(config);
  document.body.appendChild(editor);
  await editor.updateComplete;
  // loadHaForm resolves asynchronously; wait one more cycle.
  await new Promise((resolve) => setTimeout(resolve, 0));
  await editor.updateComplete;
  return editor;
}

/** Unfold a collapsed top-level section by its header text. */
async function openSection(
  editor: DeluxeRoomCardEditor,
  title: string,
): Promise<void> {
  const heads = Array.from(
    editor.shadowRoot?.querySelectorAll(".section-head") ?? [],
  );
  const head = heads.find((h) => h.textContent?.includes(title));
  expect(head, `section "${title}" exists`).toBeDefined();
  (head as HTMLElement).click();
  await editor.updateComplete;
}

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("editor", () => {
  it("renders all section headers, collapsed by default", async () => {
    const editor = await mountEditor();
    const text = editor.shadowRoot?.textContent ?? "";
    expect(text).toContain("Climate");
    expect(text).toContain("Openings");
    expect(text).toContain("Controls");
    expect(text).toContain("Alerts");
    expect(text).toContain("Card outline rules");
    expect(text).toContain("Import from area");
    // Collapsed: no section bodies (and no add buttons) until opened.
    expect(editor.shadowRoot?.querySelectorAll(".section-body")).toHaveLength(
      0,
    );
    expect(editor.shadowRoot?.querySelectorAll("mwc-button")).toHaveLength(0);
  });

  it("shows item counts on section headers", async () => {
    const editor = await mountEditor({
      ...base,
      controls: [{ entity: "light.lamp" }, { entity: "light.other" }],
    });
    const counts = Array.from(
      editor.shadowRoot?.querySelectorAll(".section-count") ?? [],
    ).map((el) => el.textContent?.trim());
    expect(counts).toContain("2");
  });

  it("expands and collapses a section on header click", async () => {
    const editor = await mountEditor();
    await openSection(editor, "Openings");
    expect(editor.shadowRoot?.querySelectorAll(".section-body")).toHaveLength(
      1,
    );
    await openSection(editor, "Openings");
    expect(editor.shadowRoot?.querySelectorAll(".section-body")).toHaveLength(
      0,
    );
  });

  it("renders the climate form only when the section is open", async () => {
    const editor = await mountEditor();
    const forms = (): number =>
      editor.shadowRoot?.querySelectorAll("ha-form").length ?? 0;
    const collapsed = forms();
    await openSection(editor, "Climate");
    expect(forms()).toBe(collapsed + 1);
  });

  it("adds an opening item and emits config-changed", async () => {
    const editor = await mountEditor();
    let emitted: DeluxeRoomCardConfig | undefined;
    editor.addEventListener("config-changed", (ev) => {
      emitted = (ev as CustomEvent).detail.config;
    });
    await openSection(editor, "Openings");
    const addButtons = Array.from(
      editor.shadowRoot?.querySelectorAll("mwc-button") ?? [],
    );
    const openingsAdd = addButtons.find((b) =>
      b.textContent?.includes("Opening"),
    );
    (openingsAdd as HTMLElement).click();
    expect(emitted?.openings?.items).toHaveLength(1);
  });

  it("adds an outline rule with defaults", async () => {
    const editor = await mountEditor();
    let emitted: DeluxeRoomCardConfig | undefined;
    editor.addEventListener("config-changed", (ev) => {
      emitted = (ev as CustomEvent).detail.config;
    });
    await openSection(editor, "Card outline rules");
    const addButtons = Array.from(
      editor.shadowRoot?.querySelectorAll("mwc-button") ?? [],
    );
    const ruleAdd = addButtons.find((b) => b.textContent?.includes("Rule"));
    (ruleAdd as HTMLElement).click();
    expect(emitted?.card_alerts).toEqual([
      { outline: "warning", match: "all", conditions: [] },
    ]);
  });

  it("uses the native area selector and imports entities from an area", async () => {
    const editor = await mountEditor();
    let emitted: DeluxeRoomCardConfig | undefined;
    editor.addEventListener("config-changed", (ev) => {
      emitted = (ev as CustomEvent).detail.config;
    });
    await openSection(editor, "Import from area");
    const areaForm = editor.shadowRoot?.querySelector(".area-import ha-form");
    expect(areaForm).toBeTruthy();
    // The area selector reports its value through ha-form's value-changed.
    areaForm?.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { area: "wz" } },
        bubbles: true,
        composed: true,
      }),
    );
    await editor.updateComplete;
    const importButton = Array.from(
      editor.shadowRoot?.querySelectorAll("mwc-button") ?? [],
    ).find((b) => b.textContent?.includes("Import from area"));
    expect(
      (importButton as HTMLElement & { disabled?: boolean }).disabled,
    ).toBe(false);
    (importButton as HTMLElement).click();
    expect(emitted?.controls).toEqual([{ entity: "light.lamp" }]);
  });

  it("removes an item", async () => {
    const editor = await mountEditor({
      ...base,
      controls: [{ entity: "light.lamp" }, { entity: "light.other" }],
    });
    let emitted: DeluxeRoomCardConfig | undefined;
    editor.addEventListener("config-changed", (ev) => {
      emitted = (ev as CustomEvent).detail.config;
    });
    await openSection(editor, "Controls");
    const remove = Array.from(
      editor.shadowRoot?.querySelectorAll("ha-icon-button") ?? [],
    ).filter((b) => (b as HTMLElement & { label?: string }).label === "Remove");
    (remove[0] as HTMLElement).click();
    expect(emitted?.controls).toEqual([{ entity: "light.other" }]);
  });

  /** Expand a section, then the first list row inside it. */
  async function openFirstRow(
    editor: DeluxeRoomCardEditor,
    section: string,
  ): Promise<void> {
    await openSection(editor, section);
    const row = editor.shadowRoot?.querySelector<HTMLElement>(".list-title");
    row?.click();
    await editor.updateComplete;
  }

  it("stores picker colors as hex strings in the config", async () => {
    const editor = await mountEditor({
      ...base,
      controls: [{ entity: "light.lamp" }],
    });
    let emitted: DeluxeRoomCardConfig | undefined;
    editor.addEventListener("config-changed", (ev) => {
      emitted = (ev as CustomEvent).detail.config;
    });
    await openFirstRow(editor, "Controls");
    const colorForm = editor.shadowRoot?.querySelector(
      ".list-item .color-form",
    );
    expect(colorForm).toBeTruthy();
    // The color_rgb selector reports [r, g, b]; the config must stay hex.
    colorForm?.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { color: [210, 59, 52] } },
        bubbles: true,
        composed: true,
      }),
    );
    expect(emitted?.controls).toEqual([
      { entity: "light.lamp", color: "#d23b34" },
    ]);
  });

  it("preserves the color when other item fields change", async () => {
    const editor = await mountEditor({
      ...base,
      controls: [{ entity: "light.lamp", color: "#2f7d54" }],
    });
    let emitted: DeluxeRoomCardConfig | undefined;
    editor.addEventListener("config-changed", (ev) => {
      emitted = (ev as CustomEvent).detail.config;
    });
    await openFirstRow(editor, "Controls");
    const itemForm = editor.shadowRoot?.querySelector(".list-item > ha-form");
    itemForm?.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { entity: "light.lamp", name: "Lamp" } },
        bubbles: true,
        composed: true,
      }),
    );
    expect(emitted?.controls).toEqual([
      { entity: "light.lamp", name: "Lamp", color: "#2f7d54" },
    ]);
  });

  it("resets an item color to the theme default", async () => {
    const editor = await mountEditor({
      ...base,
      controls: [{ entity: "light.lamp", color: "#2f7d54" }],
    });
    let emitted: DeluxeRoomCardConfig | undefined;
    editor.addEventListener("config-changed", (ev) => {
      emitted = (ev as CustomEvent).detail.config;
    });
    await openFirstRow(editor, "Controls");
    const reset = editor.shadowRoot?.querySelector<HTMLElement>(
      ".list-item .color-reset",
    );
    expect(reset).toBeTruthy();
    reset?.click();
    expect(emitted?.controls).toEqual([{ entity: "light.lamp" }]);
  });

  it("resets the accent color override to the theme default", async () => {
    const editor = await mountEditor({
      ...base,
      color_style: "override",
      accent_color: "#2f7d54",
    });
    let emitted: DeluxeRoomCardConfig | undefined;
    editor.addEventListener("config-changed", (ev) => {
      emitted = (ev as CustomEvent).detail.config;
    });
    const accentReset =
      editor.shadowRoot?.querySelectorAll<HTMLElement>(".color-reset")[0];
    expect(accentReset).toBeTruthy();
    accentReset?.click();
    expect(emitted?.accent_color).toBeUndefined();
  });

  it("shows override color rows only for color_style override", async () => {
    const themed = await mountEditor({ ...base, color_style: "theme" });
    // No top-level color rows in theme mode (item rows are collapsed).
    expect(themed.shadowRoot?.querySelectorAll(".color-row")).toHaveLength(0);
    const override = await mountEditor({ ...base, color_style: "override" });
    expect(
      override.shadowRoot?.querySelectorAll(".color-row").length,
    ).toBeGreaterThanOrEqual(2);
  });

  it("offers a per-opening state_style with a default option", async () => {
    const editor = await mountEditor();
    const grid = (
      editor as unknown as {
        _openingSchema: () => {
          schema?: {
            name: string;
            selector?: { select?: { options?: { value: string }[] } };
          }[];
        }[];
      }
    )
      ._openingSchema()
      .find((s) => s.schema);
    const styleField = grid?.schema?.find((f) => f.name === "state_style");
    const values = styleField?.selector?.select?.options?.map((o) => o.value);
    expect(values).toEqual(["", "combined", "label", "bar", "radial", "color"]);
  });

  it("fills the default option and stores a chosen per-opening style", async () => {
    const editor = await mountEditor({
      ...base,
      openings: { items: [{ window: "binary_sensor.win" }] },
    });
    let emitted: DeluxeRoomCardConfig | undefined;
    editor.addEventListener("config-changed", (ev) => {
      emitted = (ev as CustomEvent).detail.config;
    });
    await openFirstRow(editor, "Openings");
    const itemForm = editor.shadowRoot?.querySelector(".list-item > ha-form");
    // Choosing a concrete style stores it on the item.
    itemForm?.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: { window: "binary_sensor.win", state_style: "combined" },
        },
        bubbles: true,
        composed: true,
      }),
    );
    expect(emitted?.openings?.items?.[0].state_style).toBe("combined");
    // Choosing the empty "default" option removes it again.
    itemForm?.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { window: "binary_sensor.win", state_style: "" } },
        bubbles: true,
        composed: true,
      }),
    );
    expect(emitted?.openings?.items?.[0].state_style).toBeUndefined();
  });

  it("stores only non-default opening display flags", async () => {
    const editor = await mountEditor({
      ...base,
      openings: { items: [{ window: "binary_sensor.win" }] },
    });
    let emitted: DeluxeRoomCardConfig | undefined;
    editor.addEventListener("config-changed", (ev) => {
      emitted = (ev as CustomEvent).detail.config;
    });
    await openFirstRow(editor, "Openings");
    const itemForm = editor.shadowRoot?.querySelector(".list-item > ha-form");
    // Turning show_value off is stored; the default-true flags are dropped.
    itemForm?.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: {
            window: "binary_sensor.win",
            show_name: true,
            show_value: false,
            show_icon: true,
          },
        },
        bubbles: true,
        composed: true,
      }),
    );
    expect(emitted?.openings?.items?.[0]).toEqual({
      window: "binary_sensor.win",
      show_value: false,
    });
  });

  it("collapses climate thresholds into expandable schema blocks", async () => {
    const editor = await mountEditor();
    const schema = (
      editor as unknown as {
        _climateSchema: () => { name?: string; type?: string }[];
      }
    )._climateSchema();
    const temp = schema.find((s) => s.name === "temperature_thresholds");
    const hum = schema.find((s) => s.name === "humidity_thresholds");
    expect(temp?.type).toBe("expandable");
    expect(hum?.type).toBe("expandable");
  });

  it("offers a relative/absolute scale inside the humidity thresholds", async () => {
    const editor = await mountEditor();
    const schema = (
      editor as unknown as {
        _climateSchema: () => { name?: string; schema?: { name?: string }[] }[];
      }
    )._climateSchema();
    const hum = schema.find((s) => s.name === "humidity_thresholds");
    expect(hum?.schema?.some((s) => s.name === "scale")).toBe(true);
  });

  it("keeps an absolute scale but drops the implicit relative one", async () => {
    const editor = await mountEditor();
    const prune = (
      editor as unknown as {
        _humidityThresholds: (value: unknown) => Record<string, unknown>;
      }
    )._humidityThresholds.bind(editor);
    expect(prune({ scale: "absolute", high: 13, high_crit: "" })).toEqual({
      scale: "absolute",
      high: 13,
    });
    expect(prune({ scale: "relative", high: 60 })).toEqual({ high: 60 });
    expect(prune({ scale: "relative" })).toEqual({});
  });
});
