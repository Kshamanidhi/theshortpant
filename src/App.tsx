import { useState } from "react";
import Navbar from "./components/Navbar";
import InkSplash from "./components/InkSplash";
import BrushOverlay from "./components/BrushOverlay";
import Hero from "./sections/Hero";
import WhyICreate from "./sections/WhyICreate";
import ThingsINotice from "./sections/ThingsINotice";
import SelectedWork from "./sections/SelectedWork";
import CurrentlyExploring from "./sections/CurrentlyExploring";
import Closing from "./sections/Closing";
import WorkPage from "./pages/WorkPage";
import BackPocketPage from "./pages/backPocket/BackPocketPage";
import BackPocketItemPage from "./pages/backPocket/BackPocketItemPage";
import { RouterProvider, useRouter } from "./lib/router";

function HomePage({ showBrushOverlay }: { showBrushOverlay: boolean }) {
  return (
    <>
      <Hero />
      <p className="mobile-only-notice">Experience the site on desktop.</p>
      <div className="hide-on-mobile">
        <WhyICreate />
        <ThingsINotice />
      </div>
      <SelectedWork />
      <div className="hide-on-mobile">
        <CurrentlyExploring />
      </div>
      <Closing />
      {showBrushOverlay && <BrushOverlay />}
    </>
  );
}

function Routes({ showBrushOverlay }: { showBrushOverlay: boolean }) {
  const { path } = useRouter();
  const backPocketId = path.match(/^\/back-pocket\/([^/]+)\/?$/)?.[1];

  let page;
  if (path === "/work") page = <WorkPage />;
  else if (path === "/back-pocket" || path === "/back-pocket/") page = <BackPocketPage />;
  // Keyed by id so moving between two items starts the new one collapsed.
  else if (backPocketId) page = <BackPocketItemPage key={backPocketId} id={backPocketId} />;
  else page = <HomePage showBrushOverlay={showBrushOverlay} />;

  return <main>{page}</main>;
}

export default function App() {
  // BrushOverlay is a mouse-drag drawing canvas, home page only — it
  // doesn't make sense as a touch interaction (left unmounted below
  // desktop width, no point wiring up its listeners), and is scoped to
  // the home page rather than every route.
  const [showBrushOverlay] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1025px)").matches
  );

  return (
    <RouterProvider>
      <Navbar />
      <Routes showBrushOverlay={showBrushOverlay} />
      <InkSplash />
    </RouterProvider>
  );
}
