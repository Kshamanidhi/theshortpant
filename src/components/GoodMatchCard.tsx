import { useState } from "react";

// Each checklist item reveals one or more sketches elsewhere on the card —
// checking "You care about the problem" reveals two head sketches at once,
// the other two each reveal one drawing (a full figure, a side profile).
const ITEMS = ["You care about the problem.", "Want me to think with you, not just for you.", "Designing for version 20"];

export default function GoodMatchCard() {
  const [checked, setChecked] = useState([false, false, false]);
  const allChecked = checked.every(Boolean);

  function toggle(i: number) {
    setChecked((prev) => prev.map((c, idx) => (idx === i ? !c : c)));
  }

  return (
    <div className="gm-wrap">
      <div className={`gm-card${allChecked ? " gm-tilted" : ""}`}>
        <img className="gm-page-bg" src="/typewriter-page%201.png" alt="" aria-hidden="true" />

        <div className="gm-content">
          <p className="gm-heading">Are we a good match?</p>
          <div className="gm-rule" />

          <div className="gm-body">
            <div className="gm-left">
              <div className="gm-heads" aria-hidden="true">
                <img
                  className={`gm-head gm-head-1${checked[0] ? " gm-visible" : ""}`}
                  src="/close-01.png"
                  alt=""
                />
                <img
                  className={`gm-head gm-head-2${checked[0] ? " gm-visible" : ""}`}
                  src="/close-02.png"
                  alt=""
                />
                <img
                  className={`gm-head gm-head-3${checked[2] ? " gm-visible" : ""}`}
                  src="/close-03.png"
                  alt=""
                />
              </div>

              <ul className="gm-checklist">
                {ITEMS.map((label, i) => (
                  <li key={label}>
                    <button
                      type="button"
                      className="gm-check-row"
                      onClick={() => toggle(i)}
                      aria-pressed={checked[i]}
                    >
                      <span className={`gm-checkbox${checked[i] ? " gm-checked" : ""}`} aria-hidden="true">
                        {checked[i] && (
                          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                            <path d="M1 4.5L4 7.5L10 1" stroke="var(--color-bg)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className={`gm-check-label${checked[i] ? " gm-struck" : ""}`}>{label}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <a href="mailto:kshamanidhikg@gmail.com" className="gm-cta">
                Let's find out <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="gm-figure-slot" aria-hidden="true">
              <img
                className={`gm-figure${checked[1] ? " gm-visible" : ""}`}
                src="/close-04.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
