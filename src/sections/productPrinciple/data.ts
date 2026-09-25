export type SlotId = "headline" | "cta" | "cta-style";

export type ElementOption = {
  id: string;
  label: string;
  isCorrect: boolean;
  /** Only used by the "consistent" stage — the radius the CTA button adopts. */
  radius?: string;
  feedback: {
    success: string;
    failure: string;
  };
};

export type PrincipleStage = {
  id: "clear" | "honest" | "consistent";
  title: string;
  slot: SlotId;
  slotLabel: string;
  prompt: string;
  options: ElementOption[];
};

export const stages: PrincipleStage[] = [
  {
    id: "clear",
    title: "CLEAR",
    slot: "headline",
    slotLabel: "HEADLINE",
    prompt: "Choose the headline that says the most in the fewest words.",
    options: [
      {
        id: "headline-clear",
        label: "Save 3 hours every week.",
        isCorrect: true,
        feedback: {
          success: "The headline tells the user exactly what they get.",
          failure: "",
        },
      },
      {
        id: "headline-vague-1",
        label: "Reimagine your workflow.",
        isCorrect: false,
        feedback: {
          success: "",
          failure: "It sounds nice, but it doesn't say what the product actually does.",
        },
      },
      {
        id: "headline-vague-2",
        label: "The future of productivity.",
        isCorrect: false,
        feedback: {
          success: "",
          failure: "Confident, but empty — the user still doesn't know what happens next.",
        },
      },
    ],
  },
  {
    id: "honest",
    title: "HONEST",
    slot: "cta",
    slotLabel: "CTA",
    prompt:
      "This button starts a 14-day trial that turns into a paid plan automatically. Choose the label that says so.",
    options: [
      {
        id: "cta-honest",
        label: "Start 14-day trial",
        isCorrect: true,
        feedback: {
          success: "The button promises exactly what the product delivers.",
          failure: "",
        },
      },
      {
        id: "cta-dishonest-1",
        label: "Try free forever",
        isCorrect: false,
        feedback: {
          success: "",
          failure: "“Forever” isn't true — the trial ends and billing starts.",
        },
      },
      {
        id: "cta-dishonest-2",
        label: "Unlock now",
        isCorrect: false,
        feedback: {
          success: "",
          failure: "“Unlock” doesn't mention a trial — or billing — at all.",
        },
      },
    ],
  },
  {
    id: "consistent",
    title: "CONSISTENT",
    slot: "cta-style",
    slotLabel: "BUTTON STYLE",
    prompt: "The rest of this card uses fully-rounded buttons. Choose the style that belongs.",
    options: [
      {
        id: "style-pill",
        label: "Pill button",
        isCorrect: true,
        radius: "999px",
        feedback: {
          success: "Same shape language as the rest of the card — nothing to fight against.",
          failure: "",
        },
      },
      {
        id: "style-sharp",
        label: "Sharp button",
        isCorrect: false,
        radius: "2px",
        feedback: {
          success: "",
          failure: "Square corners next to pill shapes read as a different product.",
        },
      },
      {
        id: "style-soft",
        label: "Soft button",
        isCorrect: false,
        radius: "8px",
        feedback: {
          success: "",
          failure: "Close, but not quite — a slightly different radius still breaks the pattern.",
        },
      },
    ],
  },
];

export const finalMessage = {
  title: "SEE HOW EASY IT IS TO MAKE GOOD DESIGN.",
  message: "When the product is clear, honest and consistent, good design has less to fight against.",
};
