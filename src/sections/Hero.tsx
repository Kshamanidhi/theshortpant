import GoodDesignPatch from "../components/GoodDesignPatch";

export default function Hero() {
  return (
    <section
      id="about"
      style={{
        position: "relative",
        minHeight: "100svh",
        paddingTop: "6rem",
        paddingBottom: "8rem",
        display: "flex",
        alignItems: "center",
        paddingLeft: "2rem",
        paddingRight: "2rem",
        overflow: "hidden",
      }}
    >
      <div
        className="hero-text-in"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "2.5rem",
          width: "100%",
          maxWidth: "44rem",
          margin: "0 auto",
        }}
      >
        {/* Name + role */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span
            style={{
              fontSize: "0.875rem",
              color: "var(--color-muted)",
              letterSpacing: "0.02em",
            }}
          >
            kshamanidhi
          </span>
          <span
            style={{
              fontSize: "1.225rem",
              color: "var(--color-fg)",
              lineHeight: "1.2",
            }}
          >
            Product Designer
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            margin: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.35rem",
            fontFamily: "var(--font-sans)",
            lineHeight: "1.15",
            letterSpacing: "-0.01em",
          }}
        >
          <span
            style={{
              fontSize: "clamp(2.125rem, 3vw, 3.5rem)",
              fontWeight: "normal",
              color: "var(--color-muted)",
            }}
          >
            A product should be
          </span>
          <span
            className="hero-rotator"
            style={{
              fontSize: "clamp(2.75rem, 6vw, 4.5rem)",
              fontWeight: "bold",
              color: "var(--color-fg)",
            }}
          >
            <span className="hero-rotator-word" style={{ animationDelay: "0ms" }}>
              Clear
            </span>
            <span className="hero-rotator-word" style={{ animationDelay: "1500ms" }}>
              Honest
            </span>
            <span className="hero-rotator-word" style={{ animationDelay: "3000ms" }}>
              Consistent
            </span>
          </span>
        </h1>

        {/* Good design follows — patch */}
        <GoodDesignPatch style={{ marginTop: "-1rem" }} />

        {/* Location */}
        <span
          style={{
            fontSize: "0.875rem",
            color: "var(--color-muted)",
            letterSpacing: "0.02em",
          }}
        >
          Raipur, India
        </span>
      </div>
    </section>
  );
}
