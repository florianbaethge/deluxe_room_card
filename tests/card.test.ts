import { beforeEach, describe, expect, it } from "vitest";

import "../src/deluxe-room-card";
import type { DeluxeRoomCard } from "../src/deluxe-room-card";
import type { DeluxeRoomCardConfig } from "../src/types";
import { entity, makeHass } from "./helpers";

async function mountCard(
  config: DeluxeRoomCardConfig,
  hass = makeHass([]),
): Promise<DeluxeRoomCard> {
  const card = document.createElement("deluxe-room-card");
  card.setConfig(config);
  card.hass = hass;
  document.body.appendChild(card);
  await card.updateComplete;
  return card;
}

function shadowText(card: DeluxeRoomCard): string {
  return card.shadowRoot?.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

const base: DeluxeRoomCardConfig = {
  type: "custom:deluxe-room-card",
  title: "Living room",
};

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("registration", () => {
  it("defines the element and registers with the card picker", () => {
    expect(customElements.get("deluxe-room-card")).toBeDefined();
    expect(customElements.get("deluxe-room-card-editor")).toBeDefined();
    const cards = window.customCards as { type: string }[];
    expect(cards.some((c) => c.type === "deluxe-room-card")).toBe(true);
  });

  it("provides a config element and a stub config", async () => {
    const { DeluxeRoomCard } = await import("../src/deluxe-room-card");
    expect(DeluxeRoomCard.getConfigElement().tagName.toLowerCase()).toBe(
      "deluxe-room-card-editor",
    );
    expect(DeluxeRoomCard.getStubConfig().type).toBe("custom:deluxe-room-card");
  });
});

describe("setConfig", () => {
  it("throws on invalid configuration", () => {
    const card = document.createElement("deluxe-room-card");
    expect(() =>
      card.setConfig({ ...base, layout: "bogus" as never }),
    ).toThrow();
  });
});

describe("rendering", () => {
  it("renders title and climate values", async () => {
    const hass = makeHass([
      entity("sensor.temp", "23", { unit_of_measurement: "°C" }),
      entity("sensor.hum", "74"),
    ]);
    const card = await mountCard(
      {
        ...base,
        climate: { temperature: "sensor.temp", humidity: "sensor.hum" },
      },
      hass,
    );
    const text = shadowText(card);
    expect(text).toContain("Living room");
    expect(text).toContain("23.0 °C");
    expect(text).toContain("74.0 %");
  });

  it("shows an honest message instead of NaN for missing sensor values", async () => {
    const hass = makeHass([entity("sensor.temp", "unavailable")]);
    const card = await mountCard(
      { ...base, climate: { temperature: "sensor.temp" } },
      hass,
    );
    const text = shadowText(card);
    expect(text).not.toContain("NaN");
    expect(text).toContain("Temp – no value");
  });

  it("flags entities that do not exist", async () => {
    const card = await mountCard(
      { ...base, climate: { temperature: "sensor.missing" } },
      makeHass([]),
    );
    expect(shadowText(card)).toContain("Entity not found");
  });

  it("renders opening chips with position and state", async () => {
    const hass = makeHass([
      entity("binary_sensor.win", "on"),
      entity("cover.blind", "open", { current_position: 60 }),
    ]);
    const card = await mountCard(
      {
        ...base,
        openings: {
          state_style: "label",
          items: [
            { window: "binary_sensor.win", cover: "cover.blind", name: "Left" },
          ],
        },
      },
      hass,
    );
    const text = shadowText(card);
    expect(text).toContain("Left");
    expect(text).toContain("60 %");
    expect(card.shadowRoot?.querySelectorAll(".chip")).toHaveLength(1);
  });

  it("localizes to German when hass.locale says so", async () => {
    const hass = makeHass([entity("binary_sensor.win", "off")], {
      locale: { language: "de" },
    });
    const card = await mountCard(
      {
        ...base,
        openings: { items: [{ window: "binary_sensor.win", name: "Fenster" }] },
      },
      hass,
    );
    expect(shadowText(card)).toContain("Zu");
  });

  it("renders full-width alert bars only when active", async () => {
    const hass = makeHass([entity("binary_sensor.leak", "on")]);
    const card = await mountCard(
      {
        ...base,
        alerts: [
          {
            entity: "binary_sensor.leak",
            label: "Water leak detected!",
            severity: "critical",
            full_width: true,
          },
        ],
      },
      hass,
    );
    expect(card.shadowRoot?.querySelectorAll(".alert-bar")).toHaveLength(1);
    expect(shadowText(card)).toContain("Water leak detected!");

    card.hass = makeHass([entity("binary_sensor.leak", "off")]);
    await card.updateComplete;
    expect(card.shadowRoot?.querySelectorAll(".alert-bar")).toHaveLength(0);
  });

  it("adds a threshold alert bar when alert_on_threshold is set", async () => {
    const hass = makeHass([entity("sensor.hum", "84")]);
    const card = await mountCard(
      {
        ...base,
        climate: {
          humidity: "sensor.hum",
          humidity_thresholds: { high: 60, high_crit: 75 },
          alert_on_threshold: true,
        },
      },
      hass,
    );
    expect(shadowText(card)).toContain("Too humid");
  });

  it("applies the outline class from card_alerts rules", async () => {
    const hass = makeHass([
      entity("sun.sun", "below_horizon"),
      entity("binary_sensor.win", "on"),
    ]);
    const card = await mountCard(
      {
        ...base,
        card_alerts: [
          {
            outline: "critical",
            match: "all",
            conditions: [
              { after: "sunset" },
              { entity: "binary_sensor.win", state: "on" },
            ],
          },
        ],
      },
      hass,
    );
    const haCard = card.shadowRoot?.querySelector("ha-card");
    expect(haCard?.classList.contains("outline-critical")).toBe(true);
  });

  it("renders each layout preset", async () => {
    for (const layout of [
      "classic",
      "controls-bottom",
      "header-bar",
      "compact",
    ] as const) {
      const card = await mountCard({ ...base, layout }, makeHass([]));
      const haCard = card.shadowRoot?.querySelector("ha-card");
      expect(haCard?.classList.contains(`layout-${layout}`)).toBe(true);
    }
  });

  it("honors a per-opening state_style over the section default", async () => {
    const hass = makeHass([
      entity("binary_sensor.win", "off"),
      entity("cover.blind", "open", { current_position: 40 }),
    ]);
    const card = await mountCard(
      {
        ...base,
        openings: {
          state_style: "label",
          items: [
            {
              window: "binary_sensor.win",
              cover: "cover.blind",
              state_style: "combined",
            },
          ],
        },
      },
      hass,
    );
    // The combined style renders the framed box instead of an icon+text chip.
    expect(card.shadowRoot?.querySelector(".chip-combined")).toBeTruthy();
    expect(card.shadowRoot?.querySelector(".combined-box")).toBeTruthy();
  });

  it("renders each state style without crashing", async () => {
    const hass = makeHass([
      entity("binary_sensor.win", "off"),
      entity("cover.blind", "open", { current_position: 40 }),
    ]);
    for (const style of [
      "combined",
      "label",
      "bar",
      "radial",
      "color",
    ] as const) {
      const card = await mountCard(
        {
          ...base,
          openings: {
            state_style: style,
            items: [{ window: "binary_sensor.win", cover: "cover.blind" }],
          },
        },
        hass,
      );
      expect(card.shadowRoot?.querySelectorAll(".chip")).toHaveLength(1);
    }
  });
});

describe("interactions", () => {
  it("toggles a control on tap", async () => {
    const hass = makeHass([entity("light.lamp", "off")]);
    const card = await mountCard(
      { ...base, controls: [{ entity: "light.lamp" }] },
      hass,
    );
    const button =
      card.shadowRoot?.querySelector<HTMLButtonElement>(".control");
    button?.dispatchEvent(new Event("pointerdown"));
    button?.dispatchEvent(new Event("pointerup"));
    expect(hass.calls).toEqual([
      ["homeassistant", "toggle", { entity_id: "light.lamp" }],
    ]);
  });

  it("fires hass-more-info for the default chip tap", async () => {
    const hass = makeHass([
      entity("cover.blind", "open", { current_position: 60 }),
    ]);
    const card = await mountCard(
      { ...base, openings: { items: [{ cover: "cover.blind" }] } },
      hass,
    );
    let detail: { entityId?: string } | undefined;
    card.addEventListener("hass-more-info", (ev) => {
      detail = (ev as CustomEvent).detail;
    });
    card.shadowRoot
      ?.querySelector<HTMLButtonElement>(".chip")
      ?.dispatchEvent(new Event("click"));
    expect(detail?.entityId).toBe("cover.blind");
  });

  it("toggles the control_entity when tap_action is toggle", async () => {
    const hass = makeHass([
      entity("cover.blind", "open", { current_position: 60 }),
      entity("cover.blind_quiet", "closed"),
    ]);
    const card = await mountCard(
      {
        ...base,
        openings: {
          items: [
            {
              cover: "cover.blind",
              control_entity: "cover.blind_quiet",
              tap_action: "toggle",
            },
          ],
        },
      },
      hass,
    );
    card.shadowRoot
      ?.querySelector<HTMLButtonElement>(".chip")
      ?.dispatchEvent(new Event("click"));
    expect(hass.calls).toEqual([
      ["homeassistant", "toggle", { entity_id: "cover.blind_quiet" }],
    ]);
  });
});

describe("sizing", () => {
  it("reports a card size for masonry layouts", async () => {
    const card = await mountCard(base, makeHass([]));
    expect(card.getCardSize()).toBe(3);
    const compact = await mountCard(
      { ...base, layout: "compact" },
      makeHass([]),
    );
    expect(compact.getCardSize()).toBe(2);
  });

  it("provides grid options for sections layouts", async () => {
    const card = await mountCard(base, makeHass([]));
    expect(card.getGridOptions()).toMatchObject({ columns: 12 });
  });
});
