"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMorseInput } from "@/lib/hooks/useMorseInput";
import { getMorseAudio } from "@/lib/morse/audio";
import type { UiStrings } from "@/lib/i18n/strings";
import { ControlKeys } from "./ControlKeys";
import { WordTrain } from "./WordTrain";
import styles from "./SpeedTest.module.css";

const DURATION_SECONDS = 60;
const MISMATCH = " ";

interface SpeedTestProps {
  learnedLetters: string[];
  words: string[];
  morse: Record<string, string>;
  strings: UiStrings;
  singleSwitch: boolean;
  singleSwitchHoldMs: number;
  soundEnabled: boolean;
  onExit: () => void;
}

function pickWord(pool: Set<string>, words: string[]): string {
  const candidates = words.filter((w) => [...w].every((ch) => pool.has(ch)));
  if (candidates.length === 0) return [...pool][0] ?? "";
  return candidates[Math.floor(Math.random() * candidates.length)];
}

type Phase = "intro" | "playing" | "done";

export function SpeedTest({
  learnedLetters,
  words,
  morse,
  strings,
  singleSwitch,
  singleSwitchHoldMs,
  soundEnabled,
  onExit,
}: SpeedTestProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [pair, setPair] = useState<[string, string]>(["", ""]);
  const [letterIndex, setLetterIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(DURATION_SECONDS);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  const poolRef = useRef<Set<string>>(new Set());

  const currentWord = pair[0];
  const currentLetter = currentWord[letterIndex] ?? "";

  const handleConfirm = useCallback(
    (pattern: string) => {
      const expected = morse[currentLetter];
      const isCorrect = pattern === expected;
      setTotalCount((c) => c + 1);

      if (soundEnabled) {
        const audio = getMorseAudio();
        audio.setEnabled(true);
        if (expected) void audio.playPattern(isCorrect ? expected : MISMATCH);
      }

      if (!isCorrect) {
        setFeedback("incorrect");
        setTimeout(() => setFeedback(null), 300);
        return;
      }

      setFeedback("correct");
      setTimeout(() => setFeedback(null), 250);
      setCorrectCount((c) => c + 1);

      setLetterIndex((i) => {
        const next = i + 1;
        if (next >= currentWord.length) {
          setPair((prev) => [prev[1], pickWord(poolRef.current, words)]);
          return 0;
        }
        return next;
      });
    },
    [currentLetter, currentWord, morse, soundEnabled, words],
  );

  const input = useMorseInput({
    onConfirm: handleConfirm,
    enabled: phase === "playing",
    singleSwitch,
    singleSwitchHoldMs,
    onSymbol: (symbol) => {
      if (!soundEnabled) return;
      const audio = getMorseAudio();
      audio.setEnabled(true);
      if (symbol === "-") audio.playDah();
      else audio.playDit();
    },
  });

  const start = () => {
    poolRef.current = new Set(learnedLetters);
    setPair([
      pickWord(poolRef.current, words),
      pickWord(poolRef.current, words),
    ]);
    setLetterIndex(0);
    setSecondsLeft(DURATION_SECONDS);
    setCorrectCount(0);
    setTotalCount(0);
    setFeedback(null);
    setPhase("playing");
  };

  useEffect(() => {
    if (phase !== "playing") return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timer);
          setPhase("done");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  const wpm = Math.round(correctCount / 5);
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return (
    <div className={styles.overlay}>
      <div className={styles.column}>
        <div className={styles.header}>
          <span className={styles.title}>{strings.speedTest.title}</span>
          <button
            type="button"
            className={styles.exit}
            onClick={onExit}
            aria-label={strings.speedTest.exit}
          >
            &#10005;
          </button>
        </div>

        {phase === "intro" && (
          <div className={styles.intro}>
            <p>
              {learnedLetters.length >= 3
                ? strings.speedTest.subtitle
                : strings.speedTest.empty}
            </p>
            {learnedLetters.length >= 3 && (
              <button type="button" className={styles.primaryButton} onClick={start}>
                {strings.speedTest.start}
              </button>
            )}
          </div>
        )}

        {phase === "playing" && (
          <>
            <div className={styles.timerRow}>
              <span
                className={[styles.timer, secondsLeft <= 10 ? styles.low : ""].join(" ")}
              >
                {strings.speedTest.timeLeft(secondsLeft)}
              </span>
            </div>
            <WordTrain
              words={pair}
              letterIndex={letterIndex}
              buffer={input.buffer}
              feedback={feedback}
            />
            <div className={styles.controls}>
              <ControlKeys input={input} singleSwitch={singleSwitch} strings={strings} />
            </div>
          </>
        )}

        {phase === "done" && (
          <div className={styles.done}>
            <p>{strings.speedTest.finished}</p>
            <div className={styles.results}>
              <div className={styles.resultBlock}>
                <span className={styles.resultValue}>{wpm}</span>
                <span className={styles.resultLabel}>{strings.speedTest.wpmUnit}</span>
              </div>
              <div className={styles.resultBlock}>
                <span className={styles.resultValue}>{accuracy}%</span>
                <span className={styles.resultLabel}>
                  {strings.speedTest.accuracyUnit}
                </span>
              </div>
            </div>
            <button type="button" className={styles.primaryButton} onClick={start}>
              {strings.speedTest.playAgain}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
