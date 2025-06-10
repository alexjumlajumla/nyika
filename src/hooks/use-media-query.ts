import { useState, useEffect } from 'react';

type MediaQueryCallback = (event: { matches: boolean; media: string }) => void;

/**
 * Older versions of Safari (shipped with Catalina and before) do not support addEventListener on matchMedia
 * https://stackoverflow.com/questions/56466261/matchmedia-addlistener-marked-as-deprecated-addeventlistener-options-argume
 */
function attachMediaListener(query: MediaQueryList, callback: MediaQueryCallback) {
  if (query.addEventListener) {
    query.addEventListener('change', callback);
    return () => query.removeEventListener('change', callback);
  } else {
    // Fallback for older browsers
    query.addListener(callback);
    return () => query.removeListener(callback);
  }
}

/**
 * Returns a boolean indicating whether the media query matches the current viewport.
 * @param query The media query to evaluate
 * @param defaultState The default state to return if the hook is being run on the server
 * @returns boolean indicating whether the media query matches
 */
function useMediaQuery(query: string, defaultState = false) {
  const [state, setState] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return defaultState;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(query);
    setState(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setState(event.matches);
    };

    const cleanup = attachMediaListener(mediaQuery, listener as unknown as MediaQueryCallback);
    return () => {
      cleanup?.();
    };
  }, [query]);

  return state;
}

export { useMediaQuery };

// Usage examples:
// const isSmall = useMediaQuery('(min-width: 640px)');
// const isMedium = useMediaQuery('(min-width: 768px)');
// const isLarge = useMediaQuery('(min-width: 1024px)');
// const isXLarge = useMediaQuery('(min-width: 1280px)');
// const is2XLarge = useMediaQuery('(min-width: 1536px)');
