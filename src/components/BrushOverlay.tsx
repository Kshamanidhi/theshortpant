import { useEffect, useRef, useState } from "react";

const BRUSH_COLOR = "#D64545";
const BRUSH_SIZE = 4;
const HINT_LIFETIME_MS = 3200;

function isInteractive(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return !!target.closest('a, button, input, textarea, select, [role="button"]');
}

export default function BrushOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const hasDrawnRef = useRef(false);
  const [hint, setHint] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctxEl = canvasEl.getContext("2d");
    if (!ctxEl) return;
    // Non-null: both are stable DOM refs for the component's mounted lifetime,
    // but TS narrowing from the guards above doesn't cross into the closures below.
    const canvas = canvasEl;
    const ctx = ctxEl;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = BRUSH_COLOR;
      ctx.lineWidth = BRUSH_SIZE;
    }
    resize();

    function handlePointerDown(e: PointerEvent) {
      if (e.button !== 0 || isInteractive(e.target)) return;
      // Stop the drag from also starting a native text/image selection.
      e.preventDefault();
      drawingRef.current = true;
      lastPointRef.current = { x: e.clientX, y: e.clientY };

      if (!hasDrawnRef.current) {
        hasDrawnRef.current = true;
        setHint({ x: e.clientX, y: e.clientY });
        window.setTimeout(() => setHint(null), HINT_LIFETIME_MS);
      }
    }

    function handlePointerMove(e: PointerEvent) {
      if (!drawingRef.current || !lastPointRef.current) return;
      e.preventDefault();
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
      lastPointRef.current = { x: e.clientX, y: e.clientY };
    }

    function stopDrawing() {
      drawingRef.current = false;
      lastPointRef.current = null;
    }

    function handleDoubleClick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDrawing);
    window.addEventListener("pointercancel", stopDrawing);
    window.addEventListener("dblclick", handleDoubleClick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDrawing);
      window.removeEventListener("pointercancel", stopDrawing);
      window.removeEventListener("dblclick", handleDoubleClick);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9998 }}
      />
      {hint && (
        <div
          className="first-draw-hint"
          style={{
            position: "fixed",
            left: hint.x + 18,
            top: hint.y + 18,
            zIndex: 10000,
            pointerEvents: "none",
            maxWidth: "13rem",
            background: "var(--color-bg)",
            border: "1px solid var(--color-fg)",
            padding: "0.5rem 0.75rem",
            fontSize: "0.8125rem",
            lineHeight: 1.4,
            color: "var(--color-fg)",
          }}
        >
          Oops! Don't worry — double click to erase.
        </div>
      )}
    </>
  );
}
