import React from "react";

interface StatCardProps {
  // ⭐ Renamed
  value: number | string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
  showEmoji?: boolean;
  emoji?: string;
}

export function StatCard({
  // ⭐ Renamed (also changed to named export)
  value,
  title,
  description,
  icon,
  iconBgColor,
  showEmoji = false,
  emoji,
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-950 flex-1 rounded-xl p-2.5 sm:p-4 lg:p-6 shadow-sm border shadow-primary-100 dark:shadow-primary-800 hover:dark:shadow-xl border-gray-200 dark:border-primary-700 hover:shadow-xl transition-shadow duration-500">
      <div className="flex items-center justify-between mb-2 lg:mb-4">
        <div
          className={`w-9 h-9 lg:w-12 lg:h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}
        >
          {icon}
        </div>

        <span
          className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1 lg:gap-2"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          {showEmoji && emoji && <span>{emoji}</span>}
          {value}
        </span>
      </div>

      <h3 className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {title}
      </h3>

      <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}
