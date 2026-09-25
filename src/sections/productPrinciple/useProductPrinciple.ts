import { useCallback, useEffect, useRef, useState } from "react";
import { stages, finalMessage, type PrincipleStage, type ElementOption } from "./data";

type CardState = {
  headline: string | null;
  ctaLabel: string | null;
  ctaRadius: string | null;
};

type Feedback = {
  kind: "principle" | "final";
  title: string;
  message: string;
  status: "success" | "failure";
};

type Attempt = {
  optionId: string;
  status: "success" | "failure";
};

const ADVANCE_DELAY = 650;
const SHAKE_DURATION = 550;

export function useProductPrinciple() {
  const [stageIndex, setStageIndex] = useState(0);
  const [card, setCard] = useState<CardState>({
    headline: null,
    ctaLabel: null,
    ctaRadius: null,
  });
  const [usedOptionIds, setUsedOptionIds] = useState<Set<string>>(new Set());
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const advanceTimer = useRef<number | null>(null);
  const shakeTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
      if (shakeTimer.current) window.clearTimeout(shakeTimer.current);
    };
  }, []);

  const activeStage: PrincipleStage | undefined = stages[stageIndex];
  const completed = stageIndex >= stages.length;

  const applyOption = useCallback((stage: PrincipleStage, option: ElementOption) => {
    setCard((prev) => {
      if (stage.slot === "headline") return { ...prev, headline: option.label };
      if (stage.slot === "cta") return { ...prev, ctaLabel: option.label };
      return { ...prev, ctaRadius: option.radius ?? prev.ctaRadius };
    });
  }, []);

  const handleOptionActivate = useCallback(
    (optionId: string) => {
      if (!activeStage || attempt || usedOptionIds.has(optionId)) return;
      const option = activeStage.options.find((o) => o.id === optionId);
      if (!option) return;

      if (option.isCorrect) {
        setAttempt({ optionId, status: "success" });
        setUsedOptionIds((prev) => new Set(prev).add(optionId));
        applyOption(activeStage, option);
        setFeedback({
          kind: "principle",
          title: activeStage.title,
          message: option.feedback.success,
          status: "success",
        });
        advanceTimer.current = window.setTimeout(() => {
          setAttempt(null);
          setStageIndex((i) => {
            const next = i + 1;
            if (next >= stages.length) {
              setFeedback({
                kind: "final",
                title: finalMessage.title,
                message: finalMessage.message,
                status: "success",
              });
            }
            return next;
          });
        }, ADVANCE_DELAY);
      } else {
        setAttempt({ optionId, status: "failure" });
        setFeedback({
          kind: "principle",
          title: activeStage.title,
          message: option.feedback.failure,
          status: "failure",
        });
        shakeTimer.current = window.setTimeout(() => {
          setAttempt(null);
        }, SHAKE_DURATION);
      }
    },
    [activeStage, attempt, usedOptionIds, applyOption]
  );

  return {
    stages,
    stageIndex,
    activeStage,
    completed,
    card,
    usedOptionIds,
    attempt,
    feedback,
    handleOptionActivate,
  };
}
