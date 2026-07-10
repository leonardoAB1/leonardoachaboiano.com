"use client";

import { useCallback, useSyncExternalStore } from "react";

// Generic matchMedia hook, built on useSyncExternalStore - the hook React
// provides specifically for reading a value from something outside React
// (here, the browser's matchMedia API) and re-rendering when it changes.
// This replaces the older useState+useEffect+addEventListener pattern: that
// version called setState synchronously inside the effect body just to seed
// the initial value, which is exactly the anti-pattern eslint-plugin-react-hooks'
// set-state-in-effect rule flags (it causes an extra render on mount and
// isn't safe under concurrent rendering). useSyncExternalStore reads the
// current value directly during render instead.
// Returns false on the server and during hydration (see getServerSnapshot).
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );
  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
