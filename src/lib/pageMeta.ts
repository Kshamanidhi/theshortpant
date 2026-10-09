// Per-page titles and descriptions, shared by the build-time pre-renderer
// (scripts/prerender.mjs bakes them into each page's HTML for search engines
// and link previews) and the live app (keeps the tab title in step as you
// navigate between pages).
import { BACK_POCKET_ITEMS } from "../pages/backPocket/data";

export type PageMeta = {
  path: string;
  // Written to dist/<file>; Netlify serves /work from work.html etc.
  file: string;
  // Browser-tab title, also used for the link-preview title unless
  // ogTitle overrides it.
  title: string;
  ogTitle?: string;
  description: string;
  // Absolute-path image for link previews; falls back to /og-image.png.
  image?: string;
};

const SITE_DESCRIPTION =
  "Portfolio of Kshamanidhi, a product designer in Raipur, India. A product should be clear, honest and consistent. Good design follows.";

// Link-preview descriptions read best around 150-200 characters.
function clip(text: string, max = 200): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length <= max ? flat : flat.slice(0, flat.lastIndexOf(" ", max - 1)) + "…";
}

export const PAGES: PageMeta[] = [
  {
    path: "/",
    file: "index.html",
    title: "The Short Pant — Product Designer",
    ogTitle: "Kshamanidhi, Product Designer",
    description: SITE_DESCRIPTION,
  },
  {
    path: "/work",
    file: "work.html",
    title: "Work · Kshamanidhi, Product Designer",
    description:
      "Case studies by Kshamanidhi: Vault2047 and Finance 2045 summit sites, a lifestyle app redesign for DIFC, and Donaleb, an employee wellness and social impact platform.",
  },
  {
    path: "/back-pocket",
    file: "back-pocket.html",
    title: "Back Pocket · Kshamanidhi, Product Designer",
    description:
      "Plugins, animations, illustrations, and other things Kshamanidhi made on the side: Figma plugins, Monster Wall, a Remotion motion studio and a design token guide.",
  },
  ...BACK_POCKET_ITEMS.filter((item) => item.detail).map((item) => ({
    path: `/back-pocket/${item.id}`,
    file: `back-pocket/${item.id}.html`,
    title: `${item.detail!.title} · Kshamanidhi`,
    description: clip(item.detail!.description),
    image: item.card.image,
  })),
];

export function pageTitle(path: string): string {
  const normalized = path.length > 1 ? path.replace(/\/+$/, "") : path;
  return (PAGES.find((page) => page.path === normalized) ?? PAGES[0]).title;
}
