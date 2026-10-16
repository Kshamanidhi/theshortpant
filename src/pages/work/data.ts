// Content for /work (the project grid) and /work/<id> (case studies).
//
// Anything still to be written is a `todo("hint")` instead of a string: the
// page renders it as a dashed placeholder showing the hint, so a missing
// piece is visible rather than silently blank. Replace each todo() with the
// real copy as it comes in.

export type Todo = { todo: string };
export type Text = string | Todo;
export const todo = (hint: string): Todo => ({ todo: hint });

export type Decision = {
  title: Text;
  // The moment that forced the decision: who, what, what was at stake.
  situation: Text;
  chosen: { text: Text; why: Text; image?: string };
  rejected: { text: Text; whyNot: Text; image?: string };
};

export type CaseStudy = {
  headline: string;
  tldr: { problem: Text; did: Text; result: Text };
  // The facts strip under the hero (role, client, timeline…).
  facts: { label: string; value: Text }[];
  heroImage: string;
  overview: Text[];
  problem: Text[];
  constraints: Text[];
  decisions: Decision[];
  process: { intro: Text; steps: { label: string; image?: string }[] };
  outcome: { paragraphs: Text[]; numbers: { value: Text; label: Text }[] };
  reflections: Text[];
};

export type WorkProject = {
  id: string;
  title: string;
  // One line for the grid card: what it is, then (once known) the outcome.
  line: string;
  outcome?: Text;
  tags: string[];
  cover: string;
  // When set, the card links to /work/<id>; otherwise it says "coming soon".
  caseStudy?: CaseStudy;
};

export const WORK_PROJECTS: WorkProject[] = [
  {
    id: "difc",
    title: "Redesigned a Lifestyle App",
    line: "One app for everyone inside DIFC: employees, guests and students.",
    outcome: todo("One-line outcome, ideally with your strongest number"),
    tags: ["Product & motion designer", "iOS · Android", "Apr 25 – Jun 26", "DIFC · Magure"],
    cover: "/wrk-difc-wrk1.png",
    caseStudy: {
      headline: "One app for everyone inside Dubai's financial district",
      tldr: {
        problem: todo("One line: what was broken, and for whom"),
        did: "Built the design system across light and dark, and designed the motion icons.",
        result: todo("One line, ideally with your strongest number"),
      },
      facts: [
        { label: "Role", value: "Product & motion designer" },
        { label: "Client", value: "DIFC" },
        { label: "Agency", value: "Magure INC" },
        { label: "Timeline", value: "Apr 25 – Jun 26" },
        { label: "Team", value: todo("e.g. 2 designers, 4 devs") },
      ],
      heroImage: "/wrk-difc-wrk1.png",
      overview: [
        "An all-in-one app for everyone inside DIFC, Dubai's financial district: employees, guests and students. They find services, get around and grab perks without switching between five different apps.",
        todo("What you owned vs. the team, in two lines"),
      ],
      problem: [
        todo("Your problem statement: who struggled, with what, and how you knew (research, data, stakeholders)"),
      ],
      constraints: [
        "Three audiences with different reasons to open the same app.",
        "One design system that had to hold up in both light and dark.",
        "A financial district trying to feel like a lifestyle brand.",
        todo("Any technical, timeline or brand constraint"),
      ],
      decisions: [
        {
          title: todo("Decision title, e.g. how the home screen serves three audiences"),
          situation: todo("The situation that forced the decision"),
          chosen: { text: todo("What you went with, in one or two lines"), why: todo("Why, plus any number that backed it") },
          rejected: { text: todo("The alternative you explored"), whyNot: todo("What was wrong with it") },
        },
        {
          title: todo("Decision title, e.g. one token set for light and dark"),
          situation: todo("The situation that forced the decision"),
          chosen: { text: todo("What you went with"), why: todo("Why") },
          rejected: { text: todo("The alternative you explored"), whyNot: todo("What was wrong with it") },
        },
      ],
      process: {
        intro: todo("A short line on how the work moved from idea to screen"),
        steps: [{ label: "Sketch" }, { label: "Wireframe" }, { label: "Final", image: "/wrk-difc-wrk1.png" }],
      },
      outcome: {
        paragraphs: [todo("What shipped, and what changed because of it")],
        numbers: [
          { value: todo("00%"), label: todo("what it measures") },
          { value: todo("00"), label: todo("what it measures") },
          { value: todo("00×"), label: todo("what it measures") },
        ],
      },
      reflections: [
        "One app, three different people using it for three different reasons.",
        "A design system had to hold up in both light and dark, not just look good in one.",
        "Motion icons, small details, but they're the first thing that makes an app feel alive.",
      ],
    },
  },
  {
    id: "donaleb",
    title: "Donaleb",
    line: "A fitness app that turns employees' steps into real donations for causes their company supports.",
    tags: ["Product designer", "Mobile · Admin web", "Oct 23", "Freelance"],
    cover: "/wrk-dona02.png",
  },
  {
    id: "vault2047",
    title: "Vault2047",
    line: "The site and digital experience for a cyber-defence summit in Mumbai.",
    tags: ["Web designer", "Web", "Mar – May 26", "Trescon · Wormit"],
    cover: "/wrk-v-wrk2.png",
  },
  {
    id: "finance2045",
    title: "Finance 2045",
    line: "A fintech summit site for Jakarta, built inside a locked brand system.",
    tags: ["Web designer", "Web", "May – Jun 26", "Trescon · Wormit"],
    cover: "/wrk-f453.png",
  },
];
