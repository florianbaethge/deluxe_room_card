/** Shared test fixtures. */

import type { HassEntity, HomeAssistant } from "../src/types";

export function entity(
  entityId: string,
  state: string,
  attributes: Record<string, unknown> = {},
  lastChanged = new Date().toISOString(),
): HassEntity {
  return {
    entity_id: entityId,
    state,
    attributes,
    last_changed: lastChanged,
  };
}

export function makeHass(
  entities: HassEntity[],
  overrides: Partial<HomeAssistant> = {},
): HomeAssistant & { calls: unknown[][] } {
  const calls: unknown[][] = [];
  return {
    states: Object.fromEntries(entities.map((e) => [e.entity_id, e])),
    locale: { language: "en" },
    callService: async (...args: unknown[]) => {
      calls.push(args);
    },
    calls,
    ...overrides,
  };
}

export function getState(
  entities: HassEntity[],
): (id: string) => HassEntity | undefined {
  const map = Object.fromEntries(entities.map((e) => [e.entity_id, e]));
  return (id: string): HassEntity | undefined => map[id];
}
