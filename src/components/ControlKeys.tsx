"use client";

import type { MorseInputHandle } from "@/lib/hooks/useMorseInput";
import type { UiStrings } from "@/lib/i18n/strings";
import styles from "./ControlKeys.module.css";

interface ControlKeysProps {
  input: MorseInputHandle;
  singleSwitch: boolean;
  strings: UiStrings;
}

export function ControlKeys({ input, singleSwitch, strings }: ControlKeysProps) {
  if (singleSwitch) {
    return (
      <div className={styles.switchWrap} style={{ flexDirection: "column" }}>
        <button
          type="button"
          className={styles.switchButton}
          onPointerDown={(e) => {
            e.preventDefault();
            input.switchPress();
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            input.switchRelease();
          }}
          onPointerLeave={() => input.switchRelease()}
        >
          {strings.controls.dot} / {strings.controls.dash}
        </button>
        <p className={styles.switchHint}>{strings.settings.singleSwitchHint}</p>
      </div>
    );
  }

  return (
    <div className={styles.keys}>
      <button type="button" className={styles.key} onClick={input.addDot}>
        <span className={styles.glyph}>·</span>
        <span className={styles.label}>{strings.controls.dot}</span>
      </button>
      <button type="button" className={styles.key} onClick={input.addDash}>
        <span className={styles.glyph}>–</span>
        <span className={styles.label}>{strings.controls.dash}</span>
      </button>
      <button
        type="button"
        className={`${styles.key} ${styles.confirm}`}
        onClick={input.confirm}
      >
        <span className={styles.glyph}>&#10003;</span>
        <span className={styles.label}>{strings.controls.confirm}</span>
      </button>
      <button type="button" className={styles.key} onClick={input.deleteLast}>
        <span className={styles.glyph}>&#9003;</span>
        <span className={styles.label}>{strings.controls.delete}</span>
      </button>
    </div>
  );
}
