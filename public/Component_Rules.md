# Tier 3 — Component Rules

> Version 1.4 — aligned 2026-08-17 (no content changes in this file this release — see `00-INDEX.md` changelog). Part of a 4-file set: `primitive_rules.md`, `Semantic_Rules.md`, `Component_Rules.md`, `Cross-Tier_Rules.md`. See `00-INDEX.md` for read order. This file is self-contained for Tier 3 — full glossary, platform-split table, and worked cross-tier example live in `Cross-Tier_Rules.md`.

> **System in one paragraph:** three tiers, references only ever point one tier down (Component → Semantic → Primitive), never sideways or backward. Primitive = raw value, no meaning. Semantic = role/function, aliases a primitive. Component = specific UI part, aliases a semantic token.

> **Purpose:** Bind a specific UI component and its states to semantic meanings. Component tokens provide implementation-level consistency while remaining independent of raw values.

---

# Definition

A component token represents **how a specific UI component should look or behave** by referencing semantic tokens from Tier 2.

Every Tier 3 token **must alias a Tier 2 semantic token**.

Examples:

- `button/primary/bg`
- `input/border/focus`
- `tab/active/text`
- `modal/scrim`
- `toast/bg`

---

# Allowed Categories

Only the following components belong in Tier 3.

| Component | Typical Tokens |
|-----------|----------------|
| **Button** | Background and text for each variant (primary, secondary, tertiary, destructive) across all interaction states (default, hover, pressed, disabled) |
| **Card** | Background, pressed background, border, shadow |
| **Tab** | Active background, active text, inactive background, inactive text, indicator |
| **Navigation** | Background, active/inactive icons, active/inactive labels, indicator |
| **Input / Text Field** | Background, border, focused border, error border, text, placeholder, label |
| **Chip / Badge** | Background, text, plus success, warning and danger variants |
| **Slider** | Active track, inactive track, thumb, thumb border |
| **Modal / Sheet** | Background, scrim, border |
| **Toast / Snackbar** | Background, text, icon |
| **Divider** | Default, strong |
| **Avatar** | Background, border |
| **Switch / Toggle** | Active track, inactive track, thumb |
| **Progress** | Track, fill |

---

# Rules

## Rule 1 — Every component token aliases Tier 2

Component tokens must always reference semantic tokens.

Correct

```
button/primary/bg
→ color/accent/primary

input/border/focus
→ color/border/focus

card/bg
→ color/background/surface
```

Incorrect

```
button/primary/bg
→ blue/500

button/primary/bg
→ #2563EB
```

Tier 3 never references Tier 1 or literal values.

---

## Rule 2 — Name by component, part and state

Component tokens follow a predictable hierarchy.

```
component
    variant
        part
            state
```

Examples

```
button/primary/bg

button/destructive/text

tab/active/indicator

input/border/focus

switch/thumb

progress/fill
```

Names should clearly identify the component, the affected part and its interaction state.

---

## Rule 3 — Only create component tokens when justified

Component tokens should not exist simply because a component exists.

Create Tier 3 only when **three or more components** would otherwise share the same semantic token but require independent behaviour or overrides.

Example

Initially

```
Button
→ color/accent/primary
```

No component token required.

Later

```
Button
Tab
Navigation
```

All require slightly different pressed or active behaviour.

Now create

```
button/primary/bg

tab/active/bg

navigation/active/bg
```

Tier 3 exists to manage divergence, not duplication.

---

## Rule 4 — Reuse before creating new tokens

Before introducing a new component token, check whether an existing one already represents the same visual role.

Correct

```
card/bg

modal/bg

→ Same component token if both are visually identical.
```

Incorrect

```
card/background

modal/background

sheet/background
```

when all three resolve to the same semantic role without any visual difference.

Avoid duplicate tokens that exist only because component names differ.

---

## Rule 5 — Every interactive state is explicit

Every interactive state must have its own component token.

Examples

```
button/primary/bg

button/primary/bg-hover

button/primary/bg-pressed

button/primary/bg-disabled
```

Incorrect

```
button/primary/bg

Pressed State
→ Apply 20% opacity

Hover State
→ Darken programmatically
```

Runtime effects should never replace explicit design tokens.

---

## Rule 6 — Background and foreground are always separate

Never assume text or icon colours automatically work on a new background.

Every state explicitly defines both.

Correct

```
button/primary/bg

button/primary/text

button/primary/icon
```

Incorrect

```
button/primary/bg

Text
→ Automatically inherited
```

Foreground and background must always be independently controlled.

---

## Rule 7 — Component tokens describe implementation, not colour

Component names should remain valid regardless of branding changes.

Correct

```
button/primary/bg

toast/bg

input/border/error

navigation/icon/active
```

Incorrect

```
button/blue

toast/green

input/red-border
```

Implementation tokens describe interface behaviour rather than appearance.

---

## Rule 8 — Components inherit through semantics

Component tokens should never invent new meaning.

Instead, they bind an existing semantic role to a specific UI element.

Example

```
button/destructive/bg

→ color/danger/bg
```

Note: `danger` sits directly under `color` — there is no intermediate `feedback` path segment anywhere else in this system (see the Semantic tier's own category table, which lists "Feedback" only as a documentation grouping label, not a literal path segment).

Rather than

```
button/destructive/bg

→ red/600
```

This preserves a clean separation between meaning and implementation.

---

## Rule 9 — Not every property multiplies the variant grid

A component property only belongs in the `Type/Size/State` variant grid if it changes the component's actual content — different padding, different font size, different fill.

Properties that only change *presence* or *reference*, not content, are **boolean** or **instance-swap** properties instead — layered on top of the grid, not folded into it.

```
Button variants:  Type × Size × State  =  2 × 3 × 3  =  18 components

Show icon  → boolean property (true/false), toggles icon visibility on any of the 18 — does not multiply the grid
Icon       → instance-swap property, lets the icon itself be replaced — does not multiply the grid
```

Getting this wrong is expensive: treating `Show icon` as a 4th variant axis (Icon=Yes / Icon=No) would have turned 18 variants into 36, for a property that changes nothing about any individual variant's content — only whether one already-identical nested element is visible.

**Rule of thumb:** if two instances of the same `Type/Size/State` combination would look identical except for this one property, it's boolean or instance-swap. If they'd need different padding/fill/text/size, it's a variant axis.

**Platform is never a variant axis either — for the same underlying reason.** Don't build `Button/iOS/Primary/Default` vs `Button/Android/Primary/Default` as sibling variants in one grid. Platform divergence is handled at the Surface level (see the new section below), not by multiplying every component's variant matrix by 2. A `Type × Size × State` grid of 18 stays 18 regardless of platform — only what each variant's Surface slot resolves to (a token fill, or a non-token material) changes per platform.

---

# Tier Boundary

> **Status: out of core scope, decided.** This 4-file set governs Tiers 1–3 only. The Tier 4 concept below is documented for awareness — so nobody mistakes a product-specific token for a missing Tier 3 component — but it is not part of what these 4 files define or enforce. Building it out is a separate, later decision.

Tier 3 ends where implementation details become product-specific.

Anything tied to a particular screen, feature, brand, platform or application should belong in **Tier 4 — Product / Feature Tokens**, not the component layer.

Examples

- `checkout/pay-button/bg`
- `profile/avatar/premium-border`
- `music-player/mini-player/bg`
- `dashboard/widget/header`

These are no longer reusable UI component definitions and should not be placed in Tier 3.

---

# Surface — the slot between Component and fill

Not a new formal tier. A naming/structural convention that clarifies how Rule 1 (every component token aliases Tier 2) and the non-token material exception below actually coexist, without pretending Material belongs in the alias chain.

Every component that has a background can be thought of as having a **Surface** — the specific layer that receives either a semantic fill or a material recipe.

```
Button
│
├── Surface   ← receives one of the two implementations below
│
└── Content (icon, label)
```

A Surface resolves one of two ways, and only one of them produces a real Tier 3 token:

**A. Token-backed Surface (the default, everywhere except iOS chrome material).**
```
card/bg
→ color/background/surface
```
Satisfies Rule 1 in full. This is what every component in this file uses unless it's explicitly one of the iOS materials below.

**B. Non-token Surface (iOS chrome materials only).**
```
navbar/surface
→ material/ios/regular   (not a Tier 2 alias — see below)
```
Does not satisfy Rule 1, and isn't expected to. Documented separately, not folded into the component's normal token definition.

The point of naming this explicitly: a component's Surface can be implemented differently per platform (token fill on Android, material recipe on iOS) without that difference leaking into the component's variant grid, its semantic token, or its name. The component stays one definition; only what its Surface slot resolves to changes.

---

# iOS Materials — a non-token asset library, not a Tier 4 boundary case

This is a different situation from the Tier 4 note above, and the two should not be conflated. Tier 4 tokens are still tokens — they still alias downward through Tier 3 → 2 → 1, they're just out of this 4-file set's governance scope. iOS materials are not tokens at all.

**What they are.** Apple's system materials (`ultraThin`, `thin`, `regular`, `thick`, `chrome`) combine a tint color with a background blur. Used for chrome surfaces only — nav bars, tab bars, sheets, popovers, sidebars. Never for base page/card backgrounds, which stay flat `color/background/surface` tokens exactly as defined in `Semantic_Rules.md` Rule 5 — this is not a full material replacement.

**Why they can't be Tier 3 components.** Rule 1 above requires every Tier 3 token to alias a Tier 2 semantic token. A material's tint layer can do that — but its blur cannot bind to a Figma variable under current tool capability. A component that's half-token, half-hardcoded doesn't satisfy Rule 1, so it doesn't belong in the alias chain at all, not even loosely.

**How to build them instead.** As actual Figma components/rectangles with blur effects applied directly, named `material/ios/{ultraThin, thin, regular, thick, chrome}` — a separate, parallel library, not part of the Component Rules variant grid (Rule 9) or state rules (Rule 5) above. The tint sub-layer, where possible, should still reference a Tier 2 color token internally (partial alias is better than none) — but the component as a whole is not considered "complete" by this file's standards, and that's expected, not a defect.

**Known Figma rendering gotcha — layer type affects the result.** Controlled testing found that a manually built Glass effect renders differently depending on whether it's applied to a **Rectangle** versus a **Frame**, even with identical Glass parameters, dimensions, and background. A Rectangle + Glass matched Apple's UI Kit reference more closely than a Frame + Glass did. Practical implication: the material's construction recipe must specify layer type as part of the definition, not just the effect settings —

```
Material / Glass / Regular

Surface layer type: Rectangle   ← not incidental, part of the spec
Effect: Figma Glass
Fill: ...
Stroke: ...
Radius: ...
```

— and this should be re-verified whenever Figma's Glass renderer changes, since it's an empirical finding about current tool behavior, not a documented API contract.

**Figma Glass ≠ native Liquid Glass.** Figma's Glass effect is a design-time approximation. Apple's native `UIGlassEffect`/`UIGlassContainerEffect` respond dynamically to background content, interaction, and grouping in ways a static Figma layer cannot reproduce. Treat the Figma material as representing *intent*, not a guaranteed visual match to the shipped app.

**Caveat, not a permanent rule.** This whole section is a documented workaround for current Figma tool limitations (blur can't bind to variables, layer type affects rendering), not a claim that iOS materials are inherently non-tokenizable. Revisit if that tooling changes.