import { Completion } from "@/types";

export function calculateStreak(completions: Completion[]) {
  let currentStreak = 0;
  let longestStreak = 0;
  let lastCompletionDate = null;
  const isActive = completions.length > 0;

  for (const completion of completions) {
    const completionDate = new Date(completion.created_at);
    const completionDay = completionDate.getDate();
    const completionMonth = completionDate.getMonth();
    const completionYear = completionDate.getFullYear();

    if (lastCompletionDate) {
      const lastCompletionDay = lastCompletionDate.getDate();
      const lastCompletionMonth = lastCompletionDate.getMonth();
      const lastCompletionYear = lastCompletionDate.getFullYear();

      if (
        completionDay === lastCompletionDay + 1 &&
        completionMonth === lastCompletionMonth &&
        completionYear === lastCompletionYear
      ) {
        currentStreak += 1;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    lastCompletionDate = completionDate;
  }

  return { currentStreak, longestStreak, isActive };
}
