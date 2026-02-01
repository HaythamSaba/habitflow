import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { getAllAchievements, getUserAchievements } from "@/lib/api";

/**
 * Hook to fetch all achievements and user's unlocked achievements
 */
export function useAchievements() {
  const { user } = useAuth();

  // Fetch all achievements (master list)
  const {
    data: allAchievements,
    isLoading: isLoadingAll,
    error: errorAll,
  } = useQuery({
    queryKey: ["achievements"],
    queryFn: getAllAchievements,
  });

  // Fetch user's unlocked achievements
  const {
    data: userAchievements,
    isLoading: isLoadingUser,
    error: errorUser,
  } = useQuery({
    queryKey: ["user-achievements", user?.id],
    queryFn: () => {
      if (!user) throw new Error("Not authenticated");
      return getUserAchievements(user.id);
    },
    enabled: !!user,
  });

  // Extract unlocked achievement IDs
  const unlockedIds = userAchievements?.map((ua) => ua.achievement_id) || [];

  // Separate locked and unlocked
  const unlockedAchievements =
    allAchievements?.filter((a) => unlockedIds.includes(a.id)) || [];
  const lockedAchievements =
    allAchievements?.filter((a) => !unlockedIds.includes(a.id)) || [];

  return {
    allAchievements: allAchievements || [],
    userAchievements: userAchievements || [],
    unlockedAchievements,
    lockedAchievements,
    unlockedIds,
    isLoading: isLoadingAll || isLoadingUser,
    error: errorAll || errorUser,
  };
}
