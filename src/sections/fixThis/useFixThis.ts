import { useCallback, useEffect, useRef, useState } from "react";
import { rounds, passwordFixMessage, type Round, type RoundOption } from "./data";

type CardState = {
  labelsVisible: boolean;
  passwordMessage: string | null;
  buttonFilled: boolean;
};

type Attempt = {
  optionId: string;
  status: "correct" | "wrong";
};

const ADVANCE_DELAY = 900;
const WRONG_FLASH_DURATION = 450;

export function useFixThis() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [card, setCard] = useState<CardState>({
    labelsVisible: false,
    passwordMessage: null,
    buttonFilled: false,
  });
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [locked, setLocked] = useState(false);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);

  const advanceTimer = useRef<number | null>(null);
  const flashTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
      if (flashTimer.current) window.clearTimeout(flashTimer.current);
    };
  }, []);

  const activeRound: Round | undefined = rounds[roundIndex];
  const completed = roundIndex >= rounds.length;

  const applyFix = useCallback((round: Round) => {
    setCard((prev) => {
      if (round.id === "clear") return { ...prev, labelsVisible: true };
      if (round.id === "honest") return { ...prev, passwordMessage: passwordFixMessage };
      return { ...prev, buttonFilled: true };
    });
  }, []);

  const selectOption = useCallback(
    (option: RoundOption) => {
      if (!activeRound || locked) return;

      if (option.outcome === "correct") {
        setAttempt({ optionId: option.id, status: "correct" });
        setLocked(true);
        setFeedbackText(option.feedback);
        applyFix(activeRound);
        advanceTimer.current = window.setTimeout(() => {
          setAttempt(null);
          setLocked(false);
          setFeedbackText(null);
          setRoundIndex((i) => i + 1);
        }, ADVANCE_DELAY);
      } else {
        setAttempt({ optionId: option.id, status: "wrong" });
        setFeedbackText(option.feedback);
        flashTimer.current = window.setTimeout(() => {
          setAttempt(null);
        }, WRONG_FLASH_DURATION);
      }
    },
    [activeRound, locked, applyFix]
  );

  return {
    roundIndex,
    activeRound,
    completed,
    card,
    attempt,
    locked,
    feedbackText,
    selectOption,
    totalRounds: rounds.length,
  };
}
