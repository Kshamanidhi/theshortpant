// True only while the build renders pages to static HTML in Node (there's no
// window there). Pre-rendered pages open every "Read more" so the full write-
// ups land in the HTML that search engines and link scrapers read; visitors
// always get the live app, which starts collapsed as usual.
export const IS_PRERENDER = typeof window === "undefined";
