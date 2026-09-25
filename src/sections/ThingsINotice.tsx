import { useEffect, useRef, useState } from "react";
import { DotLottieReact, type DotLottie } from "@lottiefiles/dotlottie-react";
import { gsap, ScrollTrigger } from "../lib/gsap";

type Card = { claim: string; extra?: string; thumbnail?: string; fit?: "contain" | "cover" };

// Without `autoResize`, dotlottie-web sizes its canvas's internal bitmap
// once at mount (often before the card's real CSS size settles) and never
// matches it to devicePixelRatio, so it gets upscaled and looks blurry.
const LOTTIE_RENDER_CONFIG = {
  autoResize: true,
  devicePixelRatio: typeof window !== "undefined" ? Math.max(window.devicePixelRatio || 1, 2) : 2,
};

const PLACEHOLDER_EXTRA =
  "Replace with the real one-line reasoning behind this observation.";

// Placeholder copy — swap each for a real observation before shipping.
// Must have exactly NUM_COLUMNS * CARDS_PER_COLUMN entries — one card per
// grid slot, no repeats.
const CARD_CONTENT: Card[] = [
  {
    claim: "Adding decent spacing around controls saves users from accidental clicks.",
    thumbnail: "/obs-1.png",
  },
  {
    claim: "Skeleton screens feel faster.",
    extra: "Same load time, different perception.",
    thumbnail: "skeleton",
  },
  {
    claim: "Double-tap used to mean zoom.",
    extra: "Instagram repurposed an old Photos gesture and retrained everyone, crazy huh!",
    thumbnail: "double-tap-heart",
  },
  {
    claim: "Icon meaning vs icon looks.",
    extra:
      "Radio button: One of my fav buttons. I was amazed when I came to know that this button is directly adapted from an actual car radio, where pressing one preset popped the rest back out.",
    thumbnail: "/Old Car Radio.jpg",
    fit: "cover",
  },
  {
    claim: "Swipe isn't premium, it's a permission slip.",
    extra:
      "A button says do it now. A swipe says are you sure. Use it when the action can't be undone, not when it just feels fancy.",
    thumbnail: "slide-to-pay",
  },
  {
    claim: "The icon can shrink. The tap zone can't.",
    extra:
      "A small icon is fine for the eye. A small touch target is a miss for the thumb. Keep the icon tight, pad the box around it regardless.",
    thumbnail: "/obs-touchTarget.png",
  },
  {
    claim: "Color meaning isn't universal:",
    extra: "I first thought it was an error or some designer's fault. I accidentally discovered that different regions read the same color differently.",
    thumbnail: "/obs-colorUni.png",
  },
  {
    claim: "Do not break illusion:",
    extra: "A generic shimmer box that doesn't match what loads next breaks the illusion it was built for.",
    thumbnail: "broken-illusion",
  },
  {
    claim: "Disabled state, unexplained:",
    extra: "A disabled button with no reason is dead end. But same state with small tooltip give it a door to move.",
    thumbnail: "disabled-tooltip",
  },
  {
    claim: "Toggle vs checkbox:",
    extra: "A toggle implies immediate effect. A checkbox implies \"pick this, then confirm.\"",
    thumbnail: "toggle-checkbox",
  },
  {
    claim: "It took me time to realize progress bars aren't always real.",
    extra:
     "Sometimes there's real math behind them, sometimes it's just timed to feel right.",
    thumbnail: "ai-image-loader",
  },
  {
    claim: "HSL isn't built on human perception.",
    extra:
      "Two different colors at the same lightness value in HSL often don't look equally light to the eye. Crazy topic to talk about!",
    thumbnail: "/obs-HSL.png",
  },
  {
    claim: "Red/Green color blindness:",
    extra: "Is also a case to take care of while designing for all. Better to have other cues rather than depending on colors.",
    thumbnail: "/obs-redGreen.png",
  },
  {
    claim: "Android:",
    extra:
      "It works on the philosophy that interface is physical. Every element is a sheet of paper with real position in space. Shadow defines that level boundary.",
    thumbnail: "/obs-android.png",
    fit: "cover",
  },
  {
    claim: "iOS philosophy:",
    extra:
      "Content is the main thing to focus on, depth comes from blur and layering, not shadow. Typography wins over other hierarchy factors.",
    thumbnail: "/obs-ios.png",
    fit: "cover",
  },
  { claim: "[Observation #16]", extra: PLACEHOLDER_EXTRA },
];

const NUM_COLUMNS = 4;
const CARDS_PER_COLUMN = 4;
const CARD_SPACING = 440; // px between successive card slots in a column
const COLUMN_SPEED = [1, 1.2, 0.85, 1.1];
const COLUMN_PHASE = [0, 0.3, 0.55, 0.8]; // fraction of CARD_SPACING — a modest head start so columns don't all enter in lockstep

const FOCUS_CENTER = 0.3; // 0=top, 1=bottom — where the sharp focal band sits
const FOCUS_PLATEAU = 0.16; // fraction of half-zone that stays fully sharp
const HEADER_FADE_END = 0.1; // header is fully gone by this fraction of pin progress

function smoothstep(t: number) {
  const c = Math.min(Math.max(t, 0), 1);
  return c * c * (3 - 2 * c);
}

function SkeletonThumbnail() {
  return (
    <div
      style={{
        height: "100%",
        boxSizing: "border-box",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
      }}
    >
      <div className="skeleton-block" style={{ flex: "1 1 auto", borderRadius: "2px" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <div className="skeleton-block" style={{ height: "9px", width: "85%", borderRadius: "2px" }} />
        <div className="skeleton-block" style={{ height: "9px", width: "55%", borderRadius: "2px" }} />
      </div>
    </div>
  );
}

const BROKEN_ILLUSION_LOADING_MS = 1800;
const BROKEN_ILLUSION_REVEALED_MS = 1800;

// The skeleton here is the exact same "photo + two caption lines" shape as
// SkeletonThumbnail — deliberately generic. What loads after it is a single
// short line of real text with no photo at all, so the mismatch itself is
// the demonstration, not a caption explaining it.
function BrokenIllusionThumbnail({ reducedMotion }: { reducedMotion: boolean }) {
  const [revealed, setRevealed] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) return;

    let timer: number;
    function schedule(showRevealed: boolean) {
      timer = window.setTimeout(() => {
        setRevealed(showRevealed);
        schedule(!showRevealed);
      }, showRevealed ? BROKEN_ILLUSION_LOADING_MS : BROKEN_ILLUSION_REVEALED_MS);
    }
    schedule(true);

    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--color-bg)" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: revealed ? 0 : 1,
          transition: "opacity 150ms ease",
          boxSizing: "border-box",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
        }}
      >
        <div className="skeleton-block" style={{ flex: "1 1 auto", borderRadius: "2px" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div className="skeleton-block" style={{ height: "9px", width: "85%", borderRadius: "2px" }} />
          <div className="skeleton-block" style={{ height: "9px", width: "55%", borderRadius: "2px" }} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: revealed ? 1 : 0,
          transition: "opacity 150ms ease",
          boxSizing: "border-box",
          padding: "1rem",
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.9375rem", lineHeight: 1.5, color: "var(--color-fg)" }}>
          Theshortpant is here
          <br />
          And having tea.
        </p>
      </div>
    </div>
  );
}

const DISABLED_TOOLTIP_IDLE_MS = 1600;
const DISABLED_TOOLTIP_SHOWN_MS = 1800;

function DisabledButtonTooltipThumbnail({ reducedMotion }: { reducedMotion: boolean }) {
  const [tapped, setTapped] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) return;

    let timer: number;
    function schedule(showTooltip: boolean) {
      timer = window.setTimeout(
        () => {
          setTapped(showTooltip);
          schedule(!showTooltip);
        },
        showTooltip ? DISABLED_TOOLTIP_IDLE_MS : DISABLED_TOOLTIP_SHOWN_MS
      );
    }
    schedule(true);

    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        background: "var(--color-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ position: "relative" }}>
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: "calc(100% + 10px)",
            left: "50%",
            transform: `translateX(-50%) translateY(${tapped ? 0 : 4}px)`,
            opacity: tapped ? 1 : 0,
            transition: "opacity 180ms ease, transform 180ms ease",
            background: "var(--color-fg)",
            color: "var(--color-bg)",
            fontSize: "0.75rem",
            padding: "0.4rem 0.65rem",
            borderRadius: "4px",
            whiteSpace: "nowrap",
          }}
        >
          Password doesn't match.
          <span
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: "5px solid var(--color-fg)",
            }}
          />
        </div>

        <button
          type="button"
          disabled
          style={{
            appearance: "none",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg)",
            color: "var(--color-muted)",
            borderRadius: "4px",
            padding: "0.6rem 1.5rem",
            fontFamily: "var(--font-sans)",
            fontSize: "0.875rem",
            cursor: "not-allowed",
            transform: tapped ? "scale(0.96)" : "scale(1)",
            transition: "transform 150ms ease",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

const TOGGLE_CHECKBOX_OFF_MS = 1500;
const TOGGLE_CHECKBOX_ON_MS = 1500;

function ToggleSwitch({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        position: "relative",
        display: "inline-block",
        width: "34px",
        height: "19px",
        borderRadius: "999px",
        background: on ? "var(--color-accent)" : "var(--color-border)",
        transition: "background 200ms ease",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "2px",
          left: on ? "17px" : "2px",
          width: "15px",
          height: "15px",
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
          transition: "left 200ms ease",
        }}
      />
    </span>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "19px",
        height: "19px",
        borderRadius: "3px",
        border: `1.5px solid ${checked ? "var(--color-accent)" : "var(--color-border)"}`,
        background: checked ? "var(--color-accent)" : "var(--color-bg)",
        transition: "background 200ms ease, border-color 200ms ease",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" style={{ opacity: checked ? 1 : 0, transition: "opacity 150ms ease" }}>
        <path
          d="M2 6.2 L5 9 L10 3"
          fill="none"
          stroke="#fff"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function ToggleCheckboxThumbnail({ reducedMotion }: { reducedMotion: boolean }) {
  const [on, setOn] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) return;

    let timer: number;
    function schedule(next: boolean) {
      timer = window.setTimeout(
        () => {
          setOn(next);
          schedule(!next);
        },
        next ? TOGGLE_CHECKBOX_OFF_MS : TOGGLE_CHECKBOX_ON_MS
      );
    }
    schedule(true);

    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2.5rem",
        background: "var(--color-bg)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
        <ToggleSwitch on={on} />
        <span style={{ fontSize: "0.6875rem", color: "var(--color-muted)", fontFamily: "var(--font-sans)" }}>Toggle</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
        <Checkbox checked={on} />
        <span style={{ fontSize: "0.6875rem", color: "var(--color-muted)", fontFamily: "var(--font-sans)" }}>Checkbox</span>
      </div>
    </div>
  );
}

const AI_LOADER_FILL_MS = 2600;
const AI_LOADER_HOLD_MS = 700;

// Classic "fake progress" curve — fast out of the gate, crawling at the end —
// the exact pacing the copy is calling out, not a plain linear fill.
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function AIImageLoaderThumbnail({ reducedMotion }: { reducedMotion: boolean }) {
  const [progress, setProgress] = useState(reducedMotion ? 0.62 : 0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    let start: number | null = null;
    let phase: "filling" | "holding" = "filling";
    let holdStart = 0;

    function frame(ts: number) {
      if (start === null) start = ts;
      if (phase === "filling") {
        const t = Math.min((ts - start) / AI_LOADER_FILL_MS, 1);
        setProgress(easeOutCubic(t));
        if (t >= 1) {
          phase = "holding";
          holdStart = ts;
        }
      } else if (ts - holdStart >= AI_LOADER_HOLD_MS) {
        phase = "filling";
        start = ts;
        setProgress(0);
      }
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  const pct = Math.round(progress * 100);

  return (
    <div
      style={{
        height: "100%",
        boxSizing: "border-box",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.7rem",
        background: "var(--color-bg)",
      }}
    >
      <div className="skeleton-block" style={{ position: "relative", flex: "1 1 auto", borderRadius: "4px" }}>
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          aria-hidden
          style={{ position: "absolute", top: "50%", left: "50%", marginTop: -11, marginLeft: -11 }}
        >
          <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8z" fill="var(--color-fg)" opacity={0.55} />
        </svg>
      </div>
      <div>
        <div style={{ height: "5px", borderRadius: "999px", background: "var(--color-border)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "var(--color-accent)", borderRadius: "999px" }} />
        </div>
        <div
          style={{
            marginTop: "0.35rem",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.6875rem",
            color: "var(--color-muted)",
            fontFamily: "var(--font-sans)",
          }}
        >
          <span>Generating image…</span>
          <span>{pct}%</span>
        </div>
      </div>
    </div>
  );
}

function DoubleTapHeartThumbnail({ reducedMotion }: { reducedMotion: boolean }) {
  // The heart-like.lottie asset opens on its outlined (unliked) frame each
  // time it plays or loops, then fills in shortly after. Re-key the rings on
  // those exact moments so the "tap" cue fires while the heart is still an
  // outline, instead of guessing at a fixed CSS timer unrelated to playback.
  const [ringKey, setRingKey] = useState(0);

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        overflow: "hidden",
        background: "var(--color-bg)",
      }}
    >
      <span key={`ring1-${ringKey}`} className="dtl-ring" aria-hidden />
      <span key={`ring2-${ringKey}`} className="dtl-ring dtl-ring-2" aria-hidden />

      <DotLottieReact
        src="/heart-like.lottie"
        autoplay={!reducedMotion}
        loop={!reducedMotion}
        renderConfig={LOTTIE_RENDER_CONFIG}
        dotLottieRefCallback={(dotLottie: DotLottie | null) => {
          if (!dotLottie) return;
          const retriggerRings = () => setRingKey((k) => k + 1);
          dotLottie.addEventListener("play", retriggerRings);
          dotLottie.addEventListener("loop", retriggerRings);
          return () => {
            dotLottie.removeEventListener("play", retriggerRings);
            dotLottie.removeEventListener("loop", retriggerRings);
          };
        }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 100,
          height: 100,
          marginTop: -50,
          marginLeft: -50,
        }}
      />
    </div>
  );
}

function SlideToPayThumbnail({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg)",
      }}
    >
      <DotLottieReact
        src="/slide-to-pay.lottie"
        autoplay={!reducedMotion}
        loop={!reducedMotion}
        layout={{ fit: "contain" }}
        renderConfig={LOTTIE_RENDER_CONFIG}
        style={{ width: "98%", height: "98%" }}
      />
    </div>
  );
}

function CardThumbnail({ content, reducedMotion }: { content: Card; reducedMotion: boolean }) {
  if (content.thumbnail === "skeleton") return <SkeletonThumbnail />;
  if (content.thumbnail === "double-tap-heart") return <DoubleTapHeartThumbnail reducedMotion={reducedMotion} />;
  if (content.thumbnail === "slide-to-pay") return <SlideToPayThumbnail reducedMotion={reducedMotion} />;
  if (content.thumbnail === "broken-illusion") return <BrokenIllusionThumbnail reducedMotion={reducedMotion} />;
  if (content.thumbnail === "disabled-tooltip") return <DisabledButtonTooltipThumbnail reducedMotion={reducedMotion} />;
  if (content.thumbnail === "toggle-checkbox") return <ToggleCheckboxThumbnail reducedMotion={reducedMotion} />;
  if (content.thumbnail === "ai-image-loader") return <AIImageLoaderThumbnail reducedMotion={reducedMotion} />;
  if (content.thumbnail) {
    return (
      <img
        src={content.thumbnail}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: content.fit ?? "contain" }}
      />
    );
  }
  return null;
}

export default function ThingsINotice() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const columnsWrapperRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[][]>(
    Array.from({ length: NUM_COLUMNS }, () => [])
  );
  const zoneHeightRef = useRef(800);
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reducedMotion) return;

    function measure() {
      if (stickyRef.current) {
        zoneHeightRef.current = stickyRef.current.clientHeight;
      }
    }

    function updateFrame(progress: number) {
      const zoneH = zoneHeightRef.current;

      const headerOpacity = 1 - smoothstep(progress / HEADER_FADE_END);
      if (headerRef.current) {
        headerRef.current.style.opacity = String(headerOpacity);
      }

      // Each column's cards make one pass, bottom to top, then stay gone —
      // no wraparound. `journey` is the total distance from "last card not
      // yet entered" to "first card fully exited", derived from the live
      // zone height so it self-adjusts to any viewport instead of a guessed
      // pixel constant.
      const journey = zoneH + (CARDS_PER_COLUMN - 1) * CARD_SPACING;

      cardRefs.current.forEach((cards, ci) => {
        const speed = COLUMN_SPEED[ci % COLUMN_SPEED.length];
        const headStart = COLUMN_PHASE[ci % COLUMN_PHASE.length] * CARD_SPACING;
        const traveled = progress * journey * speed + headStart;

        cards.forEach((card, i) => {
          if (!card) return;
          const baseY = i * CARD_SPACING;
          const pos = zoneH + baseY - traveled; // px from top of the visible zone

          const t = pos / zoneH; // ~0 top .. ~1 bottom
          // Distance from the focal plane, normalized separately toward
          // whichever edge is closer, so the plateau can sit off-center.
          const dist =
            t < FOCUS_CENTER
              ? (FOCUS_CENTER - t) / FOCUS_CENTER
              : (t - FOCUS_CENTER) / (1 - FOCUS_CENTER);
          let focal: number;
          if (dist <= FOCUS_PLATEAU) {
            focal = 1;
          } else {
            const eased = (dist - FOCUS_PLATEAU) / (1 - FOCUS_PLATEAU);
            focal = 1 - smoothstep(eased);
          }
          focal = Math.max(focal, 0);

          const scale = 0.42 + 0.58 * focal;
          const blurPx = (1 - focal) * 7;

          card.style.transform = `translateY(${pos}px) scale(${scale})`;
          card.style.opacity = String(focal);
          card.style.filter = focal < 0.98 ? `blur(${blurPx.toFixed(1)}px)` : "none";
          card.style.zIndex = String(Math.round(focal * 100));
        });
      });
    }

    measure();
    updateFrame(0);
    window.addEventListener("resize", measure);

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => updateFrame(self.progress),
        onRefresh: () => {
          measure();
          updateFrame(0);
        },
      });
      return () => st.kill();
    }, sectionRef);

    return () => {
      window.removeEventListener("resize", measure);
      ctx.revert();
    };
  }, [reducedMotion]);

  const header = (
    <div
      ref={headerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        maxWidth: "75rem",
        margin: "0 auto",
        padding: "6rem 2rem 2rem",
        textAlign: "center",
        pointerEvents: "none",
      }}
    >
      <p
        style={{
          margin: "0 0 0.75rem",
          fontSize: "0.875rem",
          color: "var(--color-muted)",
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        }}
      >
        worth talking about
      </p>
      <h2
        style={{
          margin: 0,
          fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
          fontWeight: "normal",
          color: "var(--color-fg)",
        }}
      >
        Things I'd actually bring up.
      </h2>
    </div>
  );

  const columns = Array.from({ length: NUM_COLUMNS }, (_, ci) => (
    <div
      key={ci}
      className="things-column"
      style={{
        position: "relative",
        flex: "1 1 0",
        minWidth: 0,
        height: "100%",
      }}
    >
      {Array.from({ length: CARDS_PER_COLUMN }, (_, i) => {
        const content = CARD_CONTENT[(ci * CARDS_PER_COLUMN + i) % CARD_CONTENT.length];
        return (
          <div
            key={i}
            ref={(el) => {
              cardRefs.current[ci][i] = el;
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              border: "1px solid var(--color-border)",
              background: "var(--color-bg)",
              willChange: "transform, opacity, filter",
              opacity: reducedMotion ? 1 : 0,
            }}
          >
            <div
              style={{
                aspectRatio: "16 / 10",
                borderBottom: "1px solid var(--color-border)",
                backgroundImage: content.thumbnail
                  ? undefined
                  : "repeating-linear-gradient(135deg, var(--color-border) 0, var(--color-border) 1px, transparent 1px, transparent 14px)",
              }}
            >
              <CardThumbnail content={content} reducedMotion={reducedMotion} />
            </div>
            <div style={{ padding: "1.5rem" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "1.0625rem",
                  lineHeight: 1.6,
                  color: "var(--color-fg)",
                }}
              >
                {content.claim} {content.extra}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  ));

  if (reducedMotion) {
    return (
      <section ref={sectionRef} style={{ padding: "8rem 2rem", maxWidth: "75rem", margin: "0 auto" }}>
        <div style={{ marginBottom: "4rem", textAlign: "center" }}>
          <p
            style={{
              margin: "0 0 0.75rem",
              fontSize: "0.875rem",
              color: "var(--color-muted)",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
          >
            worth talking about
          </p>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              fontWeight: "normal",
              color: "var(--color-fg)",
            }}
          >
            Things I'd actually bring up.
          </h2>
        </div>
        <div className="flex flex-wrap" style={{ gap: "1.5rem" }}>
          {CARD_CONTENT.map((content) => (
            <div
              key={content.claim}
              style={{
                flex: "1 1 18rem",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg)",
              }}
            >
              <div
                style={{
                  aspectRatio: "16 / 10",
                  borderBottom: "1px solid var(--color-border)",
                  backgroundImage: content.thumbnail
                    ? undefined
                    : "repeating-linear-gradient(135deg, var(--color-border) 0, var(--color-border) 1px, transparent 1px, transparent 14px)",
                }}
              >
                <CardThumbnail content={content} reducedMotion={reducedMotion} />
              </div>
              <div style={{ padding: "1.5rem" }}>
                <p style={{ margin: 0, fontSize: "1.0625rem", lineHeight: 1.6, color: "var(--color-fg)" }}>
                  {content.claim} {content.extra}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} style={{ position: "relative", height: "400vh" }}>
      <div
        ref={stickyRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {header}
        <div
          ref={columnsWrapperRef}
          className="flex"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            maxWidth: "75rem",
            margin: "0 auto",
            gap: "1.75rem",
            padding: "2rem",
          }}
        >
          {columns}
        </div>
      </div>
    </section>
  );
}
