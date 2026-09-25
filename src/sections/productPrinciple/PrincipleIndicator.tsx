import { stages } from "./data";

export default function PrincipleIndicator({ stageIndex }: { stageIndex: number }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "1.5rem",
        flexWrap: "wrap",
      }}
    >
      {stages.map((stage, i) => {
        const state = i < stageIndex ? "done" : i === stageIndex ? "active" : "upcoming";
        return (
          <span
            key={stage.id}
            style={{
              fontSize: "0.8125rem",
              letterSpacing: "0.08em",
              color: state === "upcoming" ? "var(--color-border)" : "var(--color-fg)",
              opacity: state === "active" ? 1 : state === "done" ? 0.55 : 0.4,
              transition: "opacity 240ms ease, color 240ms ease",
            }}
          >
            {state === "done" ? "✓ " : ""}
            {stage.title}
          </span>
        );
      })}
    </div>
  );
}
