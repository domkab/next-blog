import { useEffect, useState } from "react";

type UseMediaQueryOptions = {
  defaultValue?: boolean;
};

type LegacyMql = MediaQueryList & {
  addListener?: (listener: (e: MediaQueryListEvent) => void) => void;
  removeListener?: (listener: (e: MediaQueryListEvent) => void) => void;
};

export const useMediaQuery = (
  query: string,
  options: UseMediaQueryOptions = {},
) => {
  const { defaultValue = false } = options;
  const [matches, setMatches] = useState<boolean>(defaultValue);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql: LegacyMql = window.matchMedia(query);

    const onChange = () => setMatches(mql.matches);

    // set immediately on mount
    onChange();

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }

    // Safari < 14 / legacy
    if (typeof mql.addListener === "function") {
      mql.addListener(onChange);
      return () => mql.removeListener?.(onChange);
    }

    return;
  }, [query]);

  return matches;
};