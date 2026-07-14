"use client";

import { useCallback, useMemo, useState } from "react";
import { useMorseInput } from "@/lib/hooks/useMorseInput";
import { getMorseAudio } from "@/lib/morse/audio";
import type { UiStrings } from "@/lib/i18n/strings";
import { ControlKeys } from "./ControlKeys";
import styles from "./ReviewMode.module.css";

interface ReviewModeProps {
  letters: string[];
  morse: Record<string, string>;
  strings: UiStrings;
  singleSwitch: boolean;
  singleSwitchHoldMs: number;
  soundEnabled: boolean;
  onExit: () => void;
}

function shuffled(items: string[]): string[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

type Phase = "intro" | "playing" | "done";

export function ReviewMode({
  letters,
  morse,
  strings,
  singleSwitch,
  singleSwitchHoldMs,
  soundEnabled,
  onExit,
}: ReviewModeProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [queue, setQueue] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  const currentLetter = queue[index] ?? "";
  const currentPattern = morse[currentLetter] ?? "";

  const handleConfirm = useCallback(
    (pattern: string) => {
      const isCorrect = pattern === currentPattern;
      setFeedback(isCorrect ? "correct" : "incorrect");
      if (isCorrect) setCorrect((c) => c + 1);
      if (soundEnabled) {
        const audio = getMorseAudio();
        audio.setEnabled(true);
        void audio.playPattern(currentPattern);
      }

      setTimeout(() => {
        setFeedback(null);
        setIndex((i) => {
          const nextIndex = i + 1;
          if (nextIndex >= queue.length) {
            setPhase("done");
            return i;
          }
          return nextIndex;
        });
      }, 500);
    },
    [currentPattern, queue.length, soundEnabled],
  );

  const input = useMorseInput({
    onConfirm: handleConfirm,
    enabled: phase === "playing" && feedback === null,
    singleSwitch,
    singleSwitchHoldMs,
  });

  const start = () => {
    setQueue(shuffled(Array.from(new Set(letters))));
    setIndex(0);
    setCorrect(0);
    setFeedback(null);
    setPhase("playing");
  };

  const total = queue.length;

  const scoreLabel = useMemo(
    () => strings.review.correctOf(correct, total),
    [correct, total, strings],
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.header}>
        <span className={styles.title}>{strings.review.title}</span>
        <button
          type="button"
          className={styles.exit}
          onClick={onExit}
          aria-label={strings.review.exit}
        >
          &#10005;
        </button>
      </div>

      {phase === "intro" && (
        <div className={styles.intro}>
          <p>
            {letters.length > 0
              ? strings.review.subtitle
              : strings.review.empty}
          </p>
          {letters.length > 0 && (
            <button type="button" className={styles.primaryButton} onClick={start}>
              {strings.review.start}
            </button>
          )}
        </div>
      )}

      {phase === "playing" && (
        <>
          <div className={styles.score}>{scoreLabel}</div>
          <div className={styles.body}>
            <div className={styles.letter}>{currentLetter.toUpperCase()}</div>
            <div className={styles.buffer}>
              {[...input.buffer].map((symbol, i) =>
                symbol === "-" ? (
                  <span key={i} className={styles.bufferDash} />
                ) : (
                  <span key={i} className={styles.bufferDot} />
                ),
              )}
            </div>
            <div
              className={[styles.feedback, feedback ? styles[feedback] : ""].join(" ")}
            >
              {feedback === "correct" ? "✓" : feedback === "incorrect" ? currentPattern : ""}
            </div>
          </div>
          <div className={styles.controls}>
            <ControlKeys input={input} singleSwitch={singleSwitch} strings={strings} />
          </div>
        </>
      )}

      {phase === "done" && (
        <div className={styles.done}>
          <p>{strings.review.finished}</p>
          <div className={styles.doneScore}>{scoreLabel}</div>
          <button type="button" className={styles.primaryButton} onClick={start}>
            {strings.review.playAgain}
          </button>
        </div>
      )}
    </div>
  );
}
