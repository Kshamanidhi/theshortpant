import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { useProductPrinciple } from "./useProductPrinciple";
import PrincipleIndicator from "./PrincipleIndicator";
import ProductCard from "./ProductCard";
import ElementPicker from "./ElementPicker";
import FeedbackBar from "./FeedbackBar";

export default function ProductPrinciple() {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  const { stageIndex, activeStage, completed, card, usedOptionIds, attempt, feedback, handleOptionActivate } =
    useProductPrinciple();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(introRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
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

  const handleContinue = () => {
    sectionRef.current?.nextElementSibling?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        padding: "6rem 2rem 0",
      }}
    >
      <div
        ref={introRef}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "0.75rem",
          maxWidth: "36rem",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            fontWeight: "normal",
            lineHeight: 1.3,
            color: "var(--color-fg)",
          }}
        >
          Before knowing about me, let's make something.
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "1rem",
            color: "var(--color-muted)",
          }}
        >
          Just remember my product principle.
        </p>
        <p
          style={{
            margin: "0.5rem 0 0",
            fontSize: "0.8125rem",
            letterSpacing: "0.12em",
            color: "var(--color-fg)",
          }}
        >
          CLEAR &middot; HONEST &middot; CONSISTENT
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "0.875rem",
            color: "var(--color-muted)",
          }}
        >
          Build the card by choosing the right elements.
        </p>
      </div>

      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "2.5rem",
          padding: "3rem 0 0",
        }}
      >
        <PrincipleIndicator stageIndex={stageIndex} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2.5rem",
          }}
        >
          <ProductCard card={card} activeSlot={activeStage?.slot} onDropOption={handleOptionActivate} />

          {activeStage && (
            <ElementPicker
              stage={activeStage}
              usedOptionIds={usedOptionIds}
              attempt={attempt}
              onActivate={handleOptionActivate}
            />
          )}

          {completed && (
            <button
              type="button"
              onClick={handleContinue}
              className="pp-fade-up"
              style={{
                appearance: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.8125rem",
                letterSpacing: "0.08em",
                color: "var(--color-muted)",
                padding: "0.5rem",
              }}
            >
              Continue exploring &darr;
            </button>
          )}
        </div>

        <FeedbackBar feedback={feedback} />
      </div>
    </section>
  );
}
