import { useEffect, useState } from "react";

type Splash = {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  blobPath: string;
  droplets: { x: number; y: number; r: number }[];
};

const BOX = 70; // local SVG viewBox size
const LIFETIME_MS = 750;
const MAX_CONCURRENT = 10;

let nextId = 0;

// A jittered polygon smoothed into a closed blob path — organic and
// different every click, no hand-authored path variants needed.
function randomBlobPath(cx: number, cy: number, baseR: number) {
  const points = 8 + Math.floor(Math.random() * 3);
  const jitter = 0.4;
  const pts: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const r = baseR * (1 - jitter / 2 + Math.random() * jitter);
    pts.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
  }
  const mid = (a: [number, number], b: [number, number]): [number, number] => [
    (a[0] + b[0]) / 2,
    (a[1] + b[1]) / 2,
  ];
  let d = `M ${mid(pts[points - 1], pts[0]).join(",")} `;
  for (let i = 0; i < points; i++) {
    const next = pts[(i + 1) % points];
    const m = mid(pts[i], next);
    d += `Q ${pts[i].join(",")} ${m.join(",")} `;
  }
  return d + "Z";
}

function makeSplash(x: number, y: number): Splash {
  const cx = BOX / 2;
  const cy = BOX / 2;
  const dropletCount = 2 + Math.floor(Math.random() * 3);
  const droplets = Array.from({ length: dropletCount }, () => {
    const angle = Math.random() * Math.PI * 2;
    const dist = BOX * 0.32 + Math.random() * BOX * 0.2;
    return {
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      r: 1.5 + Math.random() * 3.5,
    };
  });

  return {
    id: nextId++,
    x,
    y,
    rotation: Math.random() * 360,
    scale: 0.75 + Math.random() * 0.6,
    blobPath: randomBlobPath(cx, cy, BOX * 0.24),
    droplets,
  };
}

export default function InkSplash() {
  const [splashes, setSplashes] = useState<Splash[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function handleDoubleClick(e: MouseEvent) {
      if (e.button !== 0) return;
      const splash = makeSplash(e.clientX, e.clientY);
      setSplashes((prev) => [...prev.slice(-(MAX_CONCURRENT - 1)), splash]);
      window.setTimeout(() => {
        setSplashes((prev) => prev.filter((s) => s.id !== splash.id));
      }, LIFETIME_MS);
    }

    window.addEventListener("dblclick", handleDoubleClick);
    return () => window.removeEventListener("dblclick", handleDoubleClick);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}
    >
      {splashes.map((s) => (
        <svg
          key={s.id}
          className="ink-splash"
          viewBox={`0 0 ${BOX} ${BOX}`}
          style={
            {
              position: "absolute",
              left: s.x,
              top: s.y,
              width: `${BOX}px`,
              height: `${BOX}px`,
              "--ink-rotate": `${s.rotation}deg`,
              "--ink-scale": s.scale,
            } as React.CSSProperties
          }
        >
          <path d={s.blobPath} fill="var(--color-fg)" />
          {s.droplets.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="var(--color-fg)" />
          ))}
        </svg>
      ))}
    </div>
  );
}
