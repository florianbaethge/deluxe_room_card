/**
 * Visual config editor for the Deluxe Room Card.
 *
 * Scalar options use ha-form with native selectors; the list sections
 * (openings, controls, alerts, outline rules) use small custom row editors,
 * each backed by its own ha-form schema.
 */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { hexToRgb, rgbToHex } from "./color";
import { applyAreaImport, deriveFromArea } from "./config";
import { fireEvent } from "./fire-event";
import { localize } from "./i18n";
import type {
  AlertItem,
  CardAlertRule,
  CardCondition,
  ControlItem,
  DeluxeRoomCardConfig,
  HomeAssistant,
  OpeningItem,
} from "./types";

/** Force-load ha-form and friends (they ship with the entities card editor). */
async function loadHaForm(): Promise<void> {
  if (customElements.get("ha-form")) return;
  try {
    const helpers = await (
      window as unknown as {
        loadCardHelpers?: () => Promise<{
          createCardElement: (config: unknown) => Promise<{
            constructor: { getConfigElement?: () => Promise<unknown> };
          }>;
        }>;
      }
    ).loadCardHelpers?.();
    if (!helpers) return;
    const card = await helpers.createCardElement({
      type: "entities",
      entities: [],
    });
    await card.constructor.getConfigElement?.();
  } catch {
    // ha-form is usually already defined inside the edit dialog
  }
}

type HaFormSchema = Record<string, unknown>;

interface ListSection<T> {
  key: "openings" | "controls" | "alerts" | "card_alerts";
  titleKey: string;
  itemKey: string;
  items: T[];
  schema: (item: T) => HaFormSchema[];
  newItem: () => T;
  summary: (item: T) => string;
}

@customElement("deluxe-room-card-editor")
export class DeluxeRoomCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: DeluxeRoomCardConfig;

  @state() private _formReady = false;

  @state() private _expanded: Record<string, number | null> = {};

  /** Which top-level editor sections are unfolded. */
  @state() private _openSections: Record<string, boolean> = {};

  @state() private _importArea = "";

  public setConfig(config: DeluxeRoomCardConfig): void {
    this._config = config;
  }

  public connectedCallback(): void {
    super.connectedCallback();
    void loadHaForm().then(() => {
      this._formReady = true;
    });
  }

  private _t(key: string): string {
    return localize(this.hass, key);
  }

  private _emit(config: DeluxeRoomCardConfig): void {
    this._config = config;
    fireEvent(this, "config-changed", { config });
  }

  /* ------------------------------------------------------------ schemas --- */

  private _select(name: string, options: [string, string][]): HaFormSchema {
    return {
      name,
      selector: {
        select: {
          mode: "dropdown",
          options: options.map(([value, labelKey]) => ({
            value,
            label: this._t(labelKey),
          })),
        },
      },
    };
  }

  private _generalSchema(): HaFormSchema[] {
    const overrides: HaFormSchema[] =
      this._config?.color_style === "override"
        ? [
            { name: "accent_color", selector: { color_rgb: {} } },
            { name: "bg_tint", selector: { color_rgb: {} } },
          ]
        : [];
    return [
      { name: "title", selector: { text: {} } },
      { name: "icon", selector: { icon: {} } },
      {
        name: "",
        type: "grid",
        schema: [
          this._select("layout", [
            ["classic", "layout_classic"],
            ["controls-bottom", "layout_controls_bottom"],
            ["header-bar", "layout_header_bar"],
            ["compact", "layout_compact"],
          ]),
          this._select("width", [
            ["auto", "width_auto"],
            ["full", "width_full"],
            ["half", "width_half"],
          ]),
          this._select("state_style", [
            ["combined", "style_combined"],
            ["label", "style_label"],
            ["bar", "style_bar"],
            ["radial", "style_radial"],
            ["color", "style_color"],
          ]),
          {
            name: "icon_size",
            selector: {
              number: { min: 0.6, max: 1.8, step: 0.1, mode: "slider" },
            },
          },
          this._select("color_style", [
            ["theme", "color_theme"],
            ["override", "color_override"],
          ]),
          ...overrides,
        ],
      },
      {
        name: "",
        type: "grid",
        schema: [
          { name: "show_name", selector: { boolean: {} } },
          { name: "show_climate", selector: { boolean: {} } },
          { name: "show_icon", selector: { boolean: {} } },
        ],
      },
    ];
  }

  private _climateSchema(): HaFormSchema[] {
    return [
      {
        name: "temperature",
        selector: { entity: { domain: "sensor", device_class: "temperature" } },
      },
      {
        name: "humidity",
        selector: { entity: { domain: "sensor", device_class: "humidity" } },
      },
      {
        // Collapsed by default so the editor stays short.
        name: "temperature_thresholds",
        type: "expandable",
        title: this._t("thresholds_temp"),
        schema: [
          {
            name: "",
            type: "grid",
            schema: [
              { name: "low", selector: { number: { mode: "box", step: 0.5 } } },
              {
                name: "low_crit",
                selector: { number: { mode: "box", step: 0.5 } },
              },
              {
                name: "high",
                selector: { number: { mode: "box", step: 0.5 } },
              },
              {
                name: "high_crit",
                selector: { number: { mode: "box", step: 0.5 } },
              },
            ],
          },
        ],
      },
      {
        name: "humidity_thresholds",
        type: "expandable",
        title: this._t("thresholds_hum"),
        schema: [
          {
            name: "",
            type: "grid",
            schema: [
              { name: "low", selector: { number: { mode: "box", step: 1 } } },
              {
                name: "low_crit",
                selector: { number: { mode: "box", step: 1 } },
              },
              { name: "high", selector: { number: { mode: "box", step: 1 } } },
              {
                name: "high_crit",
                selector: { number: { mode: "box", step: 1 } },
              },
            ],
          },
        ],
      },
      { name: "alert_on_threshold", selector: { boolean: {} } },
    ];
  }

  private _openingSchema(): HaFormSchema[] {
    return [
      {
        name: "window",
        selector: { entity: { domain: ["binary_sensor", "sensor"] } },
      },
      { name: "door", selector: { entity: { domain: "binary_sensor" } } },
      { name: "cover", selector: { entity: { domain: "cover" } } },
      { name: "control_entity", selector: { entity: {} } },
      {
        name: "",
        type: "grid",
        schema: [
          { name: "name", selector: { text: {} } },
          { name: "icon", selector: { icon: {} } },
          this._select("tap_action", [
            ["more-info", "action_more_info"],
            ["toggle", "action_toggle"],
            ["call-service", "action_call_service"],
            ["none", "action_none"],
          ]),
        ],
      },
    ];
  }

  private _controlSchema(): HaFormSchema[] {
    return [
      {
        name: "entity",
        selector: {
          entity: { domain: ["light", "switch", "input_boolean", "fan"] },
        },
      },
      {
        name: "",
        type: "grid",
        schema: [
          { name: "name", selector: { text: {} } },
          { name: "icon", selector: { icon: {} } },
          { name: "label", selector: { text: {} } },
          { name: "color", selector: { color_rgb: {} } },
        ],
      },
    ];
  }

  private _alertSchema(): HaFormSchema[] {
    return [
      { name: "entity", selector: { entity: {} } },
      {
        name: "",
        type: "grid",
        schema: [
          { name: "label", selector: { text: {} } },
          { name: "icon", selector: { icon: {} } },
          { name: "active_state", selector: { text: {} } },
          { name: "invert", selector: { boolean: {} } },
          { name: "below", selector: { number: { mode: "box" } } },
          { name: "above", selector: { number: { mode: "box" } } },
          this._select("severity", [
            ["info", "severity_info"],
            ["warning", "severity_warning"],
            ["critical", "severity_critical"],
          ]),
          { name: "full_width", selector: { boolean: {} } },
          { name: "color", selector: { color_rgb: {} } },
        ],
      },
    ];
  }

  private _ruleSchema(): HaFormSchema[] {
    return [
      {
        name: "",
        type: "grid",
        schema: [
          this._select("outline", [
            ["warning", "outline_warning"],
            ["critical", "outline_critical"],
          ]),
          this._select("match", [
            ["all", "match_all"],
            ["any", "match_any"],
          ]),
        ],
      },
    ];
  }

  private _conditionSchema(): HaFormSchema[] {
    return [
      { name: "entity", selector: { entity: {} } },
      {
        name: "",
        type: "grid",
        schema: [
          { name: "state", selector: { text: {} } },
          { name: "attribute", selector: { text: {} } },
          { name: "above", selector: { number: { mode: "box" } } },
          { name: "below", selector: { number: { mode: "box" } } },
          this._select("after", [
            ["sunrise", "sunrise"],
            ["sunset", "sunset"],
          ]),
          this._select("before", [
            ["sunrise", "sunrise"],
            ["sunset", "sunset"],
          ]),
          { name: "for", selector: { text: {} } },
        ],
      },
    ];
  }

  /* ------------------------------------------------------------- labels --- */

  private _computeLabel = (schema: { name: string }): string => {
    const labels: Record<string, string> = {
      title: this._t("title"),
      icon: this._t("room_icon"),
      layout: this._t("layout"),
      width: this._t("width"),
      state_style: this._t("state_style"),
      icon_size: this._t("icon_size"),
      color_style: this._t("color_style"),
      accent_color: this._t("accent_color"),
      bg_tint: this._t("bg_tint"),
      show_name: this._t("show_name"),
      show_climate: this._t("show_climate"),
      show_icon: this._t("show_icon"),
      temperature: this._t("temperature"),
      humidity: this._t("humidity"),
      temperature_thresholds: this._t("thresholds_temp"),
      humidity_thresholds: this._t("thresholds_hum"),
      low: this._t("threshold_low"),
      low_crit: this._t("threshold_low_crit"),
      high: this._t("threshold_high"),
      high_crit: this._t("threshold_high_crit"),
      alert_on_threshold: this._t("alert_on_threshold"),
      window: this._t("window_sensor"),
      door: this._t("door_sensor"),
      cover: this._t("cover_entity"),
      control_entity: this._t("control_entity"),
      name: this._t("name"),
      tap_action: this._t("tap_action"),
      entity: this._t("entity"),
      label: this._t("label"),
      color: this._t("color"),
      active_state: this._t("active_state"),
      invert: this._t("invert"),
      below: this._t("below"),
      above: this._t("above"),
      severity: this._t("severity"),
      full_width: this._t("full_width"),
      outline: this._t("outline"),
      match: this._t("match"),
      state: this._t("state"),
      attribute: this._t("attribute"),
      after: this._t("after"),
      before: this._t("before"),
      for: this._t("for"),
    };
    return labels[schema.name] ?? schema.name;
  };

  /* -------------------------------------------------------------- render --- */

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config || !this._formReady) return nothing;
    const config = this._config;

    const generalData = {
      title: config.title ?? "",
      icon: config.icon ?? "mdi:sofa",
      layout: config.layout ?? "classic",
      width: config.width ?? "auto",
      state_style: config.openings?.state_style ?? "label",
      icon_size: config.icon_size ?? 1,
      color_style: config.color_style ?? "theme",
      accent_color: hexToRgb(config.accent_color),
      bg_tint: hexToRgb(config.bg_tint),
      show_name: config.show_name !== false,
      show_climate: config.show_climate !== false,
      show_icon: config.show_icon !== false,
    };

    const climate = config.climate ?? {};
    const climateCount = [climate.temperature, climate.humidity].filter(
      Boolean,
    ).length;

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${generalData}
        .schema=${this._generalSchema()}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._generalChanged}
      ></ha-form>

      ${this._renderSection(
        "climate",
        this._t("climate"),
        climateCount,
        () => html`
          <ha-form
            .hass=${this.hass}
            .data=${{
              temperature: climate.temperature ?? "",
              humidity: climate.humidity ?? "",
              temperature_thresholds: climate.temperature_thresholds ?? {},
              humidity_thresholds: climate.humidity_thresholds ?? {},
              alert_on_threshold: climate.alert_on_threshold ?? false,
            }}
            .schema=${this._climateSchema()}
            .computeLabel=${this._computeLabel}
            @value-changed=${this._climateChanged}
          ></ha-form>
        `,
      )}
      ${this._renderSection("import", this._t("import_from_area"), 0, () =>
        this._renderAreaImport(),
      )}
      ${this._renderList(this._openingsSection())}
      ${this._renderList(this._controlsSection())}
      ${this._renderList(this._alertsSection())} ${this._renderRules()}
    `;
  }

  /** Collapsible top-level editor section (collapsed by default). */
  private _renderSection(
    key: string,
    title: string,
    count: number,
    body: () => TemplateResult,
  ): TemplateResult {
    const open = this._openSections[key] ?? false;
    return html`
      <div class="section">
        <button class="section-head" @click=${() => this._toggleSection(key)}>
          <ha-icon
            .icon=${open ? "mdi:chevron-down" : "mdi:chevron-right"}
          ></ha-icon>
          <span class="section-title">${title}</span>
          ${
            count > 0
              ? html`<span class="section-count">${count}</span>`
              : nothing
          }
        </button>
        ${open ? html`<div class="section-body">${body()}</div>` : nothing}
      </div>
    `;
  }

  private _toggleSection(key: string): void {
    this._openSections = {
      ...this._openSections,
      [key]: !(this._openSections[key] ?? false),
    };
  }

  private _renderAreaImport(): TemplateResult {
    // The native area selector keeps registry lookups and search consistent
    // with the rest of Home Assistant (a hand-rolled ha-select did not
    // reliably propagate the selection).
    return html`
      <div class="area-import">
        <ha-form
          .hass=${this.hass}
          .data=${{ area: this._importArea }}
          .schema=${[{ name: "area", selector: { area: {} } }]}
          .computeLabel=${() => this._t("area")}
          @value-changed=${(ev: CustomEvent) => {
            ev.stopPropagation();
            this._importArea =
              (ev.detail.value as { area?: string }).area ?? "";
          }}
        ></ha-form>
        <mwc-button
          .disabled=${!this._importArea}
          @click=${this._importFromArea}
        >
          ${this._t("import_from_area")}
        </mwc-button>
        <p class="hint">${this._t("import_from_area_hint")}</p>
      </div>
    `;
  }

  private _importFromArea(): void {
    if (!this.hass || !this._config || !this._importArea) return;
    const imported = deriveFromArea(this.hass, this._importArea);
    this._emit(applyAreaImport(this._config, imported));
  }

  /* --------------------------------------------------------------- lists --- */

  private _openingsSection(): ListSection<OpeningItem> {
    return {
      key: "openings",
      titleKey: "openings",
      itemKey: "opening",
      items: this._config?.openings?.items ?? [],
      schema: () => this._openingSchema(),
      newItem: () => ({}),
      summary: (item) =>
        item.name ??
        item.window ??
        item.door ??
        item.cover ??
        this._t("opening"),
    };
  }

  private _controlsSection(): ListSection<ControlItem> {
    return {
      key: "controls",
      titleKey: "controls",
      itemKey: "control",
      items: this._config?.controls ?? [],
      schema: () => this._controlSchema(),
      newItem: () => ({ entity: "" }),
      summary: (item) => item.name ?? item.entity ?? this._t("control"),
    };
  }

  private _alertsSection(): ListSection<AlertItem> {
    return {
      key: "alerts",
      titleKey: "alerts",
      itemKey: "alert",
      items: this._config?.alerts ?? [],
      schema: () => this._alertSchema(),
      newItem: () => ({ entity: "" }),
      summary: (item) => item.label ?? item.entity ?? this._t("alert"),
    };
  }

  private _renderList<T>(section: ListSection<T>): TemplateResult {
    return this._renderSection(
      section.key,
      this._t(section.titleKey),
      section.items.length,
      () => this._renderListBody(section),
    );
  }

  private _renderListBody<T>(section: ListSection<T>): TemplateResult {
    const expandedIndex = this._expanded[section.key] ?? null;
    return html`
      <div class="list">
        ${section.items.map((item, index) => {
          const open = expandedIndex === index;
          return html`
            <div class="list-item">
              <div class="list-head">
                <button
                  class="list-title"
                  @click=${() => this._toggleExpanded(section.key, index)}
                >
                  <ha-icon
                    .icon=${open ? "mdi:chevron-down" : "mdi:chevron-right"}
                  ></ha-icon>
                  ${section.summary(item)}
                </button>
                <ha-icon-button
                  .label=${this._t("move_up")}
                  .disabled=${index === 0}
                  @click=${() => this._moveItem(section, index, -1)}
                  ><ha-icon icon="mdi:arrow-up"></ha-icon
                ></ha-icon-button>
                <ha-icon-button
                  .label=${this._t("move_down")}
                  .disabled=${index === section.items.length - 1}
                  @click=${() => this._moveItem(section, index, 1)}
                  ><ha-icon icon="mdi:arrow-down"></ha-icon
                ></ha-icon-button>
                <ha-icon-button
                  .label=${this._t("remove")}
                  @click=${() => this._removeItem(section, index)}
                  ><ha-icon icon="mdi:close"></ha-icon
                ></ha-icon-button>
              </div>
              ${
                open
                  ? html`
                      <ha-form
                        .hass=${this.hass}
                        .data=${itemToFormData(item as Record<string, unknown>)}
                        .schema=${section.schema(item)}
                        .computeLabel=${this._computeLabel}
                        @value-changed=${(ev: CustomEvent) =>
                          this._itemChanged(section, index, ev)}
                      ></ha-form>
                    `
                  : nothing
              }
            </div>
          `;
        })}
        <mwc-button @click=${() => this._addItem(section)}>
          + ${this._t("add")} · ${this._t(section.itemKey)}
        </mwc-button>
      </div>
    `;
  }

  private _toggleExpanded(key: string, index: number): void {
    this._expanded = {
      ...this._expanded,
      [key]: this._expanded[key] === index ? null : index,
    };
  }

  private _writeSection<T>(section: ListSection<T>, items: T[]): void {
    const config = { ...this._config! };
    if (section.key === "openings") {
      config.openings = {
        ...config.openings,
        items: items as OpeningItem[],
      };
    } else if (section.key === "controls") {
      config.controls = items as ControlItem[];
    } else if (section.key === "alerts") {
      config.alerts = items as AlertItem[];
    } else {
      config.card_alerts = items as unknown as CardAlertRule[];
    }
    this._emit(config);
  }

  private _addItem<T>(section: ListSection<T>): void {
    this._writeSection(section, [...section.items, section.newItem()]);
    this._expanded = { ...this._expanded, [section.key]: section.items.length };
  }

  private _removeItem<T>(section: ListSection<T>, index: number): void {
    const items = [...section.items];
    items.splice(index, 1);
    this._writeSection(section, items);
    this._expanded = { ...this._expanded, [section.key]: null };
  }

  private _moveItem<T>(
    section: ListSection<T>,
    index: number,
    delta: number,
  ): void {
    const target = index + delta;
    if (target < 0 || target >= section.items.length) return;
    const items = [...section.items];
    const [moved] = items.splice(index, 1);
    items.splice(target, 0, moved);
    this._writeSection(section, items);
    this._expanded = { ...this._expanded, [section.key]: target };
  }

  private _itemChanged<T>(
    section: ListSection<T>,
    index: number,
    ev: CustomEvent,
  ): void {
    ev.stopPropagation();
    const items = [...section.items];
    items[index] = pruneEmpty(formDataToItem(ev.detail.value)) as T;
    this._writeSection(section, items);
  }

  /* ------------------------------------------------------- outline rules --- */

  private _renderRules(): TemplateResult {
    const rules = this._config?.card_alerts ?? [];
    return this._renderSection(
      "card_alerts",
      this._t("card_alerts"),
      rules.length,
      () => this._renderRulesBody(rules),
    );
  }

  private _renderRulesBody(rules: CardAlertRule[]): TemplateResult {
    const expandedIndex = this._expanded["card_alerts"] ?? null;
    return html`
      <div class="list">
        ${rules.map((rule, index) => {
          const open = expandedIndex === index;
          return html`
            <div class="list-item">
              <div class="list-head">
                <button
                  class="list-title"
                  @click=${() => this._toggleExpanded("card_alerts", index)}
                >
                  <ha-icon
                    .icon=${open ? "mdi:chevron-down" : "mdi:chevron-right"}
                  ></ha-icon>
                  ${this._t("outline")}:
                  ${this._t(`outline_${rule.outline === "warn" ? "warning" : rule.outline}`)}
                  · ${rule.conditions.length}× ${this._t("condition")}
                </button>
                <ha-icon-button
                  .label=${this._t("remove")}
                  @click=${() => this._removeRule(index)}
                  ><ha-icon icon="mdi:close"></ha-icon
                ></ha-icon-button>
              </div>
              ${
                open
                  ? html`
                      <ha-form
                        .hass=${this.hass}
                        .data=${{
                          outline:
                            rule.outline === "warn" ? "warning" : rule.outline,
                          match: rule.match ?? "all",
                        }}
                        .schema=${this._ruleSchema()}
                        .computeLabel=${this._computeLabel}
                        @value-changed=${(ev: CustomEvent) =>
                          this._ruleChanged(index, ev)}
                      ></ha-form>
                      ${rule.conditions.map(
                        (cond, condIndex) => html`
                          <div class="condition">
                            <div class="condition-head">
                              <span
                                >${this._t("condition")} ${condIndex + 1}</span
                              >
                              <ha-icon-button
                                .label=${this._t("remove")}
                                @click=${() =>
                                  this._removeCondition(index, condIndex)}
                                ><ha-icon icon="mdi:close"></ha-icon
                              ></ha-icon-button>
                            </div>
                            <ha-form
                              .hass=${this.hass}
                              .data=${cond}
                              .schema=${this._conditionSchema()}
                              .computeLabel=${this._computeLabel}
                              @value-changed=${(ev: CustomEvent) =>
                                this._conditionChanged(index, condIndex, ev)}
                            ></ha-form>
                          </div>
                        `,
                      )}
                      <mwc-button @click=${() => this._addCondition(index)}>
                        + ${this._t("add")} · ${this._t("condition")}
                      </mwc-button>
                    `
                  : nothing
              }
            </div>
          `;
        })}
        <mwc-button @click=${this._addRule}>
          + ${this._t("add")} · ${this._t("rule")}
        </mwc-button>
      </div>
    `;
  }

  private _writeRules(rules: CardAlertRule[]): void {
    this._emit({ ...this._config!, card_alerts: rules });
  }

  private _addRule = (): void => {
    const rules = [...(this._config?.card_alerts ?? [])];
    rules.push({ outline: "warning", match: "all", conditions: [] });
    this._writeRules(rules);
    this._expanded = { ...this._expanded, card_alerts: rules.length - 1 };
  };

  private _removeRule(index: number): void {
    const rules = [...(this._config?.card_alerts ?? [])];
    rules.splice(index, 1);
    this._writeRules(rules);
    this._expanded = { ...this._expanded, card_alerts: null };
  }

  private _ruleChanged(index: number, ev: CustomEvent): void {
    ev.stopPropagation();
    const rules = [...(this._config?.card_alerts ?? [])];
    rules[index] = { ...rules[index], ...ev.detail.value };
    this._writeRules(rules);
  }

  private _addCondition(ruleIndex: number): void {
    const rules = [...(this._config?.card_alerts ?? [])];
    rules[ruleIndex] = {
      ...rules[ruleIndex],
      conditions: [...rules[ruleIndex].conditions, {}],
    };
    this._writeRules(rules);
  }

  private _removeCondition(ruleIndex: number, condIndex: number): void {
    const rules = [...(this._config?.card_alerts ?? [])];
    const conditions = [...rules[ruleIndex].conditions];
    conditions.splice(condIndex, 1);
    rules[ruleIndex] = { ...rules[ruleIndex], conditions };
    this._writeRules(rules);
  }

  private _conditionChanged(
    ruleIndex: number,
    condIndex: number,
    ev: CustomEvent,
  ): void {
    ev.stopPropagation();
    const rules = [...(this._config?.card_alerts ?? [])];
    const conditions = [...rules[ruleIndex].conditions];
    conditions[condIndex] = pruneEmpty(ev.detail.value) as CardCondition;
    rules[ruleIndex] = { ...rules[ruleIndex], conditions };
    this._writeRules(rules);
  }

  /* ------------------------------------------------------ change handlers --- */

  private _generalChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const value = ev.detail.value as Record<string, unknown>;
    const config: DeluxeRoomCardConfig = {
      ...this._config!,
      title: (value.title as string) || undefined,
      icon: (value.icon as string) || undefined,
      layout: value.layout as DeluxeRoomCardConfig["layout"],
      width: value.width as DeluxeRoomCardConfig["width"],
      icon_size: value.icon_size as number,
      color_style: value.color_style as DeluxeRoomCardConfig["color_style"],
      accent_color: rgbToHex(value.accent_color),
      bg_tint: rgbToHex(value.bg_tint),
      show_name: value.show_name as boolean,
      show_climate: value.show_climate as boolean,
      show_icon: value.show_icon as boolean,
      openings: {
        ...this._config?.openings,
        state_style: value.state_style as never,
      },
    };
    this._emit(config);
  }

  private _climateChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const value = ev.detail.value as Record<string, unknown>;
    const climate = pruneEmpty({
      temperature: value.temperature as string | undefined,
      humidity: value.humidity as string | undefined,
      temperature_thresholds: pruneEmpty(
        (value.temperature_thresholds ?? {}) as Record<string, number>,
      ),
      humidity_thresholds: pruneEmpty(
        (value.humidity_thresholds ?? {}) as Record<string, number>,
      ),
      alert_on_threshold: (value.alert_on_threshold as boolean) || undefined,
    });
    this._emit({ ...this._config!, climate });
  }

  static styles = css`
    .section {
      margin-top: 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 12px;
      overflow: hidden;
    }
    .section-head {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 12px 10px;
      background: none;
      border: none;
      color: inherit;
      font: inherit;
      font-weight: 600;
      font-size: 15px;
      cursor: pointer;
      text-align: left;
    }
    .section-head:hover {
      background: color-mix(
        in srgb,
        var(--primary-text-color, #212121) 4%,
        transparent
      );
    }
    .section-title {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .section-count {
      flex-shrink: 0;
      min-width: 22px;
      padding: 1px 7px;
      border-radius: 11px;
      background: color-mix(
        in srgb,
        var(--primary-color, #2f7d54) 15%,
        transparent
      );
      color: var(--primary-color, #2f7d54);
      font-size: 12px;
      font-weight: 700;
      text-align: center;
      box-sizing: border-box;
    }
    .section-body {
      padding: 2px 10px 12px;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .list-item {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 10px;
      padding: 6px 10px 10px;
    }
    .list-head {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .list-title {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 6px;
      background: none;
      border: none;
      color: inherit;
      font: inherit;
      font-weight: 500;
      cursor: pointer;
      padding: 6px 0;
      text-align: left;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    ha-icon-button {
      --mdc-icon-button-size: 36px;
      --mdc-icon-size: 18px;
    }
    .condition {
      margin: 8px 0 0 12px;
      padding: 8px 10px;
      border-left: 3px solid var(--primary-color, #2f7d54);
      background: color-mix(
        in srgb,
        var(--primary-color, #2f7d54) 6%,
        transparent
      );
      border-radius: 6px;
    }
    .condition-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 500;
      font-size: 13px;
    }
    .area-import {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 16px;
    }
    .area-import ha-select {
      flex: 1;
      min-width: 180px;
    }
    .hint {
      flex-basis: 100%;
      margin: 2px 0 0;
      font-size: 12px;
      color: var(--secondary-text-color, #757575);
    }
    ha-form {
      display: block;
      margin-top: 4px;
    }
  `;
}

/** Drop empty strings / empty objects so the YAML stays clean. */
/** Config item → ha-form data: hex colors become RGB arrays for color_rgb. */
function itemToFormData(
  item: Record<string, unknown>,
): Record<string, unknown> {
  if (typeof item.color !== "string") return item;
  return { ...item, color: hexToRgb(item.color) };
}

/** ha-form data → config item: RGB arrays back to hex strings. */
function formDataToItem(
  value: Record<string, unknown>,
): Record<string, unknown> {
  if (!Array.isArray(value.color)) return value;
  return { ...value, color: rgbToHex(value.color) };
}

function pruneEmpty<T extends Record<string, unknown>>(value: T): T {
  const result: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value ?? {})) {
    if (entry === "" || entry === undefined || entry === null) continue;
    if (
      typeof entry === "object" &&
      !Array.isArray(entry) &&
      Object.keys(entry as object).length === 0
    )
      continue;
    result[key] = entry;
  }
  return result as T;
}

declare global {
  interface HTMLElementTagNameMap {
    "deluxe-room-card-editor": DeluxeRoomCardEditor;
  }
}
