import { useState } from "react";

// Each checklist item reveals one illustration, in reading order: the first
// item the figure on the left, the second and third the two on the right.
const ITEMS = ["You care about the problem.", "Want me to think with you, not just for you.", "Designing for version 20"];

export default function GoodMatchCard() {
  const [checked, setChecked] = useState([false, false, false]);

  function toggle(i: number) {
    setChecked((prev) => prev.map((c, idx) => (idx === i ? !c : c)));
  }

  const illo = (i: number, src: string, variant: string) => (
    <img className={`gm-illo gm-illo-${variant}${checked[i] ? " gm-visible" : ""}`} src={src} alt="" />
  );

  return (
    <div className="gm-wrap">
      <p className="gm-heading">Are we a good match?</p>
      <div className="gm-rule" />

      <div className="gm-stage">
        <div className="gm-side" aria-hidden="true">
          {illo(0, "/ThreeIMG.png", "butterfly")}
        </div>

        <ul className="gm-checklist">
          {ITEMS.map((label, i) => (
            <li key={label}>
              <button type="button" className="gm-check-row" onClick={() => toggle(i)} aria-pressed={checked[i]}>
                <span className="gm-checkbox" aria-hidden="true">
                  {checked[i] && (
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                      <path
                        d="M1 4.5L4 7.5L10 1"
                        stroke="var(--color-fg)"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className={`gm-check-label${checked[i] ? " gm-struck" : ""}`}>{label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="gm-side" aria-hidden="true">
          {illo(1, "/OneIMG.png", "sitting")}
          {illo(2, "/TwoIMG.png", "hip")}
        </div>
      </div>

      <div className="gm-cta-row">
        <a href="mailto:kshamanidhikg@gmail.com" className="gm-cta">
          Let's find out <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}
