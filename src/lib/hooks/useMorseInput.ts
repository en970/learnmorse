"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const AUTO_CONFIRM_PAUSE_MS = 1400;
const DOUBLE_TAP_CLEAR_MS = 300;

export interface UseMorseInputOptions {
  onConfirm: (pattern: string) => void;
  enabled: boolean;
  singleSwitch: boolean;
  singleSwitchHoldMs: number;
  onActivity?: () => void;
  /** Fired the moment a dot or dash is added, for optional key-tap tones. */
  onSymbol?: (symbol: "." | "-") => void;
}

export interface MorseInputHandle {
  buffer: string;
  addDot: () => void;
  addDash: () => void;
  confirm: () => void;
  deleteLast: () => void;
  clear: () => void;
  /** For an on-screen single-switch button: call on press-start and press-end. */
  switchPress: () => void;
  switchRelease: () => void;
}

/**
 * Drives the dot/dash buffer for whichever letter is currently being
 * typed. Two input styles share this buffer:
 *  - Standard: separate dot / dash / confirm / delete actions, wired to
 *    both on-screen buttons and physical keys (J/. for dot, K/- for dash,
 *    space or enter to confirm, backspace/delete/I to delete).
 *  - Single switch: one key (space) where a short press is a dot and a
 *    held press is a dash. Since there's only one input, there's no
 *    separate confirm key — a short pause after the last symbol confirms
 *    automatically, and a quick double-press clears the buffer, mirroring
 *    how switch-access scanning tools are normally used.
 */
export function useMorseInput({
  onConfirm,
  enabled,
  singleSwitch,
  singleSwitchHoldMs,
  onActivity,
  onSymbol,
}: UseMorseInputOptions): MorseInputHandle {
  const [buffer, setBuffer] = useState("");
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdStart = useRef<number | null>(null);
  const lastRelease = useRef<number>(0);
  const switchKeyDown = useRef(false);

  const clearConfirmTimer = () => {
    if (confirmTimer.current) {
      clearTimeout(confirmTimer.current);
      confirmTimer.current = null;
    }
  };

  const scheduleAutoConfirm = useCallback((nextBuffer: string) => {
    clearConfirmTimer();
    confirmTimer.current = setTimeout(() => {
      if (nextBuffer.length > 0) onConfirm(nextBuffer);
      setBuffer("");
    }, AUTO_CONFIRM_PAUSE_MS);
  }, [onConfirm]);

  const addSymbol = useCallback(
    (symbol: "." | "-") => {
      if (!enabled) return;
      onActivity?.();
      onSymbol?.(symbol);
      setBuffer((prev) => {
        const next = prev + symbol;
        if (singleSwitch) scheduleAutoConfirm(next);
        return next;
      });
    },
    [enabled, singleSwitch, scheduleAutoConfirm, onActivity, onSymbol],
  );

  const addDot = useCallback(() => addSymbol("."), [addSymbol]);
  const addDash = useCallback(() => addSymbol("-"), [addSymbol]);

  const clear = useCallback(() => {
    clearConfirmTimer();
    setBuffer("");
  }, []);

  const deleteLast = useCallback(() => {
    if (!enabled) return;
    onActivity?.();
    clearConfirmTimer();
    setBuffer((prev) => prev.slice(0, -1));
  }, [enabled, onActivity]);

  const confirm = useCallback(() => {
    if (!enabled) return;
    clearConfirmTimer();
    setBuffer((prev) => {
      if (prev.length > 0) onConfirm(prev);
      return "";
    });
  }, [enabled, onConfirm]);

  const switchPress = useCallback(() => {
    if (!enabled || switchKeyDown.current) return;
    switchKeyDown.current = true;
    holdStart.current = performance.now();
  }, [enabled]);

  const switchRelease = useCallback(() => {
    if (!enabled) return;
    switchKeyDown.current = false;
    const start = holdStart.current;
    holdStart.current = null;
    if (start === null) return;

    const duration = performance.now() - start;
    const now = performance.now();
    if (now - lastRelease.current < DOUBLE_TAP_CLEAR_MS) {
      clear();
      lastRelease.current = 0;
      return;
    }
    lastRelease.current = now;
    addSymbol(duration >= singleSwitchHoldMs ? "-" : ".");
  }, [enabled, singleSwitchHoldMs, addSymbol, clear]);

  useEffect(() => clearConfirmTimer, []);

  // --- Physical keyboard: standard mode ---
  useEffect(() => {
    if (!enabled || singleSwitch) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = e.key;
      if (key === "." || key === "j" || key === "J") {
        e.preventDefault();
        addDot();
      } else if (key === "-" || key === "k" || key === "K") {
        e.preventDefault();
        addDash();
      } else if (key === " " || key === "Enter") {
        e.preventDefault();
        confirm();
      } else if (
        key === "Backspace" ||
        key === "Delete" ||
        key === "i" ||
        key === "I"
      ) {
        e.preventDefault();
        deleteLast();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, singleSwitch, addDot, addDash, confirm, deleteLast]);

  // --- Physical keyboard: single-switch mode (space bar as the switch) ---
  useEffect(() => {
    if (!enabled || !singleSwitch) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== " " || e.repeat) return;
      e.preventDefault();
      switchPress();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key !== " ") return;
      e.preventDefault();
      switchRelease();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [enabled, singleSwitch, switchPress, switchRelease]);

  return {
    buffer,
    addDot,
    addDash,
    confirm,
    deleteLast,
    clear,
    switchPress,
    switchRelease,
  };
}
