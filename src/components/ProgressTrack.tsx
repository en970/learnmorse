"use client";

import type { LetterProgress } from "@/lib/morse/engine";
import styles from "./ProgressTrack.module.css";

interface ProgressTrackProps {
  progress: LetterProgress[];
  caption: string;
}

export function ProgressTrack({ progress, caption }: ProgressTrackProps) {
  return (
    <div>
      <div className={styles.track} role="img" aria-label={caption}>
        {progress.map((p) => (
          <span
            key={p.letter}
            className={[
              styles.segment,
              p.inPool ? styles.inPool : "",
              p.learned ? styles.learned : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
