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

// Only the top section (logo, headline, TL;DR, facts, hero image) and
// Overview are required. Every other section is optional and appears, in
// the page and in its "on this page" index, only when filled in.
export type CaseStudy = {
  // Client brandmark above the headline.
  logo?: { src: string; alt: string };
  headline: string;
  // Result is optional: left out when there's no outcome to state yet.
  tldr: { problem: Text; did: Text; result?: Text };
  // Optional live link, shown under the TL;DR.
  link?: { href: string; label: string };
  // The facts strip under the hero (role, client, timeline…).
  facts: { label: string; value: Text }[];
  heroImage: string;
  overview: Text[];
  // Shown in Overview: what I personally did, then everyone else's part.
  ownership?: Text[];
  team?: { who: string; role: string; did: Text }[];
  problem?: Text[];
  constraints?: Text[];
  decisions?: Decision[];
  // One feature followed from paper to final. `aspect` (width / height)
  // sizes each step so all three sit at the same height whatever their
  // shape. `sketchbook` is an optional row of further sketches for range.
  process?: {
    intro: Text;
    steps: { label: string; caption: string; image: string; aspect: number }[];
    sketchbook?: { caption: string; image: string }[];
  };
  // Finished screens (cut-out mockups or a screen recording), one row at a
  // shared height, sized by aspect like the process steps.
  screens?: { image?: string; video?: string; aspect: number; alt: string }[];
  // Optional: looping Lottie icons shown in their own small section.
  motion?: { intro: Text; icons: string[] };
  outcome?: { paragraphs: Text[]; numbers: { value: Text; label: Text }[] };
  reflections?: Text[];
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
  // Work under NDA: no page, blurred cover images, and a contact CTA in
  // place of "View case study".
  locked?: { images: string[]; cta: { label: string; href: string } };
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
      // Recoloured to the site's ink colour from public/DIFC Brandmark.svg (white).
      logo: { src: "/difc/difc-brandmark.svg", alt: "DIFC" },
      headline: "Three products, 40+ services, one consistent DIFC+ experience",
      tldr: {
        problem: "DIFC+ was growing into three products, and 40+ services had to feel like one app.",
        did: "Built the design tokens and component library, the information architecture, and the high-fidelity UI for the DIFC+ dashboard and Tenex.",
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
        "DIFC+ was expanding across three product areas at once: the core DIFC+ app, Tenex, and property management.",
      ],
      ownership: [
        "Created the design tokens and component library from the DIFC brand guidelines.",
        "Developed the information architecture and wireframes, with reviews from Nitin.",
        "Designed the high-fidelity UI for the DIFC+ dashboard and Tenex.",
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
        "DIFC+ was expanding across three product areas: the core DIFC+ app, Tenex, and property management. The challenge was to translate business requirements and complex service workflows into a consistent, usable product experience.",
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
        intro:
          "Each service started on paper, moved into wireframes that Nitin, the PMs and the CTO reviewed, then went to high fidelity on the design system. Here's one thread, co-working billing and payments, followed all the way through.",
        steps: [
          { label: "Sketch", caption: "Billing & payments, on paper", image: "/difc/process-sketch.jpg", aspect: 412 / 549 },
          { label: "Wireframes", caption: "The pay, summary and receipt flows", image: "/difc/process-wireframes.png", aspect: 1174 / 916 },
          { label: "Final", caption: "Payments on the co-working dashboard", image: "/difc/process-final.png", aspect: 204 / 426 },
        ],
        sketchbook: [
          { caption: "EV charging stations", image: "/difc/sketch-ev-charging.jpg" },
          { caption: "Valet parking", image: "/difc/sketch-valet.jpg" },
          { caption: "Move-in request flow", image: "/difc/sketch-move-in.jpg" },
        ],
      },
      motion: {
        intro:
          "I also designed the motion icons for DIFC+ services. Small details, but they're the first thing that makes an app feel alive.",
        icons: [
          "/home-major-ug-animation.json",
          "/city-lounge-animation.json",
          "/cinema-main-animation.json",
          "/difc-lens-animation.json",
        ],
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
    id: "mymuse",
    title: "MyMuse",
    line: "The app pairs via Bluetooth with app-enabled personal massagers from MyMuse, including models like Groove+, Dive+, Link+, and Loop+.",
    tags: ["Coming soon", "Under NDA"],
    cover: "/mymuse-1-blurred.png",
    // Blurred site copies; the originals (public/MyMuse1.png, MyMuse2.png)
    // stay unpublished while the project is under NDA.
    locked: {
      images: ["/mymuse-1-blurred.png", "/mymuse-2-blurred.png"],
      cta: { label: "Contact me for a walkthrough", href: "https://cal.com/kshamanidhi-bhardwaj-tlecsq/30min" },
    },
  },
  {
    id: "donaleb",
    title: "Donaleb",
    line: "A fitness app that turns employees' steps into real donations for causes their company supports.",
    tags: ["Product designer", "Mobile · Admin web", "Oct 23", "Freelance"],
    cover: "/wrk-dona02.png",
    // Copy from the original /work slides.
    caseStudy: {
      logo: { src: "/logo-donaleb.png", alt: "Donaleb" },
      headline: "Turning steps into donations, without making fitness feel like a contest",
      tldr: {
        problem: "Fitness, competition and charity: three different motivations, one app to hold them all.",
        did: "Redesigned the app as product designer: contests, leaderboards, donations, badges and the admin dashboard, plus the splash screen and character animation.",
      },
      link: { href: "https://www.donaleb.com/", label: "Visit donaleb.com" },
      facts: [
        { label: "Role", value: "Product designer" },
        { label: "Client", value: "Yasmine Darwich" },
        { label: "Engagement", value: "Freelance" },
        { label: "Timeline", value: "Oct 23" },
        { label: "Platform", value: "Mobile · Admin web" },
      ],
      heroImage: "/wrk-dona02.png",
      overview: [
        "A fitness app for companies: employees log steps and activity, compete on leaderboards, unlock badges, and turn their progress into real donations for causes the company supports.",
      ],
      screens: [
        { image: "/wrk-dona01.png", aspect: 444 / 949, alt: "Donaleb challenge progress screen" },
        { video: "/DonaLeb_Reel_01_1.mp4", aspect: 1080 / 1920, alt: "Donaleb app walkthrough" },
        { image: "/wrk-dona03.png", aspect: 444 / 947, alt: "Donaleb app screen" },
      ],
      reflections: [
        "Fitness, competition, and charity: three different motivations, one app to hold them all.",
        "A leaderboard has to feel fun, not stressful, for people who aren't naturally competitive.",
        "Progress badges, small reward, but had to actually feel earned.",
        "A splash screen is three seconds, tops, still had to make a character feel alive in that window.",
        "An admin dashboard is a completely different user than the employee using the app, same product, two very different jobs to design for.",
      ],
    },
  },
  {
    id: "vault2047",
    title: "Vault2047",
    line: "The site and digital experience for a cyber-defence summit in Mumbai.",
    tags: ["Web designer", "Web", "Mar – May 26", "Trescon · Wormit"],
    cover: "/wrk-v-wrk2.png",
    // Copy from the original /work slides.
    caseStudy: {
      logo: { src: "/logo-vault.png", alt: "Vault2047" },
      headline: "A credible, findable home for a cyber-defence summit",
      tldr: {
        problem: "Policymakers, CISOs, founders and investors all came to one site for tickets, speakers and a dense agenda.",
        did: "I built the website and the whole digital experience for the summit, staying inside their brand's rules the whole way.",
      },
      facts: [
        { label: "Role", value: "Web designer" },
        { label: "Client", value: "Trescon" },
        { label: "Agency", value: "Wormit" },
        { label: "Timeline", value: "Mar – May 26" },
        { label: "Platform", value: "Web" },
      ],
      heroImage: "/wrk-v-wrk2.png",
      overview: [
        "A summit in Mumbai for everyone working on cyber defense: policymakers, CISOs, founders, and investors, all in one place. Tickets, speakers, the full agenda, all running through this site.",
      ],
      screens: [
        { image: "/wrk-vault1.png", aspect: 1456 / 948, alt: "Vault2047 website on desktop" },
        { image: "/wrk-vault2.png", aspect: 360 / 743, alt: "Vault2047 website on mobile" },
      ],
      reflections: [
        "Had to make this feel credible, not stiff.",
        "So much event info, had to make it findable.",
        "Plugged in a ticketing system I didn't build, made it feel like mine.",
        "One page, six kinds of people, all wanting something different from it.",
      ],
    },
  },
  {
    id: "finance2045",
    title: "Finance 2045",
    line: "A fintech summit site for Jakarta, built inside a locked brand system.",
    tags: ["Web designer", "Web", "May – Jun 26", "Trescon · Wormit"],
    cover: "/wrk-f453.png",
    // Copy from the original /work slides.
    caseStudy: {
      logo: { src: "/logo-finance.png", alt: "Finance 2045" },
      headline: "Giving ten themes room to breathe on one summit site",
      tldr: {
        problem: "Ten themes, a long speaker list, and visitors from regulators to investors, all on one page.",
        did: "I built the website and the digital experience for this summit, working inside a brand system that was already locked in.",
      },
      facts: [
        { label: "Role", value: "Web designer" },
        { label: "Client", value: "Trescon" },
        { label: "Agency", value: "Wormit" },
        { label: "Timeline", value: "May – Jun 26" },
        { label: "Platform", value: "Web" },
      ],
      heroImage: "/wrk-f453.png",
      overview: [
        "A finance summit in Jakarta, bringing CFOs, regulators, central bankers, and fintech founders together to figure out where Indonesia's financial system is headed next. Same setup as Vault, tickets, speakers, agenda, themes, all through this site.",
      ],
      screens: [
        { image: "/wrk-f451.png", aspect: 836 / 544, alt: "Finance 2045 website on desktop" },
        { image: "/wrk-f452.png", aspect: 339 / 599, alt: "Finance 2045 website on mobile" },
      ],
      reflections: [
        "Ten themes competing for the same page, had to give each one room to breathe.",
        "A speaker list this long, had to stay scannable, not a wall of names.",
        "Big numbers doing the selling here, had to make them land without sounding like a pitch deck.",
        "One page, pulling double duty for a regulator and an investor at the same time.",
      ],
    },
  },
];
