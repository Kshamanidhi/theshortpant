import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";

const STAGES = ["Idea", "Sketch", "Prototype", "Motion", "Build", "Share"];
const OUTCOMES = ["Wormit", "Plugin", "Portfolio", "AI experiment", "Illustration", "Motion"];

const ROW_HEIGHT = 96;
const LINE_X = 30;

const TIMELINE_HEIGHT = ROW_HEIGHT * (STAGES.length - 1);

export default function ThingsIBuild() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 60%",
          scrub: 0.5,
        },
      });

      tl.fromTo(
        pathRef.current,
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 1, ease: "none" },
        0
      );

      nodeRefs.current.forEach((node, i) => {
        if (!node) return;
        const frac = i / (STAGES.length - 1);
        tl.fromTo(
          node,
          { scale: 0, transformOrigin: "center" },
          { scale: 1, duration: 0.08, ease: "back.out(2)" },
          frac * 0.92
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ padding: "8rem 2rem", maxWidth: "75rem", margin: "0 auto" }}
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
        Things I Build
      </p>
      <h2
        style={{
          margin: "0 0 4rem",
          fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
          fontWeight: "normal",
          color: "var(--color-fg)",
        }}
      >
        How ideas become artifacts.
      </h2>

      <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
        {/* Timeline */}
        <div style={{ position: "relative", width: "16rem", flexShrink: 0 }}>
          <svg
            width={60}
            height={TIMELINE_HEIGHT + 20}
            style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
            aria-hidden="true"
          >
            <path
              ref={pathRef}
              d={`M${LINE_X},0 L${LINE_X},${TIMELINE_HEIGHT}`}
              stroke="var(--color-fg)"
              strokeWidth={2}
              fill="none"
            />
            {STAGES.map((_, i) => (
              <circle
                key={i}
                ref={(el) => {
                  nodeRefs.current[i] = el;
                }}
                cx={LINE_X}
                cy={i * ROW_HEIGHT}
                r={7}
                fill="var(--color-bg)"
                stroke="var(--color-fg)"
                strokeWidth={2}
              />
            ))}
          </svg>

          {STAGES.map((stage, i) => (
            <div
              key={stage}
              style={{
                position: "absolute",
                left: "3.5rem",
                top: i * ROW_HEIGHT - 10,
                fontSize: "1.0625rem",
                color: "var(--color-fg)",
              }}
            >
              {stage}
            </div>
          ))}

          <div style={{ height: TIMELINE_HEIGHT + 20 }} />
        </div>

        {/* Outcomes */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignContent: "flex-start",
            gap: "0.625rem",
            flex: 1,
            minWidth: "16rem",
          }}
        >
          {OUTCOMES.map((outcome) => (
            <span
              key={outcome}
              style={{
                fontSize: "0.875rem",
                color: "var(--color-fg)",
                border: "1px solid var(--color-fg)",
                borderRadius: "999px",
                padding: "0.375rem 1rem",
              }}
            >
              {outcome}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
