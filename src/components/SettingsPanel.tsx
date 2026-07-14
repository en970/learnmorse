"use client";

import { useState } from "react";
import { ALPHABETS, type LanguageId } from "@/lib/morse/alphabets";
import {
  PALETTE_IDS,
  useSettings,
  type PaletteId,
} from "@/lib/settings/SettingsContext";
import type { UiStrings } from "@/lib/i18n/strings";
import styles from "./SettingsPanel.module.css";

const PALETTE_PREVIEW: Record<PaletteId, [string, string, string]> = {
  "peach-pine": ["#e39268", "#77937c", "#fbefe4"],
  "dawn-coral": ["#ff9e79", "#e7a85e", "#fceee1"],
  "harbor-teal": ["#63c7bc", "#e3a768", "#f0f7f3"],
  "soft-sunset": ["#f7adb8", "#a38fdd", "#faf0f4"],
};

interface SettingsPanelProps {
  strings: UiStrings;
  onClose: () => void;
  onResetProgress: () => void;
}

export function SettingsPanel({ strings, onClose, onResetProgress }: SettingsPanelProps) {
  const settings = useSettings();
  const [confirmingReset, setConfirmingReset] = useState(false);
  const s = strings.settings;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.sheet}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={s.title}
      >
        <div className={styles.handle} />
        <div className={styles.header}>
          <span className={styles.title}>{s.title}</span>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label={s.close}
          >
            &#10005;
          </button>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>{s.alphabet}</div>
          <div className={styles.seg}>
            {(Object.keys(ALPHABETS) as LanguageId[]).map((id) => (
              <button
                key={id}
                type="button"
                className={settings.language === id ? styles.active : ""}
                onClick={() => settings.setLanguage(id)}
              >
                {ALPHABETS[id].label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>{s.palette}</div>
          <div className={styles.paletteGrid}>
            {PALETTE_IDS.map((id) => (
              <button
                key={id}
                type="button"
                className={`${styles.paletteOption} ${settings.palette === id ? styles.active : ""}`}
                onClick={() => settings.setPalette(id)}
              >
                <span className={styles.paletteSwatches}>
                  {PALETTE_PREVIEW[id].map((c, i) => (
                    <span key={i} style={{ background: c }} />
                  ))}
                </span>
                <span className={styles.paletteName}>
                  {strings.paletteNames[id] ?? id}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.row}>
            <div className={styles.rowText}>
              <div className={styles.label}>{s.sound}</div>
              <div className={styles.sub}>{s.soundHint}</div>
            </div>
            <button
              type="button"
              className={`${styles.switch} ${settings.soundEnabled ? styles.on : ""}`}
              role="switch"
              aria-checked={settings.soundEnabled}
              onClick={() => settings.setSoundEnabled(!settings.soundEnabled)}
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.row}>
            <div className={styles.rowText}>
              <div className={styles.label}>{s.singleSwitch}</div>
              <div className={styles.sub}>{s.singleSwitchHint}</div>
            </div>
            <button
              type="button"
              className={`${styles.switch} ${settings.singleSwitch ? styles.on : ""}`}
              role="switch"
              aria-checked={settings.singleSwitch}
              onClick={() => settings.setSingleSwitch(!settings.singleSwitch)}
            />
          </div>
          {settings.singleSwitch && (
            <div style={{ marginTop: 14 }}>
              <div className={styles.rowText} style={{ marginBottom: 8 }}>
                <div className={styles.label}>{s.holdDuration}</div>
              </div>
              <input
                type="range"
                className={styles.slider}
                min={150}
                max={700}
                step={10}
                value={settings.singleSwitchHoldMs}
                onChange={(e) =>
                  settings.setSingleSwitchHoldMs(Number(e.target.value))
                }
              />
            </div>
          )}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>{s.appearance}</div>
          <div className={styles.seg}>
            <button
              type="button"
              className={settings.theme === "light" ? styles.active : ""}
              onClick={() => settings.setTheme("light")}
            >
              {s.appearanceLight}
            </button>
            <button
              type="button"
              className={settings.theme === "auto" ? styles.active : ""}
              onClick={() => settings.setTheme("auto")}
            >
              {s.appearanceAuto}
            </button>
            <button
              type="button"
              className={settings.theme === "dark" ? styles.active : ""}
              onClick={() => settings.setTheme("dark")}
            >
              {s.appearanceDark}
            </button>
          </div>
        </div>

        <div className={styles.section}>
          {confirmingReset ? (
            <>
              <p className={styles.warning}>{s.resetWarning}</p>
              <div className={styles.confirmRow}>
                <button
                  type="button"
                  className={styles.confirmCancel}
                  onClick={() => setConfirmingReset(false)}
                >
                  {s.resetCancel}
                </button>
                <button
                  type="button"
                  className={styles.confirmDanger}
                  onClick={() => {
                    onResetProgress();
                    setConfirmingReset(false);
                  }}
                >
                  {s.resetConfirm}
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              className={styles.resetButton}
              onClick={() => setConfirmingReset(true)}
            >
              {s.resetProgress}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
