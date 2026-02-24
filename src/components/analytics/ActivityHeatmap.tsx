import { useEffect, useState } from "react";
import { useActivityHeatmap, WeekActivity } from "@/hooks/useActivityHeatmap";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { useAllCompletions } from "@/hooks/useAllCompletions";

export function ActivityHeatmap() {
  const { completions } = useAllCompletions();
  const { weeks, months, maxCount } = useActivityHeatmap(
    completions || [],
    365,
  );

  const [hoveredDay, setHoveredDay] = useState<{
    date: Date;
    count: number;
  } | null>(null);

  // ⭐ Track dark mode
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

  // ⭐ Responsive cell size
  const [cellSize, setCellSize] = useState(12);

  // ⭐ FIXED: Cell size updates
  useEffect(() => {
    const updateCellSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCellSize(8); // Mobile
      } else if (width < 1024) {
        setCellSize(10); // Tablet
      } else {
        setCellSize(12); // Desktop
      }
    };

    updateCellSize();
    window.addEventListener("resize", updateCellSize);
    return () => window.removeEventListener("resize", updateCellSize);
  }, []);

  // ⭐ FIXED: Dark mode observer (was broken before)
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Color levels
  const getColor = (level: number, isDark: boolean) => {
    if (level === 0) return isDark ? "#1f2937" : "#ebedf0";

    const colors = isDark
      ? {
          1: "#0e4429",
          2: "#006d32",
          3: "#26a641",
          4: "#39d353",
        }
      : {
          1: "#9be9a8",
          2: "#40c463",
          3: "#30a14e",
          4: "#216e39",
        };

    return colors[level as 1 | 2 | 3 | 4] || colors[1];
  };

  return (
    <div className="bg-white dark:bg-gray-950 rounded-2xl p-4 md:p-6 border border-gray-200 dark:border-gray-800">
      {/* Header - RESPONSIVE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-primary-500" />
            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">
              Activity Calendar
            </h3>
          </div>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            {completions?.length || 0} total completions in the last year
          </p>
        </div>

        {/* Legend - RESPONSIVE */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor: getColor(level, isDark),
              }}
            />
          ))}
          <span className="text-xs text-gray-600 dark:text-gray-400">More</span>
        </div>
      </div>

      {/* Heatmap Container - RESPONSIVE SCROLL */}
      <div className="relative mb-4">
        {/* ⭐ Mobile scroll indicator */}
        <div className="md:hidden mb-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
          <span>Scroll horizontally to view full calendar</span>
        </div>

        {/* ⭐ Scrollable container */}
        <div className="overflow-x-auto overflow-y-hidden -mx-4 md:mx-0 px-4 md:px-0 pb-2"> 
          <div className="inline-block min-w-max">
            {/* Month labels - RESPONSIVE */}
            <div className="flex justify-between mb-2 ml-12">
              {months.map((month, index) => (
                <div
                  key={index}
                  className="text-xs text-gray-600 dark:text-gray-400 font-medium"
                  style={{
                    width: `${cellSize * 4.3}px`,
                  }}
                >
                  {/* ⭐ Abbreviated on mobile */}
                  <span className="hidden sm:inline">{month.name}</span>
                  <span className="sm:hidden">{month.name.slice(0, 3)}</span>
                </div>
              ))}
            </div>

            {/* Grid - RESPONSIVE */}
            <div className="flex gap-1">
              {/* ⭐ Day labels - RESPONSIVE (single letter on mobile) */}
              <div className="flex flex-col gap-2.5 md:gap-1 pb-4 justify-between pr-2 min-w-11 sm:min-w-11">
                {/* Desktop: Full day names */}
                <span
                  className=" sm:block text-xs text-gray-600 dark:text-gray-400"
                  style={{ height: cellSize }}
                >
                  Mon
                </span>
                <span
                  className=" sm:block text-xs text-gray-600 dark:text-gray-400"
                  style={{ height: cellSize }}
                >
                  Tue
                </span>
                <span
                  className=" sm:block text-xs text-gray-600 dark:text-gray-400"
                  style={{ height: cellSize }}
                >
                  Wed
                </span>
                <span
                  className=" sm:block text-xs text-gray-600 dark:text-gray-400"
                  style={{ height: cellSize }}
                >
                  Thu
                </span>
                <span
                  className=" sm:block text-xs text-gray-600 dark:text-gray-400"
                  style={{ height: cellSize }}
                >
                  Fri
                </span>
                <span
                  className=" sm:block text-xs text-gray-600 dark:text-gray-400"
                  style={{ height: cellSize }}
                >
                  Sat
                </span>
                <span
                  className=" sm:block text-xs text-gray-600 dark:text-gray-400"
                  style={{ height: cellSize }}
                >
                  Sun
                </span>

                {/* ⭐ Mobile: Single letter */}
                {/* <span
                  className="sm:hidden text-xs text-gray-600 dark:text-gray-400"
                  style={{ height: cellSize }}
                >
                  M
                </span>
                <span
                  className="sm:hidden text-xs text-gray-600 dark:text-gray-400"
                  style={{ height: cellSize }}
                >
                  T
                </span>
                <span
                  className="sm:hidden text-xs text-gray-600 dark:text-gray-400"
                  style={{ height: cellSize }}
                >
                  W
                </span>
                <span
                  className="sm:hidden text-xs text-gray-600 dark:text-gray-400"
                  style={{ height: cellSize }}
                >
                  T
                </span>
                <span
                  className="sm:hidden text-xs text-gray-600 dark:text-gray-400"
                  style={{ height: cellSize }}
                >
                  F
                </span>
                <span
                  className="sm:hidden text-xs text-gray-600 dark:text-gray-400"
                  style={{ height: cellSize }}
                >
                  S
                </span>
                <span
                  className="sm:hidden text-xs text-gray-600 dark:text-gray-400"
                  style={{ height: cellSize }}
                >
                  S
                </span> */}
              </div>

              {/* ⭐ Weeks - TOUCH FRIENDLY */}
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-2 md:gap-1">
                  {week.days.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-primary-500 active:ring-2 active:ring-primary-600 duration-300 hover:ring-offset-1 dark:hover:ring-offset-gray-800"
                      style={{
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: getColor(day.level, isDark),
                        minWidth: cellSize < 10 ? "10px" : "auto",
                        minHeight: cellSize < 10 ? "10px" : "auto",
                      }}
                      onMouseEnter={() =>
                        setHoveredDay({ date: day.date, count: day.count })
                      }
                      onMouseLeave={() => setHoveredDay(null)}
                      // ⭐ Touch events for mobile
                      onTouchStart={() =>
                        setHoveredDay({ date: day.date, count: day.count })
                      }
                      onTouchEnd={() => {
                        setTimeout(() => setHoveredDay(null), 2000);
                      }}
                      title={`${format(day.date, "MMM d, yyyy")}: ${day.count} completions`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ⭐ Hover/Touch Tooltip - BELOW CALENDAR */}
      {hoveredDay ? (
        <div className="mb-4 max-w-sm min-h-20 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {/* ⭐ Full date on desktop, short on mobile */}
            <span className="hidden sm:inline">
              {format(hoveredDay.date, "EEEE, MMMM d, yyyy")}
            </span>
            <span className="sm:hidden">
              {format(hoveredDay.date, "MMM d, yyyy")}
            </span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {hoveredDay.count}{" "}
            {hoveredDay.count === 1 ? "completion" : "completions"}
          </p>
        </div>
      ) : (
        <div className="min-h-20 max-w-sm mb-4 max-h-20 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <p className="text-sm text-gray-600 dark:text-gray-400">Hover over a day</p>
        </div>
      )}

      {/* ⭐ Stats - RESPONSIVE GRID (centered on mobile) */}
      <div className="pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="text-center md:text-left">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Current Streak
            </p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {calculateCurrentStreak(weeks)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">days</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Busiest Day
            </p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {maxCount}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              completions
            </p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Total Days
            </p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {calculateActiveDays(weeks)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              with activity
            </p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Avg per Day
            </p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
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
