import { useState, type DragEvent } from "react";
import type { PrincipleStage } from "./data";

export default function ElementPicker({
  stage,
  usedOptionIds,
  attempt,
  onActivate,
}: {
  stage: PrincipleStage;
  usedOptionIds: Set<string>;
  attempt: { optionId: string; status: "success" | "failure" } | null;
  onActivate: (optionId: string) => void;
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  return (
    <div
      key={stage.id}
      className="pp-fade-up"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.25rem",
        width: "100%",
      }}
    >
      <p
        style={{
          margin: 0,
          maxWidth: "28rem",
          textAlign: "center",
          fontSize: "0.9375rem",
          lineHeight: 1.5,
          color: "var(--color-muted)",
        }}
      >
        {stage.prompt}
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.75rem",
        }}
      >
        {stage.options.map((option) => {
          const isUsed = usedOptionIds.has(option.id);
          const isAttemptTarget = attempt?.optionId === option.id;
          const isFailing = isAttemptTarget && attempt?.status === "failure";
          const isSucceeding = isAttemptTarget && attempt?.status === "success";

          return (
            <button
              key={option.id}
              type="button"
              draggable={!isUsed}
              disabled={isUsed}
              onDragStart={(e: DragEvent<HTMLButtonElement>) => {
                e.dataTransfer.setData("text/plain", option.id);
                e.dataTransfer.effectAllowed = "move";
                setDraggingId(option.id);
              }}
              onDragEnd={() => setDraggingId(null)}
              onClick={() => onActivate(option.id)}
              className={isFailing ? "pp-shake" : undefined}
              style={{
                appearance: "none",
                cursor: isUsed ? "default" : "pointer",
                borderRadius: "999px",
                border: "1px solid var(--color-border)",
                background: isSucceeding ? "var(--color-fg)" : "var(--color-bg)",
                color: isSucceeding ? "var(--color-bg)" : "var(--color-fg)",
                padding: "0.65rem 1.1rem",
                fontSize: "0.875rem",
                fontFamily: "var(--font-sans)",
                opacity: isUsed ? 0.35 : draggingId === option.id ? 0.5 : 1,
                borderColor: isFailing ? "var(--color-fg)" : "var(--color-border)",
                transition: "opacity 180ms ease, background 180ms ease, color 180ms ease",
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
