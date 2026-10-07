import { useCallback, useEffect, useState } from "react";
import { useRouter } from "../../lib/router";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { LOTTIE_RENDER_CONFIG, PlaceholderAsset } from "../../components/ProjectSlide";
import { BACK_POCKET_ITEMS, type BackPocketItem } from "./data";

function CardFace({ item, width }: { item: BackPocketItem; width: string }) {
  const { image, video, lottie, aspect } = item.card;
  const style: React.CSSProperties = { width, aspectRatio: aspect, objectFit: "cover" };
  if (lottie)
    return (
      // Transparent-background animation — a light tinted ground keeps it
      // reading as a card face rather than a character floating on white.
      // "cover" zooms the square animation to fill the card's taller frame.
      <div style={{ ...style, background: "color-mix(in srgb, var(--color-border) 18%, var(--color-bg))" }}>
        <DotLottieReact
          src={lottie}
          autoplay
          loop
          renderConfig={LOTTIE_RENDER_CONFIG}
          layout={{ fit: "cover", align: [0.5, 0.5] }}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  if (video) return <video src={video} autoPlay loop muted playsInline style={{ display: "block", ...style }} />;
  if (image) return <img src={image} alt="" style={{ display: "block", ...style }} />;
  return <PlaceholderAsset label={item.kind} style={style} />;
}

function PreviewOverlay({ item, onClose }: { item: BackPocketItem; onClose: () => void }) {
  const { preview } = item;
  const text = preview?.text;
  const aspect = preview?.aspect ?? item.card.aspect;
  const [aw, ah] = aspect.split("/").map(Number);
  const isLandscape = aw > ah;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="bp-overlay" role="dialog" aria-modal="true" aria-label={item.title} onClick={onClose}>
      <button type="button" className="bp-overlay-close" onClick={onClose}>
        close <span aria-hidden="true">×</span>
      </button>
      {/* Clicks on the figure itself don't close — only the backdrop does. */}
      {/* Capped by height too (via the image's own aspect ratio, leaving
          room for any write-up below it), so a portrait piece never runs
          off the bottom of a short viewport. Landscape pieces get more
          width to stay legible. */}
      <figure
        className="bp-overlay-figure"
        style={{
          width: `min(${isLandscape ? "46rem" : "32rem"}, 100%, calc((100vh - ${text ? "22rem" : "10rem"}) * ${aspect}))`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {preview?.image ? (
          <img src={preview.image} alt={item.title} style={{ display: "block", width: "100%", aspectRatio: aspect }} />
        ) : (
          <CardFace item={item} width="100%" />
        )}
        <figcaption style={{ marginTop: "0.9rem", display: "flex", justifyContent: "space-between", gap: "1rem" }}>
          <span style={{ color: "var(--color-fg)" }}>{item.title}</span>
          <span style={{ color: "var(--color-muted)" }}>{item.kind}</span>
        </figcaption>
        {text?.map((para) => (
          <p key={para} style={{ margin: "0.6rem 0 0", fontSize: "0.875rem", lineHeight: 1.55, color: "var(--color-muted)" }}>
            {para}
          </p>
        ))}
      </figure>
    </div>
  );
}

export default function BackPocketPage() {
  const { navigate } = useRouter();
  const [previewItem, setPreviewItem] = useState<BackPocketItem | null>(null);
  const closePreview = useCallback(() => setPreviewItem(null), []);

  return (
    <div style={{ minHeight: "100vh", padding: "8rem 2rem 6rem", boxSizing: "border-box" }}>
      <header className="pp-fade-up" style={{ textAlign: "center", marginBottom: "4.5rem" }}>
        <span style={{ fontSize: "0.875rem", color: "var(--color-muted)", letterSpacing: "0.02em" }}>back pocket</span>
        <h1
          style={{
            margin: "0.35rem auto 0",
            maxWidth: "40rem",
            fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
            fontWeight: "bold",
            color: "var(--color-fg)",
          }}
        >
          Plugins, animations, illustrations, and other things I made on the side.
        </h1>
      </header>

      <div className="bp-field">
        {BACK_POCKET_ITEMS.map((item, i) => {
          const { card } = item;
          const caption = (
            <span className="bp-card-caption">
              <span>{item.title}</span>
              <span style={{ color: "var(--color-muted)", fontSize: "0.8125rem" }}>
                {item.kind}
                {item.detail && <span aria-hidden="true"> →</span>}
              </span>
            </span>
          );
          const cardBody = (
            <>
              <CardFace item={item} width={card.width} />
              {caption}
            </>
          );
          const cardStyle = { "--bp-rotate": `${card.rotate}deg`, width: card.width } as React.CSSProperties;

          // Three layers, because each one owns a different `transform`:
          // the entrance fade-up, the endless drift, and the card's own
          // tilt (which straightens on hover). Stacking them on one
          // element would let each animation overwrite the others.
          return (
            <div
              key={item.id}
              className="pp-fade-up"
              style={{ animationDelay: `${120 + i * 70}ms`, marginTop: card.nudgeY, marginLeft: card.nudgeX }}
            >
              <div
                className="bp-drift"
                style={{ animationDuration: `${card.driftDuration}s`, animationDelay: `${card.driftDelay}s` }}
              >
                {item.detail ? (
                  <a
                    href={`/back-pocket/${item.id}`}
                    className="bp-card"
                    style={cardStyle}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/back-pocket/${item.id}`);
                      window.scrollTo({ top: 0 });
                    }}
                  >
                    {cardBody}
                  </a>
                ) : (
                  <button type="button" className="bp-card" style={cardStyle} onClick={() => setPreviewItem(item)}>
                    {cardBody}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {previewItem && <PreviewOverlay item={previewItem} onClose={closePreview} />}
    </div>
  );
}
