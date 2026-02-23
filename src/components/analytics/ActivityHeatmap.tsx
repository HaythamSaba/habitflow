import { useEffect, useState } from "react";
import { useActivityHeatmap, WeekActivity } from "@/hooks/useActivityHeatmap";
import { useCompletions } from "@/hooks/useCompletions";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

export function ActivityHeatmap() {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );
  const { completions } = useCompletions();
  const { weeks, months, maxCount } = useActivityHeatmap(
    completions || [],
    365,
  );
  const [hoveredDay, setHoveredDay] = useState<{
    date: Date;
    count: number;
  } | null>(null);

  // Color levels (can customize these)
  const getColor = (level: number, isDark: boolean) => {
    if (level === 0) return isDark ? "#1f2937" : "#ebedf0"; // gray-800 / gray-200

    const colors = isDark
      ? {
          1: "#0e4429", // dark green 1
          2: "#006d32", // dark green 2
          3: "#26a641", // dark green 3
          4: "#39d353", // dark green 4
        }
      : {
          1: "#9be9a8", // light green 1
          2: "#40c463", // light green 2
          3: "#30a14e", // light green 3
          4: "#216e39", // light green 4
        };

    return colors[level as 1 | 2 | 3 | 4] || colors[1];
  };

  const cellSize = 12; // Size of each square

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
      const observer = new MutationObserver(checkDarkMode);
      observer.observe(document.documentElement, {
        attributeFilter: ["class"],
        attributes: true,
      });

      return () => observer.disconnect();
    };
  });

  return (
    <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Activity Calendar
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {completions?.length || 0} total completions in the last year
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor: getColor(
                  level,
                  document.documentElement.classList.contains("dark"),
                ),
              }}
            />
          ))}
          <span className="text-xs text-gray-600 dark:text-gray-400">More</span>
        </div>
      </div>

      {/* Heatmap */}
      <div className="flex justify-between gap-4">
        <div className="inline-block min-w-200 ">
          {/* Month labels */}
          <div className="flex justify-between mb-2">
            <div className="text-xs text-gray-600 dark:text-gray-400 font-bold">
              Month
            </div>
            {months.map((month, index) => (
              <div
                key={index}
                className="text-xs text-gray-600 dark:text-gray-400"
                style={{
                  marginLeft: index === 0 ? 0 : 0,
                  width: `${cellSize * 4}px`,
                }}
              >
                {month.name}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-1">
            {/* Day labels (Mon, Wed, Fri) */}
            <div className="flex flex-col justify-around pr-2">
              <span
                className="text-xs text-gray-600 dark:text-gray-400"
                style={{ height: cellSize }}
              >
                Mon
              </span>
              <span
                className="text-xs text-gray-600 dark:text-gray-400"
                style={{ height: cellSize }}
              >
                Tues
              </span>
              <span
                className="text-xs text-gray-600 dark:text-gray-400"
                style={{ height: cellSize }}
              >
                Wed
              </span>
              <span
                className="text-xs text-gray-600 dark:text-gray-400"
                style={{ height: cellSize }}
              >
                Thur
              </span>
              <span
                className="text-xs text-gray-600 dark:text-gray-400"
                style={{ height: cellSize }}
              >
                Fri
              </span>
              <span
                className="text-xs text-gray-600 dark:text-gray-400"
                style={{ height: cellSize }}
              >
                Sat
              </span>
              <span
                className="text-xs text-gray-600 dark:text-gray-400"
                style={{ height: cellSize }}
              >
                Sun
              </span>
            </div>

            {/* Weeks */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.days.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-primary-500
                    duration-300 hover:ring-offset-1 dark:hover:ring-offset-gray-800"
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: getColor(day.level, isDark),
                    }}
                    onMouseEnter={() =>
                      setHoveredDay({ date: day.date, count: day.count })
                    }
                    onMouseLeave={() => setHoveredDay(null)}
                    title={`${format(day.date, "MMM d, yyyy")}: ${day.count} completions`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Hover tooltip */}

        {hoveredDay && (
          <div className="w-55 mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {format(hoveredDay.date, "EEEE, MMMM d, yyyy")}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {hoveredDay.count}{" "}
              {hoveredDay.count === 1 ? "completion" : "completions"}
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Current Streak
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {calculateCurrentStreak(weeks)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">days</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Busiest Day
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {maxCount}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              completions
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Total Days
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {calculateActiveDays(weeks)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              with activity
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Avg per Day
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {calculateAvgPerDay(weeks)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              completions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function calculateCurrentStreak(weeks: WeekActivity[]): number {
  let streak = 0;
  const allDays = weeks.flatMap((w) => w.days).reverse();

  for (const day of allDays) {
    if (day.count > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function calculateActiveDays(weeks: WeekActivity[]): number {
  return weeks.flatMap((w) => w.days).filter((d) => d.count > 0).length;
}

function calculateAvgPerDay(weeks: WeekActivity[]): number {
  const allDays = weeks.flatMap((w) => w.days);
  const total = allDays.reduce((sum, d) => sum + d.count, 0);
  return allDays.length > 0
    ? Math.round((total / allDays.length) * 10) / 10
    : 0;
}
