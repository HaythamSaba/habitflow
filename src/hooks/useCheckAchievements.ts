import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { useHabits } from "./useHabits";
import { useCompletions } from "./useCompletions";
import { useUserStats } from "./useUserStats";
import { useDashboardStreak } from "./useDashboardStreak";
import { useAchievements } from "./useAchievements";
import { getAchievementsToUnlock } from "@/lib/achievements";
import { unlockAchievement } from "@/lib/api";
import { showAchievementToast } from "@/lib/achievementNotification";
import { useMemo, useEffect } from "react"; // ⭐ ADD useEffect

export function useCheckAchievements() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { habits } = useHabits();
  const { completions } = useCompletions();
  const { totalPoints } = useUserStats();
  const { maxStreak } = useDashboardStreak();
  const { allAchievements, unlockedIds } = useAchievements();

  // ⭐ Filter out archived habits
  const activeHabits = useMemo(
    () => habits?.filter((h) => !h.archived) || [],
    [habits],
  );

  const totalCompletions = useMemo(() => {
    return completions?.length || 0;
  }, [completions]);

  const stats = useMemo(
    () => ({
      totalCompletions: totalCompletions,
      currentStreak: maxStreak,
      totalPoints: totalPoints,
      totalHabits: activeHabits.length, // ⭐ Use activeHabits
      completions: completions || [],
    }),
    [totalCompletions, maxStreak, totalPoints, activeHabits, completions],
  );

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");

      // Find achievements to unlock
      const toUnlock = getAchievementsToUnlock(
        allAchievements,
        unlockedIds,
        stats,
      );

      // Unlock each achievement
      const results = [];
      for (const achievement of toUnlock) {
        const result = await unlockAchievement(user.id, achievement.id);
        if (!result.alreadyUnlocked) {
          results.push(result.data);
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

  // ⭐⭐⭐ AUTO-RUN WHEN STATS CHANGE
  useEffect(() => {
    if (!user || allAchievements.length === 0) return;

    // Check if there are achievements ready to unlock
    const toUnlock = getAchievementsToUnlock(
      allAchievements,
      unlockedIds,
      stats,
    );

    if (toUnlock.length > 0) {
      console.log(
        `🎯 Auto-unlocking ${toUnlock.length} achievement(s):`,
        toUnlock.map((a) => a.name),
      );
      mutation.mutate();
    }
  }, [
    user,
    stats.totalCompletions, // ⭐ Triggers when completion added/removed
    stats.currentStreak, // ⭐ Triggers when streak changes
    stats.totalPoints, // ⭐ Triggers when points change
    stats.totalHabits, // ⭐ Triggers when habits added/removed
    allAchievements,
    unlockedIds,
    mutation,
    stats,
  ]);

  return mutation;
}
