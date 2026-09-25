# The Short Pant — Portfolio

Product designer portfolio site. Vite + React 19 (TypeScript), Tailwind CSS v4, GSAP for scroll-driven motion.

## Stack

- **Framework:** Vite + React 19 (TypeScript)
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` — no `tailwind.config.js`, tokens live in `src/index.css` inside `@theme {}`
- **Motion:** GSAP + ScrollTrigger
- **Routing:** a small custom History API router (`src/lib/router.tsx`) — just enough for the home page and `/work`

## Project structure

```
src/
  components/   — shared UI (Navbar, overlays, etc.)
  sections/     — home page sections (Hero, Work, etc.)
  pages/        — standalone routes (WorkPage)
  lib/          — router, GSAP setup
  index.css     — Tailwind import + design tokens
public/         — static assets (images, video, Lottie files)
```

## Dev

```bash
npm install
npm run dev      # start dev server at localhost:5173
npm run build    # type-check + production build
npm run preview  # preview the production build
npm run lint     # oxlint
```

## Deploy

Deploys as a static site. `public/_redirects` sends all paths to `index.html` (Netlify SPA fallback) so client-side routes like `/work` resolve correctly on a direct load or refresh.
