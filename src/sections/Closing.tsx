import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import GoodMatchCard from "../components/GoodMatchCard";

export default function Closing() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 16,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="connect"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "8rem 2rem",
      }}
    >
      <div ref={contentRef} style={{ maxWidth: "64rem" }}>
        <div className="hide-on-mobile-tablet" style={{ marginBottom: "3rem" }}>
          <GoodMatchCard />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1.5rem",
            fontSize: "0.9375rem",
          }}
        >
          <a
            href="mailto:designer@wormit.co"
            style={{ color: "var(--color-fg)", textDecoration: "none" }}
          >
            designer@wormit.co
          </a>
          <a
            href="https://www.linkedin.com/in/kshamanidhi/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--color-muted)", textDecoration: "none" }}
          >
            in
          </a>
          <a
            href="https://www.instagram.com/theshortpant/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--color-muted)", textDecoration: "none" }}
          >
            insta
          </a>
        </div>
      </div>
    </section>
  );
}
