import { useEffect, useState } from "react";
import { useRouter } from "../../lib/router";
import ProjectSlide from "../../components/ProjectSlide";
import { BACK_POCKET_ITEMS } from "./data";

export default function BackPocketItemPage({ id }: { id: string }) {
  const { navigate } = useRouter();
  const [expanded, setExpanded] = useState(false);
  const item = BACK_POCKET_ITEMS.find((it) => it.id === id && it.detail);

  // Unknown id, or a card-only item (no page of its own) — fall back to
  // the card field rather than rendering an empty slide.
  useEffect(() => {
    if (!item) navigate("/back-pocket");
  }, [item, navigate]);

  if (!item?.detail) return null;

  return (
    <div style={{ position: "relative" }}>
      <a
        href="/back-pocket"
        className="work-title-link"
        onClick={(e) => {
          e.preventDefault();
          navigate("/back-pocket");
          window.scrollTo({ top: 0 });
        }}
        style={{ position: "absolute", top: "6.5rem", left: "2rem", zIndex: 1, fontSize: "0.9375rem" }}
      >
        <span aria-hidden="true">←</span> back pocket
      </a>
      <ProjectSlide project={item.detail} expanded={expanded} onToggle={() => setExpanded((v) => !v)} standalone />
    </div>
  );
}
