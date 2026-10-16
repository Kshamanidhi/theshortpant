import { useEffect } from "react";
import { useRouter } from "../../lib/router";
import { WORK_PROJECTS, type Text } from "./data";

// A string renders as-is; a todo() renders as a dashed placeholder showing
// what still needs writing.
export function T({ value }: { value: Text }) {
  return typeof value === "string" ? <>{value}</> : <span className="todo-ph">{value.todo}</span>;
}

export default function WorkIndexPage() {
  const { navigate } = useRouter();

  // Homepage links to a project without a case study as /work#<id> — land
  // on that card instead of the top of the grid.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <div className="wk">
      <header className="wk-head">
        <span className="wk-kicker">work</span>
        <h1>Selected case studies</h1>
      </header>

      <div className="wk-grid">
        {WORK_PROJECTS.map((project) => {
          const body = (
            <>
              {project.locked ? (
                <div className="wk-cover wk-cover-locked">
                  <span className="wk-badge wk-badge-muted">coming soon · under NDA</span>
                  <div className="wk-cover-pair">
                    {project.locked.images.map((src) => (
                      <img key={src} src={src} alt="" loading="lazy" />
                    ))}
                  </div>
                  <div className="wk-lock" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="11" width="16" height="10" rx="2" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                    <span>Under NDA</span>
                  </div>
                </div>
              ) : (
                <div className="wk-cover">
                  {project.caseStudy?.decisions && <span className="wk-badge">deep dive</span>}
                  <img src={project.cover} alt="" loading="lazy" />
                </div>
              )}
              <h2 className="wk-title">{project.title}</h2>
              <p className="wk-line">
                {project.line}
                {project.outcome && (
                  <>
                    {" "}
                    <T value={project.outcome} />
                  </>
                )}
              </p>
              <ul className="wk-tags">
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              {project.locked ? (
                <a
                  href={project.locked.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wk-cta wk-cta-contact"
                >
                  {project.locked.cta.label} <span aria-hidden="true">↗</span>
                </a>
              ) : project.caseStudy ? (
                <span className="wk-cta">
                  View case study <span aria-hidden="true">→</span>
                </span>
              ) : (
                <span className="wk-cta wk-cta-soon">Case study coming soon</span>
              )}
            </>
          );

          return project.caseStudy ? (
            <a
              key={project.id}
              id={project.id}
              href={`/work/${project.id}`}
              className="wk-card wk-card-link"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/work/${project.id}`);
                window.scrollTo({ top: 0 });
              }}
            >
              {body}
            </a>
          ) : (
            <div key={project.id} id={project.id} className="wk-card">
              {body}
            </div>
          );
        })}
      </div>
    </div>
  );
}
