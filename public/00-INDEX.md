# Design Token Rules — Index

> Version 1.4 — aligned 2026-08-17

A 4-file rule set for a 3-tier design token architecture (Primitive → Semantic → Component). Built to be portable — usable in a fresh session or a different tool, without this conversation's history attached.

## What changed in 1.4

Populated the typography type scale — previously only referenced by example (`fontSize/16`), never actually defined:
- `primitive_rules.md` — real `fontSize/*` scale (11–57), documented as the deliberately irregular union of iOS's and Android's actual system text-style sizes, not a linear/mathematical scale.
- `Semantic_Rules.md` — Rule 8 rewritten: typography is two separate platform-named composite sets (`typography/ios/*`, 11 HIG styles; `typography/android/*`, 15 Material 3 styles), not one shared name — unlike margin, the names themselves differ by platform, not just the resolved value.
- `Cross-Tier_Rules.md` — Platform Split Reference split into a primitive-value row (still shared) and a new semantic-naming row (platform-specific).

## What changed in 1.3

Merged in three ideas from an external cross-platform Figma reference document, plus one clarification:
- `Component_Rules.md` — new "Surface" section: a naming convention (not a new tier) for the slot inside a component that resolves to either a token-backed fill or the non-token iOS material; iOS Materials section extended with the Rectangle-vs-Frame Figma rendering gotcha and the Figma-Glass-vs-native-Liquid-Glass caveat; Rule 9 gets an explicit note that platform is never a variant axis.
- `Cross-Tier_Rules.md` — new Platform Decision Tree, a narrower supplement to the existing Decision Checklist specifically for iOS-vs-Android divergence questions (is meaning different / is only material different / is behavior different).

## What changed in 1.2

Added Android tonal-elevation surfaces and iOS system materials:
- `primitive_rules.md` — new `tonalOverlayPrimitive` category (5-step simplified scale, Android only); note that iOS materials are never Tier 1 primitives.
- `Semantic_Rules.md` — Rule 9 extended: tonal overlay is a per-level Android attribute on the *same* `elevation/level/N` scale as shadow, not a separate index; `color/background/surface-elevated` resolution defined (Android tints by elevation, iOS stays flat).
- `Component_Rules.md` — new section: iOS system materials (`ultraThin/thin/regular/thick/chrome`) documented as a non-token asset library, structurally outside the alias chain — distinct from the Tier 4 boundary case.
- `Cross-Tier_Rules.md` — Platform Split Reference rows for surface elevation tint and iOS materials; Glossary entries for Tonal Overlay, System Material, Non-Token Asset Library.

## What changed in 1.1

Added iOS (HIG) / Android (Material 3) platform-conditional handling for touch target, layout margin, and layout grid:
- `primitive_rules.md` — new Touch Target, Breakpoint, and Grid Column primitive categories.
- `Semantic_Rules.md` — new Rule 11: `layout/margin` is platform-conditional (one name, per-platform resolution table); `layout/grid` is Android/web-exclusive, not an iOS concept.
- `Cross-Tier_Rules.md` — new Rule 6 with the canonical default-value table for both platforms, plus Platform Split Reference and Glossary updates.

## Read order

1. **`primitive_rules.md`** — Tier 1. Raw values, no meaning, complete scales.
2. **`Semantic_Rules.md`** — Tier 2. Roles/function, aliases Tier 1.
3. **`Component_Rules.md`** — Tier 3. UI-specific, aliases Tier 2. Includes the variant-vs-boolean-property distinction and the Tier 4 (Product/Feature) boundary note.
4. **`Cross-Tier_Rules.md`** — rules that apply across all three tiers, PLUS the canonical Glossary, Platform Split Reference table, and worked alias-chain example. **Read this one even if you only need one tier** — the shared reference material lives here, not repeated in the other three.

## The one rule that matters most

References only ever point one tier down: **Component → Semantic → Primitive.** Never sideways, never backward, never skipped. Every other rule in these 4 files exists to protect that one line.

## Scope

Covers Tiers 1–3 only. Tier 4 (Product/Feature tokens — screen- or brand-specific, e.g. `checkout/pay-button/bg`) is documented inside `Component_Rules.md` as a boundary marker, not built out — that's explicitly a separate, later decision, not an oversight.

## Maintenance note

These files don't have a live system tracking edits across them. If you update a rule in one file that references shared material in `Cross-Tier_Rules.md` (or vice versa), update both by hand — there's no automatic sync. The version line at the top of each file is the only drift signal; bump it if you edit.
