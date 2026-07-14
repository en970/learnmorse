"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import type { LanguageId } from "../morse/alphabets";
import { usePersistentState } from "../storage";

export type ThemeMode = "light" | "dark" | "auto";
export type PaletteId =
  | "peach-pine"
  | "dawn-coral"
  | "harbor-teal"
  | "soft-sunset";

export const PALETTE_IDS: PaletteId[] = [
  "peach-pine",
  "dawn-coral",
  "harbor-teal",
  "soft-sunset",
];

interface Settings {
  language: LanguageId;
  palette: PaletteId;
  theme: ThemeMode;
  soundEnabled: boolean;
  singleSwitch: boolean;
  singleSwitchHoldMs: number;
}

const DEFAULT_SETTINGS: Settings = {
  language: "en",
  palette: "peach-pine",
  theme: "auto",
  soundEnabled: true,
  singleSwitch: false,
  singleSwitchHoldMs: 350,
};

interface SettingsContextValue extends Settings {
  setLanguage: (language: LanguageId) => void;
  setPalette: (palette: PaletteId) => void;
  setTheme: (theme: ThemeMode) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSingleSwitch: (enabled: boolean) => void;
  setSingleSwitchHoldMs: (ms: number) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = usePersistentState<Settings>(
    "settings",
    DEFAULT_SETTINGS,
  );

  useEffect(() => {
    // A palette from an older version of the app (e.g. the since-retired
    // "honey" option) might still be sitting in someone's localStorage —
    // fall back to the default rather than rendering with no matching
    // tokens at all.
    if (!PALETTE_IDS.includes(settings.palette)) {
      setSettings((s) => ({ ...s, palette: DEFAULT_SETTINGS.palette }));
      return;
    }

    const root = document.documentElement;
    root.setAttribute("data-palette", settings.palette);
    root.lang = settings.language;
    if (settings.theme === "auto") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", settings.theme);
    }
  }, [settings.palette, settings.language, settings.theme, setSettings]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      ...settings,
      setLanguage: (language) => setSettings((s) => ({ ...s, language })),
      setPalette: (palette) => setSettings((s) => ({ ...s, palette })),
      setTheme: (theme) => setSettings((s) => ({ ...s, theme })),
      setSoundEnabled: (soundEnabled) =>
        setSettings((s) => ({ ...s, soundEnabled })),
      setSingleSwitch: (singleSwitch) =>
        setSettings((s) => ({ ...s, singleSwitch })),
      setSingleSwitchHoldMs: (singleSwitchHoldMs) =>
        setSettings((s) => ({ ...s, singleSwitchHoldMs })),
    }),
    [settings, setSettings],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
