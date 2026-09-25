import { ppTheme } from "./theme";

type Feedback = {
  kind: "principle" | "final";
  title: string;
  message: string;
  status: "success" | "failure";
} | null;

export default function FeedbackBar({ feedback }: { feedback: Feedback }) {
  return (
    <div
      aria-live="polite"
      style={{
        position: "sticky",
        bottom: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        padding: "1.5rem 1rem 0",
      }}
    >
      {feedback && (
        <div
          key={feedback.title + feedback.message}
          className="pp-fade-up"
          style={{
            pointerEvents: "auto",
            width: "min(100%, 34rem)",
            borderTop: `2px solid ${
              feedback.status === "success" ? ppTheme.accentSuccess : ppTheme.accentFailure
            }`,
            background: "var(--color-bg)",
            padding: "0.9rem 1.25rem 1.1rem",
            textAlign: feedback.kind === "final" ? "center" : "left",
          }}
        >
          {feedback.kind === "principle" && (
            <div
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                color:
                  feedback.status === "success" ? ppTheme.accentSuccess : ppTheme.accentFailure,
                marginBottom: "0.35rem",
              }}
            >
              {feedback.status === "success" ? "✓ " : ""}
              {feedback.title}
            </div>
          )}
          {feedback.kind === "final" && (
            <div
              style={{
                fontSize: "1rem",
                letterSpacing: "0.02em",
                color: "var(--color-fg)",
                marginBottom: "0.4rem",
              }}
            >
              {feedback.title}
            </div>
          )}
          <p
            style={{
              margin: 0,
              fontSize: "0.9375rem",
              lineHeight: 1.5,
              color: feedback.kind === "final" ? "var(--color-muted)" : "var(--color-fg)",
            }}
          >
            {feedback.message}
          </p>
        </div>
      )}
    </div>
  );
}
