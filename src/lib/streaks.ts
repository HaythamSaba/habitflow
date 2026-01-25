import { Completion } from "@/types";

/**
 * Calculate the current active streak for a habit
 *
 * A streak is "active" if the habit was completed today or yesterday.
 * We count consecutive days backwards from today/yesterday.
 *
 * @param completions - Array of completion records
 * @returns Number of consecutive days (0 if no active streak)
 *
 * Examples:
 * - Completions on Jan 23, 22, 21 (today is Jan 23) → streak = 3
 * - Completions on Jan 21, 20, 19 (today is Jan 23) → streak = 0 (cold)
 * - Completions on Jan 22, 21, 20 (today is Jan 23) → streak = 3 (started yesterday)
 */

export function calculateCurrentStreak(completions: Completion[]): number {
  if (!completions || completions.length === 0) {
    return 0;
  }

  const uniqueDates = Array.from(
    new Set(
      completions.map(
        (c) => new Date(c.completed_at).toISOString().split("T")[0],
      ),
    ),
  );

  uniqueDates.sort((a, b) => b.localeCompare(a));

  const today = new Date().toISOString().split("T")[0];
  let streak = 0;
  let expectedDate = today;

  for (let i = 0; i < uniqueDates.length; i++) {
    const currentDate = uniqueDates[i];

    if (currentDate === expectedDate) {
      streak++;
      expectedDate = subtractOneDay(expectedDate);
    } else {
      if (i === 0) {
        const yesterday = subtractOneDay(today);
        if (currentDate === yesterday) {
          // Start from yesterday - continue counting!
          streak = 1;
          expectedDate = subtractOneDay(yesterday);
          // Don't break - keep counting!
        } else {
          // Too old - streak is dead
          return 0;
        }
      } else {
        // Found a gap - stop counting
        break;
      }
    }
  }

  return streak;
}

function subtractOneDay(dateStr: string): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split("T")[0];
}
