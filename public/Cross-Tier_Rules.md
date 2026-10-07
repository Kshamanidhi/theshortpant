# Cross-Tier Rules

> Version 1.4 — aligned 2026-08-17. Part of a 4-file set: `primitive_rules.md`, `Semantic_Rules.md`, `Component_Rules.md`, `Cross-Tier_Rules.md`. See `00-INDEX.md` for read order. **This file is the canonical single source for the Glossary, Platform Split Reference, and Worked Example** — the other 3 files reference these by name rather than duplicating them, to avoid the two copies drifting out of sync with each other.

> **Purpose:** Define the universal rules that govern relationships between all token tiers. These rules apply to every token regardless of category, platform or implementation.

---

# Rule 1 — References only flow downward

A token may only reference a token in the tier immediately below it.

```
Tier 3 (Component)
        ↓
Tier 2 (Semantic)
        ↓
Tier 1 (Primitive)
```

### Correct

```
button/primary/bg
→ color/accent/primary

color/accent/primary
→ gold/500

gold/500
→ #E3B341
```

### Incorrect

```
Component
→ Primitive

Semantic
→ Component

Primitive
→ Semantic

Component
→ Component
```

Never skip tiers, reference sideways or create circular dependencies.

---

# Rule 2 — Platform differences must be intentional

Platform differences are architectural decisions, not assumptions.

Whenever iOS and Android render a property using fundamentally different mechanisms, either:

- Create platform-specific tokens, or
- Document an explicit transformation rule.

Never assume both platforms behave identically without verification.

Examples include:

- Elevation
- Shadows
- Hairline borders
- Accessibility text scaling
- Minimum touch targets

Platform behaviour should always be explicit.

---

# Rule 3 — Every token must be production-ready

A token is not complete until it includes:

- A defined scope
- Platform export syntax

Examples

```
Scope

TEXT_FILL

CORNER_RADIUS

WIDTH_HEIGHT
```

```
Platform Export

iOS

Android

Web
```

Tokens lacking scope or export mappings are considered incomplete.

---

# Rule 4 — Trace aliases before modifying primitives

Before changing, renaming or removing any Tier 1 primitive, inspect every downstream dependency.

Example

```
Primitive

gray/700

↓

Semantic

color/text/primary

↓

Component

button/text

navigation/title

card/title
```

Removing the primitive without tracing its aliases creates orphaned references throughout the system.

Always validate the complete dependency chain before making upstream changes.

---

# Rule 5 — Raw values outside Tier 1 are defects

Literal values belong exclusively in Tier 1.

Correct

```
Tier 1

blue/500
= #2563EB
```

Incorrect

```
Tier 2

color/text/primary
= #2563EB

Tier 3

button/primary/bg
= #2563EB
```

Treat every raw value outside Tier 1 as a bug, never as a shortcut.

---

# Rule 6 — Dual-platform generation uses documented defaults, never fabricated ones

When a request asks for both iOS and Android in the same pass, generate both platform modes for every token that has a platform split — using the default values documented in the table below — rather than inventing numbers or silently picking one platform.

Two different situations, handled differently:

**A. The role exists on both platforms (spacing scale, touch target, margin).**
Emit both modes under the one semantic name, per Semantic Rule 11 and Rule 9's elevation pattern.

**B. The role exists on only one platform (grid columns/gutters — Android/web only, per Semantic Rule 11).**
Emit the Android value. For iOS, do not fabricate a matching number — mark it explicitly as not applicable (e.g. `N/A — no HIG grid spec`), so a missing value reads as an intentional platform boundary, not a bug.

## Default values (source of truth — update here first if a default changes)

| Token | iOS default | Android default |
|---|---|---|
| Touch target minimum | 44×44 pt | 48×48 dp |
| Base spacing unit | 8pt increments (4/8/16/24/32/48) | 4dp increments (4/8/12/16/24/32) |
| Layout margin — compact | 16pt (compact size class) | 16dp (compact, ≥360dp width) |
| Layout margin — medium/regular | 20pt (regular size class) | 24dp (medium, ≥600dp width) |
| Layout margin — expanded | not applicable (iOS has no 3rd/4th/5th margin state) | 32dp+ (expanded, ≥840dp width) |
| Grid columns | not applicable — no HIG grid spec | 4 (compact) / 8 (medium) / 12 (expanded) |
| Grid gutter | not applicable | 8–24dp depending on breakpoint |

This table is the single source of default values for both platforms — the other 3 files should reference it by name rather than restating the numbers, same convention as the Glossary and Platform Split Reference below.

---

# Decision Checklist

Before introducing a new token, verify the following.

### 1. Does this already exist?

If another token already fulfils the same role, reuse it instead of creating a duplicate.

---

### 2. Am I bypassing Tier 2?

If a Tier 3 token references a primitive directly:

```
button/bg
→ blue/500
```

Stop.

The semantic layer is missing an appropriate role.

Create or reuse a semantic token first.

---

### 3. Is this the first real usage?

A single occurrence usually doesn't justify introducing a new semantic or component token.

Wait until genuine reuse emerges before expanding the token hierarchy.

---

### 4. Does platform behaviour differ?

Before naming the token, determine whether the difference requires:

- Separate platform tokens
- A documented transformation

Never postpone this decision until implementation.

---

### 5. Is the name functional?

Names should describe behaviour rather than appearance.

Correct

```
color/background/surface
```

Incorrect

```
color/background/lightGrey
```

If the underlying colour changes, the name should still make sense.

---

# Platform Decision Tree (supplement — apply when the divergence is specifically iOS vs Android)

The Decision Checklist above governs new tokens generally. When the specific question is *"iOS and Android differ here — how much do I split?"*, run this narrower sequence first:

### 1. Is the meaning different?

If **no** → share the semantic token. Same name, same role, on both platforms.

If **yes** → this isn't a platform-split case at all; you need a genuinely different semantic role (rare — most iOS/Android differences are implementation, not meaning).

### 2. Is only the visual material/surface different?

If **yes** → share the semantic token and the component definition. Let the Surface slot (see `Component_Rules.md`) resolve to a different implementation per platform — a token fill on Android, a non-token material on iOS. Do not create separate components or separate semantic tokens for this.

### 3. Is behavior or interaction different?

If **yes** → this can justify separate platform components (e.g. iOS action sheet vs Android bottom sheet are different components, not one component with a material swap) — but keep sharing whatever semantic tokens still apply (colors, spacing) even across the split.

**The failure mode this prevents:** treating every iOS/Android difference as automatically requiring a full separate token or component, which produces exactly the variant explosion this rule set exists to avoid (see `Component_Rules.md` Rule 9's platform-axis note). Most divergence is case 2 — material/surface only — and should never touch the semantic layer at all.

---

# Platform Split Reference

Separate platform tokens should only exist when platforms use fundamentally different rendering models.

| Property | Split Tokens? | Reason |
|------------|--------------|--------|
| Elevation / Shadow | ✅ Yes | Android uses elevation; iOS defines manual shadow properties. Different rendering mechanisms. |
| Spacing | ❌ No | Shared value exported as `dp` or `pt`. |
| Radius | ❌ No | Same geometric measurement on both platforms. |
| Generic Sizing | ❌ No | Same value with platform-specific units. |
| Font Size (primitive value) | ❌ No | Shared numeric scale — see `primitive_rules.md`'s irregular `fontSize/*` list. Export as `sp` on Android and `pt` with Dynamic Type on iOS. |
| Typography (semantic naming) | ✅ Yes | Primitive values are shared, but the semantic token *names* are not — iOS uses 11 HIG text-style names, Android uses 15 Material 3 names. Two separate token sets, not one shared name resolving differently. See Semantic Rule 8. |
| Hairline Border | ⚠️ Flag | Same token, but platforms render one-pixel borders differently. |
| Touch Target Minimum | ✅ Yes | iOS (44pt) and Android (48dp) define different accessibility standards. |
| Layout Margin | ✅ Yes | Same semantic name, different resolution table: iOS resolves by size class (2 states), Android by window size class/breakpoint (up to 5 states). See Rule 6. |
| Layout Grid (columns/gutters) | ✅ Yes — Android/web only | Material 3 has an official column-grid spec; Apple's HIG does not. iOS gets no equivalent token — this is a platform-exclusive role, not a value split. See Semantic Rule 11. |
| Surface Elevation Tint | ✅ Yes | Android tints elevated surfaces via `tonalOverlayPrimitive`, indexed to the same `elevation/level/N` scale as shadow. iOS surface color never shifts with elevation — depth is shadow-only. See Semantic Rule 9. |
| iOS System Materials (blur+tint) | N/A — not a token | Not a value split, because it isn't a token at all on either platform. Documented in `Component_Rules.md` as a non-token asset library, outside this table and outside the alias chain. |

---

# Worked Example

Tracing a complete token from Tier 3 to Tier 1.

```
Tier 1 — Primitive

gold/700
= #D9A934

        ↑ Alias

Tier 2 — Semantic

color/accent/primary-pressed
→ gold/700

        ↑ Alias

Tier 3 — Component

button/primary/bg-pressed
→ color/accent/primary-pressed
```

### Responsibility of each tier

**Tier 1 — Primitive**

Stores only the raw value.

```
gold/700
= #D9A934
```

It has no knowledge of where it will be used.

---

**Tier 2 — Semantic**

Assigns meaning.

```
color/accent/primary-pressed
```

This role may be shared by buttons, sliders, focus indicators or any other interface element.

---

**Tier 3 — Component**

Connects semantic meaning to a specific UI implementation.

```
button/primary/bg-pressed
```

The component never knows or cares which primitive colour ultimately provides the value.

Changing the brand colour requires updating only the primitive or its semantic alias.

Every downstream component updates automatically.

---

# Glossary

| Term | Definition |
|------|------------|
| **Alias** | A token whose value references another token instead of storing a literal value. |
| **Scope** | Defines which Figma properties a variable may bind to, such as `TEXT_FILL` or `CORNER_RADIUS`. |
| **Code Syntax** | Platform-specific export name shown in Dev Mode for iOS, Android or Web. |
| **Mode** | A named variant of a collection (for example, Light or Dark) using identical token names with different values. |
| **DTCG** | The W3C Design Tokens Community Group specification (`$type`, `$value`, `$description`) for portable token files. |
| **Composite Token** | A token composed of multiple related values, such as a shadow containing colour, blur and offset. |
| **Orphaned Alias** | A downstream token still referencing a deleted or renamed token, resulting in a broken dependency chain. |
| **Size Class** | iOS's 2-state layout context (compact, regular) used to resolve platform-conditional tokens like `spacing/layout/margin`. Not the same as Android's window size class. |
| **Window Size Class** | Material 3's 5-state width-based breakpoint system (Compact, Medium, Expanded, Large, Extra-large) used to resolve Android's layout margin and grid tokens. |
| **Breakpoint** | A defined screen-width threshold at which layout values (margin, grid columns, gutter) change. Android/web concept with official Material 3 values; iOS has no published breakpoint spec. |
| **Tonal Overlay** | Android/Material technique of tinting a surface color at increasing opacity to signal elevation, instead of (or alongside) casting a shadow. Modeled here as `tonalOverlayPrimitive`, indexed to the same `elevation/level/N` scale as shadow — see Semantic Rule 9. |
| **System Material** | Apple's blur+tint chrome treatment (`ultraThin/thin/regular/thick/chrome`). Not a token — blur cannot bind to a Figma variable under current tool capability — so it's built as a component, not aliased through Tier 1–3. See `Component_Rules.md`. |
| **Non-Token Asset Library** | A set of design assets (currently: iOS system materials) that deliberately sits outside the Primitive → Semantic → Component alias chain because part of the asset (e.g. blur) cannot be represented as a token. Documented for awareness, not governed by Cross-Tier Rule 1. |