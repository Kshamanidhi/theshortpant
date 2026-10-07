# Tier 2 — Semantic Rules

> Version 1.4 — aligned 2026-08-17. Part of a 4-file set: `primitive_rules.md`, `Semantic_Rules.md`, `Component_Rules.md`, `Cross-Tier_Rules.md`. See `00-INDEX.md` for read order. This file is self-contained for Tier 2 — full glossary, platform-split table, and worked cross-tier example live in `Cross-Tier_Rules.md`.

> **System in one paragraph:** three tiers, references only ever point one tier down (Component → Semantic → Primitive), never sideways or backward. Primitive = raw value, no meaning. Semantic = role/function, aliases a primitive. Component = specific UI part, aliases a semantic token.

> **Purpose:** Give primitives meaning by assigning them functional roles. Semantic tokens are the abstraction layer between raw values (Tier 1) and implementation (Tier 3).

---

# Definition

A semantic token represents **what a value is used for**, not **what the value is**.

Every Tier 2 token **must alias a Tier 1 primitive**.

Examples:

- `color/text/primary`
- `color/background/surface`
- `spacing/inset/md`
- `radius/card`
- `motion/duration/fast`

---

# Allowed Categories

Only the following categories belong in Tier 2.

| Category | Typical Roles |
|----------|---------------|
| **Color — Background** | canvas, surface, surface-elevated, muted, disabled, overlay, scrim |
| **Color — Text** | primary, secondary, tertiary, disabled, inverse, on-accent, link |
| **Color — Border** | default, subtle, strong, focus, disabled |
| **Color — Icon** | default, secondary, disabled, on-accent |
| **Color — Accent / Brand** | primary, primary-hover, primary-pressed, primary-disabled, secondary, secondary-pressed |
| **Color — Feedback** | success, warning, danger, info × (background, text, border, icon) |
| **Color — Interactive** | hover, pressed, focus-ring, disabled-background, disabled-text |
| **Spacing** | inset, stack, inline (each xs–xl); layout (fixed roles — see Rule 10, not a step scale) |
| **Radius** | none, sm, md, lg, xl, card, sheet, full |
| **Border Width** | thin, default, thick, focus |
| **Opacity** | disabled, hover, pressed, overlay, scrim |
| **Sizing** | icon-size, touch-target (minimum, comfortable — platform-specific primitives, same pattern as elevation; see Rule 9 and Cross-Tier Rule 6), avatar-size |
| **Typography** | Two platform-specific composite sets, not one shared set — see Rule 8 |
| **Motion** | duration (fast, normal, slow), easing (standard, decelerate, accelerate, sharp) |
| **Elevation** | Semantic elevation levels mapped to platform primitives |

---

# Rules

## Rule 1 — Every semantic token aliases Tier 1

Semantic tokens never contain raw values.

Correct

```
color/text/primary
→ gray/900

spacing/inset/md
→ spacing/16

radius/card
→ radius/16
```

Incorrect

```
color/text/primary = #111111

spacing/inset/md = 16
```

Tier 2 always references Tier 1.

---

## Rule 2 — No raw values (except documented exceptions)

Tier 2 must never define literal values.

The only acceptable exception is when a value cannot be represented by the existing primitive scales (for example, a scrim with a specific alpha channel).

Every exception must include documentation explaining why.

Example

```
color/background/scrim

Value:
rgba(0,0,0,0.42)

Description:
Specific alpha required by platform guidelines.
Cannot be represented using existing opacity primitives.
```

Undocumented exceptions are not permitted.

---

## Rule 3 — Name by function, never appearance

Semantic names describe purpose rather than visual appearance.

Correct

```
color/text/primary

color/background/surface

color/border/subtle

color/accent/primary
```

Incorrect

```
color/text/navy

color/background/lightGray

color/gold/primary
```

A semantic token should remain valid even if the underlying primitive changes.

---

## Rule 4 — Follow the category / role / variant structure

Semantic tokens follow a predictable hierarchy.

```
category
    role
        variant
```

Examples

```
color/text/secondary

color/background/surface

spacing/inset/md

motion/duration/fast
```

Avoid inconsistent or flattened naming.

Incorrect

```
primaryText

surfaceColor

largeInsetSpacing
```

---

## Rule 5 — One semantic token across all modes

Semantic token names never change between themes.

Each supported mode provides a different Tier 1 alias while preserving the same semantic name.

Example

```
Light

color/background/surface
→ gray/50

Dark

color/background/surface
→ gray/900
```

Correct

```
color/background/surface
```

Incorrect

```
surface-light

surface-dark
```

Consumers should switch themes without changing token references.

---

## Rule 6 — Create semantic tokens only when reusable

A semantic token should represent a role used by at least two real scenarios.

If only one component requires a value, first determine whether an existing semantic role already satisfies the requirement.

Create a new semantic token only when no suitable role exists.

This prevents unnecessary expansion of the semantic layer.

---

## Rule 7 — Never bypass the semantic layer

Tier 3 and implementation layers must never reference Tier 1 directly.

Incorrect

```
Button Background

→ blue/500
```

Correct

```
Button Background

→ color/accent/primary

→ blue/500
```

If a required semantic role does not exist, create it rather than bypassing Tier 2.

---

## Rule 8 — Typography tokens are composites, and are named per platform

Typography semantic tokens combine multiple Tier 1 primitives into a reusable text style. Unlike `spacing/layout/margin` (Rule 11 — same name, different resolution per platform), typography does not share names across platforms at all. iOS and Android each ship a real, different named text-style set, and forcing them into one shared name (`typography/body/md`) would either lose one platform's actual style count (iOS has 11, Android has 15) or invent styles neither platform defines.

**iOS set — `typography/ios/*`** (11 styles, names match SF Pro / HIG text styles exactly):

```
typography/ios/largeTitle
→ fontSize → fontSize/34
→ fontWeight → fontWeight/regular

typography/ios/title1    → fontSize/28
typography/ios/title2    → fontSize/22
typography/ios/title3    → fontSize/20
typography/ios/headline  → fontSize/17, fontWeight/semibold
typography/ios/body      → fontSize/17, fontWeight/regular
typography/ios/callout   → fontSize/16
typography/ios/subheadline → fontSize/15
typography/ios/footnote  → fontSize/13
typography/ios/caption1  → fontSize/12
typography/ios/caption2  → fontSize/11
```

**Android set — `typography/android/*`** (15 styles: display/headline/title/body/label × large/medium/small, per Material 3):

```
typography/android/displayLarge   → fontSize/57
typography/android/displayMedium  → fontSize/45
typography/android/displaySmall   → fontSize/36
typography/android/headlineLarge  → fontSize/32
typography/android/headlineMedium → fontSize/28
typography/android/headlineSmall  → fontSize/24
typography/android/titleLarge     → fontSize/22
typography/android/titleMedium    → fontSize/16, fontWeight/medium
typography/android/titleSmall     → fontSize/14, fontWeight/medium
typography/android/bodyLarge      → fontSize/16
typography/android/bodyMedium     → fontSize/14
typography/android/bodySmall      → fontSize/12
typography/android/labelLarge     → fontSize/14, fontWeight/medium
typography/android/labelMedium    → fontSize/12, fontWeight/medium
typography/android/labelSmall     → fontSize/11, fontWeight/medium
```

Both sets alias the same `fontSize/*` primitive scale (`primitive_rules.md`) wherever a value coincides — e.g. `typography/ios/caption2` and `typography/android/labelSmall` both point to `fontSize/11`, without implying the two styles are otherwise equivalent in role or usage.

Note: the letter-spacing scale is `tightest / tight / normal / wide / widest` — there is no `default` step. Font weight is named descriptively (`regular/medium/semibold/bold`), not by its numeric value.

Typography semantics define complete text styles rather than individual values. A component consuming typography picks the token from whichever platform set applies — never mixes an iOS-named style into an Android build or vice versa.

---

## Rule 9 — Elevation is semantic

Semantic elevation tokens describe interface hierarchy rather than implementation details.

Example

```
elevation/level/1

Android
→ elevationPrimitive/dp/1
→ tonalOverlayPrimitive/opacity/4

iOS-radius
→ elevationPrimitive/shadow-radius/1

iOS-offsetY
→ elevationPrimitive/shadow-offset-y/1

iOS-color
→ elevationPrimitive/shadow-color/1
```

iOS elevation is never a single composite primitive. A Figma Effect Style (or a native shadow API call) needs radius, y-offset, and color bound independently — collapsing them into one `shadowPrimitive` loses the ability to bind each to its own property. Android needs only the one `dp` value for shadow, since the OS renders the full shadow from it — plus, as of this version, a `tonalOverlayPrimitive` opacity value, since Material surfaces tint by elevation rather than (or in addition to) casting shadow.

**One elevation scale, not two.** The tonal overlay value is an additional Android attribute hanging off the same `elevation/level/N` semantic token — it is not a separate indexing scheme. `elevation/level/2` must mean the same physical elevation everywhere it's referenced, whether the consumer reads its `dp`, its `tonalOverlay`, or (on iOS) its shadow triplet. Never create a second elevation numbering system for surface tinting.

**`color/background/surface-elevated` resolution.** This is one semantic token (per Rule 4's category/role/variant structure — `surface-elevated` is the role, elevation level is the variant, not five separate token families). It resolves as:

```
color/background/surface-elevated (level N)

Android → color/background/surface + tonalOverlayPrimitive at elevation/level/N
iOS     → color/background/surface, unchanged across elevation levels
             (iOS communicates elevation via elevation/level/N's shadow
             attributes, never by shifting the surface color itself —
             don't invent a tint behavior iOS doesn't have, per
             Cross-Tier Rule 2)
```

Consumers should never reference platform primitives directly.

---

## Rule 10 — Not every sub-category is a step scale

`inset`, `stack`, and `inline` are step scales (`xs/sm/md/lg/xl`) — more steps, finer-grained, used constantly at the component level.

`layout` is different: it's a **fixed set of named roles**, not a scale.

```
spacing/layout/margin
spacing/layout/section
```

Macro page-structure spacing needs far fewer distinct values than component-level spacing does — there's rarely a reason for five different values on one page. Don't force `layout` into the same `xs–xl` shape as the other three; that would imply a granularity it doesn't need.

**`gutter` is not listed above.** See Rule 11 — it isn't a role both platforms share, so it doesn't sit alongside `margin` and `section` as a peer.

---

## Rule 11 — `layout/margin` is platform-conditional; `layout/grid` is platform-exclusive

Not every `layout` role resolves the same way on both platforms, and one of them doesn't exist on both platforms at all. Treat these as two different cases:

**`spacing/layout/margin` — one semantic name, platform-specific resolution table.**

The name stays constant; what changes per platform is *how many states* it resolves against.

```
spacing/layout/margin

iOS      → resolves by size class (2 states: compact, regular)
             compact → touchTargetPrimitive-adjacent margin primitive, e.g. 16pt
             regular → 20pt

Android  → resolves by window size class / breakpoint (up to 5 states: compact,
             medium, expanded, large, extra-large)
             compact (≥360dp)  → 16dp
             medium (≥600dp)   → 24dp
             expanded (≥840dp) → 32dp+
```

This follows the same shape as Rule 9's elevation split: one semantic token, platform-specific primitives underneath, more states on one platform than the other. Don't force iOS to invent 5 states it doesn't have, and don't collapse Android down to iOS's 2.

**`spacing/layout/grid` (columns + gutters) — Android/web only. Do not create an iOS equivalent.**

Material 3 defines an explicit, official column-grid system (4/8/12 columns depending on breakpoint, with fixed gutter widths per breakpoint). Apple's HIG has no equivalent published specification — iOS layout is governed by Auto Layout, safe area, and size classes, not a named column count. Inventing `grid/columns` for iOS would document a convention that isn't Apple's, which violates Cross-Tier Rule 2 ("never assume platforms behave identically without verification").

```
spacing/layout/grid/columns
→ Android: gridColumnsPrimitive (4 / 8 / 12 depending on breakpoint)
→ iOS: not applicable — do not populate. Document as "N/A — no HIG grid spec"
   rather than fabricating a value.

spacing/layout/grid/gutter
→ Android: breakpoint-indexed gutter primitive (8–24dp)
→ iOS: not applicable — same as above.
```

If cross-platform layout consistency is required on iOS, that is solved through shared spacing/margin tokens and manual layout judgment per screen — not by forcing a fake grid token. See Cross-Tier Rule 6 for how a dual-platform generation request should handle this asymmetry.

---

# Tier Boundary

Tier 2 ends where implementation begins.

Anything that identifies a specific UI element or component belongs in **Tier 3**.

Examples:

- `button/background`
- `card/border`
- `navigation/icon`
- `textfield/focus-ring`

These are implementation-specific and must never be defined in the semantic layer.