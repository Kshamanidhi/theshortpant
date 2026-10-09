import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type RouterContextValue = {
  path: string;
  navigate: (to: string) => void;
};

const RouterContext = createContext<RouterContextValue | null>(null);

// `initialPath` lets the build-time pre-renderer (src/entry-server.tsx) pick
// the page to render in Node, where there's no window.location to read.
export function RouterProvider({ children, initialPath }: { children: ReactNode; initialPath?: string }) {
  const [path, setPath] = useState(() => initialPath ?? window.location.pathname);

  useEffect(() => {
    function onPopState() {
      setPath(window.location.pathname);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function navigate(to: string) {
    if (to !== window.location.pathname) {
      window.history.pushState(null, "", to);
      setPath(to);
    }
  }

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used within RouterProvider");
  return ctx;
}
