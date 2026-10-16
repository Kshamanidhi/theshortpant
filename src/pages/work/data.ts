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
  // Shown in Overview: what I personally did, then everyone else's part.
  ownership: Text[];
  team: { who: string; role: string; did: Text }[];
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
    outcome: "Client-approved and shipped across 3 product pillars.",
    tags: ["Product & motion designer", "iOS · Android", "Apr 25 – Jun 26", "DIFC · Magure"],
    cover: "/wrk-difc-wrk1.png",
    caseStudy: {
      headline: "Three products, 40+ services, one consistent DIFC+ experience",
      tldr: {
        problem: "DIFC+ was growing into three products, and 40+ services had to feel like one app.",
        did: "Built the design tokens and component library, the information architecture, and the high-fidelity UI for the DIFC+ dashboard and TenX.",
        result: "Client-approved and shipped: 3 pillars, 100+ screens each, on one system of 260+ tokens.",
      },
      facts: [
        { label: "Role", value: "Product & motion designer" },
        { label: "Client", value: "DIFC" },
        { label: "Agency", value: "Magure INC" },
        { label: "Timeline", value: "Apr 25 – Jun 26" },
        { label: "Team", value: "3 designers · PMs · CTO" },
      ],
      heroImage: "/wrk-difc-wrk1.png",
      overview: [
        "An all-in-one app for everyone inside DIFC, Dubai's financial district: employees, guests and students. They find services, get around and grab perks without switching between five different apps.",
        "DIFC+ was expanding across three product areas at once: the core DIFC+ app, TenX, and property management.",
      ],
      ownership: [
        "Created the design tokens and component library from the DIFC brand guidelines.",
        "Developed the information architecture and wireframes, with reviews from Nitin.",
        "Designed the high-fidelity UI for the DIFC+ dashboard and TenX.",
        "Guided the junior UI designer through end-of-project bug fixes, alongside Nitin.",
        "Established the design foundation that was reused for Property Management.",
      ],
      team: [
        {
          who: "Nitin Prajapati",
          role: "Lead Designer",
          did: "Reviewed my wireframes and information architecture before stakeholder presentations, and owned the Property Management design using the system I created.",
        },
        {
          who: "Junior UI Designer",
          role: "Joined near the end",
          did: "Resolved UI bugs under Nitin's and my guidance.",
        },
        {
          who: "Product Managers & CTO",
          role: "Requirements",
          did: "Provided business and product requirements through the BRD and discussions, and reviewed the proposed information architecture and wireframes.",
        },
      ],
      problem: [
        "DIFC+ was expanding across three product areas: the core DIFC+ app, TenX, and property management. The challenge was to translate business requirements and complex service workflows into a consistent, usable product experience.",
        "I identified the key design challenges by reviewing the BRD and discussing requirements, technical constraints and product expectations with the Product Managers and CTO. Those conversations showed me the different user roles, the workflows each one needed, and how complex it would be to bring multiple services into one cohesive ecosystem.",
        "From there, the focus was on structuring the experience, designing the workflows, and establishing a reusable design system that could support the product as it expanded.",
      ],
      constraints: [
        "Three audiences with different reasons to open the same app.",
        "One design system that had to hold up in both light and dark.",
        "A financial district trying to feel like a lifestyle brand.",
        "Requirements arrived as a BRD: complex service workflows that had to become usable flows.",
        "Several user roles, each with its own required workflows.",
      ],
      decisions: [
        {
          title: "Previewing uploaded documents",
          situation:
            "The property flow asked users to upload a long list of documents: unit plan, DEWA and EMPOWER activation proofs, Emirates ID, passport copy. With that many, it's easy to lose track of what's been uploaded, and whether it's the right file.",
          chosen: {
            text: "A smart accordion for each document type that opens to a large preview of the uploaded file.",
            why: "In a process this long, seeing the actual document is what removes the doubt. The accordion keeps the page short, but one tap shows enough of the file to confirm it's the right one.",
            // Site copy with the passport scan blurred; the original is public/Decision 01 - A.png.
            image: "/difc/decision-01-chosen.png",
          },
          rejected: {
            text: "A document list with a small file thumbnail next to each upload.",
            whyNot: "The thumbnails were too small to tell whether the right document had been uploaded, which brought back exactly the confusion the page was meant to remove.",
            image: "/difc/decision-01-rejected.png",
          },
        },
        {
          title: "Moving around the co-working dashboard",
          situation:
            "Co-working is one service inside DIFC+, with its own dashboard for bookings, payments and tickets. Members move between these constantly, and the app already has a main dashboard above it.",
          chosen: {
            text: "One co-working space with a tab bar (Dashboard, Bookings, Payment, Tickets) that members can tap or swipe between.",
            why: "Everything stays inside a single interface, and you always see where you are. The flow feels connected, and there's less to hold in your head.",
            image: "/difc/decision-02-chosen.png",
          },
          rejected: {
            text: "A quick-access grid of icons, each redirecting to its own separate page.",
            whyNot: "Jumping out to independent pages felt broken rather than connected. With the main DIFC+ dashboard already above it, a second dashboard of redirects would have interrupted the flow and added to the cognitive load.",
            image: "/difc/decision-02-rejected.png",
          },
        },
      ],
      process: {
        intro: todo("A short line on how the work moved from idea to screen"),
        steps: [{ label: "Sketch" }, { label: "Wireframe" }, { label: "Final", image: "/wrk-difc-wrk1.png" }],
      },
      outcome: {
        paragraphs: [
          "The design was approved by the client and shipped. The foundation I built became the base for Property Management, the third pillar, which Nitin designed on top of my system.",
        ],
        numbers: [
          { value: "40+", label: "services in one app" },
          { value: "3", label: "product pillars" },
          { value: "100+", label: "screens per pillar" },
          { value: "120+", label: "primitive tokens" },
          { value: "140+", label: "aliased tokens" },
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
