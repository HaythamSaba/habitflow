import { AchievementToast } from "@/components/achievements/AchievementToast";
import toast from "react-hot-toast";

export function showAchievementToast(achievement: {
  name: string;
  emoji: string;
  description: string;
  points_reward: number;
  rarity: string;
}) {
  toast.custom((t) => (
    <div className={`${t.visible ? "animate-fadeIn" : "animate-fadeOut"}`}>
      <AchievementToast achievement={achievement} />
    </div>
  ), {
    duration: 5000,
    position: "top-right"
  });
}
