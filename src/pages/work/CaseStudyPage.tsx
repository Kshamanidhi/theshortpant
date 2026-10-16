import { useEffect, useState } from "react";
import { useRouter } from "../../lib/router";
import { WORK_PROJECTS, type Decision, type Text } from "./data";
import { T } from "./WorkIndexPage";

const SECTIONS = [
  ["overview", "Overview"],
  ["problem", "Problem"],
  ["constraints", "Constraints"],
  ["decisions", "Key decisions"],
  ["process", "Process"],
  ["outcome", "Outcome"],
  ["reflections", "Reflections"],
] as const;

function Paragraphs({ items }: { items: Text[] }) {
  return (
    <>
      {items.map((item, i) => (
        <p key={i}>
          <T value={item} />
        </p>
      ))}
    </>
  );
}

function Bullets({ items }: { items: Text[] }) {
  return (
    <ul className="cs-bullets">
      {items.map((item, i) => (
        <li key={i}>
          <T value={item} />
        </li>
      ))}
    </ul>
  );
}

// Shows what was chosen; the toggle swaps in the rejected option and why it
// lost. Both panes stay in the DOM (one hidden) so the rejected reasoning is
// in the page source for search engines too, and the card never changes
// height when flipped — the two panes share one grid cell. (Images load
// eagerly: a lazy hidden-side image would only load on flip and resize the
// card then.)
function DecisionCard({ decision, index }: { decision: Decision; index: number }) {
  const [side, setSide] = useState<"chosen" | "rejected">("chosen");
  const num = String(index + 1).padStart(2, "0");

  return (
    <article className="dc">
      <div className="dc-head">
        <h3>
          <T value={decision.title} />
        </h3>
        <span className="dc-num">Decision {num}</span>
      </div>
      <p className="dc-situation">
        <T value={decision.situation} />
      </p>
      <div className="dc-seg" role="tablist" aria-label={`Decision ${num}`}>
        <button type="button" role="tab" aria-selected={side === "chosen"} onClick={() => setSide("chosen")}>
          ✓ What I chose
        </button>
        <button
          type="button"
          role="tab"
          className="dc-seg-rejected"
          aria-selected={side === "rejected"}
          onClick={() => setSide("rejected")}
        >
          ✕ What I rejected
        </button>
      </div>
      <div className="dc-stage">
        <div className="dc-pane dc-chosen" hidden={side !== "chosen"}>
          {decision.chosen.image ? (
            <img src={decision.chosen.image} alt="" />
          ) : (
            <div className="dc-img-ph">final screen</div>
          )}
          <div>
            <h4>CHOSEN</h4>
            <p>
              <T value={decision.chosen.text} />
            </p>
            <p className="dc-why">
              <b>Why:</b> <T value={decision.chosen.why} />
            </p>
          </div>
        </div>
        <div className="dc-pane dc-rejected" hidden={side !== "rejected"}>
          {decision.rejected.image ? (
            <img src={decision.rejected.image} alt="" />
          ) : (
            <div className="dc-img-ph">rejected option</div>
          )}
          <div>
            <h4>
              REJECTED <span className="dc-stamp">not shipped</span>
            </h4>
            <p>
              <T value={decision.rejected.text} />
            </p>
            <p className="dc-why">
              <b>Why not:</b> <T value={decision.rejected.whyNot} />
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function CaseStudyPage({ id }: { id: string }) {
  const { navigate } = useRouter();
  const project = WORK_PROJECTS.find((p) => p.id === id && p.caseStudy);
  const [active, setActive] = useState<string>("overview");

  // Unknown id, or a project without a case study yet — back to the grid.
  useEffect(() => {
    if (!project) navigate("/work");
  }, [project, navigate]);

  // "On this page" follows whichever section is in the reading band.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setActive(en.target.id)),
      { rootMargin: "-30% 0px -60% 0px" },
    );
    SECTIONS.forEach(([sid]) => {
      const el = document.getElementById(sid);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  if (!project?.caseStudy) return null;
  const cs = project.caseStudy;

  return (
    <div className="cs">
      <a
        href="/work"
        className="cs-back work-title-link"
        onClick={(e) => {
          e.preventDefault();
          navigate("/work");
          window.scrollTo({ top: 0 });
        }}
      >
        <span aria-hidden="true">←</span> work
      </a>

      <header className="cs-hero">
        <div>
          {cs.logo && <img className="cs-logo" src={cs.logo.src} alt={cs.logo.alt} />}
          <span className="wk-kicker">case study · {project.title.toLowerCase()}</span>
          <h1>{cs.headline}</h1>
          <div className="cs-tldr">
            <p>
              <b>Problem</b>
              <T value={cs.tldr.problem} />
            </p>
            <p>
              <b>What I did</b>
              <T value={cs.tldr.did} />
            </p>
            <p>
              <b>Result</b>
              <T value={cs.tldr.result} />
            </p>
          </div>
        </div>
        <img className="cs-hero-img hide-on-mobile" src={cs.heroImage} alt="" />
      </header>

      <dl className="cs-facts">
        {cs.facts.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>
              <T value={fact.value} />
            </dd>
          </div>
        ))}
      </dl>

      <div className="cs-body">
        <nav className="cs-toc" aria-label="On this page">
          {SECTIONS.map(([sid, label]) => (
            <a key={sid} href={`#${sid}`} className={active === sid ? "on" : undefined}>
              {label}
            </a>
          ))}
        </nav>

        <div className="cs-main">
          <section id="overview">
            <h2>Overview</h2>
            <Paragraphs items={cs.overview} />
            <h3 className="cs-sub">What I owned</h3>
            <Bullets items={cs.ownership} />
            <h3 className="cs-sub">Who else was involved</h3>
            <dl className="cs-team">
              {cs.team.map((member) => (
                <div key={member.who}>
                  <dt>
                    {member.who} <span>· {member.role}</span>
                  </dt>
                  <dd>
                    <T value={member.did} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="problem">
            <h2>Problem</h2>
            <Paragraphs items={cs.problem} />
          </section>

          <section id="constraints">
            <h2>Constraints</h2>
            <Bullets items={cs.constraints} />
          </section>

          <section id="decisions">
            <h2>Key decisions</h2>
            <p className="cs-note">Each card shows what I chose. Flip it to see the option I rejected, and why.</p>
            <div className="cs-decisions">
              {cs.decisions.map((decision, i) => (
                <DecisionCard key={i} decision={decision} index={i} />
              ))}
            </div>
          </section>

          <section id="process">
            <h2>Process</h2>
            <p>
              <T value={cs.process.intro} />
            </p>
            {/* Column widths follow each image's aspect ratio, so the three
                steps share one height whatever their shape. Each opens
                full size, so wireframe detail stays readable. */}
            <div
              className="cs-process"
              style={{ gridTemplateColumns: cs.process.steps.map((s) => `${s.aspect}fr`).join(" ") }}
            >
              {cs.process.steps.map((step, i) => (
                <figure key={step.label}>
                  <a href={step.image} target="_blank" rel="noopener noreferrer" className="cs-zoom">
                    <img src={step.image} alt={`${step.label}: ${step.caption}`} loading="lazy" />
                  </a>
                  <figcaption>
                    {String(i + 1).padStart(2, "0")} · {step.label}
                    <span>{step.caption}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            {cs.process.sketchbook && (
              <>
                <h3 className="cs-sub">More from the sketchbook</h3>
                <div className="cs-sketchbook">
                  {cs.process.sketchbook.map((sketch) => (
                    <figure key={sketch.image}>
                      <a href={sketch.image} target="_blank" rel="noopener noreferrer" className="cs-zoom">
                        <img src={sketch.image} alt={`Sketch: ${sketch.caption}`} loading="lazy" />
                      </a>
                      <figcaption>{sketch.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </>
            )}
          </section>

          <section id="outcome">
            <h2>Outcome</h2>
            <Paragraphs items={cs.outcome.paragraphs} />
            <div className="cs-numbers">
              {cs.outcome.numbers.map((n, i) => (
                <div key={i}>
                  <strong>
                    <T value={n.value} />
                  </strong>
                  <span>
                    <T value={n.label} />
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section id="reflections">
            <h2>Reflections</h2>
            <Bullets items={cs.reflections} />
          </section>

          <div className="cs-next">
            <a
              href="/work"
              className="work-title-link"
              onClick={(e) => {
                e.preventDefault();
                navigate("/work");
                window.scrollTo({ top: 0 });
              }}
            >
              <span aria-hidden="true">←</span> All work
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
