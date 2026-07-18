import { describe, expect, it } from "vitest";

import {
  applyAreaImport,
  ConfigError,
  deriveFromArea,
  normalizeConfig,
  relevantEntities,
  stubConfig,
} from "../src/config";
import type { DeluxeRoomCardConfig } from "../src/types";
import { entity, makeHass } from "./helpers";

const base: DeluxeRoomCardConfig = { type: "custom:deluxe-room-card" };

describe("normalizeConfig", () => {
  it("fills defaults", () => {
    const config = normalizeConfig({ ...base });
    expect(config.layout).toBe("classic");
    expect(config.width).toBe("auto");
    expect(config.color_style).toBe("theme");
    expect(config.openings?.state_style).toBe("label");
    expect(config.openings?.items).toEqual([]);
    expect(config.controls).toEqual([]);
  });

  it("rejects unknown enums", () => {
    expect(() =>
      normalizeConfig({ ...base, layout: "fancy" as never }),
    ).toThrow(ConfigError);
    expect(() => normalizeConfig({ ...base, width: "wide" as never })).toThrow(
      ConfigError,
    );
    expect(() =>
      normalizeConfig({
        ...base,
        openings: { state_style: "nope" as never },
      }),
    ).toThrow(ConfigError);
  });

  it("rejects list items without entities", () => {
    expect(() => normalizeConfig({ ...base, controls: [{} as never] })).toThrow(
      ConfigError,
    );
    expect(() => normalizeConfig({ ...base, alerts: [{} as never] })).toThrow(
      ConfigError,
    );
  });

  it("validates outline rules", () => {
    expect(() =>
      normalizeConfig({
        ...base,
        card_alerts: [{ outline: "purple" as never, conditions: [] }],
      }),
    ).toThrow(ConfigError);
    expect(
      normalizeConfig({
        ...base,
        card_alerts: [{ outline: "warn", conditions: [] }],
      }).card_alerts,
    ).toHaveLength(1);
  });

  it("clamps icon_size to 0.6–1.8", () => {
    expect(normalizeConfig({ ...base, icon_size: 5 }).icon_size).toBe(1.8);
    expect(normalizeConfig({ ...base, icon_size: 0.1 }).icon_size).toBe(0.6);
  });
});

describe("relevantEntities", () => {
  it("collects every referenced entity id incl. sun.sun", () => {
    const ids = relevantEntities(
      normalizeConfig({
        ...base,
        climate: { temperature: "sensor.t", humidity: "sensor.h" },
        openings: {
          items: [
            {
              window: "binary_sensor.w",
              cover: "cover.c",
              control_entity: "cover.quiet",
            },
          ],
        },
        controls: [{ entity: "light.l" }],
        alerts: [{ entity: "binary_sensor.leak" }],
        card_alerts: [
          {
            outline: "critical",
            conditions: [{ after: "sunset" }, { entity: "group.windows" }],
          },
        ],
      }),
    );
    expect(ids).toEqual(
      new Set([
        "sensor.t",
        "sensor.h",
        "binary_sensor.w",
        "cover.c",
        "cover.quiet",
        "light.l",
        "binary_sensor.leak",
        "group.windows",
        "sun.sun",
      ]),
    );
  });
});

describe("deriveFromArea", () => {
  const hass = makeHass(
    [
      entity("light.wz_lamp", "on", { friendly_name: "Lamp" }),
      entity("switch.wz_tv", "off"),
      entity("cover.wz_blind", "open", { friendly_name: "Blind" }),
      entity("cover.wz_gate", "closed", { device_class: "garage" }),
      entity("binary_sensor.wz_window", "off", {
        device_class: "window",
        friendly_name: "Window",
      }),
      entity("binary_sensor.wz_door", "off", { device_class: "door" }),
      entity("binary_sensor.wz_leak", "off", { device_class: "moisture" }),
      entity("binary_sensor.wz_motion", "off", { device_class: "motion" }),
      entity("sensor.wz_temp", "21.5", { device_class: "temperature" }),
      entity("sensor.wz_hum", "55", { device_class: "humidity" }),
      entity("sensor.other_temp", "10", { device_class: "temperature" }),
    ],
    {
      areas: { wz: { area_id: "wz", name: "Living room" } },
      entities: {
        "light.wz_lamp": { entity_id: "light.wz_lamp", area_id: "wz" },
        "switch.wz_tv": { entity_id: "switch.wz_tv", area_id: "wz" },
        "cover.wz_blind": { entity_id: "cover.wz_blind", area_id: "wz" },
        "cover.wz_gate": { entity_id: "cover.wz_gate", area_id: "wz" },
        "binary_sensor.wz_window": {
          entity_id: "binary_sensor.wz_window",
          area_id: "wz",
        },
        "binary_sensor.wz_door": {
          entity_id: "binary_sensor.wz_door",
          device_id: "dev1",
        },
        "binary_sensor.wz_leak": {
          entity_id: "binary_sensor.wz_leak",
          area_id: "wz",
        },
        "binary_sensor.wz_motion": {
          entity_id: "binary_sensor.wz_motion",
          area_id: "wz",
        },
        "sensor.wz_temp": { entity_id: "sensor.wz_temp", area_id: "wz" },
        "sensor.wz_hum": { entity_id: "sensor.wz_hum", area_id: "wz" },
        "sensor.other_temp": {
          entity_id: "sensor.other_temp",
          area_id: "other",
        },
      },
      devices: { dev1: { id: "dev1", area_id: "wz" } },
    },
  );

  it("classifies the area's entities into sections", () => {
    const imported = deriveFromArea(hass, "wz");
    expect(imported.controls.map((c) => c.entity)).toEqual([
      "light.wz_lamp",
      "switch.wz_tv",
    ]);
    expect(imported.openings).toHaveLength(4); // blind, gate, window, door
    expect(imported.alerts).toEqual([
      {
        entity: "binary_sensor.wz_leak",
        severity: "critical",
        full_width: true,
      },
    ]);
    expect(imported.climate.temperature).toBe("sensor.wz_temp");
    expect(imported.climate.humidity).toBe("sensor.wz_hum");
  });

  it("resolves the area via the device registry too", () => {
    const imported = deriveFromArea(hass, "wz");
    expect(
      imported.openings.some((o) => o.door === "binary_sensor.wz_door"),
    ).toBe(true);
  });

  it("only fills empty sections on apply", () => {
    const config = normalizeConfig({
      ...base,
      controls: [{ entity: "light.custom" }],
    });
    const applied = applyAreaImport(config, deriveFromArea(hass, "wz"));
    expect(applied.controls).toEqual([{ entity: "light.custom" }]);
    expect(applied.openings?.items?.length).toBe(4);
  });

  it("builds a stub config from the first area", () => {
    const stub = stubConfig(hass);
    expect(stub.title).toBe("Living room");
    expect(stub.controls?.length).toBeGreaterThan(0);
  });
});
