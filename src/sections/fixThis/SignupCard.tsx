import type { ButtonPreviewVariant, FieldPreviewVariant, OptionPreview } from "./data";

type CardState = {
  labelsVisible: boolean;
  passwordMessage: string | null;
  buttonFilled: boolean;
};

const fieldStyle = {
  border: "1px solid var(--color-border)",
  padding: "0.7rem 0.9rem",
  fontFamily: "var(--font-sans)",
  fontSize: "0.9375rem",
  color: "var(--color-muted)",
  background: "var(--color-bg)",
  width: "100%",
  boxSizing: "border-box" as const,
};

const labelStyle = {
  fontSize: "0.8125rem",
  color: "var(--color-muted)",
  letterSpacing: "0.02em",
};

export function buttonVariantStyle(variant: ButtonPreviewVariant | "none") {
  switch (variant) {
    case "oneoff":
      return { borderRadius: "999px", background: "#ff5f6d", color: "#fff", border: "1px solid transparent" };
    case "outline":
      return { borderRadius: 0, background: "transparent", color: "var(--color-muted)", border: "1px solid var(--color-border)" };
    case "match":
      return { borderRadius: 0, background: "var(--color-accent)", color: "#fff", border: "1px solid var(--color-accent)" };
    default:
      return { borderRadius: 0, background: "transparent", color: "var(--color-muted)", border: "1px solid var(--color-border)" };
  }
}

export default function SignupCard({
  card,
  hoverPreview,
}: {
  card: CardState;
  hoverPreview: OptionPreview | null;
}) {
  // A hovered option previews its exact effect on the real card, live —
  // falls back to whatever's actually been committed (fixed) so far.
  const emailVariant: FieldPreviewVariant | "none" =
    hoverPreview?.kind === "field" ? hoverPreview.variant : card.labelsVisible ? "real-label" : "none";
  const passwordMessage = hoverPreview?.kind === "message" ? hoverPreview.text : card.passwordMessage;
  const buttonVariant: ButtonPreviewVariant | "none" =
    hoverPreview?.kind === "button" ? hoverPreview.variant : card.buttonFilled ? "match" : "none";

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "22rem",
        border: "1px solid var(--color-border)",
        background: "var(--color-bg)",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}
    >
      <h3
        style={{
          margin: 0,
          fontWeight: "normal",
          fontSize: "1.25rem",
          color: "var(--color-fg)",
        }}
      >
        Create account
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <label style={{ ...labelStyle, opacity: emailVariant === "real-label" ? 1 : 0 }}>Email</label>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="email"
            placeholder="example@fun.com"
            readOnly
            style={{ ...fieldStyle, fontWeight: emailVariant === "bold-placeholder" ? "bold" : "normal" }}
          />
          {emailVariant === "tooltip" && (
            <span
              aria-hidden="true"
              style={{
                flexShrink: 0,
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                border: "1px solid var(--color-muted)",
                color: "var(--color-muted)",
                fontSize: "0.75rem",
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

      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <label style={{ ...labelStyle, opacity: emailVariant === "real-label" ? 1 : 0 }}>Password</label>
        <input type="password" placeholder="*******" readOnly style={fieldStyle} />
        <span
          style={{
            fontSize: "0.8125rem",
            lineHeight: 1.4,
            color: "var(--color-muted)",
            // Reserves room for the longest preview message even if it
            // wraps to two lines — otherwise a short message swapping in
            // for a long one changes the card's height mid-hover, which
            // (since the section centers its content vertically) shifts
            // the whole options list under the cursor and flickers.
            minHeight: "2.3em",
          }}
        >
          {passwordMessage ?? ""}
        </span>
      </div>

      <button
        type="button"
        disabled
        style={{
          appearance: "none",
          padding: "0.75rem 1.25rem",
          fontFamily: "var(--font-sans)",
          fontSize: "0.9375rem",
          cursor: "default",
          transition: "background 220ms ease, border-color 220ms ease, color 220ms ease, border-radius 220ms ease",
          ...buttonVariantStyle(buttonVariant),
        }}
      >
        Create account
      </button>
    </div>
  );
}
