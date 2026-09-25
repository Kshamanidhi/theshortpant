import { useState } from "react";
import type { ButtonPreviewVariant, FieldPreviewVariant, OptionPreview, Round, RoundOption } from "./data";

const fieldMockStyle = {
  border: "1px solid var(--color-border)",
  padding: "0.4rem 0.55rem",
  fontFamily: "var(--font-sans)",
  fontSize: "0.75rem",
  color: "var(--color-muted)",
  background: "var(--color-bg)",
  width: "100%",
  boxSizing: "border-box" as const,
};

function MiniFieldPreview({ variant }: { variant: FieldPreviewVariant }) {
  return (
    <div
      aria-hidden
      style={{
        flex: "0 0 auto",
        width: "6.5rem",
        border: "1px solid var(--color-border)",
        background: "color-mix(in srgb, var(--color-border) 12%, var(--color-bg))",
        padding: "0.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.3rem",
        pointerEvents: "none",
      }}
    >
      {variant === "real-label" && (
        <span style={{ fontSize: "0.625rem", color: "var(--color-muted)" }}>Email</span>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
        <div style={{ ...fieldMockStyle, fontWeight: variant === "bold-placeholder" ? "bold" : "normal" }}>
          Email
        </div>
        {variant === "tooltip" && (
          <span
            style={{
              flexShrink: 0,
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "1px solid var(--color-muted)",
              color: "var(--color-muted)",
              fontSize: "0.5625rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ?
          </span>
        )}
      </div>
    </div>
  );
}

function MiniMessagePreview({ text }: { text: string }) {
  return (
    <div
      aria-hidden
      style={{
        flex: "0 0 auto",
        width: "6.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.35rem",
        pointerEvents: "none",
      }}
    >
      <div style={{ ...fieldMockStyle, color: "transparent" }}>••••••</div>
      <span style={{ fontSize: "0.625rem", lineHeight: 1.35, color: "var(--color-muted)" }}>{text}</span>
    </div>
  );
}

function buttonPreviewStyle(variant: ButtonPreviewVariant) {
  switch (variant) {
    case "oneoff":
      return { borderRadius: "999px", background: "#ff5f6d", color: "#fff", border: "none" };
    case "outline":
      return {
        borderRadius: 0,
        background: "transparent",
        color: "var(--color-muted)",
        border: "1px solid var(--color-border)",
      };
    case "match":
      return { borderRadius: 0, background: "var(--color-accent)", color: "#fff", border: "none" };
  }
}

function MiniButtonPreview({ variant }: { variant: ButtonPreviewVariant }) {
  return (
    <div
      aria-hidden
      style={{
        flex: "0 0 auto",
        width: "6.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.6875rem",
          padding: "0.4rem 0.75rem",
          textAlign: "center",
          ...buttonPreviewStyle(variant),
        }}
      >
        Create account
      </span>
    </div>
  );
}

function OptionPreviewMock({ preview }: { preview: OptionPreview }) {
  if (preview.kind === "field") return <MiniFieldPreview variant={preview.variant} />;
  if (preview.kind === "message") return <MiniMessagePreview text={preview.text} />;
  return <MiniButtonPreview variant={preview.variant} />;
}

export default function OptionsPanel({
  round,
  attempt,
  locked,
  feedbackText,
  onSelect,
  onHoverOption,
}: {
  round: Round;
  attempt: { optionId: string; status: "correct" | "wrong" } | null;
  locked: boolean;
  feedbackText: string | null;
  onSelect: (option: RoundOption) => void;
  onHoverOption: (preview: OptionPreview | null) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  function handleEnter(option: RoundOption) {
    if (locked) return;
    setHoveredId(option.id);
    onHoverOption(option.preview ?? null);
  }

  function handleLeave() {
    setHoveredId(null);
    onHoverOption(null);
  }

  return (
    <div
      key={round.id}
      className="pp-fade-up"
      style={{
        width: "100%",
        maxWidth: "26rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.9375rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--color-accent)",
        }}
      >
        {round.title}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {round.options.map((option) => {
          const isAttempt = attempt?.optionId === option.id;
          const isWrongFlash = isAttempt && attempt?.status === "wrong";
          const isCorrectFlash = isAttempt && attempt?.status === "correct";
          const isHovered = hoveredId === option.id && !locked && !isAttempt;

          return (
            <button
              key={option.id}
              type="button"
              disabled={locked}
              onClick={() => onSelect(option)}
              onMouseEnter={() => handleEnter(option)}
              onMouseLeave={handleLeave}
              className={isWrongFlash ? "pp-shake" : undefined}
              style={{
                appearance: "none",
                textAlign: "left",
                fontFamily: "var(--font-sans)",
                fontSize: "0.9375rem",
                lineHeight: 1.4,
                color: "var(--color-fg)",
                padding: "0.85rem 1rem",
                border: isCorrectFlash
                  ? "1px solid var(--color-accent)"
                  : isWrongFlash
                    ? "1.5px solid var(--color-fg)"
                    : isHovered
                      ? "1px solid var(--color-fg)"
                      : "1px solid var(--color-border)",
                background: isCorrectFlash
                  ? "color-mix(in srgb, var(--color-accent) 10%, var(--color-bg))"
                  : isWrongFlash
                    ? "color-mix(in srgb, var(--color-fg) 6%, var(--color-bg))"
                    : isHovered
                      ? "color-mix(in srgb, var(--color-fg) 4%, var(--color-bg))"
                      : "var(--color-bg)",
                cursor: locked ? "default" : "pointer",
                opacity: locked && !isCorrectFlash ? 0.5 : 1,
                transform: isHovered ? "translateX(2px)" : "translateX(0)",
                transition: "background 180ms ease, border-color 180ms ease, opacity 200ms ease, transform 180ms ease",
              }}
            >
              {option.preview ? (
                <span style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                  <OptionPreviewMock preview={option.preview} />
                  <span>{option.label}</span>
                </span>
              ) : (
                option.label
              )}
            </button>
          );
        })}
      </div>

      {feedbackText && (
        <p
          className="pp-fade-up"
          style={{
            margin: 0,
            fontSize: "0.875rem",
            lineHeight: 1.5,
            color: "var(--color-muted)",
          }}
        >
          {feedbackText}
        </p>
      )}
    </div>
  );
}
