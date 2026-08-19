/**
 * Deluxe Room Card — a configurable room overview card for Home Assistant.
 *
 * Windows & covers as combined state chips, climate with thresholds, a dock
 * of light/switch buttons, alert bars and rule-based card outlines.
 */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

import {
  applyAreaImport,
  deriveFromArea,
  normalizeConfig,
  relevantEntities,
  stubConfig,
} from "./config";
import {
  activeAlerts,
  evalOutline,
  formatValue,
  humidityLevel,
  openingView,
  thresholdLevel,
  type AlertView,
  type OpeningView,
  type ThresholdLevel,
} from "./engine";
import { fireEvent } from "./fire-event";
import { localize } from "./i18n";
import type {
  DeluxeRoomCardConfig,
  HassEntity,
  HomeAssistant,
  StateStyle,
  Thresholds,
} from "./types";

import "./deluxe-room-card-editor";

declare const __VERSION__: string;

declare global {
  interface Window {
    customCards?: unknown[];
  }
}

/** Width below which the card switches to the narrow ("half") layout. */
const NARROW_BREAKPOINT = 380;

const RADIAL_CIRCUMFERENCE = 2 * Math.PI * 15.5;

const LONG_PRESS_MS = 500;

@customElement("deluxe-room-card")
export class DeluxeRoomCard extends LitElement {
  @state() private _config?: DeluxeRoomCardConfig;

  @state() private _narrow = false;

  @state() private _hass?: HomeAssistant;

  private _entities: Set<string> = new Set();

  private _areaApplied = false;

  private _resizeObserver?: ResizeObserver;

  private _outlineTimer?: ReturnType<typeof setTimeout>;

  private _pressTimer?: ReturnType<typeof setTimeout>;

  private _longPressed = false;

  public static getConfigElement(): HTMLElement {
    return document.createElement("deluxe-room-card-editor");
  }

  public static getStubConfig(hass?: HomeAssistant): DeluxeRoomCardConfig {
    return stubConfig(hass);
  }

  public setConfig(config: DeluxeRoomCardConfig): void {
    this._config = normalizeConfig(config);
    this._entities = relevantEntities(this._config);
    this._areaApplied = false;
    this._maybeApplyArea();
  }

  public set hass(hass: HomeAssistant | undefined) {
    const previous = this._hass;
    this._hass = hass;
    this._maybeApplyArea();
    if (!previous || !hass) {
      this.requestUpdate();
      return;
    }
    // Only re-render when a referenced entity actually changed.
    for (const id of this._entities) {
      if (previous.states[id] !== hass.states[id]) {
        this.requestUpdate();
        return;
      }
    }
  }

  public get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  public getCardSize(): number {
    if (!this._config) return 3;
    const base = this._config.layout === "compact" ? 2 : 3;
    const bars = (this._config.alerts ?? []).filter((a) => a.full_width).length;
    return base + Math.min(bars, 2);
  }

  public getGridOptions(): Record<string, unknown> {
    return {
      columns: 12,
      min_columns: 6,
      rows: "auto",
    };
  }

  /** `from_area` fills empty sections once, as soon as hass is available. */
  private _maybeApplyArea(): void {
    if (this._areaApplied || !this._config?.from_area || !this._hass) return;
    this._areaApplied = true;
    this._config = normalizeConfig(
      applyAreaImport(
        this._config,
        deriveFromArea(this._hass, this._config.from_area),
      ),
    );
    this._entities = relevantEntities(this._config);
  }

  public connectedCallback(): void {
    super.connectedCallback();
    if (typeof ResizeObserver !== "undefined") {
      this._resizeObserver = new ResizeObserver((entries) => {
        const width = entries[0]?.contentRect.width ?? 0;
        if (width > 0) this._narrow = width < NARROW_BREAKPOINT;
      });
      this._resizeObserver.observe(this);
    }
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
    if (this._outlineTimer) clearTimeout(this._outlineTimer);
  }

  private _getState = (id: string): HassEntity | undefined =>
    this._hass?.states[id];

  private _t(key: string): string {
    return localize(this._hass, key);
  }

  /* ------------------------------------------------------------ actions --- */

  private _moreInfo(entityId: string): void {
    fireEvent(this, "hass-more-info", { entityId });
  }

  private _handleOpeningTap(view: OpeningView): void {
    switch (view.tapAction) {
      case "none":
        return;
      case "toggle":
        if (view.actionEntity)
          void this._hass?.callService("homeassistant", "toggle", {
            entity_id: view.actionEntity,
          });
        return;
      case "call-service": {
        if (!view.service) return;
        const [domain, service] = view.service.split(".", 2);
        if (!domain || !service) return;
        void this._hass?.callService(domain, service, {
          ...(view.actionEntity ? { entity_id: view.actionEntity } : {}),
          ...(view.serviceData ?? {}),
        });
        return;
      }
      default:
        if (view.moreInfoEntity) this._moreInfo(view.moreInfoEntity);
    }
  }

  private _controlPressStart(entityId: string): void {
    this._longPressed = false;
    this._pressTimer = setTimeout(() => {
      this._longPressed = true;
      this._moreInfo(entityId);
    }, LONG_PRESS_MS);
  }

  private _controlPressEnd(entityId: string): void {
    if (this._pressTimer) clearTimeout(this._pressTimer);
    if (this._longPressed) return;
    void this._hass?.callService("homeassistant", "toggle", {
      entity_id: entityId,
    });
  }

  private _controlPressCancel(): void {
    if (this._pressTimer) clearTimeout(this._pressTimer);
    this._longPressed = false;
  }

  /* ------------------------------------------------------------- render --- */

  protected render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;

    const layout = config.layout ?? "classic";
    const narrow =
      config.width === "half" || (config.width === "auto" && this._narrow);
    const scale = config.icon_size ?? 1;

    const { outline, recheckInMs } = evalOutline(
      config.card_alerts,
      this._getState,
      Date.now(),
    );
    this._scheduleOutlineRecheck(recheckInMs);

    const alerts = [
      ...activeAlerts(config.alerts, this._getState),
      ...this._thresholdAlerts(),
    ];
    const bars = alerts.filter((a) => a.fullWidth);
    const chips = alerts.filter((a) => !a.fullWidth);

    const overrideStyles: Record<string, string> = {};
    if (config.color_style === "override") {
      if (config.accent_color)
        overrideStyles["--drc-accent"] = config.accent_color;
      if (config.bg_tint) overrideStyles["--drc-bg"] = config.bg_tint;
    }
    const colors = config.colors ?? {};
    if (colors.window_open) overrideStyles["--drc-open"] = colors.window_open;
    if (colors.window_tilted)
      overrideStyles["--drc-tilted"] = colors.window_tilted;
    if (colors.window_closed)
      overrideStyles["--drc-closed"] = colors.window_closed;
    if (colors.warning) overrideStyles["--drc-warning"] = colors.warning;
    if (colors.critical) overrideStyles["--drc-critical"] = colors.critical;
    overrideStyles["--drc-scale"] = String(scale);

    const classes = {
      card: true,
      narrow,
      [`layout-${layout}`]: true,
      "outline-warning": outline === "warning",
      "outline-critical": outline === "critical",
    };

    return html`
      <ha-card class=${classMap(classes)} style=${styleMap(overrideStyles)}>
        ${
          layout === "classic" || layout === "controls-bottom"
            ? this._renderClassic(chips, narrow)
            : layout === "header-bar"
              ? this._renderHeaderBar(chips)
              : this._renderCompact(chips)
        }
        ${
          bars.length > 0
            ? html`<div class="alert-bars">
                ${bars.map((a) => this._renderAlertBar(a))}
              </div>`
            : nothing
        }
      </ha-card>
    `;
  }

  private _scheduleOutlineRecheck(recheckInMs?: number): void {
    if (this._outlineTimer) clearTimeout(this._outlineTimer);
    if (recheckInMs === undefined) return;
    this._outlineTimer = setTimeout(
      () => this.requestUpdate(),
      Math.max(1000, recheckInMs),
    );
  }

  /** Synthesized alert bars for crossed critical climate thresholds. */
  private _thresholdAlerts(): AlertView[] {
    const climate = this._config?.climate;
    if (!climate?.alert_on_threshold) return [];
    const result: AlertView[] = [];
    const temp = climate.temperature
      ? this._getState(climate.temperature)?.state
      : undefined;
    const hum = climate.humidity
      ? this._getState(climate.humidity)?.state
      : undefined;
    const tempLevel = thresholdLevel(temp, climate.temperature_thresholds);
    const humLevel = humidityLevel(hum, temp, climate.humidity_thresholds);
    if (tempLevel === "low_crit")
      result.push(this._climateAlert("temp-low", "too_cold", "mdi:snowflake"));
    if (tempLevel === "high_crit")
      result.push(
        this._climateAlert("temp-high", "too_hot", "mdi:thermometer-alert"),
      );
    if (humLevel === "high_crit")
      result.push(
        this._climateAlert("hum-high", "too_humid", "mdi:water-percent-alert"),
      );
    if (humLevel === "low_crit")
      result.push(this._climateAlert("hum-low", "too_dry", "mdi:water-off"));
    return result;
  }

  private _climateAlert(key: string, label: string, icon: string): AlertView {
    return {
      key: `climate|${key}`,
      label: this._t(label),
      icon,
      severity: "critical",
      fullWidth: true,
    };
  }

  /* ----------------------------------------------------------- layouts --- */

  private _renderClassic(chips: AlertView[], narrow: boolean): TemplateResult {
    const config = this._config!;
    const dockLeft = config.layout === "controls-bottom";
    return html`
      ${
        config.show_icon !== false
          ? html`
              <div class="backdrop"></div>
              <ha-icon class="room-icon" .icon=${config.icon}></ha-icon>
            `
          : nothing
      }
      <div class="content">
        <div class="row top">
          ${this._renderTitleBlock()}
          <div class="chip-stack ${narrow ? "wrap" : "column"}">
            ${this._renderOpenings()}
            ${chips.map((a) => this._renderAlertChip(a))}
          </div>
        </div>
        <div class="dock-outer ${dockLeft ? "left" : "right"}">
          ${this._renderDock()}
        </div>
      </div>
    `;
  }

  private _renderHeaderBar(chips: AlertView[]): TemplateResult {
    const config = this._config!;
    return html`
      <div class="content">
        <div class="header-bar">
          ${
            config.show_icon !== false
              ? html`<span class="inline-icon"
                  ><ha-icon .icon=${config.icon}></ha-icon
                ></span>`
              : nothing
          }
          ${this._renderTitleBlock()}
        </div>
        <div class="row">
          <div class="chip-stack wrap">
            ${this._renderOpenings()}
            ${chips.map((a) => this._renderAlertChip(a))}
          </div>
          ${this._renderDock()}
        </div>
      </div>
    `;
  }

  private _renderCompact(chips: AlertView[]): TemplateResult {
    const config = this._config!;
    return html`
      <div class="content compact">
        <div class="row center">
          ${
            config.show_icon !== false
              ? html`<span class="inline-icon"
                  ><ha-icon .icon=${config.icon}></ha-icon
                ></span>`
              : nothing
          }
          ${this._renderTitleBlock()}
          <div class="chip-stack wrap end">
            ${this._renderOpenings()}
            ${chips.map((a) => this._renderAlertChip(a))}
          </div>
          ${this._renderDock()}
        </div>
      </div>
    `;
  }

  private _renderTitleBlock(): TemplateResult {
    const config = this._config!;
    return html`
      <div class="title-block">
        ${
          config.show_name !== false
            ? html`<span class="title">${config.title ?? ""}</span>`
            : nothing
        }
        ${config.show_climate !== false ? this._renderClimate() : nothing}
      </div>
    `;
  }

  /* ----------------------------------------------------------- climate --- */

  private _renderClimate(): TemplateResult | typeof nothing {
    const climate = this._config?.climate;
    if (!climate?.temperature && !climate?.humidity) return nothing;
    return html`
      <div class="climate">
        ${
          climate.temperature
            ? this._renderClimateValue(
                climate.temperature,
                "°C",
                "mdi:thermometer",
                climate.temperature_thresholds,
                "temp_no_value",
              )
            : nothing
        }
        ${
          climate.humidity
            ? this._renderClimateValue(
                climate.humidity,
                "%",
                "mdi:water-percent",
                climate.humidity_thresholds,
                "humidity_no_value",
                // Displayed relative, classified on the configured scale.
                humidityLevel(
                  this._getState(climate.humidity)?.state,
                  climate.temperature
                    ? this._getState(climate.temperature)?.state
                    : undefined,
                  climate.humidity_thresholds,
                ),
              )
            : nothing
        }
      </div>
    `;
  }

  private _renderClimateValue(
    entityId: string,
    unit: string,
    icon: string,
    thresholds: Thresholds | undefined,
    missingKey: string,
    levelOverride?: ThresholdLevel,
  ): TemplateResult {
    const entity = this._getState(entityId);
    const text = formatValue(entity?.state, unit);
    if (text === null) {
      // Honest empty state instead of "NaN °C".
      return html`<span class="climate-value missing">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        ${entity ? this._t(missingKey) : this._t("entity_missing")}
      </span>`;
    }
    const level: ThresholdLevel =
      levelOverride ?? thresholdLevel(entity?.state, thresholds);
    return html`<span class="climate-value level-${level}">
      <ha-icon .icon=${icon}></ha-icon>
      ${text}
    </span>`;
  }

  /* ---------------------------------------------------------- openings --- */

  private _renderOpenings(): TemplateResult[] {
    const o = this._config!.openings;
    const defaultStyle = (o?.state_style ?? "label") as StateStyle;
    return (o?.items ?? []).map((item, index) => {
      // Per-opening overrides win over the section defaults.
      const style = (item.state_style ?? defaultStyle) as StateStyle;
      const display = {
        showName: item.show_name ?? o?.show_name ?? true,
        showValue: item.show_value ?? o?.show_value ?? true,
        showIcon: item.show_icon ?? o?.show_icon ?? true,
      };
      return this._renderOpeningChip(
        openingView(item, this._getState, style, index, display),
      );
    });
  }

  private _openingIcon(view: OpeningView): string {
    if (view.icon) return view.icon;
    const config = this._config!;
    if (view.hasCover)
      return view.isDoor
        ? "mdi:door-sliding"
        : (config.cover_icon ?? "mdi:blinds");
    if (view.isDoor)
      return view.windowState === "open" ? "mdi:door-open" : "mdi:door-closed";
    switch (view.windowState) {
      case "open":
        return "mdi:window-open-variant";
      case "tilted":
        return "mdi:window-open";
      default:
        return config.window_icon ?? "mdi:window-closed-variant";
    }
  }

  private _renderOpeningChip(view: OpeningView): TemplateResult {
    const t = (key: string): string => this._t(key);
    const stateWord =
      view.windowState !== null
        ? t(view.windowState)
        : view.position !== null
          ? view.coverClosed
            ? t("closed")
            : view.position >= 99
              ? t("open")
              : `${Math.round(view.position)} %`
          : t("unknown");

    let sub: string | null;
    if (view.style === "color") {
      if (view.hasCover) {
        sub =
          view.position === null
            ? t("unknown")
            : view.coverClosed
              ? t("closed")
              : view.position >= 99
                ? t("open")
                : t("half");
      } else {
        sub = stateWord;
      }
    } else if (view.hasCover) {
      sub =
        view.position !== null
          ? `${Math.round(view.position)} %`
          : t("no_value");
    } else {
      sub = stateWord;
    }

    const classes = {
      chip: true,
      [`chip-${view.style}`]: true,
      [`win-${view.windowState ?? "none"}`]: true,
      "cover-closed": view.hasCover && view.coverClosed,
      "cover-open": view.hasCover && !view.coverClosed,
      "has-cover": view.hasCover,
      missing: view.missing,
      tappable: view.tapAction !== "none",
    };

    const pct = view.position ?? 0;
    const isRadial = view.style === "radial" && view.hasCover;
    const isBar = view.style === "bar" && view.hasCover;
    // The radial ring / bar column carry their own value, so no side text.
    const showSub = !isRadial && !isBar && (view.showValue || view.missing);
    const showText = !isBar && (view.showName || showSub);
    const barValue = view.missing ? t("entity_missing") : sub;

    return html`
      <button
        class=${classMap(classes)}
        title=${view.name}
        @click=${() => this._handleOpeningTap(view)}
      >
        ${
          view.style === "combined" &&
          (view.hasCover || view.windowState !== null)
            ? html`
                <span class="combined-box">
                  <span
                    class="combined-shade"
                    style=${styleMap({ height: `${100 - pct}%` })}
                  ></span>
                </span>
              `
            : view.showIcon
              ? html`<ha-icon
                  class="chip-icon"
                  .icon=${this._openingIcon(view)}
                ></ha-icon>`
              : nothing
        }
        ${
          isBar
            ? html`
                <span class="bar-block">
                  ${
                    view.showName
                      ? html`<span class="bar-name">${view.name}</span>`
                      : nothing
                  }
                  <span class="bar-track"
                    ><span
                      class="bar-fill"
                      style=${styleMap({ width: `${pct}%` })}
                    ></span
                  ></span>
                  ${
                    view.showValue || view.missing
                      ? html`<span class="bar-value">${barValue}</span>`
                      : nothing
                  }
                </span>
              `
            : nothing
        }
        ${
          showText
            ? html`
                <span class="chip-text">
                  ${
                    view.showName
                      ? html`<span class="chip-title">${view.name}</span>`
                      : nothing
                  }
                  ${
                    showSub
                      ? html`<span class="chip-sub">
                          ${view.missing ? t("entity_missing") : sub}
                        </span>`
                      : nothing
                  }
                </span>
              `
            : nothing
        }
        ${isRadial ? this._renderRadial(pct, view.showValue) : nothing}
      </button>
    `;
  }

  private _renderRadial(pct: number, showLabel: boolean): TemplateResult {
    const dash = ((pct / 100) * RADIAL_CIRCUMFERENCE).toFixed(1);
    return html`
      <span class="radial">
        <svg viewBox="0 0 36 36">
          <circle class="radial-track" cx="18" cy="18" r="15.5"></circle>
          <circle
            class="radial-fill"
            cx="18"
            cy="18"
            r="15.5"
            stroke-dasharray="${dash} ${RADIAL_CIRCUMFERENCE.toFixed(1)}"
          ></circle>
        </svg>
        ${
          showLabel
            ? html`<span class="radial-label">${Math.round(pct)}</span>`
            : nothing
        }
      </span>
    `;
  }

  /* -------------------------------------------------------------- dock --- */

  private _renderDock(): TemplateResult | typeof nothing {
    const controls = this._config?.controls ?? [];
    if (controls.length === 0) return nothing;
    return html`
      <div class="dock">
        ${controls.map((item) => {
          const entity = this._getState(item.entity);
          const on = entity?.state === "on";
          const missing = entity === undefined;
          const icon =
            item.icon ??
            (item.entity.startsWith("switch.") ? "mdi:power" : "mdi:lightbulb");
          const name =
            item.name ??
            (entity?.attributes["friendly_name"] as string | undefined) ??
            item.entity;
          const style = on && item.color ? { background: item.color } : {};
          return html`
            <button
              class=${classMap({ control: true, on, missing, labeled: !!item.label })}
              style=${styleMap(style)}
              title=${missing ? `${name} (${this._t("entity_missing")})` : name}
              @pointerdown=${() => this._controlPressStart(item.entity)}
              @pointerup=${() => this._controlPressEnd(item.entity)}
              @pointerleave=${() => this._controlPressCancel()}
            >
              <ha-icon .icon=${icon}></ha-icon>
              ${
                item.label
                  ? html`<span class="control-label">${item.label}</span>`
                  : nothing
              }
            </button>
          `;
        })}
      </div>
    `;
  }

  /* ------------------------------------------------------------- alerts --- */

  private _renderAlertChip(alert: AlertView): TemplateResult {
    return html`
      <span
        class="chip alert-chip severity-${alert.severity}"
        style=${styleMap(alert.color ? { background: alert.color } : {})}
      >
        <ha-icon class="chip-icon" .icon=${alert.icon}></ha-icon>
        <span class="chip-text">
          <span class="chip-title">${alert.label}</span>
        </span>
      </span>
    `;
  }

  private _renderAlertBar(alert: AlertView): TemplateResult {
    return html`
      <div
        class="alert-bar severity-${alert.severity}"
        style=${styleMap(alert.color ? { background: alert.color } : {})}
      >
        <ha-icon .icon=${alert.icon}></ha-icon>
        ${alert.label}
      </div>
    `;
  }

  /* -------------------------------------------------------------- style --- */

  static styles = css`
    :host {
      display: block;
      --drc-accent: var(
        --deluxe-room-card-accent,
        var(--primary-color, #2f7d54)
      );
      --drc-bg: var(--ha-card-background, var(--card-background-color, #fff));
      --drc-text: var(--primary-text-color, #212121);
      --drc-secondary: var(--secondary-text-color, #757575);
      --drc-closed: var(
        --deluxe-room-card-closed,
        var(--success-color, #4bab77)
      );
      --drc-tilted: var(
        --deluxe-room-card-tilted,
        var(--warning-color, #d6a03f)
      );
      --drc-open: var(--deluxe-room-card-open, var(--error-color, #e2645b));
      --drc-warning: var(--warning-color, #d6a03f);
      --drc-critical: var(--error-color, #d23b34);
      --drc-control-bg: var(--secondary-background-color, #e5e5e5);
      --drc-control-on: var(--deluxe-room-card-control-on, #f2a33c);
      --drc-chip-fg: #fff;
      --drc-scale: 1;
    }
    ha-card {
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      height: 100%;
      min-height: 150px;
      padding: 20px 22px;
      background: var(--drc-bg);
      color: var(--drc-text);
      display: flex;
      flex-direction: column;
    }
    ha-card.layout-compact {
      min-height: 0;
      padding: 16px 20px;
    }
    ha-card.outline-warning {
      border: 2px solid var(--drc-warning);
      box-shadow:
        0 0 0 1px var(--drc-warning),
        0 0 26px -8px var(--drc-warning);
    }
    ha-card.outline-critical {
      border: 2px solid var(--drc-critical);
      box-shadow:
        0 0 0 1px var(--drc-critical),
        0 0 26px -8px var(--drc-critical);
    }

    /* Classic backdrop icon */
    .backdrop {
      position: absolute;
      left: calc(-30px - (190px * var(--drc-scale) - 190px) / 2);
      bottom: calc(-40px - (190px * var(--drc-scale) - 190px) / 2);
      width: calc(190px * var(--drc-scale));
      height: calc(190px * var(--drc-scale));
      border-radius: 50%;
      background: var(--drc-accent);
      opacity: 0.18;
      z-index: 0;
    }
    .room-icon {
      position: absolute;
      left: 20px;
      bottom: 16px;
      z-index: 0;
      color: var(--drc-secondary);
      opacity: 0.55;
      --mdc-icon-size: calc(80px * var(--drc-scale));
    }
    .inline-icon {
      flex-shrink: 0;
      width: calc(50px * var(--drc-scale));
      height: calc(50px * var(--drc-scale));
      border-radius: 14px;
      background: color-mix(in srgb, var(--drc-accent) 20%, transparent);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--drc-secondary);
      --mdc-icon-size: calc(30px * var(--drc-scale));
    }

    .content {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 14px;
      min-width: 0;
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      min-width: 0;
    }
    .row.center {
      align-items: center;
    }
    .header-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      background: color-mix(in srgb, var(--drc-text) 5%, transparent);
      border: 1px solid color-mix(in srgb, var(--drc-text) 7%, transparent);
      border-radius: 12px;
      padding: 10px 14px;
    }

    .title-block {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      flex: 1 1 auto;
    }
    .title {
      font-weight: 700;
      font-size: 25px;
      line-height: 1.1;
      letter-spacing: -0.01em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    ha-card.narrow .title,
    ha-card.layout-compact .title {
      font-size: 22px;
    }
    .climate {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
      margin-top: 3px;
    }
    .climate-value {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: var(--drc-secondary);
      font-size: 15px;
      font-weight: 500;
      /* Keep "15.6 °C" on one line — never let the unit wrap. */
      white-space: nowrap;
      --mdc-icon-size: 17px;
    }
    .climate-value.level-low {
      color: var(--info-color, #5aa9e0);
    }
    .climate-value.level-high {
      color: var(--drc-warning);
    }
    .climate-value.level-low_crit,
    .climate-value.level-high_crit {
      color: var(--drc-critical);
    }
    .climate-value.missing {
      color: var(--drc-warning);
      font-size: 14px;
    }

    /* Chips */
    .chip-stack {
      display: flex;
      gap: 9px;
      min-width: 0;
    }
    .chip-stack.column {
      flex-direction: column;
      align-items: flex-end;
      flex-shrink: 0;
    }
    .chip-stack.wrap {
      flex-wrap: wrap;
      align-content: flex-start;
      flex: 1 1 auto;
    }
    .chip-stack.end {
      justify-content: flex-end;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 7px 14px;
      border-radius: 24px;
      border: 2px solid transparent;
      background: var(--drc-accent);
      color: var(--drc-chip-fg);
      min-width: 118px;
      box-sizing: border-box;
      font: inherit;
      text-align: left;
      cursor: default;
    }
    .chip.tappable {
      cursor: pointer;
    }
    .chip-icon {
      flex-shrink: 0;
      --mdc-icon-size: 22px;
    }
    .chip-text {
      display: flex;
      flex-direction: column;
      line-height: 1.15;
      min-width: 0;
    }
    .chip-title {
      font-weight: 600;
      font-size: 14.5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .chip-sub {
      opacity: 0.85;
      font-size: 12.5px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    /* Window-only chips: state color as background */
    .chip:not(.has-cover).win-open {
      background: var(--drc-critical);
    }
    .chip:not(.has-cover).win-tilted {
      background: var(--drc-tilted);
      color: var(--deluxe-room-card-tilted-fg, #1c1200);
    }
    .chip:not(.has-cover).win-unknown {
      background: color-mix(in srgb, var(--drc-secondary) 35%, transparent);
      color: var(--drc-text);
    }
    /* Cover chips: accent when open, muted when fully closed */
    .chip.has-cover.cover-closed {
      background: color-mix(in srgb, var(--drc-text) 10%, transparent);
      color: var(--drc-text);
    }
    /* Contact frame around cover chips: a bold, glowing outline in the
       window-state color — reads clearly even over a filled (blue) chip. */
    .chip.has-cover.win-open {
      --chip-frame: var(--drc-open);
    }
    .chip.has-cover.win-tilted {
      --chip-frame: var(--drc-tilted);
    }
    .chip.has-cover.win-closed {
      --chip-frame: var(--drc-closed);
    }
    .chip.has-cover.win-open,
    .chip.has-cover.win-tilted,
    .chip.has-cover.win-closed {
      border-color: var(--chip-frame);
      border-width: 3px;
      box-shadow:
        0 0 0 1px var(--chip-frame),
        0 0 10px -3px var(--chip-frame);
    }
    .chip.missing {
      background: color-mix(in srgb, var(--drc-warning) 25%, transparent);
      color: var(--drc-text);
      border-color: var(--drc-warning);
    }
    .chip.chip-combined {
      background: color-mix(in srgb, var(--drc-text) 8%, transparent);
      color: var(--drc-text);
    }
    /* Bar chips size to their compact content, not the 118px chip default. */
    .chip.chip-bar {
      min-width: 0;
      gap: 8px;
    }
    /* Compact, neutral cover-position box — the state color lives on the
       chip outline now, not on this box. */
    .combined-box {
      position: relative;
      width: 24px;
      height: 24px;
      border: 1.5px solid color-mix(in srgb, var(--drc-text) 30%, transparent);
      border-radius: 5px;
      overflow: hidden;
      background: color-mix(in srgb, var(--drc-accent) 22%, transparent);
      flex-shrink: 0;
      display: inline-block;
      box-sizing: border-box;
    }
    .combined-shade {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      background: color-mix(in srgb, var(--drc-secondary) 65%, transparent);
    }

    /* Bar style: name over the bar, value below — a compact vertical stack. */
    .bar-block {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 1px;
      min-width: 58px;
      flex: 1 1 auto;
    }
    .bar-name {
      font-size: 11px;
      font-weight: 600;
      line-height: 1.1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .bar-value {
      font-size: 9.5px;
      font-weight: 500;
      line-height: 1.05;
      opacity: 0.8;
    }
    .bar-track {
      width: 52px;
      height: 8px;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.35);
      overflow: hidden;
      flex-shrink: 0;
    }
    .bar-block .bar-track {
      width: auto;
      height: 6px;
      margin: 1px 0;
    }
    .bar-fill {
      display: block;
      height: 100%;
      background: currentColor;
      border-radius: 4px;
    }

    .radial {
      position: relative;
      width: 34px;
      height: 34px;
      flex-shrink: 0;
    }
    .radial svg {
      width: 34px;
      height: 34px;
      transform: rotate(-90deg);
    }
    .radial circle {
      fill: none;
      stroke-width: 4;
    }
    .radial-track {
      stroke: rgba(0, 0, 0, 0.35);
    }
    .radial-fill {
      stroke: currentColor;
      stroke-linecap: round;
    }
    .radial-label {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
    }

    /* Dock */
    .dock-outer {
      margin-top: auto;
      display: flex;
    }
    .dock-outer.right {
      justify-content: flex-end;
    }
    .dock-outer.left {
      justify-content: flex-start;
    }
    .dock {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: flex-end;
      flex-shrink: 0;
      max-width: 230px;
    }
    .dock-outer.left .dock {
      justify-content: flex-start;
    }
    .dock-outer.left .dock,
    ha-card.layout-header-bar .dock,
    ha-card.layout-compact .dock {
      max-width: none;
    }
    ha-card.narrow .dock {
      max-width: 150px;
    }
    ha-card.narrow .dock-outer.left .dock {
      max-width: none;
    }
    .control {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      height: 46px;
      min-width: 46px;
      padding: 0;
      border: none;
      border-radius: 23px;
      background: var(--drc-control-bg);
      color: var(--drc-secondary);
      cursor: pointer;
      flex-shrink: 0;
      font: inherit;
      --mdc-icon-size: 21px;
      transition: background 120ms ease;
    }
    .control.labeled {
      padding: 0 16px;
    }
    .control.on {
      background: var(--drc-control-on);
      color: #1c1200;
    }
    .control.missing {
      opacity: 0.4;
    }
    .control-label {
      font-weight: 700;
      font-size: 14px;
    }

    /* Alerts */
    .alert-chip {
      min-width: 0;
      border: none;
    }
    .alert-chip.severity-info {
      background: var(--drc-accent);
    }
    .alert-chip.severity-warning {
      background: var(--drc-warning);
      color: var(--deluxe-room-card-tilted-fg, #1c1200);
    }
    .alert-chip.severity-critical {
      background: var(--drc-critical);
    }
    .alert-bars {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
      margin-top: 14px;
    }
    .alert-bar {
      display: flex;
      align-items: center;
      gap: 9px;
      width: 100%;
      box-sizing: border-box;
      padding: 10px 16px;
      border-radius: 14px;
      font-weight: 600;
      font-size: 14px;
      color: #fff;
      --mdc-icon-size: 18px;
    }
    .alert-bar.severity-info {
      background: var(--drc-accent);
    }
    .alert-bar.severity-warning {
      background: color-mix(in srgb, var(--drc-warning) 30%, transparent);
      color: var(--drc-warning);
    }
    .alert-bar.severity-critical {
      background: var(--drc-critical);
    }

    /* ---- Narrow (half-width) mode: shrink everything to fit ------------- */
    ha-card.narrow {
      padding: 14px 15px;
    }
    ha-card.narrow .content {
      gap: 10px;
    }
    ha-card.narrow .row {
      gap: 10px;
    }
    ha-card.narrow .title {
      font-size: 16px;
    }
    /* Guarantee the title a fair share so a normal room name is not clipped
       to "Wohnzi…" by wide chips sitting on the same row. */
    ha-card.narrow.layout-classic .title-block {
      min-width: 45%;
    }
    ha-card.narrow .climate {
      gap: 8px;
      margin-top: 2px;
    }
    ha-card.narrow .climate-value {
      font-size: 12px;
      gap: 4px;
      --mdc-icon-size: 14px;
    }
    ha-card.narrow .climate-value.missing {
      font-size: 11.5px;
    }
    ha-card.narrow .chip-stack {
      gap: 6px;
    }
    ha-card.narrow .chip {
      min-width: 0;
      gap: 7px;
      padding: 4px 10px;
      border-radius: 20px;
    }
    ha-card.narrow .chip-icon {
      --mdc-icon-size: 18px;
    }
    ha-card.narrow .chip-title {
      font-size: 12px;
    }
    ha-card.narrow .chip-sub {
      font-size: 11px;
    }
    ha-card.narrow .combined-box {
      width: 22px;
      height: 22px;
    }
    ha-card.narrow .bar-block {
      min-width: 48px;
    }
    ha-card.narrow .bar-name {
      font-size: 10px;
    }
    ha-card.narrow .bar-value {
      font-size: 9px;
    }
    ha-card.narrow .radial,
    ha-card.narrow .radial svg {
      width: 28px;
      height: 28px;
    }
    ha-card.narrow .control {
      height: 40px;
      min-width: 40px;
      border-radius: 20px;
      --mdc-icon-size: 19px;
    }
    ha-card.narrow .control.labeled {
      padding: 0 12px;
    }
    ha-card.narrow .control-label {
      font-size: 12.5px;
    }
    ha-card.narrow .dock {
      gap: 7px;
    }
    ha-card.narrow .room-icon {
      left: 15px;
      bottom: 12px;
      opacity: 0.4;
      --mdc-icon-size: calc(56px * var(--drc-scale));
    }
    ha-card.narrow .backdrop {
      width: calc(140px * var(--drc-scale));
      height: calc(140px * var(--drc-scale));
      left: calc(-30px - (140px * var(--drc-scale) - 140px) / 2);
      bottom: calc(-38px - (140px * var(--drc-scale) - 140px) / 2);
    }
    ha-card.narrow .alert-bar {
      padding: 8px 13px;
      font-size: 13px;
      --mdc-icon-size: 16px;
    }
  `;
}

/* ------------------------------------------------------- registration --- */

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "deluxe-room-card",
  name: "Deluxe Room Card",
  description:
    "Room overview card: windows & covers as combined chips, climate with thresholds, light dock, alert bars and rule-based outlines.",
  preview: true,
  documentationURL: "https://github.com/florianbaethge/deluxe_room_card",
});

console.info(
  `%c DELUXE-ROOM-CARD %c ${__VERSION__} `,
  "color: #fff; background: #2f7d54; font-weight: 700;",
  "color: #2f7d54; background: #fff; font-weight: 700;",
);

declare global {
  interface HTMLElementTagNameMap {
    "deluxe-room-card": DeluxeRoomCard;
  }
}
