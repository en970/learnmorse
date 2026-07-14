export type LanguageId = "en" | "tr";

export interface Alphabet {
  id: LanguageId;
  label: string;
  /** lowercase letter -> morse pattern using "." and "-" */
  morse: Record<string, string>;
  /** teaching order, simplest/most useful patterns first */
  letterOrder: string[];
  /** letters that share a pattern with another letter, shown as a small aside in the UI */
  sharedPatternNote?: string;
}

const englishMorse: Record<string, string> = {
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
};

// Simplicity- and frequency-weighted teaching order, same sequence used by
// most Morse trainers (including the Google Creative Lab one this app was
// modeled after): short, common patterns first, so real words appear fast.
const englishOrder = [
  "e", "t", "a", "i", "m", "s", "o", "h", "n", "c",
  "r", "d", "u", "k", "l", "f", "b", "p", "g", "j",
  "v", "q", "w", "x", "y", "z",
];

// Turkish extends the Latin table with six letters. There is no ITU
// standard for them — the ITU-R M.1677-1 recommendation only covers the
// unaccented Latin alphabet — so this uses the set documented on Turkish
// Wikipedia's Mors alfabesi page, cross-checked against the pattern most
// European languages use for their own accented letters (reusing a related
// unaccented letter's code with an extra dit or dah tacked on). ç, ğ, ö and
// ü line up with that pattern; ş does not appear in a second independent
// source, so treat it as a community convention rather than a hard
// standard. İ and ı are distinct letters in Turkish but share the plain
// "I" pattern — there is no separate code for either.
const turkishMorse: Record<string, string> = {
  ...englishMorse,
  ç: "-.-..",
  ğ: "--.-.",
  ı: "..",
  ö: "---.",
  ş: ".--..",
  ü: "..--",
};

// Turkish has no native q, w, x, but they show up on Turkish keyboards and
// in everyday loanwords, so they're taught last as a bonus rather than left
// out entirely.
const turkishOrder = [
  "e", "t", "a", "i", "ı", "n", "r", "m", "s", "o",
  "l", "k", "d", "u", "y", "b", "z", "ü", "g", "ş",
  "h", "v", "c", "p", "ç", "ö", "ğ", "f", "j",
  "q", "w", "x",
];

export const ALPHABETS: Record<LanguageId, Alphabet> = {
  en: {
    id: "en",
    label: "English",
    morse: englishMorse,
    letterOrder: englishOrder,
  },
  tr: {
    id: "tr",
    label: "Türkçe",
    morse: turkishMorse,
    letterOrder: turkishOrder,
    sharedPatternNote:
      "İ and ı share the same pattern as the plain I — Morse code has no dotted/dotless distinction.",
  },
};

export function getAlphabet(id: LanguageId): Alphabet {
  return ALPHABETS[id];
}
