"use client";

import styles from "./HintChip.module.css";

interface HintChipProps {
  letter: string;
  pattern: string;
  label: string;
  onListen: () => void;
}

export function HintChip({ letter, pattern, label, onListen }: HintChipProps) {
  return (
    <div className={styles.chip}>
      <div className={styles.letter}>{letter.toUpperCase()}</div>
      <div className={styles.body}>
        <span className={styles.label}>{label}</span>
        <div className={styles.pattern}>
          {[...pattern].map((symbol, i) =>
            symbol === "-" ? (
              <span key={i} className={styles.dash} />
            ) : (
              <span key={i} className={styles.dot} />
            ),
          )}
        </div>
      </div>
      <button
        type="button"
        className={styles.listen}
        onClick={onListen}
        aria-label="Play pattern"
      >
        <svg viewBox="0 0 24 24">
          <path d="M3 10v4h4l5 5V5L7 10H3z" />
          <path d="M16.5 12a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12z" />
        </svg>
      </button>
    </div>
  );
}
