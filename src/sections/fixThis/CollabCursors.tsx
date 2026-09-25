import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "../../lib/gsap";

const POINTER_LAG = { duration: 0.35, ease: "power3" };
const REACTION_LAG = { duration: 0.6, ease: "power2.out" };

// Both cursor-*.svg assets share the same triangle geometry, tip at this
// point in their native (105x68 / 156x67) coordinate space.
const NATIVE_HEIGHT = 68;
const NATIVE_WIDTH_YOU = 105;
const TIP_NATIVE = { x: 6.668, y: 6.698 };
const DISPLAY_HEIGHT = 46;
const SCALE = DISPLAY_HEIGHT / NATIVE_HEIGHT;
const TIP_OFFSET = { x: TIP_NATIVE.x * SCALE, y: TIP_NATIVE.y * SCALE };
// `width: "auto"` computes to 0 for an `img` that is itself `position: absolute`
// (the "You" cursor) in some engines, so give it an explicit pixel width.
const DISPLAY_WIDTH_YOU = NATIVE_WIDTH_YOU * SCALE;

// Kshama isn't a real tracked cursor and never moves toward "You" — it
// drifts opposite "You"'s movement at a fraction of the scale, around its
// own fixed rest spot. Straight linear drift only, no tilt/rotation.
const REACTION_RATIO = -0.2;

export default function CollabCursors({
  containerRef,
  anchorRef,
}: {
  containerRef: RefObject<HTMLElement | null>;
  anchorRef: RefObject<HTMLElement | null>;
}) {
  const youRef = useRef<HTMLDivElement>(null);
  const kshamaRestRef = useRef<HTMLDivElement>(null);
  const kshamaReactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const youEl = youRef.current;
    const kshamaRestEl = kshamaRestRef.current;
    const kshamaReactEl = kshamaReactRef.current;
    if (!container || !youEl || !kshamaRestEl || !kshamaReactEl) return;

    if (!window.matchMedia("(pointer: fine)").matches) return;

    container.classList.add("fx-hide-native-cursor");

    const setYouX = gsap.quickTo(youEl, "x", POINTER_LAG);
    const setYouY = gsap.quickTo(youEl, "y", POINTER_LAG);
    const setReactX = gsap.quickTo(kshamaReactEl, "x", REACTION_LAG);
    const setReactY = gsap.quickTo(kshamaReactEl, "y", REACTION_LAG);

    function positionKshama() {
      const containerRect = container!.getBoundingClientRect();
      const anchorEl = anchorRef.current;
      const anchorRect = anchorEl ? anchorEl.getBoundingClientRect() : containerRect;
      gsap.set(kshamaRestEl, {
        left: anchorRect.right - containerRect.left + 18,
        top: anchorRect.top - containerRect.top - 6,
        opacity: 1,
      });
    }

    positionKshama();
    window.addEventListener("resize", positionKshama);
    const resizeObserver = new ResizeObserver(positionKshama);
    if (anchorRef.current) resizeObserver.observe(anchorRef.current);

    function handleEnter(e: PointerEvent) {
      const rect = container!.getBoundingClientRect();
      gsap.set(youEl, { x: e.clientX - rect.left, y: e.clientY - rect.top });
      gsap.to(youEl, { opacity: 1, duration: 0.15 });
    }

    function handleMove(e: PointerEvent) {
      const rect = container!.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      setYouX(mouseX);
      setYouY(mouseY);

      // Mirror "You"'s position relative to the section's center, scaled way
      // down — Kshama drifts the same direction "You" is off-center, never
      // toward "You" itself.
      const dx = mouseX - rect.width / 2;
      const dy = mouseY - rect.height / 2;

      setReactX(dx * REACTION_RATIO);
      setReactY(dy * REACTION_RATIO);
    }

    function handleLeave() {
      gsap.to(youEl, { opacity: 0, duration: 0.15 });
      setReactX(0);
      setReactY(0);
    }

    container.addEventListener("pointerenter", handleEnter);
    container.addEventListener("pointermove", handleMove);
    container.addEventListener("pointerleave", handleLeave);

    return () => {
      container.classList.remove("fx-hide-native-cursor");
      container.removeEventListener("pointerenter", handleEnter);
      container.removeEventListener("pointermove", handleMove);
      container.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("resize", positionKshama);
      resizeObserver.disconnect();
    };
  }, [containerRef, anchorRef]);

  return (
    <>
      <div
        ref={youRef}
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 0,
          pointerEvents: "none",
          zIndex: 5,
          willChange: "transform",
        }}
      >
        <img
          src="/cursor-you.svg"
          alt=""
          style={{
            position: "absolute",
            top: -TIP_OFFSET.y,
            left: -TIP_OFFSET.x,
            height: DISPLAY_HEIGHT,
            width: DISPLAY_WIDTH_YOU,
            maxWidth: "none",
            display: "block",
          }}
        />
      </div>

      <div
        ref={kshamaRestRef}
        className="fx-kshama-cursor"
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 0,
          pointerEvents: "none",
          zIndex: 5,
        }}
      >
        <div ref={kshamaReactRef} style={{ willChange: "transform" }}>
          <img
            src="/cursor-kshama.svg"
            alt=""
            style={{ height: DISPLAY_HEIGHT, width: "auto", maxWidth: "none", display: "block" }}
          />
        </div>
      </div>
    </>
  );
}
