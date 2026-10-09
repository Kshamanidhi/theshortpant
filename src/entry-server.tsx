// Build-time pre-rendering entry (see scripts/prerender.mjs). Renders a page
// to static HTML in Node so search engines and link scrapers that don't run
// JavaScript still get real content, plus per-page title/description/preview
// tags. Never shipped to the browser.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
export { PAGES } from "./lib/pageMeta";

export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <App initialPath={path} />
    </StrictMode>,
  );
}
