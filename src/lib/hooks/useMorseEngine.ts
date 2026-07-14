"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getAlphabet, type LanguageId } from "../morse/alphabets";
import { ENGLISH_WORDS } from "../morse/words.en";
import { TURKISH_WORDS } from "../morse/words.tr";
import {
  completionRatio,
  createEngineState,
  currentLetter,
  defaultConfig,
  type EngineConfig,
  type EngineState,
  hintLevel as computeHintLevel,
  letterProgress,
  submitAttempt,
  type SubmitResult,
} from "../morse/engine";
import { readJSON, writeJSON } from "../storage";

const WORDS: Record<LanguageId, string[]> = {
  en: ENGLISH_WORDS,
  tr: TURKISH_WORDS,
};

/**
 * Word selection is randomized, so the engine's starting state can only be
 * computed on the client — building it during the static prerender would
 * bake one random word into the HTML and hand hydration a different one,
 * tripping a mismatch. `state` stays null until the post-mount effect
 * below loads (or creates) it.
 */
export function useMorseEngine(language: LanguageId) {
  const alphabet = useMemo(() => getAlphabet(language), [language]);
  const config: EngineConfig = useMemo(
    () => defaultConfig(alphabet.letterOrder, WORDS[language]),
    [alphabet, language],
  );

  const storageKey = `progress:${language}`;
  const [state, setState] = useState<EngineState | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // One-time load right after mount: word selection is randomized, so
    // this can only run on the client (see the comment on `state` above).
    const stored = readJSON<EngineState | null>(storageKey, null);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(stored ?? createEngineState(config));
    setLoaded(true);
    // Re-run only when the language (and therefore storage key) changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    if (!loaded || !state) return;
    writeJSON(storageKey, state);
  }, [state, loaded, storageKey]);

  const submit = useCallback(
    (typed: string): SubmitResult | null => {
      if (!state) return null;
      const result = submitAttempt(state, config, typed);
      setState(result.state);
      return result;
    },
    [state, config],
  );

  const reset = useCallback(() => {
    const fresh = createEngineState(config);
    setState(fresh);
    writeJSON(storageKey, fresh);
  }, [config, storageKey]);

  return {
    alphabet,
    config,
    state,
    submit,
    reset,
    ready: loaded && state !== null,
    currentLetter: state ? currentLetter(state) : "",
    hintLevel: state ? computeHintLevel(state, config) : 0,
    progress: state ? letterProgress(state, config) : [],
    completion: state ? completionRatio(state, config) : 0,
  };
}

export type MorseEngineHandle = ReturnType<typeof useMorseEngine>;
