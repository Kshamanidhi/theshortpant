import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { useRouter } from "../lib/router";

type ProjectImage = {
  src: string;
  aspect: string;
  // Overrides the CSS default width — used on a "main" image when it's
  // portrait (the default assumes a landscape hero, and a tall portrait
  // at that width could grow the stack into neighboring rows), or on an
  // "accent" image to size it independently of the shared 46% default.
  width?: string;
  // Overrides the CSS default corner position (right: -16%; bottom: -30%)
  // for an "accent" image, so each project can tuck its third screenshot
  // wherever it reads best against that project's specific main shot.
  offset?: { right?: string; bottom?: string };
};
type Project = {
  title: string;
  // Matches a project id in WorkPage.tsx's PROJECTS — the title links to
  // that exact slide on /work rather than just the page in general.
  workId: string;
  description: string;
  images?: {
    main: ProjectImage;
    secondary: ProjectImage;
    // Optional third image, layered peeking from behind the main shot's
    // corner (mirrors the earlier Vault2047 stacked-corner treatment) —
    // for projects that hand over more than two screenshots.
    accent?: ProjectImage;
  };
};

// Placeholder copy — each project needs ONE honest paragraph, not a forced
// insight. If a real project doesn't have a single clean story, cut it
// rather than inventing one.
//
// Each image carries its own real pixel aspect ratio (applied inline,
// overriding the shared CSS default) — screenshots come in at whatever
// ratio they come in at, and forcing a generic one crops them.
const PROJECTS: Project[] = [
  {
    title: "Vault2047",
    workId: "vault2047",
    description:
      "A global ecosystem for conversations, collaboration, and innovation around cybersecurity and digital resilience.",
    images: {
      main: { src: "/wrk-vault1.png", aspect: "1456 / 948" },
      secondary: { src: "/wrk-vault2.png", aspect: "360 / 743" },
    },
  },
  {
    title: "Redesigned a LifeStyle App",
    workId: "lifestyle-app",
    description:
      "One of Dubai's most ambitious lifestyle apps, redesigned from the ground up, then expanded into a property ecosystem.",
    images: {
      main: { src: "/wrk-difc1.png", aspect: "589 / 352" },
      secondary: { src: "/wrk-difc2.png", aspect: "294 / 260" },
    },
  },
  {
    title: "Finance 2045, Global Finance & Fintech Summit",
    workId: "finance2045",
    description:
      "Connecting global capital, financial leaders, and emerging technology to Indonesia's digital economy.",
    images: {
      main: { src: "/wrk-f451.png", aspect: "836 / 544" },
      secondary: { src: "/wrk-f452.png", aspect: "339 / 599" },
      accent: { src: "/wrk-f453.png", aspect: "360 / 628" },
    },
  },
  {
    title: "Donaleb, Employee Wellness & Social Impact Platform",
    workId: "donaleb",
    description:
      "A gamified wellness platform that helps organizations engage employees through fitness challenges, rewards, and charitable giving.",
    images: {
      secondary: { src: "/wrk-dona02.png", aspect: "440 / 946" },
      // All three shots are portrait phone screens — the shared "main"
      // width default assumes a landscape hero, so it's overridden here
      // to keep the stack from growing tall enough to spill into
      // neighboring rows.
      main: { src: "/wrk-dona01.png", aspect: "440 / 945", width: "clamp(10.5rem, 15vw, 13.5rem)" },
      accent: {
        src: "/wrk-dona03.png",
        aspect: "440 / 943",
        width: "62%",
        offset: { right: "-42%", bottom: "-12%" },
      },
    },
  },
];

// Each row occupies this fraction of the pinned viewport height — leaves
// the remainder (100 - ROW_STEP_VH) as the "next project" peek beneath it.
const ROW_STEP_VH = 58;
// Scroll distance (vh) the pin runs for per transition between rows — the
// pacing knob for how gradual the scroll-driven handoff feels.
const SCROLL_PER_STEP_VH = 100;

function ProjectSideImage({
  image,
  accent,
  placeholderClass,
}: {
  image?: ProjectImage;
  accent?: ProjectImage;
  placeholderClass: string;
}) {
  if (!image) {
    return <span className={`work-row-img-el work-row-img-placeholder ${placeholderClass}`} />;
  }

  if (!accent) {
    return (
      <img
        className="work-row-img-el"
        src={image.src}
        style={{ aspectRatio: image.aspect, width: image.width }}
        alt=""
      />
    );
  }

  return (
    <div className="work-row-img-stack" style={{ width: image.width }}>
      <img
        className="work-row-img-stack-accent"
        src={accent.src}
        style={{
          aspectRatio: accent.aspect,
          width: accent.width,
          right: accent.offset?.right,
          bottom: accent.offset?.bottom,
        }}
        alt=""
      />
      <img
        className="work-row-img-stack-main"
        src={image.src}
        style={{ aspectRatio: image.aspect }}
        alt=""
      />
    </div>
  );
}

function ProjectContent({ project }: { project: Project }) {
  const { navigate } = useRouter();

  return (
    <>
      <div
        className={`work-row-img work-row-img-left${project.images ? " work-row-img-left-photo" : ""}`}
        aria-hidden="true"
      >
        <ProjectSideImage
          image={project.images?.secondary}
          placeholderClass="work-row-img-placeholder-light"
        />
      </div>

      <div className="work-row-text">
        <h3
          style={{
            margin: "0 0 0.75rem",
            fontSize: "clamp(1.25rem, 2vw, 1.625rem)",
            fontWeight: "normal",
            color: "var(--color-fg)",
          }}
        >
          <a
            href={`/work#${project.workId}`}
            className="work-title-link"
            onClick={(e) => {
              e.preventDefault();
              navigate("/work");
              window.location.hash = project.workId;
            }}
          >
            {project.title}
          </a>
        </h3>
        <p className="work-row-desc">{project.description}</p>
      </div>

      <div
        className={`work-row-img work-row-img-right${project.images ? " work-row-img-right-photo" : ""}`}
        aria-hidden="true"
      >
        <ProjectSideImage
          image={project.images?.main}
          accent={project.images?.accent}
          placeholderClass="work-row-img-placeholder-dark"
        />
      </div>
    </>
  );
}

function ScrollingWorkList({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const n = PROJECTS.length;

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          const travel = ((n - 1) / n) * 100 * self.progress;
          if (wrapperRef.current) {
            wrapperRef.current.style.transform = `translateY(-${travel}%)`;
          }
        },
      });
      return () => st.kill();
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, n]);

  return (
    <section
      ref={sectionRef}
      style={{ position: "relative", height: `${100 + (n - 1) * SCROLL_PER_STEP_VH}vh` }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div ref={wrapperRef} style={{ height: `${n * ROW_STEP_VH}vh` }}>
          {PROJECTS.map((project) => (
            <div key={project.title} className="work-row" style={{ height: `${ROW_STEP_VH}vh` }}>
              <ProjectContent project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StaticWorkList() {
  return (
    <div className="work-list">
      {PROJECTS.map((project) => (
        <div key={project.title} className="work-row" style={{ minHeight: "20rem", padding: "1.5rem 0" }}>
          <ProjectContent project={project} />
        </div>
      ))}
    </div>
  );
}

export default function SelectedWork() {
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  // The pinned scroll-jack row assumes short, wide-column desktop text —
  // each row's height is a fixed vh slice. At mobile widths the same copy
  // wraps to many more lines and overflows that fixed height, bleeding
  // into the next row. Simplest fix: mobile gets the plain static list,
  // same as reduced-motion users, rather than reworking the pin math for
  // a layout that's being used text-only here anyway.
  const [isMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches
  );
  const useStaticList = reducedMotion || isMobile;

  return (
    <>
      <section id="work" style={{ padding: "8rem 2rem 0", maxWidth: "75rem", margin: "0 auto" }}>
        <h2
          style={{
            margin: 0,
            textAlign: "center",
            fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
            fontWeight: "normal",
            color: "var(--color-fg)",
          }}
        >
          Work
        </h2>
      </section>

      {useStaticList ? (
        <div style={{ padding: "3rem 2rem 8rem", maxWidth: "75rem", margin: "0 auto" }}>
          <StaticWorkList />
        </div>
      ) : (
        <ScrollingWorkList reducedMotion={reducedMotion} />
      )}
    </>
  );
}
