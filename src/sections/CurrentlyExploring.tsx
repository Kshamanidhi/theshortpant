const ITEMS = [
  { icon: "/sym-06.svg", label: "Traveling" },
  { icon: "/sym-55.svg", label: "Creative Coding" },
  { icon: "/sym-03-1.svg", label: "AI Motion Graphics" },
  { icon: "/sym-04.svg", label: "Design System Automation" },
];

export default function CurrentlyExploring() {
  return (
    <section style={{ padding: "6rem 2rem", maxWidth: "75rem", margin: "0 auto" }}>
      <h2
        style={{
          margin: "0 0 6rem",
          textAlign: "center",
          fontSize: "clamp(1.625rem, 3.5vw, 2.625rem)",
          fontWeight: "normal",
          color: "var(--color-fg)",
        }}
      >
        Me right now.
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: "clamp(2.5rem, 6vw, 5rem)",
          rowGap: "3rem",
        }}
      >
        {ITEMS.map(({ icon, label }) => (
          <div
            key={label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.25rem",
              width: "9rem",
            }}
          >
            <img src={icon} alt="" style={{ height: "5.5rem", width: "auto" }} />
            <p
              style={{
                margin: 0,
                textAlign: "center",
                fontSize: "1rem",
                lineHeight: 1.4,
                color: "var(--color-fg)",
              }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
