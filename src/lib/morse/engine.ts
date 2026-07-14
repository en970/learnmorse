// Framework-agnostic teaching engine. Modeled on the letter-unlock and
// hint-escalation logic from Google Creative Lab's original morse-learn
// (later adapted by Ace Centre), generalized to work with any letter order
// and any word bank so the same code drives both English and Turkish.
//
// Core idea: learners only ever see words built from letters they've
// already unlocked. Get a letter right enough times in a row and the next
// letter in the teaching order joins the pool. Struggle with a letter and
// its hint (the hint word + its Morse pattern) reappears automatically.

export interface LetterStats {
  score: number;
  attempts: number;
}

export interface EngineConfig {
  letterOrder: string[];
  words: string[];
  /** score a letter needs to reach to count as "learned" */
  learnedThreshold: number;
  /** consecutive correct answers needed before the next letter unlocks */
  unlockStreak: number;
  /** how many letters the pool starts with */
  startPoolSize: number;
  scoreCeiling: number;
  scoreFloor: number;
}

export function defaultConfig(
  letterOrder: string[],
  words: string[],
): EngineConfig {
  const learnedThreshold = 2;
  return {
    letterOrder,
    words,
    learnedThreshold,
    unlockStreak: 3,
    startPoolSize: 3,
    scoreCeiling: learnedThreshold + 2,
    scoreFloor: -(learnedThreshold + 2),
  };
}

export interface EngineState {
  pool: string[];
  stats: Record<string, LetterStats>;
  consecutiveCorrect: number;
  mistakeStreak: number;
  /** [active word, next word in the train] */
  words: [string, string];
  letterIndex: number;
}

export type HintLevel = 0 | 1 | 2;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getStats(state: EngineState, letter: string): LetterStats {
  return state.stats[letter] ?? { score: 0, attempts: 0 };
}

function weightedPick(candidates: string[]): string {
  // Shorter words are weighted a little heavier so the pool eases in with
  // easy wins before throwing longer words at the learner.
  const weights = candidates.map((w) => 1 / Math.sqrt(w.length));
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < candidates.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return candidates[i];
  }
  return candidates[candidates.length - 1];
}

export function pickWord(
  pool: string[],
  stats: Record<string, LetterStats>,
  words: string[],
  learnedThreshold: number,
): string {
  const poolSet = new Set(pool);
  const candidates = words.filter((w) => [...w].every((ch) => poolSet.has(ch)));

  if (candidates.length === 0) {
    // Nothing in the bank fits yet (can happen with a very small starting
    // pool) — fall back to drilling the newest letter on its own so the
    // app never gets stuck with nothing to show.
    return pool[pool.length - 1] ?? pool[0] ?? "";
  }

  const newest = pool[pool.length - 1];
  const newestStats = stats[newest] ?? { score: 0, attempts: 0 };
  if (newestStats.score < learnedThreshold) {
    const withNewest = candidates.filter((w) => w.includes(newest));
    if (withNewest.length > 0) return weightedPick(withNewest);
  }

  return weightedPick(candidates);
}

export function createEngineState(config: EngineConfig): EngineState {
  const pool = config.letterOrder.slice(0, config.startPoolSize);
  const stats: Record<string, LetterStats> = {};
  const first = pickWord(pool, stats, config.words, config.learnedThreshold);
  const second = pickWord(pool, stats, config.words, config.learnedThreshold);
  return {
    pool,
    stats,
    consecutiveCorrect: 0,
    mistakeStreak: 0,
    words: [first, second],
    letterIndex: 0,
  };
}

export function currentLetter(state: EngineState): string {
  return state.words[0][state.letterIndex] ?? "";
}

export function isLetterLearned(
  state: EngineState,
  config: EngineConfig,
  letter: string,
): boolean {
  return getStats(state, letter).score >= config.learnedThreshold;
}

/**
 * 0 = no hint, 1 = text hint only, 2 = full hint (word + morse playback).
 * A letter that hasn't been learned yet always shows its full hint; a
 * letter that *was* learned but is now being missed repeatedly earns the
 * hint back, same as the reference app's 3-miss / 4-miss escalation.
 */
export function hintLevel(state: EngineState, config: EngineConfig): HintLevel {
  const letter = currentLetter(state);
  if (!isLetterLearned(state, config, letter)) return 2;
  if (state.mistakeStreak >= 4) return 2;
  if (state.mistakeStreak >= 3) return 1;
  return 0;
}

export interface SubmitResult {
  state: EngineState;
  correct: boolean;
  wordCompleted: boolean;
  unlockedLetter: string | null;
}

export function submitAttempt(
  state: EngineState,
  config: EngineConfig,
  typed: string,
): SubmitResult {
  const letter = currentLetter(state);
  const correct = typed.toLowerCase() === letter;

  const prevStats = getStats(state, letter);
  const nextStats: LetterStats = {
    score: clamp(
      prevStats.score + (correct ? 1 : -1),
      config.scoreFloor,
      config.scoreCeiling,
    ),
    attempts: prevStats.attempts + 1,
  };

  let next: EngineState = {
    ...state,
    stats: { ...state.stats, [letter]: nextStats },
  };

  let unlockedLetter: string | null = null;
  let wordCompleted = false;

  if (correct) {
    next.consecutiveCorrect += 1;
    next.mistakeStreak = 0;
    next.letterIndex += 1;

    // Unlock gate: a fresh streak, and the newest pool letter is either
    // already learned or has never once come up in a word (nothing to
    // learn from yet, so don't hold the whole pool hostage waiting on it).
    if (next.pool.length < config.letterOrder.length) {
      const newest = next.pool[next.pool.length - 1];
      const newestStats = getStats(next, newest);
      const newestIsBlocking =
        newestStats.attempts > 0 && newestStats.score < config.learnedThreshold;

      if (next.consecutiveCorrect >= config.unlockStreak && !newestIsBlocking) {
        const nextLetter = config.letterOrder[next.pool.length];
        next = {
          ...next,
          pool: [...next.pool, nextLetter],
          consecutiveCorrect: 0,
        };
        unlockedLetter = nextLetter;
      }
    }

    if (next.letterIndex >= next.words[0].length) {
      wordCompleted = true;
      const upcoming = pickWord(next.pool, next.stats, config.words, config.learnedThreshold);
      next = {
        ...next,
        words: [next.words[1], upcoming],
        letterIndex: 0,
      };
    }
  } else {
    next.consecutiveCorrect = 0;
    next.mistakeStreak += 1;
  }

  return { state: next, correct, wordCompleted, unlockedLetter };
}

export interface LetterProgress {
  letter: string;
  inPool: boolean;
  learned: boolean;
}

export function letterProgress(
  state: EngineState,
  config: EngineConfig,
): LetterProgress[] {
  const poolSet = new Set(state.pool);
  return config.letterOrder.map((letter) => ({
    letter,
    inPool: poolSet.has(letter),
    learned: isLetterLearned(state, config, letter),
  }));
}

export function completionRatio(state: EngineState, config: EngineConfig): number {
  const learnedCount = config.letterOrder.filter((l) =>
    isLetterLearned(state, config, l),
  ).length;
  return learnedCount / config.letterOrder.length;
}
