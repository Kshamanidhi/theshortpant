# MyPortfolio — Claude Guide

## Stack
- **Framework:** Vite + React 19 (TypeScript)
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` — no `tailwind.config.js`
- **Design tokens:** Defined in `src/index.css` inside `@theme {}`

## Project Structure
```
src/
  components/    — Shared UI components (Navbar, etc.)
  sections/      — Full-page sections (Hero, Work, Skills, Contact)
  index.css      — Tailwind import + CSS custom properties
  App.tsx        — Root layout
```

## Key conventions
- Design tokens are referenced as `var(--color-*)` CSS variables
- Each page section lives in `src/sections/` as its own file
- Shared/reusable pieces go in `src/components/`
- No `App.css` — all global styles are in `index.css`

## Dev
```bash
npm run dev      # start dev server at localhost:5173
npm run build    # production build
npm run preview  # preview production build
```
