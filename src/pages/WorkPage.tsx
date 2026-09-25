import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Without `autoResize`, dotlottie-web sizes its canvas's internal bitmap
// once at mount and never matches it to devicePixelRatio, so it gets
// upscaled and looks blurry — same fix as ThingsINotice.tsx.
const LOTTIE_RENDER_CONFIG = {
  autoResize: true,
  devicePixelRatio: typeof window !== "undefined" ? Math.max(window.devicePixelRatio || 1, 2) : 2,
};

// Each project's card/image assets carry their own size, tilt, and float —
// no shared default, so every project reads as its own physical stack of
// paper rather than the same template redrawn with new pictures.
// `transparentAsset` flags a PNG that has real transparent padding around
// its content (a mockup graphic sitting inside a larger canvas) rather
// than filling its full frame — those get a drop-shadow that follows the
// actual silhouette instead of a border/background that would otherwise
// show up as a visible rectangular patch through the empty margin.
type ImageVisual = { width: string; rotate: number; nudgeX?: string; nudgeY?: string; transparentAsset?: boolean };
type MotionIcon = {
  src: string;
  size: string;
  rotate?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
};

type WorkProject = {
  id: string;
  // Placeholder text shown when no real logoImage is set yet. When
  // logoImage IS set, it takes over; when neither logoLabel nor
  // logoImage should render at all, set logoImage to null.
  logoLabel: string;
  logoImage?: string | null;
  title: string;
  // When set, the title becomes a link to the live project (new tab).
  link?: string;
  meta: { by: string; under: string; timeline: string };
  description: string;
  scope: string;
  learnings: string[];
  images: { main: string; secondary: string };
  cardVisual: { width: string; height: string; rotate: number };
  imageVisual: { main: ImageVisual; secondary: ImageVisual };
  motionIcons?: MotionIcon[];
  // When set, replaces the right-side stacked screenshots with a single
  // tilted video reel instead.
  rightVideo?: { src: string; width: string };
  // When set, replaces the left "Project card" placeholder with a real
  // image — sized by width only (height auto) so its own aspect ratio
  // decides the box, never cropped or stretched to fit.
  cardImage?: string;
};

// Copy grounded in what was actually described for each project — no
// invented metrics. Logo and project-card are dummy placeholders until
// real assets land; the two screenshots per
// project are the real ones already used on the homepage's Work section.
const PROJECTS: WorkProject[] = [
  {
    id: "vault2047",
    logoLabel: "VAULT2047",
    logoImage: "/logo-vault.png",
    title: "Vault2047",
    meta: { by: "Trescon", under: "Wormit", timeline: "March 26 - May 26" },
    description:
      "A summit in Mumbai for everyone working on cyber defense: policymakers, CISOs, founders, and investors, all in one place. Tickets, speakers, the full agenda, all running through this site.",
    scope:
      "I built the website and the whole digital experience for the summit, staying inside their brand's rules the whole way.",
    learnings: [
      "Had to make this feel credible, not stiff.",
      "So much event info, had to make it findable.",
      "Plugged in a ticketing system I didn't build, made it feel like mine.",
      "One page, six kinds of people, all wanting something different from it.",
    ],
    images: { main: "/wrk-vault1.png", secondary: "/wrk-vault2.png" },
    cardImage: "/wrk-v-wrk2.png",
    cardVisual: { width: "11rem", height: "15rem", rotate: -4 },
    imageVisual: {
      main: { width: "92%", rotate: -3, transparentAsset: true },
      secondary: { width: "68%", rotate: 3, transparentAsset: true },
    },
  },
  {
    id: "finance2045",
    logoLabel: "FINANCE 2045",
    logoImage: "/logo-finance.png",
    title: "Finance 2045, Global Finance & Fintech Summit",
    meta: { by: "Trescon", under: "Wormit", timeline: "May 26 - Jun 26" },
    description:
      "A finance summit in Jakarta, bringing CFOs, regulators, central bankers, and fintech founders together to figure out where Indonesia's financial system is headed next. Same setup as Vault, tickets, speakers, agenda, themes, all through this site.",
    scope:
      "I built the website and the digital experience for this summit, working inside a brand system that was already locked in.",
    learnings: [
      "Ten themes competing for the same page, had to give each one room to breathe.",
      "A speaker list this long, had to stay scannable, not a wall of names.",
      "Big numbers doing the selling here, had to make them land without sounding like a pitch deck.",
      "One page, pulling double duty for a regulator and an investor at the same time.",
    ],
    images: { main: "/wrk-f451.png", secondary: "/wrk-f452.png" },
    cardImage: "/wrk-f453.png",
    cardVisual: { width: "10.5rem", height: "14rem", rotate: 5 },
    imageVisual: {
      main: { width: "90%", rotate: 4, nudgeY: "-0.5rem", transparentAsset: true },
      secondary: { width: "64%", rotate: -5, nudgeX: "-0.5rem", transparentAsset: true },
    },
  },
  {
    id: "lifestyle-app",
    logoLabel: "LIFESTYLE APP",
    logoImage: null,
    title: "Redesigned a Lifestyle App",
    link: "https://wormit.co/blog-difc.html",
    meta: { by: "DIFC", under: "Magure INC", timeline: "Apr 25 - June 26" },
    description:
      "An all-in-one app for everyone inside DIFC, Dubai's financial district — employees, guests, students — so they can find services, get around, and grab perks without switching between five different apps.",
    scope:
      "My role was product and motion designer. I helped the team build a design system and keep it consistent across light and dark theme, along with the motion icons.",
    learnings: [
      "One app, three different people using it for three different reasons.",
      "A design system had to hold up in both light and dark, not just look good in one.",
      "Motion icons, small details, but they're the first thing that makes an app feel alive.",
      "A financial district trying to feel more like a lifestyle brand, had to walk that line carefully.",
    ],
    images: { main: "/wrk-difc1.png", secondary: "/wrk-difc2.png" },
    cardImage: "/wrk-difc-wrk1.png",
    cardVisual: { width: "12rem", height: "16rem", rotate: -6 },
    imageVisual: {
      main: { width: "75%", rotate: -2 },
      secondary: { width: "60%", rotate: 6, nudgeY: "0.75rem" },
    },
    // The motion icons this project is actually known for — placed low in
    // the slide, one near the project card and one near the screenshots,
    // as a quiet flourish rather than crowding the reveal itself.
    motionIcons: [
      { src: "/home-major-ug-animation.json", size: "6rem", rotate: -5, left: "14rem", bottom: "9rem" },
      { src: "/city-lounge-animation.json", size: "5.5rem", rotate: 7, right: "10rem", bottom: "9rem" },
    ],
  },
  {
    id: "donaleb",
    logoLabel: "DONALEB",
    logoImage: "/logo-donaleb.png",
    title: "Donaleb, Employee Wellness & Social Impact Platform",
    link: "https://www.donaleb.com/",
    meta: { by: "Yasmine Darwich", under: "Freelance", timeline: "Oct 23" },
    description:
      "A fitness app for companies: employees log steps and activity, compete on leaderboards, unlock badges, and turn their progress into real donations for causes the company supports.",
    scope:
      "I redesigned the app as product designer, contests, leaderboards, donations, badges, admin dashboard, plus the splash screen and character animation.",
    learnings: [
      "Fitness, competition, and charity: three different motivations, one app to hold them all.",
      "A leaderboard has to feel fun, not stressful, for people who aren't naturally competitive.",
      "Progress badges, small reward, but had to actually feel earned.",
      "A splash screen is three seconds, tops, still had to make a character feel alive in that window.",
      "An admin dashboard is a completely different user than the employee using the app, same product, two very different jobs to design for.",
    ],
    images: { main: "/wrk-dona01.png", secondary: "/wrk-dona03.png" },
    cardImage: "/wrk-dona02.png",
    cardVisual: { width: "10rem", height: "14.5rem", rotate: 6 },
    imageVisual: {
      main: { width: "68%", rotate: -6, nudgeX: "0.5rem", transparentAsset: true },
      secondary: { width: "72%", rotate: 2, transparentAsset: true },
    },
    rightVideo: { src: "/DonaLeb_Reel_01_1.mp4", width: "11rem" },
  },
];

// A transparent-padded asset (mockup graphic sitting inside a larger
// canvas) gets a drop-shadow that follows its own silhouette — a
// border/background would draw a rectangle around the full canvas,
// showing as a visible patch through the empty margin. A fully-opaque
// photo just gets the usual thin border + background frame.
function frameStyle(transparentAsset?: boolean): React.CSSProperties {
  return transparentAsset
    ? { filter: "drop-shadow(0 0.5rem 1.25rem rgba(0, 0, 0, 0.1))" }
    : { border: "1px solid var(--color-border)", background: "var(--color-bg)" };
}

function PlaceholderAsset({
  label,
  style,
  className,
}: {
  label: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        border: "1px dashed var(--color-border)",
        background: "color-mix(in srgb, var(--color-border) 8%, var(--color-bg))",
        color: "var(--color-muted)",
        fontSize: "0.6875rem",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0.5rem",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {label}
    </div>
  );
}

function ProjectSlide({
  project,
  expanded,
  onToggle,
}: {
  project: WorkProject;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 2rem",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "78rem",
          gap: "2.5rem",
        }}
      >
        {project.cardImage ? (
          // Rendered standalone (no fixed-size overflow:hidden wrapper) —
          // a rotated image needs a larger bounding box than its own
          // width/height, and clipping it to a box sized for the
          // unrotated image cuts off its edges. Width drives height via
          // the image's own aspect ratio, so nothing is cropped or
          // stretched either.
          expanded && (
            // pp-fade-up itself animates `transform` (translateY) — putting
            // it on the same element as the rotate would let the animation
            // silently overwrite the rotate. Split across two elements
            // instead: this wrapper fades in, the inner img stays rotated.
            <div className="pp-fade-up hide-on-mobile-tablet" style={{ flex: "0 0 auto" }}>
              <img
                src={project.cardImage}
                alt=""
                style={{
                  display: "block",
                  width: project.cardVisual.width,
                  height: "auto",
                  // drop-shadow (not box-shadow) follows the image's own
                  // opaque pixels — box-shadow would shadow the full
                  // rectangular box, showing as a patch through any
                  // transparent padding. No `background` either, for the
                  // same reason: it'd paint an opaque rectangle behind
                  // transparent corners instead of letting them stay clear.
                  filter: "drop-shadow(0 0.5rem 1.25rem rgba(0, 0, 0, 0.1))",
                  transform: `rotate(${project.cardVisual.rotate}deg)`,
                }}
              />
            </div>
          )
        ) : (
          <div
            className="hide-on-mobile-tablet"
            style={{
              flex: "0 0 auto",
              width: expanded ? project.cardVisual.width : "0",
              opacity: expanded ? 1 : 0,
              transition: "width 500ms cubic-bezier(.165,.84,.44,1), opacity 400ms ease",
              overflow: "hidden",
            }}
          >
            <PlaceholderAsset
              label="Project card"
              style={{
                width: project.cardVisual.width,
                height: project.cardVisual.height,
                transform: `rotate(${project.cardVisual.rotate}deg)`,
              }}
            />
          </div>
        )}

        <div style={{ flex: "1 1 26rem", maxWidth: "36rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          {project.logoImage === null ? null : project.logoImage ? (
            <img
              src={project.logoImage}
              alt=""
              className="hide-on-mobile-tablet"
              style={{ width: "9rem", height: "auto", alignSelf: "flex-start" }}
            />
          ) : (
            <PlaceholderAsset
              label={project.logoLabel}
              className="hide-on-mobile-tablet"
              style={{ width: "9rem", height: "3.25rem", alignSelf: "flex-start" }}
            />
          )}

          {expanded && (
            <p className="pp-fade-up" style={{ margin: 0, fontSize: "0.8125rem", color: "var(--color-muted)" }}>
              Project by: {project.meta.by}
              <span style={{ margin: "0 0.75rem" }}>&bull;</span>
              Project Under: {project.meta.under}
              <span style={{ margin: "0 0.75rem" }}>&bull;</span>
              Timeline: {project.meta.timeline}
            </p>
          )}

          <div>
            <h2
              style={{
                margin: "0 0 0.65rem",
                fontSize: "clamp(1.375rem, 2.25vw, 1.875rem)",
                fontWeight: "normal",
                color: "var(--color-fg)",
              }}
            >
              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="work-title-link"
                >
                  {project.title}
                </a>
              ) : (
                project.title
              )}
            </h2>
            <p style={{ margin: 0, fontSize: "0.9375rem", lineHeight: 1.6, color: "var(--color-muted)" }}>
              {project.description}
            </p>
          </div>

          <p style={{ margin: 0, fontSize: "1.0625rem", lineHeight: 1.5, fontWeight: "bold", color: "var(--color-fg)" }}>
            {project.scope}
          </p>

          {expanded && (
            <div className="pp-fade-up" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.875rem", color: "var(--color-accent)" }}>Learnings</span>
              {project.learnings.map((line) => (
                <p
                  key={line}
                  style={{
                    margin: 0,
                    display: "flex",
                    gap: "0.6rem",
                    fontSize: "0.9375rem",
                    lineHeight: 1.5,
                    color: "var(--color-fg)",
                  }}
                >
                  <span aria-hidden="true" style={{ color: "var(--color-accent)" }}>
                    &bull;
                  </span>
                  <span>{line}</span>
                </p>
              ))}
            </div>
          )}

          <button type="button" onClick={onToggle} className="work-read-more" style={{ alignSelf: "flex-start" }}>
            {expanded ? "Read less" : "Read more"} <span aria-hidden="true">{expanded ? "←" : "→"}</span>
          </button>
        </div>

        {project.rightVideo ? (
          <div
            className="hide-on-mobile-tablet"
            style={{
              flex: "0 0 auto",
              width: expanded ? project.rightVideo.width : "0",
              opacity: expanded ? 1 : 0,
              transition: "width 500ms cubic-bezier(.165,.84,.44,1), opacity 400ms ease",
              overflow: "hidden",
            }}
          >
            {/* No fixed height and no object-fit crop — the wrapper's
                width drives the height via the video's own aspect ratio,
                so the full frame is always visible, never cropped. */}
            <video
              src={project.rightVideo.src}
              autoPlay
              loop
              muted
              playsInline
              style={{
                display: "block",
                width: project.rightVideo.width,
                height: "auto",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg)",
                boxShadow: "0 0.5rem 1.25rem rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>
        ) : (
          <div
            className="hide-on-mobile-tablet"
            style={{
              flex: "0 0 auto",
              width: expanded ? "15rem" : "0",
              height: "13rem",
              opacity: expanded ? 1 : 0,
              transition: "width 500ms cubic-bezier(.165,.84,.44,1), opacity 400ms ease",
              // visible, not hidden — a rotated image's bounding box is
              // larger than its own width/height, and clipping to this
              // box (sized for the unrotated image) cut off its edges.
              overflow: expanded ? "visible" : "hidden",
              position: "relative",
            }}
          >
            <img
              src={project.images.secondary}
              alt=""
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: project.imageVisual.secondary.width,
                transform: `rotate(${project.imageVisual.secondary.rotate}deg) translate(${
                  project.imageVisual.secondary.nudgeX ?? "0"
                }, ${project.imageVisual.secondary.nudgeY ?? "0"})`,
                ...frameStyle(project.imageVisual.secondary.transparentAsset),
              }}
            />
            <img
              src={project.images.main}
              alt=""
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: project.imageVisual.main.width,
                transform: `rotate(${project.imageVisual.main.rotate}deg) translate(${
                  project.imageVisual.main.nudgeX ?? "0"
                }, ${project.imageVisual.main.nudgeY ?? "0"})`,
                ...frameStyle(project.imageVisual.main.transparentAsset),
              }}
            />
          </div>
        )}
      </div>

      {expanded &&
        project.motionIcons?.map((icon) => (
          <div
            key={icon.src}
            className="pp-fade-up hide-on-mobile-tablet"
            style={{
              position: "absolute",
              top: icon.top,
              left: icon.left,
              right: icon.right,
              bottom: icon.bottom,
              width: `calc(${icon.size} + 3rem)`,
              height: `calc(${icon.size} + 3rem)`,
              padding: "1.5rem",
              boxSizing: "border-box",
              background: "var(--color-accent)",
              transform: `rotate(${icon.rotate ?? 0}deg)`,
            }}
          >
            <DotLottieReact
              src={icon.src}
              autoplay
              loop
              renderConfig={LOTTIE_RENDER_CONFIG}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        ))}
    </div>
  );
}

// A homepage project link (e.g. "/work#donaleb") should land directly on
// that project's slide, not always slide 0 — resolved once up front so the
// very first paint is already correct instead of flashing slide 0 then
// jumping.
function initialIndexFromHash(): number {
  if (typeof window === "undefined") return 0;
  const id = window.location.hash.slice(1);
  const idx = PROJECTS.findIndex((p) => p.id === id);
  return idx >= 0 ? idx : 0;
}

export default function WorkPage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(initialIndexFromHash());
  const isAnimatingRef = useRef(false);
  const [expanded, setExpanded] = useState<boolean[]>(() => PROJECTS.map(() => false));

  // Set through GSAP (not a raw inline `transform` style) so GSAP's own
  // transform cache starts out correctly. A plain CSS transform survives
  // fine on screen, but the *next* gsap.to({ yPercent }) call reads GSAP's
  // internal cache rather than the DOM — if that cache was never
  // initialized, it treats the untouched-by-GSAP starting point as 0 and
  // the first tween lands compounded on top of the real position instead
  // of replacing it (jumping to the wrong slide, sometimes out of range).
  useLayoutEffect(() => {
    if (indexRef.current > 0) {
      gsap.set(trackRef.current, { yPercent: (-100 * indexRef.current) / PROJECTS.length });
    }
  }, []);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    function goTo(next: number) {
      const clamped = Math.max(0, Math.min(PROJECTS.length - 1, next));
      if (clamped === indexRef.current || isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      indexRef.current = clamped;
      gsap.to(trackRef.current, {
        // yPercent is relative to the track's OWN height (N slides tall),
        // not the viewport — so one slide-step is 100/N percent, not 100.
        yPercent: (-100 * clamped) / PROJECTS.length,
        duration: 0.85,
        ease: "power2.inOut",
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      if (isAnimatingRef.current || Math.abs(e.deltaY) < 12) return;
      goTo(indexRef.current + (e.deltaY > 0 ? 1 : -1));
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        goTo(indexRef.current + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goTo(indexRef.current - 1);
      }
    }

    let touchStartY = 0;
    function onTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0].clientY;
    }
    function onTouchEnd(e: TouchEvent) {
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 40) return;
      goTo(indexRef.current + (delta > 0 ? 1 : -1));
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div style={{ height: "100vh", overflow: "hidden", position: "relative" }}>
      <div
        ref={trackRef}
        style={{
          height: `${PROJECTS.length * 100}vh`,
        }}>
        {PROJECTS.map((project, i) => (
          <ProjectSlide
            key={project.id}
            project={project}
            expanded={expanded[i]}
            onToggle={() => setExpanded((prev) => prev.map((v, idx) => (idx === i ? !v : v)))}
          />
        ))}
      </div>
    </div>
  );
}
