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

export function calculateLongestStreak(completions: Completion[]): number {
  // STEP 1: Handle empty case
  if (!completions || completions.length === 0) {
    return 0;
  }

  // STEP 2: Get unique dates
  const uniqueDates = Array.from(
    new Set(
      completions.map(
        (c) => new Date(c.completed_at).toISOString().split("T")[0],
      ),
    ),
  );

  // STEP 3: Sort dates from newest to oldest
  uniqueDates.sort((a, b) => b.localeCompare(a));

  // Edge case: Only 1 unique date
  if (uniqueDates.length === 1) {
    return 1;
  }

  // STEP 4: Find all streaks in history
  const streaks: number[] = [];
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const previousDate = uniqueDates[i - 1]; // Newer date
    const currentDate = uniqueDates[i]; // Older date

    // Check if dates are consecutive (1 day apart)
    const expectedDate = subtractOneDay(previousDate);

    if (currentDate === expectedDate) {
      // ✅ Consecutive! Continue counting
      currentStreak += 1;
    } else {
      // ❌ Gap found! Save this streak and start new one
      streaks.push(currentStreak);
      currentStreak = 1;
    }
  }

  // ⭐ Don't forget the last streak!
  streaks.push(currentStreak);

  // STEP 5: Return the longest streak
  return Math.max(...streaks);
}
