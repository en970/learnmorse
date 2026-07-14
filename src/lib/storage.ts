"use client";

import { useEffect, useRef, useState } from "react";

const PREFIX = "learnmorse:";

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage full or unavailable (private browsing, etc.) — fail quietly,
    // progress just won't persist this session.
  }
}

/**
 * Persistent piece of state backed by localStorage. Starts from `initial`
 * on every render (so server and first client render match, avoiding a
 * hydration warning), then syncs from storage right after mount.
 */
export function usePersistentState<T>(
  key: string,
  initial: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(initial);
  const loaded = useRef(false);

  useEffect(() => {
    // Deliberate one-time read on mount: localStorage isn't available
    // during the static prerender, so the real value can only be known
    // once we're running in the browser. Keeping `initial` as the first
    // render's value (both server and client) is what avoids a hydration
    // mismatch here — this isn't the "effect causing cascading state"
    // pattern the rule is meant to catch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(readJSON(key, initial));
    loaded.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!loaded.current) return;
    writeJSON(key, value);
  }, [key, value]);

  return [value, setValue];
}
