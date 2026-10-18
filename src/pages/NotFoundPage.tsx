import { useRouter } from "../lib/router";

// Served for any address that isn't a real page. On Netlify the build's
// 404.html (this page, pre-rendered) is returned with a real 404 status, so
// search engines drop the address instead of indexing a copy of the homepage.
export default function NotFoundPage() {
  const { navigate } = useRouter();
  const go = (to: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(to);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="nf">
      <span className="wk-kicker">404</span>
      <h1>This page slipped out of my back pocket.</h1>
      <p>The address doesn't match anything here. Try one of these instead:</p>
      <p className="nf-links">
        <a href="/" className="work-title-link" onClick={go("/")}>
          Home
        </a>
        <a href="/work" className="work-title-link" onClick={go("/work")}>
          Work
        </a>
        <a href="/back-pocket" className="work-title-link" onClick={go("/back-pocket")}>
          Back pocket
        </a>
      </p>
    </div>
  );
}
