// Sanity check for the word banks: for every point along each language's
// letter-teaching order, make sure at least a few real words are buildable
// from the letters unlocked so far. Run with: node scripts/validate-words.mjs
import { ALPHABETS } from "../src/lib/morse/alphabets.ts";
import { ENGLISH_WORDS } from "../src/lib/morse/words.en.ts";
import { TURKISH_WORDS } from "../src/lib/morse/words.tr.ts";

const WORDS = { en: ENGLISH_WORDS, tr: TURKISH_WORDS };
const MIN_START_POOL = 3;
const WARN_BELOW = 2;

let hadProblem = false;

for (const [id, alphabet] of Object.entries(ALPHABETS)) {
  const words = WORDS[id];
  console.log(`\n=== ${alphabet.label} (${id}) — ${words.length} words ===`);

  for (let size = MIN_START_POOL; size <= alphabet.letterOrder.length; size++) {
    const pool = new Set(alphabet.letterOrder.slice(0, size));
    const newest = alphabet.letterOrder[size - 1];

    const matches = words.filter((w) =>
      [...w].every((ch) => pool.has(ch)),
    );
    const withNewest = matches.filter((w) => w.includes(newest));

    const flag = matches.length < WARN_BELOW ? " <-- LOW" : "";
    const newestFlag = withNewest.length === 0 ? " (none contain newest letter — fallback will trigger)" : "";

    if (matches.length < WARN_BELOW) hadProblem = true;

    console.log(
      `pool[${size}] +${newest}: ${matches.length} words total, ${withNewest.length} with "${newest}"${flag}${newestFlag}`,
    );
  }
}

if (hadProblem) {
  console.log("\nSome pool sizes have very few (<2) matching words — consider adding more.");
  process.exitCode = 1;
} else {
  console.log("\nLooks healthy: every pool size has at least a couple of usable words.");
}
