"use client";

import type { UiStrings } from "@/lib/i18n/strings";
import styles from "./TopBar.module.css";

interface TopBarProps {
  streakDays: number;
  strings: UiStrings;
  onOpenReview: () => void;
  onOpenSpeedTest: () => void;
  onOpenSettings: () => void;
  reviewLabel: string;
  speedTestLabel: string;
}

export function TopBar({
  streakDays,
  strings,
  onOpenReview,
  onOpenSpeedTest,
  onOpenSettings,
  reviewLabel,
  speedTestLabel,
}: TopBarProps) {
  const lit = Math.min(streakDays, 5);

  return (
    <div className={styles.bar}>
      <div className={styles.tag}>
        <span className={styles.dots}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < lit ? "lit" : ""} />
          ))}
        </span>
        {streakDays > 0 ? strings.streak(streakDays) : strings.streakNew}
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.textButton} onClick={onOpenReview}>
          {reviewLabel}
        </button>
        <button
          type="button"
          className={styles.iconButton}
          onClick={onOpenSpeedTest}
          aria-label={speedTestLabel}
        >
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l3 2" />
            <path d="M9 2h6" />
            <path d="M12 2v3" />
          </svg>
        </button>
        <button
          type="button"
          className={styles.iconButton}
          onClick={onOpenSettings}
          aria-label={strings.settings.title}
        >
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
