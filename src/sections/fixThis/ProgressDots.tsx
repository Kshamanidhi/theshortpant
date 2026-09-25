export default function ProgressDots({ roundIndex, total }: { roundIndex: number; total: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          style={{
            display: "block",
            width: i === roundIndex ? "1.5rem" : "0.5rem",
            height: "0.375rem",
            borderRadius: "999px",
            background:
              i < roundIndex
                ? "var(--color-accent)"
                : i === roundIndex
                  ? "var(--color-fg)"
                  : "var(--color-border)",
            transition: "width 240ms ease, background 240ms ease",
          }}
        />
      ))}
    </div>
  );
}
