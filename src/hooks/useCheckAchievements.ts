import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { useHabits } from "./useHabits";
import { useCompletions } from "./useCompletions";
import { useUserStats } from "./useUserStats";
import { useDashboardStreak } from "./useDashboardStreak";
import { useAchievements } from "./useAchievements";
import { getAchievementsToUnlock } from "@/lib/achievements";
import { unlockAchievement } from "@/lib/api";
import { showAchievementToast } from "@/lib/achievementNotification"; // ⭐ NEW
import { useMemo } from "react";

/**
 * Hook to check and unlock achievements
 * Call this after any action that might unlock achievements
 */
export function useCheckAchievements() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { habits } = useHabits();
  const { completions } = useCompletions();
  const { totalPoints } = useUserStats();
  const { maxStreak } = useDashboardStreak();
  const { allAchievements, unlockedIds } = useAchievements();

  const totalCompletions = useMemo(() => {
    return completions?.length || 0;
  }, [completions]);

  const stats = useMemo(
    () => ({
      totalCompletions: totalCompletions,
      currentStreak: maxStreak,
      totalPoints: totalPoints,
      totalHabits: habits?.length || 0,
      completions: completions || [],
    }),
    [totalCompletions, maxStreak, totalPoints, habits, completions]
  );

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");

      // Find achievements to unlock
      const toUnlock = getAchievementsToUnlock(
        allAchievements,
        unlockedIds,
        stats
      );

      // Unlock each achievement
      const results = [];
      for (const achievement of toUnlock) {
        const result = await unlockAchievement(user.id, achievement.id);
        if (!result.alreadyUnlocked) {
          results.push(result.data);

          // ⭐ Show toast notification using helper
          showAchievementToast(result.data.achievement || achievement);
        }
      }

      return results;
    },
    onSuccess: (newlyUnlocked) => {
      queryClient.invalidateQueries({ queryKey: ["user-achievements"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });

      return newlyUnlocked;
    },
  });
}
