import { describe, expect, it } from "vitest";

import {
  activeAlerts,
  alertActive,
  coverPositionOf,
  evalCondition,
  evalOutline,
  formatValue,
  openingView,
  parseDuration,
  parseNumber,
  thresholdLevel,
  windowStateOf,
} from "../src/engine";
import { entity, getState } from "./helpers";

describe("parseNumber", () => {
  it("parses numbers and numeric strings", () => {
    expect(parseNumber(23.4)).toBe(23.4);
    expect(parseNumber("23.4")).toBe(23.4);
    expect(parseNumber("0")).toBe(0);
  });

  it("never returns NaN", () => {
    expect(parseNumber("unavailable")).toBeNull();
    expect(parseNumber("unknown")).toBeNull();
    expect(parseNumber("abc")).toBeNull();
    expect(parseNumber(undefined)).toBeNull();
    expect(parseNumber(null)).toBeNull();
    expect(parseNumber(NaN)).toBeNull();
  });
});

describe("formatValue", () => {
  it("formats with one decimal", () => {
    expect(formatValue(23, "°C")).toBe("23.0 °C");
    expect(formatValue("74.25", "%")).toBe("74.3 %");
  });

  it("returns null for missing values (no NaN in the UI)", () => {
    expect(formatValue("unavailable", "°C")).toBeNull();
    expect(formatValue(undefined, "°C")).toBeNull();
  });
});

describe("thresholdLevel", () => {
  const t = { low: 19, low_crit: 17, high: 25, high_crit: 28 };

  it("classifies against thresholds", () => {
    expect(thresholdLevel(23, t)).toBe("normal");
    expect(thresholdLevel(18, t)).toBe("low");
    expect(thresholdLevel(16.5, t)).toBe("low_crit");
    expect(thresholdLevel(26, t)).toBe("high");
    expect(thresholdLevel(29, t)).toBe("high_crit");
  });

  it("handles boundaries inclusively", () => {
    expect(thresholdLevel(19, t)).toBe("low");
    expect(thresholdLevel(25, t)).toBe("high");
    expect(thresholdLevel(28, t)).toBe("high_crit");
  });

  it("is unknown without a value and normal without thresholds", () => {
    expect(thresholdLevel("unavailable", t)).toBe("unknown");
    expect(thresholdLevel(23, undefined)).toBe("normal");
  });

  it("supports partial thresholds (empty = off)", () => {
    expect(thresholdLevel(10, { high: 60 })).toBe("normal");
    expect(thresholdLevel(75, { high: 60 })).toBe("high");
  });
});

describe("windowStateOf", () => {
  it("maps binary sensor states", () => {
    expect(windowStateOf(entity("binary_sensor.w", "on"))).toBe("open");
    expect(windowStateOf(entity("binary_sensor.w", "off"))).toBe("closed");
  });

  it("maps string states incl. tilted", () => {
    expect(windowStateOf(entity("sensor.w", "open"))).toBe("open");
    expect(windowStateOf(entity("sensor.w", "tilted"))).toBe("tilted");
    expect(windowStateOf(entity("sensor.w", "closed"))).toBe("closed");
  });

  it("is unknown for unavailable or missing entities", () => {
    expect(windowStateOf(entity("sensor.w", "unavailable"))).toBe("unknown");
    expect(windowStateOf(undefined)).toBe("unknown");
  });
});

describe("coverPositionOf", () => {
  it("prefers current_position and clamps", () => {
    expect(
      coverPositionOf(entity("cover.r", "open", { current_position: 60 })),
    ).toBe(60);
    expect(
      coverPositionOf(entity("cover.r", "open", { current_position: 140 })),
    ).toBe(100);
  });

  it("falls back to open/closed states", () => {
    expect(coverPositionOf(entity("cover.r", "open"))).toBe(100);
    expect(coverPositionOf(entity("cover.r", "closed"))).toBe(0);
  });

  it("returns null when unavailable", () => {
    expect(coverPositionOf(entity("cover.r", "unavailable"))).toBeNull();
    expect(coverPositionOf(undefined)).toBeNull();
  });
});

describe("openingView", () => {
  const states = [
    entity("binary_sensor.window", "on", { friendly_name: "Left window" }),
    entity("cover.blind", "open", { current_position: 60 }),
  ];

  it("combines window and cover into one view", () => {
    const view = openingView(
      { window: "binary_sensor.window", cover: "cover.blind" },
      getState(states),
      "label",
      0,
    );
    expect(view.windowState).toBe("open");
    expect(view.position).toBe(60);
    expect(view.hasCover).toBe(true);
    expect(view.coverClosed).toBe(false);
    expect(view.missing).toBe(false);
    expect(view.name).toBe("Left window");
    expect(view.moreInfoEntity).toBe("cover.blind");
  });

  it("flags missing entities instead of guessing", () => {
    const view = openingView(
      { window: "binary_sensor.nope" },
      getState(states),
      "label",
      0,
    );
    expect(view.missing).toBe(true);
  });

  it("marks doors and closed covers", () => {
    const closed = [entity("cover.gate", "closed", { current_position: 0 })];
    const view = openingView(
      { cover: "cover.gate", device_class: "door" },
      getState(closed),
      "label",
      0,
    );
    expect(view.isDoor).toBe(true);
    expect(view.coverClosed).toBe(true);
  });

  it("auto-detects doors from the contact entity's device_class", () => {
    const door = [
      entity("binary_sensor.front", "on", { device_class: "door" }),
    ];
    const view = openingView(
      { window: "binary_sensor.front" },
      getState(door),
      "label",
      0,
    );
    expect(view.isDoor).toBe(true);
  });

  it("prefers control_entity as the action target", () => {
    const view = openingView(
      {
        window: "binary_sensor.window",
        cover: "cover.blind",
        control_entity: "cover.blind_quiet",
        tap_action: "toggle",
      },
      getState(states),
      "label",
      0,
    );
    expect(view.actionEntity).toBe("cover.blind_quiet");
    expect(view.moreInfoEntity).toBe("cover.blind");
  });

  it("defaults display flags to true and honors overrides", () => {
    const on = openingView(
      { window: "binary_sensor.window" },
      getState(states),
      "label",
      0,
    );
    expect(on.showName).toBe(true);
    expect(on.showValue).toBe(true);
    expect(on.showIcon).toBe(true);

    const off = openingView(
      { window: "binary_sensor.window" },
      getState(states),
      "label",
      0,
      { showValue: false, showIcon: false },
    );
    expect(off.showName).toBe(true);
    expect(off.showValue).toBe(false);
    expect(off.showIcon).toBe(false);
  });
});

describe("alertActive", () => {
  it("matches active_state with default on", () => {
    expect(alertActive({ entity: "b.s" }, entity("b.s", "on"))).toBe(true);
    expect(alertActive({ entity: "b.s" }, entity("b.s", "off"))).toBe(false);
    expect(
      alertActive({ entity: "b.s", active_state: "wet" }, entity("b.s", "wet")),
    ).toBe(true);
  });

  it("supports invert", () => {
    expect(
      alertActive({ entity: "b.s", invert: true }, entity("b.s", "off")),
    ).toBe(true);
  });

  it("supports numeric below/above thresholds", () => {
    expect(
      alertActive({ entity: "s.batt", below: 15 }, entity("s.batt", "12")),
    ).toBe(true);
    expect(
      alertActive({ entity: "s.batt", below: 15 }, entity("s.batt", "80")),
    ).toBe(false);
    expect(
      alertActive({ entity: "s.temp", above: 30 }, entity("s.temp", "31")),
    ).toBe(true);
  });

  it("is inactive for unavailable or missing entities", () => {
    expect(alertActive({ entity: "b.s" }, entity("b.s", "unavailable"))).toBe(
      false,
    );
    expect(alertActive({ entity: "b.s" }, undefined)).toBe(false);
  });

  it("fires on unavailable: true for every no-value state", () => {
    const item = { entity: "c.x", unavailable: true };
    for (const state of ["unavailable", "unknown", "none", "NaN", ""])
      expect(alertActive(item, entity("c.x", state))).toBe(true);
    expect(alertActive(item, undefined)).toBe(true);
    expect(alertActive(item, entity("c.x", "open"))).toBe(false);
  });

  it("lets unavailable: true win over a value match", () => {
    // Without the availability branch, below: 20 would swallow the dead sensor.
    const item = { entity: "s.batt", unavailable: true, below: 20 };
    expect(alertActive(item, entity("s.batt", "unavailable"))).toBe(true);
    expect(alertActive(item, entity("s.batt", "5"))).toBe(false);
  });

  it("inverts an availability alert into an is-available alert", () => {
    const item = { entity: "c.x", unavailable: true, invert: true };
    expect(alertActive(item, entity("c.x", "unavailable"))).toBe(false);
    expect(alertActive(item, entity("c.x", "open"))).toBe(true);
  });

  it("checks an attribute's availability when one is given", () => {
    const item = {
      entity: "c.x",
      unavailable: true,
      attribute: "current_position",
    };
    expect(alertActive(item, entity("c.x", "open", {}))).toBe(true);
    expect(
      alertActive(item, entity("c.x", "open", { current_position: 40 })),
    ).toBe(false);
  });
});

describe("activeAlerts", () => {
  it("collects only active alerts with defaults filled in", () => {
    const states = [
      entity("binary_sensor.leak", "on", { friendly_name: "Leak sensor" }),
      entity("binary_sensor.motion", "off"),
    ];
    const views = activeAlerts(
      [
        {
          entity: "binary_sensor.leak",
          severity: "critical",
          full_width: true,
        },
        { entity: "binary_sensor.motion", severity: "warning" },
      ],
      getState(states),
    );
    expect(views).toHaveLength(1);
    expect(views[0].label).toBe("Leak sensor");
    expect(views[0].severity).toBe("critical");
    expect(views[0].fullWidth).toBe(true);
  });

  it("defaults alerts to full-width, opt out with full_width: false", () => {
    const states = [entity("binary_sensor.a", "on")];
    const [bar] = activeAlerts(
      [{ entity: "binary_sensor.a" }],
      getState(states),
    );
    expect(bar.fullWidth).toBe(true);
    const [chip] = activeAlerts(
      [{ entity: "binary_sensor.a", full_width: false }],
      getState(states),
    );
    expect(chip.fullWidth).toBe(false);
  });
});

describe("parseDuration", () => {
  it("parses seconds and HH:MM:SS", () => {
    expect(parseDuration(300)).toBe(300);
    expect(parseDuration("300")).toBe(300);
    expect(parseDuration("00:10:00")).toBe(600);
    expect(parseDuration("10:30")).toBe(630);
    expect(parseDuration(undefined)).toBe(0);
    expect(parseDuration("abc")).toBe(0);
  });
});

describe("evalCondition", () => {
  const now = Date.now();

  it("matches entity state", () => {
    const get = getState([entity("binary_sensor.w", "on")]);
    expect(
      evalCondition({ entity: "binary_sensor.w", state: "on" }, get, now).met,
    ).toBe(true);
    expect(
      evalCondition({ entity: "binary_sensor.w", state: "off" }, get, now).met,
    ).toBe(false);
  });

  it("matches numeric attribute below/above", () => {
    const get = getState([entity("cover.r", "open", { current_position: 30 })]);
    expect(
      evalCondition(
        { entity: "cover.r", attribute: "current_position", below: 50 },
        get,
        now,
      ).met,
    ).toBe(true);
    expect(
      evalCondition(
        { entity: "cover.r", attribute: "current_position", above: 50 },
        get,
        now,
      ).met,
    ).toBe(false);
  });

  it("evaluates sun windows via sun.sun", () => {
    const night = getState([entity("sun.sun", "below_horizon")]);
    const day = getState([entity("sun.sun", "above_horizon")]);
    const cond = { after: "sunset", before: "sunrise" } as const;
    expect(evalCondition(cond, night, now).met).toBe(true);
    expect(evalCondition(cond, day, now).met).toBe(false);
  });

  it("combines sun window with an entity check", () => {
    const get = getState([
      entity("sun.sun", "below_horizon"),
      entity("binary_sensor.w", "on"),
    ]);
    expect(
      evalCondition(
        { after: "sunset", entity: "binary_sensor.w", state: "on" },
        get,
        now,
      ).met,
    ).toBe(true);
  });

  it("holds `for` durations against last_changed", () => {
    const openedRecently = getState([
      entity("binary_sensor.w", "on", {}, new Date(now - 60_000).toISOString()),
    ]);
    const openedLongAgo = getState([
      entity(
        "binary_sensor.w",
        "on",
        {},
        new Date(now - 700_000).toISOString(),
      ),
    ]);
    const cond = { entity: "binary_sensor.w", state: "on", for: 600 };
    const pending = evalCondition(cond, openedRecently, now);
    expect(pending.met).toBe(false);
    expect(pending.recheckInMs).toBeGreaterThan(0);
    expect(evalCondition(cond, openedLongAgo, now).met).toBe(true);
  });

  it("treats unavailable entities as not met", () => {
    const get = getState([entity("binary_sensor.w", "unavailable")]);
    expect(
      evalCondition({ entity: "binary_sensor.w", state: "on" }, get, now).met,
    ).toBe(false);
  });
});

describe("evalOutline", () => {
  const now = Date.now();

  it("applies AND / OR matching", () => {
    const get = getState([
      entity("binary_sensor.a", "on"),
      entity("binary_sensor.b", "off"),
    ]);
    const conditions = [
      { entity: "binary_sensor.a", state: "on" },
      { entity: "binary_sensor.b", state: "on" },
    ];
    expect(
      evalOutline([{ outline: "warning", match: "all", conditions }], get, now)
        .outline,
    ).toBeNull();
    expect(
      evalOutline([{ outline: "warning", match: "any", conditions }], get, now)
        .outline,
    ).toBe("warning");
  });

  it("lets critical win over warning and accepts the warn alias", () => {
    const get = getState([entity("binary_sensor.a", "on")]);
    const cond = [{ entity: "binary_sensor.a", state: "on" }];
    const result = evalOutline(
      [
        { outline: "warn", conditions: cond },
        { outline: "critical", conditions: cond },
      ],
      get,
      now,
    );
    expect(result.outline).toBe("critical");
  });

  it("matches unavailable entities only with unavailable: true", () => {
    const get = getState([entity("cover.tahoma", "unavailable")]);
    const plain = [{ entity: "cover.tahoma", state: "open" }];
    const avail = [{ entity: "cover.tahoma", unavailable: true }];
    expect(
      evalOutline([{ outline: "warning", conditions: plain }], get, now)
        .outline,
    ).toBeNull();
    expect(
      evalOutline([{ outline: "warning", conditions: avail }], get, now)
        .outline,
    ).toBe("warning");
    // …and stays quiet once the cover reports again.
    expect(
      evalOutline(
        [{ outline: "warning", conditions: avail }],
        getState([entity("cover.tahoma", "open")]),
        now,
      ).outline,
    ).toBeNull();
  });

  it("matches an entity hass no longer knows, ignoring its for: hold", () => {
    const get = getState([]);
    const rules = [
      {
        outline: "warning" as const,
        conditions: [
          { entity: "cover.gone", unavailable: true, for: "00:10:00" },
        ],
      },
    ];
    expect(evalOutline(rules, get, now).outline).toBe("warning");
  });

  it("still honours for: while hass keeps the unavailable entity", () => {
    const changed = new Date(now - 60_000).toISOString();
    const get = getState([entity("cover.tahoma", "unavailable", {}, changed)]);
    const rules = [
      {
        outline: "warning" as const,
        conditions: [
          { entity: "cover.tahoma", unavailable: true, for: "00:10:00" },
        ],
      },
    ];
    const result = evalOutline(rules, get, now);
    expect(result.outline).toBeNull();
    expect(result.recheckInMs).toBeGreaterThan(0);
  });

  it("returns no outline for empty rules or conditions", () => {
    const get = getState([]);
    expect(evalOutline(undefined, get, now).outline).toBeNull();
    expect(
      evalOutline([{ outline: "critical", conditions: [] }], get, now).outline,
    ).toBeNull();
  });
});
