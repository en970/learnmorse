import type { LanguageId } from "../morse/alphabets";

export interface UiStrings {
  tagline: string;
  streak: (days: number) => string;
  streakNew: string;
  controls: {
    dot: string;
    dash: string;
    confirm: string;
    delete: string;
  };
  hint: {
    newLetter: string;
    pattern: string;
  };
  settings: {
    title: string;
    close: string;
    alphabet: string;
    palette: string;
    sound: string;
    soundHint: string;
    singleSwitch: string;
    singleSwitchHint: string;
    holdDuration: string;
    appearance: string;
    appearanceLight: string;
    appearanceDark: string;
    appearanceAuto: string;
    resetProgress: string;
    resetConfirm: string;
    resetCancel: string;
    resetWarning: string;
  };
  review: {
    title: string;
    subtitle: string;
    start: string;
    empty: string;
    exit: string;
    correctOf: (correct: number, total: number) => string;
    finished: string;
    playAgain: string;
  };
  progress: {
    lettersLearned: (learned: number, total: number) => string;
    complete: string;
  };
  paletteNames: Record<string, string>;
}

export const STRINGS: Record<LanguageId, UiStrings> = {
  en: {
    tagline: "Learn Morse code, one letter at a time.",
    streak: (days) => `${days}-day streak`,
    streakNew: "First day — welcome",
    controls: {
      dot: "dot",
      dash: "dash",
      confirm: "enter",
      delete: "delete",
    },
    hint: {
      newLetter: "New letter",
      pattern: "pattern",
    },
    settings: {
      title: "Settings",
      close: "Close",
      alphabet: "Alphabet",
      palette: "Color palette",
      sound: "Tone feedback",
      soundHint: "Short dot/dash tones as you type",
      singleSwitch: "Single-switch mode",
      singleSwitchHint: "One key — hold briefly for a dot, longer for a dash",
      holdDuration: "Dash hold length",
      appearance: "Appearance",
      appearanceLight: "Light",
      appearanceDark: "Dark",
      appearanceAuto: "Auto",
      resetProgress: "Reset progress",
      resetConfirm: "Yes, reset everything",
      resetCancel: "Cancel",
      resetWarning: "This clears every letter you've learned. It can't be undone.",
    },
    review: {
      title: "Review",
      subtitle: "A quick pass over everything you've learned so far.",
      start: "Start review",
      empty: "Learn a couple of letters first, then come back to review them.",
      exit: "Exit review",
      correctOf: (correct, total) => `${correct} / ${total} correct`,
      finished: "Nicely done.",
      playAgain: "Review again",
    },
    progress: {
      lettersLearned: (learned, total) => `${learned} of ${total} letters`,
      complete: "Full alphabet learned",
    },
    paletteNames: {
      "peach-pine": "Dusty Peach & Pine",
      "dawn-coral": "Dawn Coral",
      "harbor-teal": "Harbor Teal",
      "soft-sunset": "Soft Sunset",
      honey: "Honey",
    },
  },
  tr: {
    tagline: "Mors kodunu harf harf öğren.",
    streak: (days) => `${days} günlük seri`,
    streakNew: "İlk gün — hoş geldin",
    controls: {
      dot: "nokta",
      dash: "çizgi",
      confirm: "onayla",
      delete: "sil",
    },
    hint: {
      newLetter: "Yeni harf",
      pattern: "kod",
    },
    settings: {
      title: "Ayarlar",
      close: "Kapat",
      alphabet: "Alfabe",
      palette: "Renk paleti",
      sound: "Ton geri bildirimi",
      soundHint: "Yazarken kısa nokta/çizgi tonları",
      singleSwitch: "Tek tuş modu",
      singleSwitchHint: "Tek tuş — kısa basış nokta, uzun basış çizgi",
      holdDuration: "Çizgi basma süresi",
      appearance: "Görünüm",
      appearanceLight: "Açık",
      appearanceDark: "Koyu",
      appearanceAuto: "Otomatik",
      resetProgress: "İlerlemeyi sıfırla",
      resetConfirm: "Evet, her şeyi sıfırla",
      resetCancel: "Vazgeç",
      resetWarning: "Öğrendiğin bütün harfler silinir. Bu işlem geri alınamaz.",
    },
    review: {
      title: "Tekrar",
      subtitle: "Şimdiye kadar öğrendiklerine hızlı bir bakış.",
      start: "Tekrara başla",
      empty: "Önce birkaç harf öğren, sonra tekrar etmeye buradan devam et.",
      exit: "Tekrardan çık",
      correctOf: (correct, total) => `${correct} / ${total} doğru`,
      finished: "Güzel gitti.",
      playAgain: "Tekrar et",
    },
    progress: {
      lettersLearned: (learned, total) => `${total} harften ${learned} tanesi`,
      complete: "Tüm alfabe öğrenildi",
    },
    paletteNames: {
      "peach-pine": "Toz Şeftali & Çam",
      "dawn-coral": "Şafak Mercanı",
      "harbor-teal": "Liman Turkuazı",
      "soft-sunset": "Yumuşak Gün Batımı",
      honey: "Bal",
    },
  },
};
