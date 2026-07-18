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

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("editor", () => {
  it("renders the section headings", async () => {
    const editor = await mountEditor();
    const text = editor.shadowRoot?.textContent ?? "";
    expect(text).toContain("Climate");
    expect(text).toContain("Openings");
    expect(text).toContain("Controls");
    expect(text).toContain("Card outline rules");
  });

  it("adds an opening item and emits config-changed", async () => {
    const editor = await mountEditor();
    let emitted: DeluxeRoomCardConfig | undefined;
    editor.addEventListener("config-changed", (ev) => {
      emitted = (ev as CustomEvent).detail.config;
    });
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
    const addButtons = Array.from(
      editor.shadowRoot?.querySelectorAll("mwc-button") ?? [],
    );
    const ruleAdd = addButtons.find((b) => b.textContent?.includes("Rule"));
    (ruleAdd as HTMLElement).click();
    expect(emitted?.card_alerts).toEqual([
      { outline: "warning", match: "all", conditions: [] },
    ]);
  });

  it("imports entities from an area", async () => {
    const editor = await mountEditor();
    let emitted: DeluxeRoomCardConfig | undefined;
    editor.addEventListener("config-changed", (ev) => {
      emitted = (ev as CustomEvent).detail.config;
    });
    // Simulate area selection + import (the ha-select itself is HA-internal).
    (editor as unknown as { _importArea: string })._importArea = "wz";
    (editor as unknown as { _importFromArea: () => void })._importFromArea();
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
    const remove = Array.from(
      editor.shadowRoot?.querySelectorAll("ha-icon-button") ?? [],
    ).filter((b) => (b as HTMLElement & { label?: string }).label === "Remove");
    (remove[0] as HTMLElement).click();
    expect(emitted?.controls).toEqual([{ entity: "light.other" }]);
  });
});
