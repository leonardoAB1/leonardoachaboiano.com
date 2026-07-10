"use client";

import { useSyncExternalStore } from "react";

// There's nothing to subscribe to here - hydration only happens once - so
// the subscribe function is a no-op that never calls back.
const subscribe = () => () => {};

// Renders false on the server and during hydration, then true afterward -
// the standard fix for "show a placeholder until the client takes over"
// (e.g. before reading a theme that only exists in localStorage). The old
// pattern for this was useState(false) + useEffect(() => setMounted(true)),
// but calling setState synchronously in an effect body is exactly what
// eslint-plugin-react-hooks' set-state-in-effect rule flags. React's actual
// primitive for "value differs between server and client, briefly" is
// useSyncExternalStore's getServerSnapshot/getSnapshot split.
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
