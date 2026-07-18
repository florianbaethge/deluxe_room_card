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

  it("stores picker colors as hex strings in the config", async () => {
    const editor = await mountEditor({
      ...base,
      controls: [{ entity: "light.lamp", color: "#2f7d54" }],
    });
    let emitted: DeluxeRoomCardConfig | undefined;
    editor.addEventListener("config-changed", (ev) => {
      emitted = (ev as CustomEvent).detail.config;
    });
    await openSection(editor, "Controls");
    // Expand the item row so its ha-form renders.
    const row = editor.shadowRoot?.querySelector<HTMLElement>(".list-title");
    row?.click();
    await editor.updateComplete;
    const form = editor.shadowRoot?.querySelector(".list-item ha-form");
    expect(form).toBeTruthy();
    // The color_rgb selector reports [r, g, b]; the config must stay hex.
    form?.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: { entity: "light.lamp", color: [210, 59, 52] },
        },
        bubbles: true,
        composed: true,
      }),
    );
    expect(emitted?.controls).toEqual([
      { entity: "light.lamp", color: "#d23b34" },
    ]);
  });

  it("uses the color_rgb selector for color fields", async () => {
    const editor = await mountEditor();
    const schemas = editor as unknown as {
      _controlSchema: () => {
        schema?: { name: string; selector?: object }[];
      }[];
      _alertSchema: () => { schema?: { name: string; selector?: object }[] }[];
    };
    const controlGrid = schemas._controlSchema().find((s) => s.schema);
    const colorField = controlGrid?.schema?.find((f) => f.name === "color");
    expect(colorField?.selector).toEqual({ color_rgb: {} });
    const alertGrid = schemas._alertSchema().find((s) => s.schema);
    const alertColor = alertGrid?.schema?.find((f) => f.name === "color");
    expect(alertColor?.selector).toEqual({ color_rgb: {} });
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
});
