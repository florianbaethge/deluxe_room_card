/** Config normalization, stub config and area import helpers. */

import type {
  AlertItem,
  ClimateConfig,
  ControlItem,
  DeluxeRoomCardConfig,
  HomeAssistant,
  OpeningItem,
  StateStyle,
} from "./types";
import { DEFAULT_CONFIG } from "./types";

const LAYOUTS = ["classic", "controls-bottom", "header-bar", "compact"];
const WIDTHS = ["auto", "full", "half"];
const COLOR_STYLES = ["theme", "override"];
const STATE_STYLES = ["combined", "label", "bar", "radial", "color"];

export class ConfigError extends Error {}

/** Validate and normalize a raw card config. Throws ConfigError on bad input. */
export function normalizeConfig(
  raw: DeluxeRoomCardConfig,
): DeluxeRoomCardConfig {
  if (!raw || typeof raw !== "object")
    throw new ConfigError("Invalid configuration");

  const config: DeluxeRoomCardConfig = {
    ...DEFAULT_CONFIG,
    ...raw,
    openings: {
      ...raw.openings,
      state_style: (raw.openings?.state_style ??
        DEFAULT_CONFIG.state_style) as StateStyle,
      items: raw.openings?.items ?? [],
    },
    controls: raw.controls ?? [],
    alerts: raw.alerts ?? [],
    card_alerts: raw.card_alerts ?? [],
    climate: raw.climate ?? {},
  };

  if (config.layout && !LAYOUTS.includes(config.layout))
    throw new ConfigError(`Unknown layout: ${config.layout}`);
  if (config.width && !WIDTHS.includes(config.width))
    throw new ConfigError(`Unknown width: ${config.width}`);
  if (config.color_style && !COLOR_STYLES.includes(config.color_style))
    throw new ConfigError(`Unknown color_style: ${config.color_style}`);
  const style = config.openings?.state_style;
  if (style && !STATE_STYLES.includes(style))
    throw new ConfigError(`Unknown state_style: ${style}`);
  for (const item of config.openings?.items ?? []) {
    if (item.state_style && !STATE_STYLES.includes(item.state_style))
      throw new ConfigError(`Unknown state_style: ${item.state_style}`);
  }

  for (const item of config.controls ?? []) {
    if (!item.entity) throw new ConfigError("controls: entity is required");
  }
  for (const item of config.alerts ?? []) {
    if (!item.entity) throw new ConfigError("alerts: entity is required");
  }
  for (const rule of config.card_alerts ?? []) {
    if (
      !rule.outline ||
      !["warn", "warning", "critical"].includes(rule.outline)
    )
      throw new ConfigError("card_alerts: outline must be warning or critical");
    if (!Array.isArray(rule.conditions))
      throw new ConfigError("card_alerts: conditions must be a list");
  }

  const size = config.icon_size ?? 1;
  config.icon_size = Math.min(1.8, Math.max(0.6, size));
  return config;
}

/** All entity ids referenced by a config (for efficient hass diffing). */
export function relevantEntities(config: DeluxeRoomCardConfig): Set<string> {
  const ids = new Set<string>();
  const add = (id?: string): void => {
    if (id) ids.add(id);
  };
  add(config.climate?.temperature);
  add(config.climate?.humidity);
  for (const item of config.openings?.items ?? []) {
    add(item.window);
    add(item.door);
    add(item.cover);
    add(item.control_entity);
  }
  for (const item of config.controls ?? []) add(item.entity);
  for (const item of config.alerts ?? []) add(item.entity);
  for (const rule of config.card_alerts ?? []) {
    for (const cond of rule.conditions) {
      add(cond.entity);
      if (cond.after !== undefined || cond.before !== undefined)
        ids.add("sun.sun");
    }
  }
  return ids;
}

/* --------------------------------------------------------- area import --- */

export interface AreaImport {
  climate: ClimateConfig;
  openings: OpeningItem[];
  controls: ControlItem[];
  alerts: AlertItem[];
}

function entityIdsInArea(hass: HomeAssistant, areaId: string): string[] {
  const entities = hass.entities ?? {};
  const devices = hass.devices ?? {};
  const ids: string[] = [];
  for (const entry of Object.values(entities)) {
    if (entry.hidden || entry.disabled_by) continue;
    const area =
      entry.area_id ??
      (entry.device_id ? devices[entry.device_id]?.area_id : undefined);
    if (area === areaId) ids.push(entry.entity_id);
  }
  return ids;
}

/**
 * Derive card sections from an area's entities. Used by the editor's
 * "import from area" button and by the `from_area` YAML shortcut; the result
 * is materialized into the config so later edits stick.
 */
export function deriveFromArea(
  hass: HomeAssistant,
  areaId: string,
): AreaImport {
  const result: AreaImport = {
    climate: {},
    openings: [],
    controls: [],
    alerts: [],
  };
  for (const id of entityIdsInArea(hass, areaId)) {
    const entity = hass.states[id];
    const domain = id.split(".")[0];
    const deviceClass = entity?.attributes["device_class"] as
      string | undefined;
    const name = entity?.attributes["friendly_name"] as string | undefined;

    if (domain === "light") {
      result.controls.push({ entity: id });
    } else if (domain === "switch") {
      result.controls.push({ entity: id });
    } else if (domain === "cover") {
      result.openings.push(
        deviceClass && ["door", "garage", "gate"].includes(deviceClass)
          ? { cover: id, name, device_class: "door" }
          : { cover: id, name },
      );
    } else if (domain === "binary_sensor") {
      if (deviceClass === "window") {
        result.openings.push({ window: id, name });
      } else if (deviceClass === "door" || deviceClass === "garage_door") {
        result.openings.push({ door: id, name });
      } else if (
        deviceClass &&
        ["moisture", "smoke", "gas", "carbon_monoxide", "safety"].includes(
          deviceClass,
        )
      ) {
        result.alerts.push({
          entity: id,
          severity: "critical",
          full_width: true,
        });
      }
    } else if (domain === "sensor") {
      if (deviceClass === "temperature" && !result.climate.temperature)
        result.climate.temperature = id;
      else if (deviceClass === "humidity" && !result.climate.humidity)
        result.climate.humidity = id;
    }
  }
  return result;
}

/** Apply an area import to a config, only filling empty sections. */
export function applyAreaImport(
  config: DeluxeRoomCardConfig,
  imported: AreaImport,
): DeluxeRoomCardConfig {
  const next: DeluxeRoomCardConfig = { ...config };
  const climate = { ...config.climate };
  if (!climate.temperature && imported.climate.temperature)
    climate.temperature = imported.climate.temperature;
  if (!climate.humidity && imported.climate.humidity)
    climate.humidity = imported.climate.humidity;
  next.climate = climate;
  if (!config.openings?.items?.length)
    next.openings = { ...config.openings, items: imported.openings };
  if (!config.controls?.length) next.controls = imported.controls;
  if (!config.alerts?.length) next.alerts = imported.alerts;
  return next;
}

/** Starter config shown when the card is added from the picker. */
export function stubConfig(hass?: HomeAssistant): DeluxeRoomCardConfig {
  const config: DeluxeRoomCardConfig = {
    type: "custom:deluxe-room-card",
    title: "Living room",
    icon: "mdi:sofa",
    openings: { state_style: "label", items: [] },
    controls: [],
  };
  if (!hass) return config;
  const firstArea = Object.keys(hass.areas ?? {})[0];
  if (firstArea) {
    const area = hass.areas?.[firstArea];
    const applied = applyAreaImport(config, deriveFromArea(hass, firstArea));
    applied.title = area?.name ?? config.title;
    return applied;
  }
  return config;
}
