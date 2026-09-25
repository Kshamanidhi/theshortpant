import { useEffect, useRef, useState } from "react";
import { useRouter } from "../lib/router";

function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const goingDown = y > lastY.current;
        setHidden(goingDown && y > 80);
        lastY.current = y;
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return hidden;
}

const tickerStyle: React.CSSProperties = {
  display: "block",
  lineHeight: "1",
  transition: "transform 0.4s cubic-bezier(0.76, 0, 0.24, 1)",
};

const LOGO_GRADIENTS = [
  "linear-gradient(115deg, #ff5f6d, #ffc371, #a86bd6)",
  "linear-gradient(115deg, #7f7fd5, #86a8e7, #91eae4)",
  "linear-gradient(115deg, #f093fb, #f5576c, #ffd452)",
  "linear-gradient(115deg, #43e97b, #38f9d7, #2d9cdb)",
  "linear-gradient(115deg, #fa709a, #fee140, #ff5f6d)",
  "linear-gradient(115deg, #30cfd0, #7f7fd5, #f5576c)",
];

function Logo() {
  const [gradient, setGradient] = useState(LOGO_GRADIENTS[0]);
  const [hoverKey, setHoverKey] = useState(0);
  const { navigate } = useRouter();

  return (
    <a
      href="/"
      className="logo-mark"
      style={{ display: "block", lineHeight: 0, position: "relative" }}
      onClick={(e) => {
        e.preventDefault();
        navigate("/");
        window.scrollTo({ top: 0 });
      }}
      onMouseEnter={() => {
        setGradient(LOGO_GRADIENTS[Math.floor(Math.random() * LOGO_GRADIENTS.length)]);
        setHoverKey((k) => k + 1);
      }}
    >
      <img
        src="/logo.svg"
        alt="The Short Pant"
        style={{ height: "3.5rem", width: "auto", display: "block" }}
      />
      <span
        key={hoverKey}
        className="logo-mark-sweep"
        aria-hidden="true"
        style={{ backgroundImage: gradient }}
      />
    </a>
  );
}

function NavLink({
  href,
  label,
  onClick,
  className,
}: {
  href: string;
  label: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`nav-ticker${className ? ` ${className}` : ""}`}
      style={{
        display: "block",
        overflow: "hidden",
        height: "1em",
        lineHeight: "1",
        fontSize: "1rem",
        color: "var(--color-fg)",
        textDecoration: "none",
      }}
    >
      <span style={tickerStyle}>{label}</span>
      <span style={tickerStyle} aria-hidden="true">{label}</span>
    </a>
  );
}

function navLinkProps(link: string, path: string, navigate: (to: string) => void) {
  if (link === "work") {
    return {
      href: "/work",
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate("/work");
        window.scrollTo({ top: 0 });
      },
    };
  }

  // "about" / "connect" are anchors on the home page — if we're already
  // there, let the browser jump natively; otherwise navigate home first,
  // then scroll to the anchor once it's mounted.
  if (path === "/") {
    return { href: `#${link}` };
  }

  return {
    href: `/#${link}`,
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      navigate("/");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById(link)?.scrollIntoView();
        });
      });
    },
  };
}

export default function Navbar() {
  const hidden = useHideOnScroll();
  const { path, navigate } = useRouter();

  return (
    <>
      <style>{`
        .nav-ticker:hover span {
          transform: translateY(-100%);
        }

        .logo-mark-sweep {
          position: absolute;
          inset: 0;
          pointer-events: none;
          -webkit-mask-image: url(/logo.svg);
          mask-image: url(/logo.svg);
          -webkit-mask-size: contain;
          mask-size: contain;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-position: center;
          mask-position: center;
          background-size: 250% 100%;
          background-position: 100% 0;
          opacity: 0;
          transition: opacity 350ms ease;
        }

        .logo-mark:hover .logo-mark-sweep {
          opacity: 1;
          animation: logo-sweep 700ms cubic-bezier(.19, 1, .22, 1) forwards;
        }

        @keyframes logo-sweep {
          from { background-position: 100% 0; }
          to { background-position: 0% 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .logo-mark-sweep {
            transition: none;
            animation: none !important;
          }

          nav {
            transition: none !important;
          }
        }

      `}</style>

      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{
          padding: "1.25rem 2rem",
          backgroundColor: "var(--color-bg)",
          transform: hidden ? "translateY(-110%)" : "translateY(0)",
          transition: "transform 350ms cubic-bezier(.19, 1, .22, 1)",
        }}
      >
        {/* Logo */}
        <Logo />

        {/* Nav links + social */}
        <div className="flex items-center" style={{ gap: "2.5rem" }}>
          {["about", "work", "connect"].map((link) => (
            <NavLink
              key={link}
              label={link}
              // "about"/"connect" hidden everywhere for now (not just
              // mobile) — kept in the map rather than deleted so they're
              // easy to bring back later.
              className={link === "work" ? undefined : "hide-for-now"}
              {...navLinkProps(link, path, navigate)}
            />
          ))}

          {/* Social buttons */}
          <div className="flex items-center hide-on-mobile" style={{ gap: "0.5rem", marginLeft: "0.5rem" }}>
            {[
              { label: "in", href: "https://www.linkedin.com/in/kshamanidhi/" },
              { label: "insta", href: "https://www.instagram.com/theshortpant/" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-fg)",
                  border: "1px solid var(--color-fg)",
                  padding: "0.25rem 0.625rem",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
