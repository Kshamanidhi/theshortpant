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
              <div className="wk-cover">
                {project.caseStudy && <span className="wk-badge">case study</span>}
                <img src={project.cover} alt="" loading="lazy" />
              </div>
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
              {project.caseStudy ? (
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
