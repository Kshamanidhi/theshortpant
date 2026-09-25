import { useEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";
import { useFixThis } from "./useFixThis";
import SignupCard from "./SignupCard";
import OptionsPanel from "./OptionsPanel";
import ProgressDots from "./ProgressDots";
import CollabCursors from "./CollabCursors";
import type { OptionPreview } from "./data";

export default function FixThis() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRowRef = useRef<HTMLDivElement>(null);

  const { roundIndex, activeRound, completed, card, attempt, locked, feedbackText, selectOption, totalRounds } =
    useFixThis();

  // Hovering an option previews its effect on the real card, temporarily —
  // reset whenever the round changes so a stale preview can't linger.
  const [hoverPreview, setHoverPreview] = useState<OptionPreview | null>(null);
  useEffect(() => {
    setHoverPreview(null);
  }, [roundIndex]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100svh",
        padding: "6rem 2rem 8rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "3.5rem",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, var(--color-border) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <CollabCursors containerRef={sectionRef} anchorRef={cardsRowRef} />

      <div
        ref={headerRef}
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "0.35rem",
        }}
      >
        <span
          style={{
            fontSize: "0.875rem",
            color: "var(--color-muted)",
            letterSpacing: "0.02em",
          }}
        >
          fix this
        </span>
        {activeRound && !completed && (
          <h2
            style={{
              margin: 0,
              maxWidth: "40rem",
              fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
              fontWeight: "bold",
              fontFamily: "var(--font-sans)",
              color: "var(--color-fg)",
            }}
          >
            {activeRound.question}
          </h2>
        )}
        {completed && (
          <h2
            style={{
              margin: 0,
              maxWidth: "40rem",
              fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
              fontWeight: "bold",
              fontFamily: "var(--font-sans)",
              color: "var(--color-accent)",
            }}
          >
            Clear, Honest &amp; Consistent.
          </h2>
        )}
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "2.5rem",
          maxWidth: "60rem",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <ProgressDots roundIndex={roundIndex} total={totalRounds} />

        <div
          ref={cardsRowRef}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "3rem",
          }}
        >
          <div
            style={{
              flex: "1 1 20rem",
              maxWidth: "22rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            <SignupCard card={card} hoverPreview={hoverPreview} />
          </div>

          {activeRound && !completed && (
            <div style={{ flex: "1 1 20rem", maxWidth: "26rem", display: "flex" }}>
              <OptionsPanel
                round={activeRound}
                attempt={attempt}
                locked={locked}
                feedbackText={feedbackText}
                onSelect={selectOption}
                onHoverOption={setHoverPreview}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
