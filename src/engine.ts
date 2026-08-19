/**
 * Pure view-model logic for the Deluxe Room Card.
 *
 * Everything in this module is side-effect free and operates on plain data so
 * it can be unit-tested without a DOM or a Home Assistant instance.
 */

import type {
  AlertItem,
  CardAlertRule,
  CardCondition,
  HassEntity,
  HumidityThresholds,
  OpeningItem,
  OutlineLevel,
  Severity,
  StateStyle,
  Thresholds,
} from "./types";

export type GetState = (entityId: string) => HassEntity | undefined;

const UNAVAILABLE_STATES = new Set([
  "unavailable",
  "unknown",
  "none",
  "nan",
  "",
]);

/** Whether a raw state/attribute counts as "no usable value". */
function isBlank(raw: unknown): boolean {
  if (raw === null || raw === undefined) return true;
  return (
    typeof raw === "string" && UNAVAILABLE_STATES.has(raw.trim().toLowerCase())
  );
}

/**
 * Whether an entity currently has no usable value — missing from hass, or
 * unavailable/unknown/NaN. This is the condition behind the card's empty
 * states, and what `unavailable: true` alerts and conditions match on.
 */
export function entityUnavailable(
  entity: HassEntity | undefined,
  attribute?: string,
): boolean {
  if (!entity) return true;
  return isBlank(attribute ? entity.attributes[attribute] : entity.state);
}

/* ------------------------------------------------------------- numbers --- */

/** Parse a state/attribute into a finite number, or null (never NaN). */
export function parseNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" && UNAVAILABLE_STATES.has(value.toLowerCase()))
    return null;
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : null;
}

/** Format a number with one decimal and a unit ("23.0 °C"), or null. */
export function formatValue(value: unknown, unit: string): string | null {
  const num = parseNumber(value);
  if (num === null) return null;
  const rounded = Math.round(num * 10) / 10;
  const text = Number.isInteger(rounded) ? rounded.toFixed(1) : String(rounded);
  return unit ? `${text} ${unit}` : text;
}

export type ThresholdLevel =
  "low_crit" | "low" | "high" | "high_crit" | "normal" | "unknown";

/** Classify a climate value against its thresholds. */
export function thresholdLevel(
  value: unknown,
  thresholds?: Thresholds,
): ThresholdLevel {
  const num = parseNumber(value);
  if (num === null) return "unknown";
  if (!thresholds) return "normal";
  const t = thresholds;
  if (t.low_crit !== undefined && num <= t.low_crit) return "low_crit";
  if (t.high_crit !== undefined && num >= t.high_crit) return "high_crit";
  if (t.high !== undefined && num >= t.high) return "high";
  if (t.low !== undefined && num <= t.low) return "low";
  return "normal";
}

/* ------------------------------------------------------------ humidity --- */

/* Magnus coefficients over water — good to ~0.1 % between -45 and 60 degC. */
const MAGNUS_A = 17.62;
const MAGNUS_B = 243.12;

/** Saturation vapour pressure in hPa at a temperature in degC. */
function saturationPressure(tempC: number): number {
  return 6.112 * Math.exp((MAGNUS_A * tempC) / (MAGNUS_B + tempC));
}

/**
 * Water actually held by the air in g/m3, from degC and % relative humidity.
 * Null when either reading is missing or the humidity is out of range.
 */
export function absoluteHumidity(
  temperature: unknown,
  relative: unknown,
): number | null {
  const temp = parseNumber(temperature);
  const rel = parseNumber(relative);
  if (temp === null || rel === null) return null;
  if (rel < 0 || rel > 100) return null;
  const vapour = (rel / 100) * saturationPressure(temp);
  return (216.7 * vapour) / (273.15 + temp);
}

/**
 * Classify humidity against its thresholds, honouring `scale: "absolute"`.
 *
 * Absolute thresholds need a temperature reading; without one the numbers are
 * not comparable to a percentage at all (a `high: 14` g/m3 limit would flag
 * every plausible percentage as critical), so the level goes "unknown" rather
 * than raising a wrong alert.
 */
export function humidityLevel(
  humidity: unknown,
  temperature: unknown,
  thresholds?: HumidityThresholds,
): ThresholdLevel {
  if (thresholds?.scale !== "absolute")
    return thresholdLevel(humidity, thresholds);
  if (parseNumber(humidity) === null) return "unknown";
  return thresholdLevel(absoluteHumidity(temperature, humidity), thresholds);
}

/* ------------------------------------------------------------ openings --- */

export type WindowState = "open" | "tilted" | "closed" | "unknown";

/** Map an entity state to the window/door contact state. */
export function windowStateOf(entity: HassEntity | undefined): WindowState {
  if (!entity) return "unknown";
  const state = entity.state.toLowerCase();
  if (UNAVAILABLE_STATES.has(state)) return "unknown";
  if (state === "on" || state === "open" || state === "opening") return "open";
  if (state === "tilted" || state === "tilt") return "tilted";
  if (state === "off" || state === "closed" || state === "closing")
    return "closed";
  return "unknown";
}

/** Cover position 0–100 (100 = open), or null when unknown. */
export function coverPositionOf(entity: HassEntity | undefined): number | null {
  if (!entity) return null;
  if (UNAVAILABLE_STATES.has(entity.state.toLowerCase())) return null;
  const pos = parseNumber(entity.attributes["current_position"]);
  if (pos !== null) return Math.max(0, Math.min(100, pos));
  if (entity.state === "open") return 100;
  if (entity.state === "closed") return 0;
  return null;
}

export interface OpeningView {
  key: string;
  name: string;
  icon: string | null;
  style: StateStyle;
  /** Contact state, when a window/door sensor is configured. */
  windowState: WindowState | null;
  /** Cover position 0–100, when a cover is configured. */
  position: number | null;
  isDoor: boolean;
  hasCover: boolean;
  coverClosed: boolean;
  /** Configured entity is missing from hass. */
  missing: boolean;
  /** Entity to open in the more-info dialog. */
  moreInfoEntity: string | null;
  /** Entity targeted by toggle / call-service taps. */
  actionEntity: string | null;
  tapAction: NonNullable<OpeningItem["tap_action"]>;
  service?: string;
  serviceData?: Record<string, unknown>;
  showName: boolean;
  showValue: boolean;
  showIcon: boolean;
}

export interface OpeningDisplay {
  showName?: boolean;
  showValue?: boolean;
  showIcon?: boolean;
}

/** Build the view model for one opening chip. */
export function openingView(
  item: OpeningItem,
  getState: GetState,
  style: StateStyle,
  index: number,
  display?: OpeningDisplay,
): OpeningView {
  const contactId = item.window ?? item.door;
  const contact = contactId ? getState(contactId) : undefined;
  const cover = item.cover ? getState(item.cover) : undefined;

  const missing =
    (contactId !== undefined && contact === undefined) ||
    (item.cover !== undefined && cover === undefined);

  const windowState = contactId ? windowStateOf(contact) : null;
  const position = item.cover ? coverPositionOf(cover) : null;
  const hasCover = item.cover !== undefined;
  // A single contact sensor covers both windows and doors; door-ness is taken
  // from the item's device_class or, failing that, the entity's own class.
  const DOOR_CLASSES = ["door", "garage_door", "garage", "gate"];
  const contactClass = contact?.attributes["device_class"] as
    string | undefined;
  const isDoor =
    item.door !== undefined ||
    DOOR_CLASSES.includes(item.device_class ?? "") ||
    DOOR_CLASSES.includes(contactClass ?? "");

  const friendly =
    (contact?.attributes["friendly_name"] as string | undefined) ??
    (cover?.attributes["friendly_name"] as string | undefined);

  return {
    key: `${contactId ?? ""}|${item.cover ?? ""}|${index}`,
    name: item.name ?? friendly ?? contactId ?? item.cover ?? "?",
    icon: item.icon ?? null,
    style,
    windowState,
    position,
    isDoor,
    hasCover,
    coverClosed: position !== null && position <= 1,
    missing,
    moreInfoEntity: item.cover ?? contactId ?? null,
    actionEntity: item.control_entity ?? item.cover ?? contactId ?? null,
    tapAction: item.tap_action ?? "more-info",
    service: item.service,
    serviceData: item.service_data,
    showName: display?.showName ?? true,
    showValue: display?.showValue ?? true,
    showIcon: display?.showIcon ?? true,
  };
}

/* -------------------------------------------------------------- alerts --- */

/** Whether an alert config is currently active for the given entity. */
export function alertActive(
  item: AlertItem,
  entity: HassEntity | undefined,
): boolean {
  // Availability alerts are the one kind that must survive a dead entity, so
  // they are answered before the blank-state guard below.
  if (item.unavailable) {
    const blank = entityUnavailable(entity, item.attribute);
    return item.invert ? !blank : blank;
  }

  if (!entity) return false;
  const raw = item.attribute ? entity.attributes[item.attribute] : entity.state;
  if (isBlank(raw)) return false;

  if (item.below !== undefined || item.above !== undefined) {
    const num = parseNumber(raw);
    if (num === null) return false;
    if (item.below !== undefined && num >= item.below) return false;
    if (item.above !== undefined && num <= item.above) return false;
    return true;
  }

  const active = String(raw) === (item.active_state ?? "on");
  return item.invert ? !active : active;
}

export interface AlertView {
  key: string;
  label: string;
  icon: string;
  severity: Severity;
  color?: string;
  fullWidth: boolean;
}

const SEVERITY_ICONS: Record<Severity, string> = {
  info: "mdi:information-outline",
  warning: "mdi:alert-outline",
  critical: "mdi:alert",
};

/** Collect the currently active alert views. */
export function activeAlerts(
  alerts: AlertItem[] | undefined,
  getState: GetState,
): AlertView[] {
  if (!alerts) return [];
  return alerts
    .filter((item) => alertActive(item, getState(item.entity)))
    .map((item, index) => {
      const entity = getState(item.entity);
      const severity: Severity = item.severity ?? "warning";
      return {
        key: `${item.entity}|${index}`,
        label:
          item.label ??
          (entity?.attributes["friendly_name"] as string | undefined) ??
          item.entity,
        icon: item.icon ?? SEVERITY_ICONS[severity],
        severity,
        color: item.color,
        // Alerts default to a prominent full-width bar; opt into a compact
        // chip with full_width: false.
        fullWidth: item.full_width ?? true,
      };
    });
}

/* -------------------------------------------------- outline conditions --- */

/** Parse "300", 300 or "HH:MM:SS" into seconds. */
export function parseDuration(value: number | string | undefined): number {
  if (value === undefined) return 0;
  if (typeof value === "number") return value;
  const parts = value.split(":").map((p) => Number(p));
  if (parts.some((p) => !Number.isFinite(p))) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] ?? 0;
}

export interface ConditionResult {
  met: boolean;
  /** When set, re-evaluate after this many ms (pending `for` durations). */
  recheckInMs?: number;
}

function sunMatches(
  event: "after" | "before",
  target: string,
  sunState: string,
): boolean {
  // after sunset / before sunrise → night; after sunrise / before sunset → day.
  const night = sunState === "below_horizon";
  if (event === "after") return target === "sunset" ? night : !night;
  return target === "sunrise" ? night : !night;
}

/** Evaluate one card-outline condition. */
export function evalCondition(
  cond: CardCondition,
  getState: GetState,
  now: number,
): ConditionResult {
  // Sun-based windows use the sun.sun entity.
  if (cond.after !== undefined || cond.before !== undefined) {
    const sun = getState("sun.sun");
    if (!sun) return { met: false };
    const afterOk =
      cond.after === undefined || sunMatches("after", cond.after, sun.state);
    const beforeOk =
      cond.before === undefined || sunMatches("before", cond.before, sun.state);
    if (!(afterOk && beforeOk)) return { met: false };
    if (cond.entity === undefined) return { met: true };
    // Fall through: entity condition must hold too.
  }

  if (cond.entity === undefined) return { met: false };
  const entity = getState(cond.entity);
  const blank = entityUnavailable(entity, cond.attribute);

  if (cond.unavailable) {
    if (!blank) return { met: false };
    // An unavailable entity has no value to compare, so the remaining
    // state/numeric checks are skipped; `for:` still applies when hass still
    // knows the entity (it keeps last_changed across the drop-out).
    return holdSatisfied(cond, entity, now);
  }
  if (blank || !entity) return { met: false };

  let met = true;
  const raw = cond.attribute ? entity.attributes[cond.attribute] : entity.state;

  if (cond.state !== undefined) {
    const wanted = Array.isArray(cond.state) ? cond.state : [cond.state];
    met = wanted.includes(String(raw));
  }
  if (met && (cond.above !== undefined || cond.below !== undefined)) {
    const num = parseNumber(raw);
    if (num === null) met = false;
    else {
      if (cond.above !== undefined && num <= cond.above) met = false;
      if (cond.below !== undefined && num >= cond.below) met = false;
    }
  }
  if (!met) return { met: false };
  return holdSatisfied(cond, entity, now);
}

/**
 * Apply a condition's `for:` hold. Measured against last_changed, so it only
 * tracks *state* changes (attribute-only conditions hold immediately once
 * true). An entity hass no longer knows carries no timestamp, so the hold is
 * skipped rather than blocking the condition forever.
 */
function holdSatisfied(
  cond: CardCondition,
  entity: HassEntity | undefined,
  now: number,
): ConditionResult {
  const forSeconds = parseDuration(cond.for);
  if (forSeconds <= 0 || !entity) return { met: true };
  const changed = Date.parse(entity.last_changed);
  if (!Number.isFinite(changed)) return { met: true };
  const heldMs = now - changed;
  const neededMs = forSeconds * 1000;
  if (heldMs < neededMs) return { met: false, recheckInMs: neededMs - heldMs };
  return { met: true };
}

export interface OutlineResult {
  outline: OutlineLevel | null;
  recheckInMs?: number;
}

/** Evaluate the card outline rules; critical wins over warning. */
export function evalOutline(
  rules: CardAlertRule[] | undefined,
  getState: GetState,
  now: number,
): OutlineResult {
  if (!rules || rules.length === 0) return { outline: null };
  let outline: OutlineLevel | null = null;
  let recheckInMs: number | undefined;

  for (const rule of rules) {
    const match = rule.match ?? "all";
    const results = rule.conditions.map((c) => evalCondition(c, getState, now));
    for (const r of results) {
      if (r.recheckInMs !== undefined)
        recheckInMs = Math.min(recheckInMs ?? Infinity, r.recheckInMs);
    }
    const met =
      match === "any"
        ? results.some((r) => r.met)
        : results.length > 0 && results.every((r) => r.met);
    if (!met) continue;
    const level: OutlineLevel =
      rule.outline === "warn" ? "warning" : rule.outline;
    if (level === "critical") return { outline: "critical", recheckInMs };
    outline = "warning";
  }
  return { outline, recheckInMs };
}
