"use client";

import { useEffect, useState } from "react";
import { readJSON, writeJSON } from "../storage";

interface StreakData {
  count: number;
  lastActiveDate: string;
}

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function wasYesterday(key: string): boolean {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return key === dateKey(d);
}

/** Counts consecutive calendar days the app has been opened on. */
export function useStreak(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // One-time read/update of the streak counter right after mount — the
    // calendar-day comparison needs the browser's clock and localStorage,
    // neither of which exist during the static prerender.
    const today = dateKey(new Date());
    const stored = readJSON<StreakData>("streak", { count: 0, lastActiveDate: "" });

    if (stored.lastActiveDate === today) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCount(stored.count);
      return;
    }

    const nextCount = wasYesterday(stored.lastActiveDate) ? stored.count + 1 : 1;
    writeJSON<StreakData>("streak", { count: nextCount, lastActiveDate: today });
    setCount(nextCount);
  }, []);

  return count;
}
