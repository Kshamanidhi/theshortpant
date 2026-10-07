# Tier 1 — Primitive Rules

> Version 1.4 — aligned 2026-08-17. Part of a 4-file set: `primitive_rules.md`, `Semantic_Rules.md`, `Component_Rules.md`, `Cross-Tier_Rules.md`. See `00-INDEX.md` for read order. This file is self-contained for Tier 1 — full glossary, platform-split table, and worked cross-tier example live in `Cross-Tier_Rules.md`.

> **System in one paragraph:** three tiers, references only ever point one tier down (Component → Semantic → Primitive), never sideways or backward. Primitive = raw value, no meaning. Semantic = role/function, aliases a primitive. Component = specific UI part, aliases a semantic token.

> **Purpose:** Store raw, immutable values with **no semantic meaning**. Primitive tokens are the foundation of the design token system and exist solely to define measurable values.

---

## Definition

A primitive token represents a **literal value** (hex, number, string, cubic-bezier, etc.) and **must never imply purpose or usage**.

Examples:

- `blue/500`
- `spacing/16`
- `fontSize/14`
- `duration/200`
- `radius/12`

---

# Allowed Categories

Only the following categories belong in Tier 1.

| Category | Description | Example |
|----------|-------------|---------|
| Color | 8–10 step hue ramps | `blue/500` |
| Spacing | 4pt/dp spacing scale | `spacing/16` |
| Radius | Corner radius scale including full (pill) | `radius/24` |
| Border Width | Hairline → thick border scale | `borderWidth/thin` |
| Opacity | Numeric opacity scale | `opacity/32` |
| Font Size | Typography size scale — **not linear/mathematical**. Union of iOS (SF Pro) and Android (Material 3) real text-style sizes. See scale below. | `fontSize/17` |
| Line Height | Unitless line-height ratios | `lineHeight/normal` |
| Letter Spacing | em-based tracking scale | `letterSpacing/wide` |
| Font Weight | Descriptive weight scale (numeric value lives inside the token, not the name) | `fontWeight/medium` (= 500) |
| Font Family | Raw font family stacks | `fontFamily/sans` |
| Icon Size | Icon sizing scale | `iconSize/md` |
| Dimension | Generic sizing values | `dimension/44` |
| Duration | Motion timing values | `duration/fast` |
| Easing | Cubic-bezier definitions | `easing/standard` |
| Elevation Primitive | Platform-specific elevation primitives | `elevationPrimitive/dp/3` |
| Touch Target Primitive | Platform-specific minimum tap-area values | `touchTargetPrimitive/pt/44`, `touchTargetPrimitive/dp/48` |
| Breakpoint Primitive | Platform-specific responsive width thresholds (Android/web only — see Cross-Tier Rule 6) | `breakpointPrimitive/dp/360`, `breakpointPrimitive/dp/600` |
| Grid Column Primitive | Platform-specific column-count values at a given breakpoint (Android/web only) | `gridColumnsPrimitive/4`, `gridColumnsPrimitive/8`, `gridColumnsPrimitive/12` |
| Tonal Overlay Primitive | Android-only, simplified 5-step opacity scale used to tint elevated surfaces; one step per elevation level (see Semantic Rule 9). Not Material 3's full non-linear spec — deliberately simplified per project decision. | `tonalOverlayPrimitive/opacity/4`, `/8`, `/12`, `/16`, `/20` |

---

# Rules

## Rule 1 — Primitive values only

A Tier 1 token must always contain a **literal value**.

Allowed:

```
blue/500 = #2563EB
spacing/16 = 16
duration/200 = 200
```

Not allowed:

```
blue/500 = {brand.primary}
spacing/16 = {spacing.md}
```

Primitive tokens must never reference another token.

---

## Rule 2 — No aliases

Tier 1 cannot contain aliases.

If a token points to another token, it no longer belongs in Tier 1.

Wrong

```
primaryBlue → blue/500
```

Correct

```
blue/500 = #2563EB
```

Aliases belong in higher tiers.

---

## Rule 3 — No semantic meaning

Primitive tokens describe **what the value is**, never **what it does**.

Correct

```
blue/500
gray/300
spacing/16
radius/8
```

Incorrect

```
danger
success
primary
button-bg
card-shadow
```

Meaning is introduced in Tier 2.

---

## Rule 4 — Build complete scales

Every primitive category must be treated as a **scale**, not as isolated values.

Example:

```
blue/
 ├── 50
 ├── 100
 ├── 200
 ├── 300
 ├── 400
 ├── 500
 ├── 600
 ├── 700
 ├── 800
 └── 900
```

Avoid creating single values without the surrounding scale.

**Exception to linear scales: `fontSize/*`.** Unlike `spacing/*` or `radius/*`, the font size scale is not evenly spaced. It's the union of iOS's and Android's actual system text-style sizes — each platform's values come from real legibility testing, not a ratio. Treat this as the one deliberately irregular primitive family; document it once here rather than re-deriving it per project.

```
fontSize/
 ├── 11   (iOS Caption 2 / Android Label Small)
 ├── 12   (iOS Caption 1 / Android Label Medium, Body Small)
 ├── 13   (iOS Footnote)
 ├── 14   (Android Title Small, Label Large, Body Medium)
 ├── 15   (iOS Subheadline)
 ├── 16   (iOS Callout / Android Title Medium, Body Large)
 ├── 17   (iOS Body, Headline)
 ├── 20   (iOS Title 3)
 ├── 22   (iOS Title 2 / Android Title Large)
 ├── 24   (Android Headline Small)
 ├── 28   (iOS Title 1 / Android Headline Medium)
 ├── 32   (Android Headline Large)
 ├── 34   (iOS Large Title)
 ├── 36   (Android Display Small)
 ├── 45   (Android Display Medium)
 └── 57   (Android Display Large)
```

Neither platform defines a real text style below 11 — don't add an 8/9/10 step here to satisfy an unrelated 8px spacing grid; font size and spacing are different primitive families (Rule 5) and don't need matching floors. If a project genuinely needs sub-11 text (badge counters, micro-labels), that is a deliberate custom addition outside both platform specs — document it as such rather than implying it's platform-accurate.

---

## Rule 5 — One family, one property

Each primitive family represents only one measurable property.

Examples

```
blue/*
```

Only defines hue progression.

```
spacing/*
```

Only defines spacing.

```
radius/*
```

Only defines corner radius.

A primitive family must never mix different concepts or embed usage meaning.

---

## Rule 6 — Never consumed directly

Design components and UI should never reference Tier 1 directly.

Incorrect

```
Button Background
→ blue/500
```

Correct

```
Button Background
→ Tier 2 → Tier 1
```

Every UI decision must pass through semantic tokens.

---

## Rule 7 — Extend by generating the full scale

When introducing a new primitive family, generate the complete scale instead of adding isolated values.

Correct

```
purple/
50
100
200
300
400
500
600
700
800
900
```

Incorrect

```
purple/500
```

Complete scales ensure consistency and prevent fragmented token systems.

---

# Tier Boundary

Tier 1 ends where **meaning begins**.

Anything that answers questions such as:

- Primary
- Secondary
- Success
- Warning
- Danger
- Disabled
- Surface
- Background
- Text
- Border

does **not** belong in Tier 1.

Those belong in **Tier 2 — Semantic**.

---

# Note — iOS materials are not primitives

iOS system materials (blur + tint, used for chrome like nav bars, tab bars, sheets) are **not** modeled as Tier 1 primitives, and never will be under this system. The tint portion could alias a color primitive, but the blur portion cannot bind to a Figma variable under current tool capability — so the component as a whole sits outside the primitive→semantic→component chain entirely. See `Component_Rules.md` for where this non-token asset library is documented.