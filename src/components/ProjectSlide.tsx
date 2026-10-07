import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Without `autoResize`, dotlottie-web sizes its canvas's internal bitmap
// once at mount and never matches it to devicePixelRatio, so it gets
// upscaled and looks blurry — same fix as ThingsINotice.tsx.
export const LOTTIE_RENDER_CONFIG = {
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

export type WorkProject = {
  id: string;
  // Placeholder text shown when no real logoImage is set yet. When
  // logoImage IS set, it takes over; when neither logoLabel nor
  // logoImage should render at all, set logoImage to null.
  logoLabel: string;
  logoImage?: string | null;
  title: string;
  // When set, the title becomes a link to the live project (new tab).
  link?: string;
  // Optional — Back Pocket items leave it out entirely.
  meta?: { by: string; under: string; timeline: string };
  // Blank-line-separated ("\n\n") paragraphs render as separate <p>s.
  description: string;
  scope: string;
  learnings: string[];
  // Heading over the `learnings` list — defaults to "Learnings". A
  // product page (e.g. a plugin) uses it as a feature list instead.
  learningsLabel?: string;
  // Optional closing line, shown after the list when expanded.
  note?: string;
  // Longer write-ups (e.g. a Back Pocket project page): titled sections of
  // paragraphs, each optionally followed by its own screenshots, shown
  // when expanded, before the `learnings` list.
  // An image entry is either a plain src (full column width) or an object
  // with its own display width (e.g. a small UI crop kept near native size
  // so it stays sharp) and an optional caption.
  sections?: {
    heading: string;
    paragraphs: string[];
    // `video: true` renders the src as a silent looping clip instead of an image.
    images?: (string | { src: string; width?: string; caption?: string; video?: boolean })[];
    // Optional code snippet shown after the paragraphs, as a preformatted block.
    code?: string;
  }[];
  // Small tool/brand marks shown above the title (e.g. the tools a guide
  // is about), sliding in one after another on load.
  logos?: { src: string; alt: string }[];
  // Files visitors can take away (e.g. a rule set), shown before "Read
  // more" so they're visible without expanding. `all` is an optional
  // single bundle (zip) offered alongside the individual files.
  downloads?: {
    heading: string;
    note?: string;
    // Short "how to use these" steps, shown before the file links.
    // Supports the same inline **bold** / `code` formatting as sections.
    steps?: string[];
    files: { label: string; href: string }[];
    all?: { label: string; href: string };
  };
  // Optional — when missing (content not ready yet), the right side shows
  // two dashed placeholder frames instead of real screenshots.
  // null drops the right column entirely (a text-only write-up).
  images?: { main: string; secondary: string } | null;
  cardVisual: { width: string; height: string; rotate: number };
  imageVisual: { main: ImageVisual; secondary: ImageVisual };
  motionIcons?: MotionIcon[];
  // When set, replaces the right-side stacked screenshots with a single
  // tilted video reel instead.
  rightVideo?: { src: string; width: string };
  // When set, replaces the left "Project card" placeholder with a real
  // image — sized by width only (height auto) so its own aspect ratio
  // decides the box, never cropped or stretched to fit.
  // null drops the left card entirely (no image and no placeholder).
  cardImage?: string | null;
};

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

export function PlaceholderAsset({
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

// Minimal inline markdown for long-form section copy: **bold**, *italic*,
// and `code`. Anything else renders as plain text.
function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code
          key={i}
          style={{
            fontFamily: "inherit",
            fontSize: "0.875em",
            padding: "0.05em 0.3em",
            overflowWrap: "anywhere",
            background: "color-mix(in srgb, var(--color-border) 35%, var(--color-bg))",
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

export default function ProjectSlide({
  project,
  expanded,
  onToggle,
  standalone = false,
}: {
  project: WorkProject;
  expanded: boolean;
  onToggle: () => void;
  // Work page slides are exactly one viewport tall (its scroll-jack track
  // steps in 100vh increments). A standalone slide (Back Pocket item
  // page) scrolls normally instead, so it only needs to be *at least* a
  // viewport tall and clear the fixed navbar — expanded content on a short
  // screen grows the page rather than overflowing it.
  standalone?: boolean;
}) {
  // A long write-up (sections) makes the text column many screens tall —
  // centring the side images against it would leave them floating
  // mid-page, out of view. Pin them in view while the text scrolls instead.
  const pinSides = standalone && !!project.sections?.length;
  // A text-only standalone page (no side columns at all) has empty space
  // either side of the 36rem text — full-width media may break out past the
  // text edges into it, while paragraphs keep their comfortable line
  // length. Any side asset rules it out: the media would run into it.
  const breakout = standalone && project.images === null && project.cardImage === null && !project.rightVideo;
  const sideStyle: React.CSSProperties = pinSides ? { position: "sticky", top: "28vh", alignSelf: "flex-start" } : {};

  return (
    <div
      style={{
        ...(standalone ? { minHeight: "100vh", padding: "7rem 2rem 4rem" } : { height: "100vh", padding: "0 2rem" }),
        width: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
        {project.cardImage === null ? null : project.cardImage ? (
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
            <div className="pp-fade-up hide-on-mobile-tablet" style={{ flex: "0 0 auto", ...sideStyle }}>
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
              // Same as the screenshots column: clipping to the unrotated
              // box would cut off the tilted card's corners once open.
              overflow: expanded ? "visible" : "hidden",
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

        {/* minWidth 0: a flex item defaults to min-width:auto, so a wide child
            (e.g. a code block's longest line) would force this column — and the
            page — wider than the screen instead of letting the <pre> scroll. */}
        <div style={{ flex: "1 1 26rem", minWidth: 0, maxWidth: "36rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
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

          {expanded && project.meta && (
            <p className="pp-fade-up" style={{ margin: 0, fontSize: "0.8125rem", color: "var(--color-muted)" }}>
              Project by: {project.meta.by}
              <span style={{ margin: "0 0.75rem" }}>&bull;</span>
              Project Under: {project.meta.under}
              <span style={{ margin: "0 0.75rem" }}>&bull;</span>
              Timeline: {project.meta.timeline}
            </p>
          )}

          {project.logos && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
              {project.logos.map((logo, i) => (
                <img
                  key={logo.src}
                  src={logo.src}
                  alt={logo.alt}
                  className="slide-logo-in"
                  style={{ width: "2.25rem", height: "2.25rem", animationDelay: `${120 + i * 110}ms` }}
                />
              ))}
            </div>
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
            {project.description.split("\n\n").map((para, i) => (
              <p
                key={para}
                style={{ margin: i === 0 ? 0 : "0.6rem 0 0", fontSize: "0.9375rem", lineHeight: 1.6, color: "var(--color-muted)" }}
              >
                {para}
              </p>
            ))}
          </div>

          <p style={{ margin: 0, fontSize: "1.0625rem", lineHeight: 1.5, fontWeight: "bold", color: "var(--color-fg)" }}>
            {project.scope}
          </p>

          {project.downloads && (
            <div className="bp-downloads">
              <span style={{ fontSize: "0.875rem", color: "var(--color-accent)" }}>{project.downloads.heading}</span>
              {project.downloads.note && (
                <p style={{ margin: 0, fontSize: "0.8125rem", lineHeight: 1.5, color: "var(--color-muted)" }}>
                  {project.downloads.note}
                </p>
              )}
              {project.downloads.steps && (
                <ol
                  style={{
                    margin: "0.2rem 0 0.3rem",
                    paddingLeft: "1.2rem",
                    // Tailwind's preflight strips list markers — restore the numbers.
                    listStyle: "decimal",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.45rem",
                    fontSize: "0.8125rem",
                    lineHeight: 1.55,
                    color: "var(--color-fg)",
                  }}
                >
                  {project.downloads.steps.map((step) => (
                    <li key={step}>{renderInline(step)}</li>
                  ))}
                </ol>
              )}
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: "0.4rem 1.25rem" }}>
                {project.downloads.files.map((file) => (
                  <li key={file.href}>
                    <a href={file.href} download className="work-title-link" style={{ fontSize: "0.875rem" }}>
                      {file.label} <span aria-hidden="true">↓</span>
                    </a>
                  </li>
                ))}
              </ul>
              {project.downloads.all && (
                <a
                  href={project.downloads.all.href}
                  download
                  className="work-read-more"
                  style={{ alignSelf: "flex-start", textDecoration: "none", fontSize: "0.875rem" }}
                >
                  {project.downloads.all.label} <span aria-hidden="true">↓</span>
                </a>
              )}
            </div>
          )}

          {expanded &&
            project.sections?.map((section) => (
              <div key={section.heading} className="pp-fade-up" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.875rem", color: "var(--color-accent)" }}>{section.heading}</span>
                {section.paragraphs.map((para) => (
                  <p key={para} style={{ margin: 0, fontSize: "0.9375rem", lineHeight: 1.6, color: "var(--color-fg)" }}>
                    {renderInline(para)}
                  </p>
                ))}
                {section.code && (
                  <pre
                    style={{
                      margin: "0.4rem 0 0",
                      padding: "1rem 1.1rem",
                      overflowX: "auto",
                      fontFamily: "inherit",
                      fontSize: "0.8125rem",
                      lineHeight: 1.6,
                      color: "var(--color-fg)",
                      background: "color-mix(in srgb, var(--color-border) 22%, var(--color-bg))",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <code>{section.code}</code>
                  </pre>
                )}
                {section.images?.map((entry) => {
                  const img: { src: string; width?: string; caption?: string; video?: boolean } =
                    typeof entry === "string" ? { src: entry } : entry;
                  const mediaStyle: React.CSSProperties = {
                    display: "block",
                    width: img.width ?? "100%",
                    maxWidth: "100%",
                    height: "auto",
                    border: "1px solid var(--color-border)",
                  };
                  return (
                    <figure
                      key={img.src}
                      className={breakout && !img.width ? "slide-breakout" : undefined}
                      style={{ margin: "0.5rem 0 0" }}
                    >
                      {img.video ? (
                        <video src={img.src} autoPlay loop muted playsInline style={mediaStyle} />
                      ) : (
                        <img src={img.src} alt={img.caption ?? ""} loading="lazy" style={mediaStyle} />
                      )}
                      {img.caption && (
                        <figcaption style={{ marginTop: "0.4rem", fontSize: "0.8125rem", color: "var(--color-muted)" }}>
                          {img.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                })}
              </div>
            ))}

          {expanded && (project.learnings.length > 0 || project.note) && (
            <div className="pp-fade-up" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {project.learnings.length > 0 && (
                <span style={{ fontSize: "0.875rem", color: "var(--color-accent)" }}>
                  {project.learningsLabel ?? "Learnings"}
                </span>
              )}
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
              {project.note && (
                <p style={{ margin: "0.6rem 0 0", fontSize: "0.9375rem", lineHeight: 1.5, color: "var(--color-muted)" }}>
                  {project.note}
                </p>
              )}
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
              ...sideStyle,
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
        ) : project.images === null ? null : (
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
              ...sideStyle,
            }}
          >
            {(["secondary", "main"] as const).map((slot) => {
              const visual = project.imageVisual[slot];
              const style: React.CSSProperties = {
                position: "absolute",
                ...(slot === "main" ? { left: 0, top: 0 } : { right: 0, bottom: 0 }),
                width: visual.width,
                transform: `rotate(${visual.rotate}deg) translate(${visual.nudgeX ?? "0"}, ${visual.nudgeY ?? "0"})`,
              };
              return project.images ? (
                <img key={slot} src={project.images[slot]} alt="" style={{ ...style, ...frameStyle(visual.transparentAsset) }} />
              ) : (
                <PlaceholderAsset key={slot} label="Screenshot" style={{ ...style, aspectRatio: "4 / 3" }} />
              );
            })}
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
