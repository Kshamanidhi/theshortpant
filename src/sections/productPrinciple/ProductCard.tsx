import { useState, type DragEvent } from "react";
import { ppTheme } from "./theme";
import type { SlotId } from "./data";

type CardState = {
  headline: string | null;
  ctaLabel: string | null;
  ctaRadius: string | null;
};

export default function ProductCard({
  card,
  activeSlot,
  onDropOption,
}: {
  card: CardState;
  activeSlot: SlotId | undefined;
  onDropOption: (optionId: string) => void;
}) {
  const [dragOver, setDragOver] = useState<"headline" | "cta" | null>(null);

  const isHeadlineActive = activeSlot === "headline";
  const isCtaActive = activeSlot === "cta" || activeSlot === "cta-style";

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(null);
    const optionId = e.dataTransfer.getData("text/plain");
    if (optionId) onDropOption(optionId);
  };

  const handleDragOver = (zone: "headline" | "cta") => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(zone);
  };

  return (
    <div
      style={{
        width: "min(100%, 26rem)",
        borderRadius: ppTheme.cardRadius,
        border: ppTheme.border,
        background: "var(--color-bg)",
        padding: "2.5rem 2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      {/* Headline slot */}
      <div
        onDrop={isHeadlineActive ? handleDrop : undefined}
        onDragOver={isHeadlineActive ? handleDragOver("headline") : undefined}
        onDragLeave={() => setDragOver((z) => (z === "headline" ? null : z))}
        className={card.headline ? "pp-pop" : undefined}
        style={{
          minHeight: "3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: card.headline ? "flex-start" : "center",
          borderRadius: ppTheme.slotRadius,
          border: card.headline ? "1px solid transparent" : ppTheme.borderDashed,
          background:
            dragOver === "headline"
              ? "color-mix(in srgb, var(--color-fg) 6%, transparent)"
              : "transparent",
          padding: "0.5rem 0.75rem",
          transition: "background 180ms ease, border-color 240ms ease",
        }}
      >
        {card.headline ? (
          <span
            style={{
              fontSize: "1.375rem",
              lineHeight: 1.25,
              color: "var(--color-fg)",
            }}
          >
            {card.headline}
          </span>
        ) : (
          <span
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              color: "var(--color-border)",
            }}
          >
            HEADLINE
          </span>
        )}
      </div>

      {/* Body — static placeholder, not part of the exercise */}
      <div
        style={{
          minHeight: "2.5rem",
          display: "flex",
          alignItems: "center",
          padding: "0.5rem 0.75rem",
        }}
      >
        <span
          style={{
            fontSize: "0.875rem",
            lineHeight: 1.5,
            color: "var(--color-muted)",
          }}
        >
          A short line of supporting copy goes here.
        </span>
      </div>

      {/* CTA slot */}
      <div
        onDrop={isCtaActive ? handleDrop : undefined}
        onDragOver={isCtaActive ? handleDragOver("cta") : undefined}
        onDragLeave={() => setDragOver((z) => (z === "cta" ? null : z))}
        style={{
          minHeight: "3.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: ppTheme.slotRadius,
          border: card.ctaLabel ? "1px solid transparent" : ppTheme.borderDashed,
          background:
            dragOver === "cta"
              ? "color-mix(in srgb, var(--color-fg) 6%, transparent)"
              : "transparent",
          padding: "0.5rem 0.75rem",
          transition: "background 180ms ease, border-color 240ms ease",
        }}
      >
        {card.ctaLabel ? (
          <span
            className="pp-pop"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: "0.75rem 1.25rem",
              borderRadius: card.ctaRadius ?? ppTheme.buttonRadiusDefault,
              background: "var(--color-fg)",
              color: "var(--color-bg)",
              fontSize: "0.9375rem",
              transition: "border-radius 260ms cubic-bezier(.165,.84,.44,1)",
            }}
          >
            {card.ctaLabel}
          </span>
        ) : (
          <span
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              color: "var(--color-border)",
            }}
          >
            CTA
          </span>
        )}
      </div>
    </div>
  );
}
