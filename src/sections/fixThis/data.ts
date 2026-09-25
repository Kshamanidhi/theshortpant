export type FieldPreviewVariant = "bold-placeholder" | "real-label" | "tooltip";
export type ButtonPreviewVariant = "oneoff" | "match" | "outline";

export type OptionPreview =
  | { kind: "field"; variant: FieldPreviewVariant }
  | { kind: "message"; text: string }
  | { kind: "button"; variant: ButtonPreviewVariant };

export type RoundOption = {
  id: string;
  label: string;
  outcome: "correct" | "wrong";
  feedback: string;
  /** Optional tiny live mockup shown next to the label, so the option can be
   * seen instead of just read. */
  preview?: OptionPreview;
};

export type Round = {
  id: "clear" | "honest" | "consistent";
  title: string;
  question: string;
  options: RoundOption[];
};

export const rounds: Round[] = [
  {
    id: "clear",
    title: "Clear",
    question: "The field has no label. Which fix actually solves it?",
    options: [
      {
        id: "clear-bold-placeholder",
        label: "Make the placeholder text bold instead.",
        outcome: "wrong",
        feedback: "Still a placeholder — it vanishes the second they start typing, bold or not.",
        preview: { kind: "field", variant: "bold-placeholder" },
      },
      {
        id: "clear-real-label",
        label: 'Add a real label above the field: "Email".',
        outcome: "correct",
        feedback: "Nice, that's it.",
        preview: { kind: "field", variant: "real-label" },
      },
      {
        id: "clear-tooltip",
        label: "Add a tooltip icon that explains the field on hover.",
        outcome: "wrong",
        feedback: "Now they have to hunt for it. That's not clear, that's a scavenger hunt.",
        preview: { kind: "field", variant: "tooltip" },
      },
    ],
  },
  {
    id: "honest",
    title: "Honest",
    question: "Password rejected. Which error message should the field show?",
    options: [
      {
        id: "honest-specific",
        label: '"Password needs at least one number."',
        outcome: "correct",
        feedback: "Nice, that's it.",
        preview: { kind: "message", text: "Password needs at least one number." },
      },
      {
        id: "honest-vague",
        label: '"Something went wrong."',
        outcome: "wrong",
        feedback: "True. Also useless. What actually went wrong?",
        preview: { kind: "message", text: "Something went wrong." },
      },
      {
        id: "honest-cute",
        label: '"Oops! Try again \u{1F62C}"',
        outcome: "wrong",
        feedback: "Nicer tone, same problem. Still doesn't say what to fix.",
        preview: { kind: "message", text: "Oops! Try again \u{1F62C}" },
      },
    ],
  },
  {
    id: "consistent",
    title: "Consistent",
    question: "The submit button needs to go live. Which version ships?",
    options: [
      {
        id: "consistent-oneoff",
        label: "A pill shaped button in a brand new color, just for this screen.",
        outcome: "wrong",
        feedback: "One-off style. Now the next screen has no idea what to copy.",
        preview: { kind: "button", variant: "oneoff" },
      },
      {
        id: "consistent-outline",
        label: "Keep it outlined and grey until hover.",
        outcome: "wrong",
        feedback: "Grey and outlined reads as disabled, not ready to click.",
        preview: { kind: "button", variant: "outline" },
      },
      {
        id: "consistent-match",
        label: "Same radius, weight, and color as the rest of the card.",
        outcome: "correct",
        feedback: "Nice, that's it.",
        preview: { kind: "button", variant: "match" },
      },
    ],
  },
];

export const passwordFixMessage = "Password needs at least one number.";
