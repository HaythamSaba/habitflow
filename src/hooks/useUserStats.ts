import { getUserStats } from "@/lib/api";
import { useAuth } from "./useAuth";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { calculateLevel, getLevelData, getLevelProgress, getPointsToNextLevel } from "@/lib/points";

export function useUserStats() {
  const { user } = useAuth();

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-stats", user?.id],
    queryFn: () => {
      if (!user) throw new Error("User not authenticated");
      return getUserStats(user.id);
    },
    enabled: !!user,
  });

  // Calculate derived data
  const totalPoints = stats?.total_points || 0;
  const currentLevel = useMemo(
    () => calculateLevel(totalPoints),
    [totalPoints],
  );
  const levelData = useMemo(() => getLevelData(currentLevel), [currentLevel]);
  const pointsToNext = useMemo(
    () => getPointsToNextLevel(totalPoints),
    [totalPoints],
  );
  const levelProgress = useMemo(
    () => getLevelProgress(totalPoints),
    [totalPoints],
  );

  return {
    totalPoints,
    currentLevel,
    levelData,
    pointsToNext,
    levelProgress,
    isLoading,
    error,
  };
}
