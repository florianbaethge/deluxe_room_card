/** Shared types for the Deluxe Room Card. */

/* ---------------------------------------------------------------- hass --- */

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
}

export interface AreaRegistryEntry {
  area_id: string;
  name: string;
}

export interface EntityRegistryDisplayEntry {
  entity_id: string;
  area_id?: string;
  device_id?: string;
  hidden?: boolean;
  disabled_by?: string | null;
}

export interface DeviceRegistryEntry {
  id: string;
  area_id?: string;
}

/** The subset of the hass object the card relies on. */
export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language?: string;
  locale?: { language?: string };
  areas?: Record<string, AreaRegistryEntry>;
  entities?: Record<string, EntityRegistryDisplayEntry>;
  devices?: Record<string, DeviceRegistryEntry>;
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
  ): Promise<unknown>;
}

/* -------------------------------------------------------------- config --- */

export type LayoutPreset =
  "classic" | "controls-bottom" | "header-bar" | "compact";

export type WidthMode = "auto" | "full" | "half";

export type ColorStyle = "theme" | "override";

export type StateStyle = "combined" | "label" | "bar" | "radial" | "color";

export type Severity = "info" | "warning" | "critical";

export type OutlineLevel = "warning" | "critical";

export type TapAction = "more-info" | "toggle" | "call-service" | "none";

export interface Thresholds {
  low?: number;
  low_crit?: number;
  high?: number;
  high_crit?: number;
}

export interface ClimateConfig {
  temperature?: string;
  humidity?: string;
  temperature_thresholds?: Thresholds;
  humidity_thresholds?: Thresholds;
  /** Raise an alert bar when a critical threshold is crossed. */
  alert_on_threshold?: boolean;
}

export interface OpeningItem {
  /** Window contact sensor (binary_sensor or sensor with open/tilted/closed). */
  window?: string;
  /** Door contact sensor — same semantics, door icon. */
  door?: string;
  /** Cover entity that provides the 0–100 % position and is controllable. */
  cover?: string;
  /** Alternate entity targeted by toggle / call-service taps (e.g. quiet mode). */
  control_entity?: string;
  name?: string;
  icon?: string;
  /** Per-opening display style; falls back to openings.state_style. */
  state_style?: StateStyle;
  tap_action?: TapAction;
  /** `domain.service` for tap_action: call-service. */
  service?: string;
  service_data?: Record<string, unknown>;
  device_class?: string;
}

export interface OpeningsConfig {
  /** Default display style for all openings; overridable per item. */
  state_style?: StateStyle;
  items?: OpeningItem[];
}

export interface ControlItem {
  entity: string;
  name?: string;
  icon?: string;
  /** Active color override for this button. */
  color?: string;
  /** Optional short text label rendered next to the icon. */
  label?: string;
}

export interface AlertItem {
  entity: string;
  /** State that counts as active (default: "on"). */
  active_state?: string;
  /** Invert the state match. */
  invert?: boolean;
  /** Numeric thresholds — active when the value crosses them. */
  below?: number;
  above?: number;
  /** Read this attribute instead of the state. */
  attribute?: string;
  label?: string;
  icon?: string;
  severity?: Severity;
  color?: string;
  /** Render as a full-width bar at the bottom instead of a chip. */
  full_width?: boolean;
}

export type SunEvent = "sunrise" | "sunset";

export interface CardCondition {
  entity?: string;
  state?: string | string[];
  attribute?: string;
  above?: number;
  below?: number;
  /** Sun-based window, e.g. after: sunset. */
  after?: SunEvent;
  before?: SunEvent;
  /** Condition must hold for this long (seconds or "HH:MM:SS"). */
  for?: number | string;
}

export interface CardAlertRule {
  /** "warn" is accepted as an alias for "warning". */
  outline: OutlineLevel | "warn";
  match?: "all" | "any";
  conditions: CardCondition[];
}

export interface ColorsConfig {
  window_open?: string;
  window_tilted?: string;
  window_closed?: string;
  warning?: string;
  critical?: string;
}

export interface DeluxeRoomCardConfig {
  type: string;
  title?: string;
  /** Room icon rendered as a backdrop (classic) or inline (other layouts). */
  icon?: string;
  /** Scale factor for the room icon and its circle (0.6–1.8). */
  icon_size?: number;
  window_icon?: string;
  cover_icon?: string;
  layout?: LayoutPreset;
  width?: WidthMode;
  color_style?: ColorStyle;
  /** Only used with color_style: override. */
  accent_color?: string;
  bg_tint?: string;
  colors?: ColorsConfig;
  show_name?: boolean;
  show_climate?: boolean;
  show_icon?: boolean;
  /** Fill empty sections once from this area's entities. */
  from_area?: string;
  climate?: ClimateConfig;
  openings?: OpeningsConfig;
  controls?: ControlItem[];
  alerts?: AlertItem[];
  card_alerts?: CardAlertRule[];
}

export const DEFAULT_CONFIG = {
  icon: "mdi:sofa",
  icon_size: 1.0,
  layout: "classic" as LayoutPreset,
  width: "auto" as WidthMode,
  color_style: "theme" as ColorStyle,
  state_style: "label" as StateStyle,
  show_name: true,
  show_climate: true,
  show_icon: true,
};
