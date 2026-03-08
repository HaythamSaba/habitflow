import React from "react";
import AnimatedNumber from "./AnimatedNumber";

interface StatCardProps {
  // ⭐ Renamed
  value: number | string;
  isPercentage?: boolean;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
  showEmoji?: boolean;
  emoji?: string;
}

export function StatCard({
  value,
  isPercentage = false,
  title,
  description,
  icon,
  iconBgColor,
  showEmoji = false,
  emoji,
}: StatCardProps) {
  return (
    <div className={`${iconBgColor} flex-1 rounded-xl p-2.5 sm:p-4 lg:p-6 shadow-primary-100 dark:shadow-primary-800 hover:dark:shadow-xl dark:border-primary-700 hover:shadow-xl transition-shadow duration-500`}>
      <div className="flex items-center justify-between mb-2 lg:mb-4">
        <div
          className={`w-9 h-9 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center`}
        >
          {icon}
        </div>

        <span
          className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center "
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          {showEmoji && emoji && <span>{emoji}</span>}
          <AnimatedNumber value={value as number} />
          {isPercentage && "%"}
        </span>
      </div>

      <h3 className="text-xs lg:text-base font-medium text-gray-600 dark:text-gray-200 mb-1">
        {title}
      </h3>

      <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}
