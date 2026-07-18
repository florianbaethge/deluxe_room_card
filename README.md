[![CI](https://github.com/florianbaethge/deluxe_room_card/actions/workflows/ci.yml/badge.svg)](https://github.com/florianbaethge/deluxe_room_card/actions/workflows/ci.yml)
[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://hacs.xyz)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

# Deluxe Room Card

A configurable room overview card for Home Assistant dashboards: windows and
covers as combined state chips, a climate line with thresholds, a dock of
light/switch buttons, alert bars for leak or battery sensors, and rule-based
warning/critical outlines around the whole card — all configurable from a
visual editor, no YAML required.

![Classic layout](https://raw.githubusercontent.com/florianbaethge/deluxe_room_card/main/screenshots/design-classic.png)

<details>
<summary><b>More previews</b> — layouts, chip styles, thresholds &amp; outlines, empty states, responsive</summary>

The four layout presets and per-room color overrides:

![Layout presets](https://raw.githubusercontent.com/florianbaethge/deluxe_room_card/main/screenshots/design-layouts.png)

The five window/cover chip styles:

![Chip styles](https://raw.githubusercontent.com/florianbaethge/deluxe_room_card/main/screenshots/design-states.png)

Climate thresholds, alert bars and rule-based card outlines:

![Thresholds and outlines](https://raw.githubusercontent.com/florianbaethge/deluxe_room_card/main/screenshots/design-thresholds.png)

Honest empty states instead of `NaN`:

![Empty states](https://raw.githubusercontent.com/florianbaethge/deluxe_room_card/main/screenshots/design-empty-states.png)

Same configuration in half and full width:

![Responsive](https://raw.githubusercontent.com/florianbaethge/deluxe_room_card/main/screenshots/design-responsive.png)

</details>

## Features

- **Combined window + cover chips**: one chip shows the cover position
  (0–100 %) *and* the window contact state — the colored frame and the small
  window badge tell you closed (green), tilted (amber) or open (red) at a
  glance. Five selectable styles: `combined`, `label`, `bar`, `radial`,
  `color`.
- **Climate line with thresholds**: temperature and humidity color themselves
  (blue = too cold, amber = high, red = critical) against configurable
  `low` / `low_crit` / `high` / `high_crit` limits. Optionally a crossed
  critical threshold raises a full-width alert bar ("Too humid — please
  ventilate!").
- **Honest empty states**: a sensor without a value shows "Temp – no value"
  instead of `NaN °C`; a misconfigured entity shows "Entity not found".
- **Control dock**: lights and switches as round buttons — tap to toggle,
  long-press for more-info. Active buttons are highlighted; many buttons wrap
  into a clean grid instead of overlapping.
- **Alerts**: any `binary_sensor`/`sensor` (or template helper) as a chip or a
  full-width bar at the bottom, with `info`/`warning`/`critical` severity,
  state matching (`active_state`, `invert`) or numeric thresholds
  (`below`/`above`) — water leak, smoke, motion-while-armed, low battery …
- **Card outline rules**: automation-style conditions (AND/OR) put a warning
  or critical border + glow around the whole card — e.g. *red when a window
  is open after sunset*, or *amber when a window is open and the cover is
  below 50 %*. Supports entity state/attribute checks, numeric comparisons,
  sun elevation (`after: sunset`) and hold durations (`for:`).
- **Four layouts**: `classic` (backdrop room icon, chips right, dock bottom
  right), `controls-bottom`, `header-bar` and `compact` — adaptive between
  full and half dashboard width via ResizeObserver.
- **Theme-aware**: follows your Home Assistant theme (light & dark) by
  default; `color_style: override` sets a per-room accent and background
  tint.
- **Visual editor** with native HA selectors, including an *Import from
  area* button that fills the card with the area's windows, covers, lights
  and sensors in one click (freely editable afterwards).
- **Localized**: English and German.

## Installation

### HACS (custom repository)

1. HACS → ⋮ → *Custom repositories* →
   `https://github.com/florianbaethge/deluxe_room_card` (type *Dashboard*)
2. Install **Deluxe Room Card**.
3. HACS registers the resource automatically. (For YAML-mode dashboards add
   `/hacsfiles/deluxe_room_card/deluxe-room-card.js` as a `module` resource.)

### Manual

Copy `dist/deluxe-room-card.js` to `config/www/` and add it under
*Settings → Dashboards → ⋮ → Resources* as a JavaScript module
(`/local/deluxe-room-card.js`).

## Quick start

Add the card from the picker (*Add card → Deluxe Room Card*) and use the
visual editor — or start from YAML:

```yaml
type: custom:deluxe-room-card
title: Living room
icon: mdi:sofa
climate:
  temperature: sensor.living_room_temperature
  humidity: sensor.living_room_humidity
openings:
  state_style: label
  items:
    - window: binary_sensor.living_room_window_left
      cover: cover.living_room_shutter_left
      name: Left
    - cover: cover.living_room_shutter_middle
      name: Middle
controls:
  - entity: light.living_room_floor_lamp
    icon: mdi:floor-lamp
```

## Configuration

### Top level

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | string | – | Room name (truncates with ellipsis, never overflows) |
| `icon` | icon | `mdi:sofa` | Room icon — backdrop in `classic`, inline chip in the other layouts |
| `icon_size` | number | `1.0` | Scale of the room icon and its circle (0.6–1.8) |
| `layout` | string | `classic` | `classic` \| `controls-bottom` \| `header-bar` \| `compact` |
| `width` | string | `auto` | `auto` (ResizeObserver) \| `full` \| `half` |
| `color_style` | string | `theme` | `theme` follows HA; `override` uses the colors below |
| `accent_color` | color | – | Accent (chips, backdrop) with `color_style: override` |
| `bg_tint` | color | – | Card background with `color_style: override` |
| `window_icon` / `cover_icon` | icon | – | Default icons for window / cover chips |
| `show_name` / `show_climate` / `show_icon` | bool | `true` | Toggle the header parts |
| `from_area` | string | – | Fill empty sections once from this area's entities |
| `colors` | map | – | Fine-tuning: `window_open`, `window_tilted`, `window_closed`, `warning`, `critical` |

### `climate`

| Option | Type | Description |
| --- | --- | --- |
| `temperature` / `humidity` | entity | Sensors for the header line |
| `temperature_thresholds` | map | `{ low, low_crit, high, high_crit }` — empty = off |
| `humidity_thresholds` | map | same keys, in % |
| `alert_on_threshold` | bool | Raise a full-width alert bar on a critical threshold |

Missing or `unavailable` values render as a clear message, never `NaN`.

### `openings`

`state_style`: `combined` \| `label` \| `bar` \| `radial` \| `color`

Each item combines up to three entities into **one chip**:

| Option | Type | Description |
| --- | --- | --- |
| `window` / `door` | entity | Contact sensor (`on`/`off`, or `open`/`tilted`/`closed` for template sensors) |
| `cover` | entity | Cover — provides the 0–100 % position |
| `control_entity` | entity | Alternate target for `toggle`/`call-service` taps (e.g. a "quiet mode" cover) |
| `name` / `icon` | string | Overrides |
| `tap_action` | string | `more-info` (default) \| `toggle` \| `call-service` \| `none` |
| `service` / `service_data` | – | For `tap_action: call-service` (e.g. `cover.close_cover`) |
| `device_class` | string | `door` renders door icons |

```yaml
openings:
  state_style: combined
  items:
    - window: binary_sensor.bedroom_window
      cover: cover.bedroom_shutter
      control_entity: cover.bedroom_shutter_quiet
      name: Window
      tap_action: more-info
    - door: binary_sensor.patio_door
      name: Patio door
```

### `controls`

```yaml
controls:
  - entity: light.floor_lamp
    icon: mdi:floor-lamp
  - entity: switch.washer
    label: WM         # optional text inside the button
    color: "#f2a33c"  # optional active color
```

Tap toggles, long-press opens more-info. Up to three buttons per row, more
wrap into a second row.

### `alerts`

```yaml
alerts:
  - entity: binary_sensor.utility_leak
    label: Water leak detected!
    icon: mdi:water-alert
    severity: critical      # info | warning | critical
    full_width: true        # bar at the bottom instead of a chip
  - entity: sensor.window_sensor_battery
    below: 15               # numeric threshold instead of a state match
    label: Battery low · window sensor
    severity: warning
    full_width: true
  - entity: binary_sensor.motion_while_armed   # e.g. a template helper
    active_state: "on"      # which state counts as active (invert: true flips it)
    severity: critical
```

### `card_alerts` — outline rules

Automation-style rules; the highest matching level wins (`critical` over
`warning`).

```yaml
card_alerts:
  - outline: critical       # warning | critical
    match: all              # all (AND) | any (OR)
    conditions:
      - after: sunset       # sun-based, uses sun.sun
      - entity: group.windows
        state: "on"
  - outline: warning
    match: all
    conditions:
      - entity: binary_sensor.living_room_window
        state: "on"
        for: "00:10:00"     # must hold for 10 minutes
      - entity: cover.living_room_shutter
        attribute: current_position
        below: 50
```

### Theming

With `color_style: theme` the card uses your theme's
`--primary-color`, `--card-background-color`, `--success-color`,
`--warning-color` and `--error-color`. These theme variables allow
fine-tuning without `override`:

```yaml
deluxe-room-card-accent: "#2f7d54"
deluxe-room-card-open: "#e2645b"
deluxe-room-card-tilted: "#d6a03f"
deluxe-room-card-closed: "#4bab77"
deluxe-room-card-control-on: "#f2a33c"
```

## Development

```bash
npm install
npm run watch      # rebuild dist/ on change
npm test           # vitest unit tests
npm run lint       # eslint + prettier
make update-version VERSION=x.y.z
```

`dist/` is committed on purpose — HACS serves the built bundle. CI fails if
the bundle is out of date. `demo/index.html` renders the card with mocked
`hass` data outside Home Assistant for quick visual checks during
development: serve the repo root with any static server and open
`/demo/index.html?theme=dark`.

## License

[MIT](LICENSE)
