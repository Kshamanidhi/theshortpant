import type { CSSProperties } from "react";

export default function GoodDesignPatch({
  width = "clamp(11rem, 22vw, 15rem)",
  rotate = "-3deg",
  style,
}: {
  width?: string;
  rotate?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: "relative",
        width,
        aspectRatio: "351 / 50",
        backgroundImage: "url(/patch-design.svg)",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `rotate(${rotate})`,
        ...style,
      }}
    >
      <span
        style={{
          color: "#fff",
          fontSize: "0.875rem",
          fontFamily: "var(--font-sans)",
          letterSpacing: "0.02em",
        }}
      >
        good design follows.
      </span>
    </div>
  );
}
