import type { WorkProject } from "../../components/ProjectSlide";

// One floating card on /back-pocket. Each card carries its own size, tilt,
// offset, and drift timing so the field reads as things tossed on a desk,
// not a grid with rotation sprinkled on.
export type BackPocketItem = {
  id: string;
  title: string;
  kind: string;
  card: {
    width: string;
    aspect: string;
    rotate: number;
    nudgeX?: string;
    nudgeY?: string;
    // Drift loop length + phase offset, so no two cards bob in sync.
    driftDuration: number;
    driftDelay: number;
    // Card face. Until set, a dashed placeholder frame shows instead.
    image?: string;
    video?: string;
    lottie?: string;
  };
  // Card-only items: what the larger preview overlay shows. Defaults to the
  // card face itself; `image` swaps in a different (e.g. full) image there,
  // and `text` adds a short write-up under the caption.
  preview?: { image?: string; aspect?: string; text?: string[] };
  // When set, the card opens its own page at /back-pocket/<id> rendered
  // with the Work page's slide. When not, clicking just opens a larger
  // preview of the card's image/video in an overlay.
  detail?: WorkProject;
};

export const BACK_POCKET_ITEMS: BackPocketItem[] = [
  {
    id: "font-saver",
    title: "Font Saver",
    kind: "figma plugin",
    card: {
      width: "15rem",
      aspect: "1200 / 946",
      rotate: -5,
      nudgeY: "1.5rem",
      driftDuration: 6.2,
      driftDelay: -1.1,
      image: "/bp-font-saver-cover.jpg",
    },
    // Copy from wormit.co/lab-project.html
    detail: {
      id: "font-saver",
      logoLabel: "FONT SAVER",
      logoImage: null,
      title: "Font Saver",
      description:
        "It started with a font. Someone on the team found one, loved it, moved on to ten other tasks, and by the time they went looking for it again, it was gone. Not deleted. Just lost in the noise of hundreds of typefaces with no way to bookmark the one that mattered.\n\nThat's the gap. Figma has no native way to save a font for later. You either remember the name, screenshot it, or lose it. Font Saver fixes that.",
      scope: "Figma doesn't let you save fonts. So we built the thing that does.",
      learningsLabel: "What it does",
      learnings: [
        "Save any font you come across, by name, so it's there when you need it again",
        "Preview it before you commit, see exactly how it looks, not just what it's called",
        "Apply it to any text layer with a single click",
        "Manage your collection, add, organise, delete, keep it clean",
        "Works with local fonts installed on your system too, not just the ones in Figma's library",
      ],
      note: "One feature. Done properly. No clutter, no extra settings to dig through, just a place to keep the fonts worth keeping.",
      cardImage: "/bp-font-saver-cover.jpg",
      cardVisual: { width: "16rem", height: "auto", rotate: -4 },
      images: { main: "/bp-font-saver-community.jpg", secondary: "/bp-font-saver-listing.png" },
      imageVisual: {
        main: { width: "100%", rotate: -3 },
        secondary: { width: "90%", rotate: 4, nudgeY: "0.5rem" },
      },
    },
  },
  {
    id: "monster-wall",
    title: "Fig-monster (Monster Wall)",
    kind: "figma project",
    card: {
      width: "12rem",
      aspect: "530 / 795",
      rotate: 4,
      nudgeY: "-1rem",
      driftDuration: 7.4,
      driftDelay: -3.2,
      image: "/bp-monster-card.png",
    },
    // Copy from wormit.co/lab-project-figma-makeathon.html (static images
    // only — the page's video was left out on purpose).
    detail: {
      id: "monster-wall",
      logoLabel: "MONSTER WALL",
      logoImage: null,
      title: "Monster Wall",
      link: "https://fig-monster.figma.site",
      description:
        "We had one question going in. What if you could build a creature that was completely, entirely yours?\n\nThat question became Monster Wall.",
      scope: "Built at Figma Makeathon 2026. What if you could build a creature that was completely, entirely yours?",
      sections: [
        {
          heading: "The Idea",
          paragraphs: [
            "Most collaborative tools feel transactional. You add your piece, you leave. No sense of arrival. No sense that the world noticed you showed up.",
            "We wanted the moment of publishing to feel like something. Like you gave something life and watched it find its place in a world that was already there.",
            "That single feeling drove every decision we made.",
          ],
        },
        {
          heading: "Building It",
          paragraphs: [
            "You pick a body. Give it emotional eyes, a mouth, horns, texture, color. Watch it come alive in real time on the preview card.",
            "Then you name it. Give it a power. Fire, Freeze, Air, Mud. The moment you choose, a biome appears behind your monster. Desert canyon. Frozen tundra. Jungle swamp. Storm cliffs.",
            "Then you write one line. What does this monster do? What does it carry? That part is yours.",
          ],
          images: ["/bp-monster-build.jpg", "/bp-monster-finalize.jpg"],
        },
        {
          heading: "The Publish Moment",
          paragraphs: [
            "Click Publish. Sound fires. A particle explosion erupts across the screen. The card flips. Fades. Then one screen. Your card. Centered. Breathing.",
            "Three seconds of silence.",
            "Just your monster. Existing.",
          ],
        },
        {
          heading: "The Wall",
          paragraphs: [
            "A 5000 by 5000 pixel canvas full of monsters made by real people.",
            "Fire cards shimmer with heat. Freeze cards drift snow. Air cards sway and push their neighbours. Mud cards creep at the edges.",
            "When someone new publishes, nearby monsters slowly turn to face the arrival.",
            "When you click Play, the power ripples outward. Flames float up from surrounding cards. Ice drizzles down. Wind blows cards sideways. Mud splatters on impact.",
            "The wall does not sit still. It breathes.",
          ],
          images: ["/bp-monster-wall.jpg"],
        },
        {
          heading: "The Kindred Spirit",
          paragraphs: [
            "After your card lands, something happens.",
            "Gold rays pulse from your monster like sonar. A beam shoots across the canvas in an arc, accelerating, hunting. It lands on one card. That card pulses gold. A permanent thread connects the two.",
            "Your monster is searching for its kindred spirit.",
            "Kindred spirit found. Your monsters share the same soul.",
            "Someone was already here. Carrying something similar. The wall found them for you.",
          ],
        },
        {
          heading: "War Cry",
          paragraphs: [
            "Before publishing you can record your voice for your monster. A roar. A scream. Whatever feels right.",
            "On the wall every card with a War Cry has an audio button.",
            "Some of them are unhinged in the best way.",
          ],
        },
        {
          heading: "The Stack",
          paragraphs: [
            "Built entirely in Figma Make. Supabase for the real time canvas. Scenes and particle overlays generated in Figma Weave. Every animation on the wall is pure CSS. No libraries.",
          ],
        },
      ],
      learnings: [],
      note: "Vibe coded, start to finish. Built at Figma Makeathon 2026 by Kshamanidhi (theshortpant).",
      cardImage: "/bp-monster-card.png",
      cardVisual: { width: "13rem", height: "auto", rotate: 5 },
      images: { main: "/bp-monster-start.jpg", secondary: "/bp-monster-cards.png" },
      imageVisual: {
        main: { width: "88%", rotate: -3 },
        secondary: { width: "80%", rotate: 4, nudgeY: "1rem", transparentAsset: true },
      },
    },
  },
  {
    id: "character-walk",
    title: "Character walk animation",
    kind: "animation",
    card: {
      width: "12rem",
      aspect: "3 / 4",
      rotate: -3,
      nudgeY: "2.5rem",
      driftDuration: 5.6,
      driftDelay: -2.4,
      lottie: "/Walk Main Animation.lottie",
    },
  },
  {
    id: "font-randomiser",
    title: "Font Randomiser",
    kind: "figma plugin",
    card: {
      width: "14rem",
      aspect: "1200 / 946",
      rotate: 6,
      nudgeY: "0.5rem",
      driftDuration: 6.8,
      driftDelay: -0.4,
      image: "/bp-font-randomiser-cover.jpg",
    },
    // Copy from wormit.co/lab-project-font-randomiser.html
    detail: {
      id: "font-randomiser",
      logoLabel: "FONT RANDOMISER",
      logoImage: null,
      title: "Font Randomiser",
      description:
        "Font pairing is a lot of trial and error, clicking through the same ten typefaces because they're the ones you remember. Font Randomiser breaks that loop.\n\nSelect a text layer, and it assigns a font to it, but not blindly. Set filters for what you're after: weight, style, category, whatever narrows it down to fonts you'd actually use, and it randomises within those bounds. You get variety without losing control.",
      scope: "Pick a layer. Set your filters. Let the font surprise you.",
      learningsLabel: "What it does",
      learnings: [
        "Chooses a font for the specific layer you've selected",
        "Lets you filter by what you actually want, so the results stay usable",
        "Turns font exploration into something fast, not tedious",
      ],
      note: "Less scrolling through dropdowns. More finding fonts you wouldn't have picked yourself.",
      // Only two images exist for this one, so no left card rather than repeating one.
      cardImage: null,
      cardVisual: { width: "16rem", height: "auto", rotate: 4 },
      images: { main: "/bp-font-randomiser-cover.jpg", secondary: "/bp-font-randomiser-ui.jpg" },
      imageVisual: {
        main: { width: "78%", rotate: -3 },
        secondary: { width: "72%", rotate: 5, nudgeY: "1rem" },
      },
    },
  },
  {
    id: "remotion-studio",
    title: "Remotion Studio for AI motion graphics",
    kind: "tool",
    card: {
      width: "17rem",
      aspect: "1200 / 621",
      rotate: -2,
      nudgeY: "-0.5rem",
      driftDuration: 7.9,
      driftDelay: -4.6,
      image: "/bp-remotion-studio.jpg",
    },
    // Copy from the "Motion with Claude" write-up (em dashes rewritten,
    // studio credit replaced with the stack line). No images yet, so the
    // slide runs text-only.
    detail: {
      id: "remotion-studio",
      logoLabel: "REMOTION STUDIO",
      logoImage: null,
      title: "Remotion Studio: React video, written by AI",
      description: "Remotion renders React components as video frames. Claude writes the components.",
      scope: "Together they make motion graphics feel less like production and more like design.",
      sections: [
        {
          heading: "The Stack",
          paragraphs: [
            "**Remotion 4.** React-based video renderer. Every frame is a deterministic function of time: no keyframe timeline, no scrubbing lag.",
            "**Claude Sonnet.** Generates the composition code from a plain-English description. Knows the rules: no CSS transitions, no `@keyframes`.",
            "**Google Fonts.** Any typeface loaded at module level. Type a font name, and Remotion fetches it and blocks rendering until it's ready.",
            "**Zod.** Schema on every composition. Duration, font, color, fps, all editable in the Studio sidebar without touching code.",
          ],
        },
        {
          heading: "Workflow",
          paragraphs: [
            "1. **Describe the motion.** Tell Claude what you want: the scene, timing, colors, font, exit behavior. Be specific about what enters and what leaves. Claude needs the full picture, since it can't scrub a timeline.",
            "2. **Claude writes the composition.** A `spring()` or `interpolate()` call per property. Individual CSS transform properties. A Zod schema with every control you named. TypeScript, so no silent failures.",
            "3. **Preview in Remotion Studio.** Hot-reload previews at full resolution. Scrub frame by frame. Tweak props live in the sidebar (change font, duration, fps) and the timeline resizes automatically via `calculateMetadata`.",
            "4. **Export.** One command. MP4 for social, WebM VP8 or ProRes 4444 for transparency, PNG sequence for lossless. Props can be overridden with the `--props` flag for batch renders.",
          ],
          images: [{ src: "/TitleCard.webm", video: true, caption: "The TitleCard composition, rendered straight out of Remotion." }],
        },
        {
          heading: "Core Rules",
          paragraphs: [
            "`useCurrentFrame()` is the only source of time. Every visual property is derived from this integer. No side effects, no timers.",
            "`interpolate()` maps a frame range to a value range with easing. Used for translate, opacity, scale, color, anything linear or curved.",
            "`spring()` is physics-based motion. Tune `damping`, `stiffness` and `mass`. It replaces bounce easing entirely.",
            "**No CSS animations.** Transitions and `@keyframes` break the renderer. Every animated value lives in the inline style, derived from the current frame.",
            "**Individual transforms.** Use `translate`, `scale` and `rotate` as separate style props, not a `transform` string.",
            "`delayRender()` blocks frames until assets are ready (fonts, data, images). Every frame is guaranteed to render with the right content.",
          ],
          code: "// Every frame is a pure function of time\nconst frame = useCurrentFrame();\n\nconst y = spring({ frame, fps, config: { damping: 9, stiffness: 120 }, from: -300, to: 0 });\nconst opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: \"clamp\" });\n\n// Individual properties, never a transform string\n<div style={{ translate: `0px ${y}px`, opacity }}>",
        },
        {
          heading: "What You Can Build",
          paragraphs: [
            "**Caption overlays.** Transcript auto-split into word chunks, animated with per-word stagger. Exports transparent via VP8 WebM or ProRes 4444.",
            "**Kinetic text reels.** Staggered words across scenes, each with its own entry animation (slide, pop, scale-in), solid colour backgrounds, flash transitions.",
            "**Logo animations.** SVG stroke draw-on crawl, path fill reveal, morphing shapes. All driven by frame math on SVG `strokeDashoffset`.",
            "**UI mockup animations.** Recreate an interface in React, then drop files into it, animate modals, type text in real time, all at exact pixel fidelity.",
            "**Transition plates.** Iris wipes, circle reveals, morphs. Transparent background, ready to drop into any NLE as an overlay track.",
          ],
        },
        {
          heading: "Export",
          paragraphs: [
            "**MP4, for social and delivery.** `npx remotion render MyComp out.mp4`. H.264, no alpha. The default for Instagram, YouTube and TikTok.",
            "**WebM VP8, transparent.** `npx remotion render MyComp out.webm --codec=vp8`. Supports an alpha channel. Works in Premiere, DaVinci and CapCut.",
            "**ProRes 4444, transparent.** `npx remotion render MyComp out.mov --codec=prores --prores-profile=4444`. Lossless alpha. Best quality for Final Cut and Premiere on Mac.",
            "**Override props at render.** `npx remotion render MyComp out.mp4 --props='{\"font\":\"Bebas Neue\",\"durationSec\":15}'`. Batch-render variants without changing source code.",
          ],
        },
      ],
      learnings: [],
      note: "Built with Remotion 4, React, TypeScript and Claude Sonnet.",
      // Side assets, Work-page style: the Studio itself on the left, a
      // rendered vertical kinetic-type reel on the right (Donaleb's size).
      cardImage: "/bp-remotion-studio.jpg",
      images: null,
      rightVideo: { src: "/WordReel.webm", width: "11rem" },
      cardVisual: { width: "16rem", height: "auto", rotate: -3 },
      imageVisual: {
        main: { width: "100%", rotate: 0 },
        secondary: { width: "100%", rotate: 0 },
      },
    },
  },
  {
    id: "wormit-wall",
    title: "Wormit wall illustration",
    kind: "illustration",
    card: {
      width: "15rem",
      aspect: "1200 / 900",
      rotate: 5,
      nudgeY: "1.75rem",
      driftDuration: 6.5,
      driftDelay: -1.9,
      image: "/bp-wormit-wall-mockup.jpg",
    },
    // Copy from wormit.co/lab-project-illustrations.html
    preview: {
      image: "/bp-wormit-wall.jpg",
      aspect: "1600 / 1200",
      text: [
        "A wall mural for the Wormit studio, two characters caught mid-freefall, right above the desks.",
        "Every studio needs one wall that doesn't take itself too seriously. So we sketched two characters caught mid-fall, glasses askew, shoes flying off, floating past a half-finished undersea doodle of fish, coral, and a very confused-looking car.",
        "It's painted straight onto the studio wall, sitting right behind the desks, next to the posters that actually mean something.",
        "One wall, one mood. Loose, playful, unmistakably ours. A reminder that not everything on the wall has to be a client deliverable.",
      ],
    },
  },
  {
    id: "figma-token-guide",
    title: "Figma token automation, step by step",
    kind: "guide",
    card: {
      width: "12rem",
      aspect: "3 / 4",
      rotate: -6,
      nudgeY: "-1.25rem",
      driftDuration: 5.9,
      driftDelay: -3.7,
      image: "/figma-token-automation.png",
    },
    // Copy supplied directly.
    detail: {
      id: "figma-token-guide",
      logoLabel: "TOKEN GUIDE",
      logoImage: null,
      title: "A Practical Guide to Automating Design Tokens with AI (Without Losing Control of the System)",
      logos: [
        { src: "/figma-logo.svg", alt: "Figma" },
        { src: "/claude-logo.svg", alt: "Claude" },
      ],
      description: "I design things for a living. I also, increasingly, direct AI to build things for a living. This is about the point where those two jobs overlapped in a way worth writing down: teaching an AI the actual rules of a design token system, and watching it build (and maintain) one, inside a real Figma file, at a scale no single person keeps consistent by hand for long.",
      scope: "If you're a designer who wants to try this yourself, this is the how. If you're trying to understand how I work, this is the thinking.",
      sections: [
        {
          heading: "The problem this solves",
          paragraphs: [
            "Every design system eventually drifts. Someone picks a blue that's close enough. A corner radius gets typed in by hand instead of pulled from the scale. Six months in, nobody can say with confidence what \"the\" primary blue even is anymore. There are four of them, scattered across components, all slightly different, all technically \"fine.\"",
            "The standard fix is a **token system**: one place that defines every raw value, one layer that gives those values meaning, and components that only ever borrow meaning, never raw values directly. It's not a new idea. What's new is that an AI can now build and maintain the whole thing *inside your actual design file*, as real, live variables, not a spec document someone has to remember to update.",
            "The hard part was never getting an AI to generate colors. It was getting it to follow a system strictly enough that the result was actually trustworthy: not generating something *that looked done*, but something that was structurally correct down to the last variable.",
          ],
        },
        {
          heading: "The system: three tiers, one rule",
          paragraphs: [
            "Before I let AI touch anything, I wrote the rules down. Not a prompt, an actual rulebook, in plain markdown, that any session (or any designer) could read cold and apply the same way every time.",
            "**Tier 1: Primitives.** Raw values only. A hex code. A number. Nothing here knows what it's for, and nothing here is allowed to reference anything else. `blue/500 = #2563EB`. That's it. The only real requirement: build a *complete scale*, never an isolated value. One blue on its own is a liability; a full 50–950 ramp is a system.",
            "**Tier 2: Semantic.** This is where meaning gets introduced. A primitive gets assigned a *role*: `color/text/primary`, `color/background/surface`, `spacing/inset/md`. Every semantic token must alias a primitive and never contain a raw value itself, with one narrow exception: a value that genuinely can't be represented by the primitive scale (a scrim needing a specific alpha, say) is allowed, but *only* if it's documented with a reason. Undocumented exceptions aren't allowed. Ever.",
            "**Tier 3: Component.** The implementation layer. `button/primary/bg`, `input/border/focus`. Every component token aliases a semantic token. Never a primitive, never a raw value. And critically: **you don't create a component token just because a component exists.** You create one only once three or more components would otherwise share the same semantic token but actually need to diverge from each other. Until then, components just consume the semantic layer directly. This single rule prevents the token system from exploding into hundreds of near-duplicate component-level tokens that exist for no real reason.",
            "**The one rule underneath all three:** references only ever flow downward. Component → Semantic → Primitive. Never sideways, never skipped, never circular. If a component token is pointing straight at a raw hex value, that's not a shortcut. It's a bug, full stop. This single constraint is what makes the whole system reliable enough to automate. An AI can't quietly take a shortcut if \"no shortcuts\" is a structural rule, not a style preference.",
            "There's a longer version of these rules: platform export requirements, how to handle values that genuinely differ between iOS and Android, a glossary, a worked example tracing one token end to end. But those three tiers and that one downward-only rule are the whole spine of it.",
          ],
        },
        {
          heading: "Handing the rulebook to an AI, not the screens",
          paragraphs: [
            "Here's the actual workflow. I didn't ask the AI to design anything. I gave it the rulebook first, then the real inputs (actual brand colors, actual spacing needs), and asked it to build the *real thing*: live variables inside the actual design file, correctly scoped, with platform-specific export names already attached, not a mockup of what the system *would* look like.",
            "This matters more than it sounds like it should. A screenshot of a nice color palette proves nothing about whether the underlying system is sound. Live variables, correctly tiered, with every alias chain intact: that's the thing that actually prevents drift six months from now.",
          ],
        },
        {
          heading: "Where it got interesting: the part that's actually worth copying",
          paragraphs: [
            "The valuable part wasn't the generation. Plenty of tools generate a palette. The valuable part was watching it recognize the edges of its own knowledge and stop.",
            "**It flagged a real gap instead of papering over it.** I'd given it a small handful of neutral colors, enough for a light theme. When I asked for a dark theme too, it pointed out that I'd only given it one color dark enough to use as a background, and that if it reused that single color for every dark-mode surface, a card and its background and a \"disabled\" state would all be visually identical. It laid out the honest options (invent a couple of additional dark shades and say so explicitly, or wait for more input) instead of quietly picking one and moving on.",
            "**It refused to invent numbers.** When the system needed a spacing scale and a corner-radius scale I hadn't actually specified, it didn't just make something up to look complete. It proposed a clearly labeled, sensible default and asked me to confirm or override it with real values, every time, not just once. That's the difference between a system that's actually consistent and one that just *looks* consistent in the file you happen to be looking at today.",
            "**It caught a conflict between old and new rules.** Partway through, I updated the rulebook itself: a handful of naming conventions changed. Instead of quietly building on top of the old version, it compared the two versions, found the exact points of disagreement, and asked whether I wanted the differences patched in place or the system rebuilt clean. Silent migration is exactly how systems end up half-old, half-new, and fully confusing.",
            "**It audited itself honestly.** When I later asked it to document the whole system, it didn't describe what it remembered building. It went back into the live file and counted what was actually there, and found one stray value that hadn't come from any of our sessions. It told me plainly, rather than folding it quietly into the write-up.",
            "None of that is the AI being clever. It's the AI being *correctly constrained*, because the rules it was given left no room for silent judgment calls on anything that genuinely mattered.",
          ],
        },
        {
          heading: "How to actually do this yourself",
          paragraphs: [
            "If you want to try this on a real project, here's the order that worked:",
            "1. **Write your own rulebook before you touch a single color.** Three tiers, one downward-only rule, explicit naming conventions. It doesn't need to be long. It needs to be unambiguous.",
            "2. **Only give the AI real inputs.** Your actual brand colors, your actual spacing needs, not placeholders \"to get started.\" Every placeholder becomes a real value in the output if you're not careful, and now it's load-bearing.",
            "3. **Build in a stopping point for genuine ambiguity.** Tell it explicitly: when a value is missing or two valid answers exist, stop and ask. Don't guess and keep moving. This is the single highest-leverage instruction in the whole process.",
            "4. **Primitives and semantics first, always.** Don't let it anywhere near component-level tokens until the foundation is complete and validated. Component tokens are the layer most likely to go wrong if the foundation underneath them is shaky.",
            "5. **Only add component tokens when real reuse demands it.** Resist the urge to pre-build a token for every component that might exist someday. Let genuine divergence between three or more real components justify each one.",
            "6. **Treat generated documentation as a snapshot, not a dashboard.** A documentation page built by reading the live file is accurate the moment it's built, and starts going stale the moment anyone changes a variable by hand. Re-generate it on demand; don't treat it as self-updating magic.",
          ],
        },
        {
          heading: "Why this is worth knowing, if you're hiring",
          paragraphs: [
            "This isn't a story about replacing design judgment with AI. The judgment stayed entirely human: what should dark mode feel like, what's the right spacing scale, do we migrate or rebuild. What got automated was the part that was always tedious and always where consistency quietly died: keeping hundreds of small values honestly in sync with a written system, every single time, without getting tired around decision one hundred and fifty.",
            "That's the actual skill on display here: not \"knows how to prompt an AI,\" but knows how to write a system precise enough that an AI (or a junior designer, or anyone) can execute it faithfully at a scale a single person can't sustain by hand. For a project big enough to need real consistency across dozens of screens and multiple platforms, that's the difference between a design system that holds up and one that quietly doesn't.",
          ],
        },
      ],
      downloads: {
        heading: "My rules: download and try",
        note: "Heads up: this system is still a work in progress (v1.4), so use it wisely. Read the index first, and check what it builds rather than trusting it blindly.",
        steps: [
          "**Connect Figma to your AI tool** through Figma's official MCP server (you sign in to Figma once). **Claude app:** Settings → Connectors → Figma. **Claude Code:** run `claude plugin install figma@claude-plugins-official`. **Cursor:** type `/add-plugin figma` in the agent chat, then connect it under Settings → Tools & MCP.",
          "**Give it the rules.** Attach the five files below (or drop the unzipped folder into your project) and ask it to read `00-INDEX.md` first.",
          "**Point it at your file.** Paste your Figma file link, give it your real brand colors and spacing, and ask it to build the variables following the rules, starting with primitives.",
        ],
        files: [
          { label: "00-INDEX.md", href: "/00-INDEX.md" },
          { label: "primitive_rules.md", href: "/primitive_rules.md" },
          { label: "Semantic_Rules.md", href: "/Semantic_Rules.md" },
          { label: "Component_Rules.md", href: "/Component_Rules.md" },
          { label: "Cross-Tier_Rules.md", href: "/Cross-Tier_Rules.md" },
        ],
        all: { label: "Download all 5 (.zip)", href: "/design-token-rules-v1.4.zip" },
      },
      learnings: [],
      // The finished Figma variables panel, in the left side slot like a
      // Work page's project card. 16rem keeps the 578px-wide crop above 2x,
      // so it stays sharp on retina screens.
      cardImage: "/figma_tokens.png",
      images: null,
      // The rule files being dropped into Claude, in the right side slot
      // (same slot Donaleb's reel uses on the Work page).
      rightVideo: { src: "/ClaudeDropFiles.mp4", width: "16rem" },
      cardVisual: { width: "16rem", height: "auto", rotate: -3 },
      imageVisual: {
        main: { width: "100%", rotate: 0 },
        secondary: { width: "100%", rotate: 0 },
      },
    },
  },
];
