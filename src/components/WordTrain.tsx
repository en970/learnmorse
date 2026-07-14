"use client";

import styles from "./WordTrain.module.css";

interface WordTrainProps {
  words: [string, string];
  letterIndex: number;
  buffer: string;
  feedback?: "correct" | "incorrect" | null;
}

function LetterCell({
  letter,
  state,
  feedback,
}: {
  letter: string;
  state: "passed" | "active" | "upcoming" | "next";
  feedback?: "correct" | "incorrect" | null;
}) {
  const className = [
    styles.cell,
    styles[state],
    state === "active" && feedback ? styles[feedback] : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={className} aria-hidden={state === "next"}>
      {letter.toUpperCase()}
    </span>
  );
}

export function WordTrain({ words, letterIndex, buffer, feedback }: WordTrainProps) {
  const [active, next] = words;

  return (
    <div className={styles.hero}>
      <div className={styles.train}>
        {[...active].map((letter, i) => (
          <LetterCell
            key={`active-${i}`}
            letter={letter}
            state={i < letterIndex ? "passed" : i === letterIndex ? "active" : "upcoming"}
            feedback={i === letterIndex ? feedback : null}
          />
        ))}
        <div className={styles.divider} />
        {[...next].slice(0, 4).map((letter, i) => (
          <LetterCell key={`next-${i}`} letter={letter} state="next" />
        ))}
      </div>

      <div className={styles.buffer} aria-live="polite">
        {[...buffer].map((symbol, i) =>
          symbol === "-" ? (
            <span key={i} className={styles.bufferDash} />
          ) : (
            <span key={i} className={styles.bufferDot} />
          ),
        )}
      </div>
    </div>
  );
}
