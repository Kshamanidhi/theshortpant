import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";

function ImagineIcon() {
  return (
    <svg viewBox="0 0 48 48" style={{ width: "2.75rem", height: "2.75rem" }} aria-hidden="true">
      <circle cx="22" cy="20" r="14" fill="none" stroke="var(--color-fg)" strokeWidth={2} />
      <circle cx="34" cy="36" r="3.5" fill="none" stroke="var(--color-fg)" strokeWidth={2} />
      <circle cx="41" cy="43" r="1.75" fill="none" stroke="var(--color-fg)" strokeWidth={2} />
    </svg>
  );
}

function ObserveIcon() {
  return (
    <svg viewBox="0 0 48 48" style={{ width: "2.75rem", height: "2.75rem" }} aria-hidden="true">
      <path
        d="M4,24 C10,10 38,10 44,24 C38,38 10,38 4,24 Z"
        fill="none"
        stroke="var(--color-fg)"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24" r="6" fill="var(--color-fg)" />
    </svg>
  );
}

function BuildIcon() {
  return (
    <svg viewBox="0 0 48 48" style={{ width: "2.75rem", height: "2.75rem" }} aria-hidden="true">
      <rect
        x="10"
        y="10"
        width="20"
        height="20"
        fill="none"
        stroke="var(--color-fg)"
        strokeWidth={2}
      />
      <circle cx="32" cy="32" r="10" fill="none" stroke="var(--color-fg)" strokeWidth={2} />
    </svg>
  );
}

const columns = [
  {
    heading: "I imagine",
    Icon: ImagineIcon,
    body: (
      <>
        Before I design something, I usually build it in my head.{" "}
        Sometimes that's preparation. Sometimes it's procrastination. I'm still learning the difference.
      </>
    ),
  },
  {
    heading: "I observe",
    Icon: ObserveIcon,
    body: (
      <>
        I notice tiny things — optical balance, motion timing, interfaces, even conversations around me.{" "}
        My brain quietly collects patterns.
      </>
    ),
  },
  {
    heading: "I build",
    Icon: BuildIcon,
    body: (
      <>
        When I understand something deeply enough, I don't just use it —{" "}
        I try building it: plugins, animations, illustrations, systems.
      </>
    ),
  },
];

export default function HowIThink() {
  const sectionRef = useRef<HTMLElement>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(colRefs.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
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
      style={{ padding: "8rem 2rem", maxWidth: "75rem", margin: "0 auto" }}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-3"
        style={{ gap: "3.5rem" }}
      >
        {columns.map(({ heading, Icon, body }, i) => (
          <div
            key={heading}
            ref={(el) => {
              colRefs.current[i] = el;
            }}
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <Icon />
            <h3
              style={{
                margin: 0,
                fontSize: "1.375rem",
                fontWeight: "normal",
                color: "var(--color-fg)",
              }}
            >
              {heading}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "1rem",
                lineHeight: 1.6,
                color: "var(--color-muted)",
              }}
            >
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
