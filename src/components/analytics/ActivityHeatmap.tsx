import { useEffect, useMemo, useRef, useState, KeyboardEvent } from "react";
import {
  useActivityHeatmap,
  DayActivity,
  WeekActivity,
} from "@/hooks/useActivityHeatmap";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { useAllCompletions } from "@/hooks/useAllCompletions";
import { useDashboardStreak } from "@/hooks/useDashboardStreak";
import { useHabits } from "@/hooks/useHabits";
import { useTheme } from "@/contexts/ThemeContext";
import { Card } from "@/components/ui/Card";
import { toDayKey } from "@/lib/dates";

/** Cells never render smaller than this, so they stay tappable */
const MIN_CELL_PX = 10;

export function ActivityHeatmap() {
  const today = new Date().toDateString();
  const { habits } = useHabits();
  const { completions } = useAllCompletions();
  // Same "Best Active Streak" as the dashboard (shared rules in lib/streaks.ts)
  const { maxStreak } = useDashboardStreak();
  // Active habits, like the rest of Analytics. Memoized so hovering a day
  // doesn't recompute the whole year.
  const activeHabits = useMemo(
    () => habits.filter((habit) => !habit.archived),
    [habits],
  );
  const { weeks, months } = useActivityHeatmap(
    activeHabits,
    completions || [],
    365,
  );
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [hoveredDay, setHoveredDay] = useState<DayActivity | null>(null);

  // Keyboard: one cell is in the tab order at a time; arrow keys move it
  const gridRef = useRef<HTMLDivElement>(null);
  const [focusKey, setFocusKey] = useState(() => toDayKey(new Date()));

  // Responsive cell size
  const [cellSize, setCellSize] = useState(12);
  // Size the cells actually render at; day labels use it too so rows line up
  const cellPx = Math.max(cellSize, MIN_CELL_PX);

  // Cell size updates
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

  const handleGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const nextKey = getNextDayKey(weeks, focusKey, event.key);
    if (!nextKey) return;
    event.preventDefault();
    setFocusKey(nextKey);
    gridRef.current
      ?.querySelector<HTMLButtonElement>(`[data-day="${nextKey}"]`)
      ?.focus();
  };

  return (
    <Card className="p-4 sm:p-4 md:p-6 shadow-none">
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
            {calculateTotalCompletions(weeks)} total completions in the last year
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
        {/* Mobile scroll indicator */}
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

        {/* Scrollable container */}
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
                  {/* Abbreviated on mobile */}
                  <span className="hidden sm:inline">{month.name}</span>
                  <span className="sm:hidden">{month.name.slice(0, 3)}</span>
                </div>
              ))}
            </div>

            {/* Grid - RESPONSIVE */}
            <div className="flex gap-1">
              {/* Day labels — rows run Sunday→Saturday (see useActivityHeatmap).
                  Same height and gap as the cells, so each label sits on its row. */}
              <div
                aria-hidden="true"
                className="flex flex-col gap-2 md:gap-1 pb-4 pr-2 min-w-11 sm:min-w-11"
              >
                {DAY_LABELS.map((label) => (
                  <span
                    key={label}
                    className="flex items-center text-xs leading-none text-gray-600 dark:text-gray-400"
                    style={{ height: cellPx }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* Weeks */}
              <div
                ref={gridRef}
                role="group"
                aria-label="Activity calendar, last 365 days. Use the arrow keys to move between days."
                className="flex gap-1"
                onKeyDown={handleGridKeyDown}
              >
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-2 md:gap-1">
                    {week.days.map((day, dayIndex) => {
                      if (!day.inRange) {
                        // Padding outside the year (incl. future days): keep the grid, show nothing
                        return (
                          <div
                            key={dayIndex}
                            aria-hidden="true"
                            style={{ width: cellPx, height: cellPx }}
                          />
                        );
                      }

                      const dayKey = toDayKey(day.date);
                      const isToday = today === day.date.toDateString();
                      return (
                        <button
                          key={dayIndex}
                          type="button"
                          data-day={dayKey}
                          tabIndex={dayKey === focusKey ? 0 : -1}
                          aria-label={describeDay(day, isToday)}
                          className={`
                          rounded-sm cursor-pointer transition-all
                          hover:ring-2 hover:ring-primary-500
                          active:ring-2 active:ring-primary-600
                          duration-300 hover:ring-offset-0
                          dark:hover:ring-offset-gray-800
                          focus-visible:outline-2 focus-visible:outline-offset-2
                          focus-visible:outline-primary-600 dark:focus-visible:outline-primary-300
                            ${
                              isToday
                                ? "ring-2 ring-secondary-500 dark:ring-secondary-400 ring-offset-0 dark:ring-offset-gray-900"
                                : ""
                            }
                          `}
                          style={{
                            width: cellPx,
                            height: cellPx,
                            backgroundColor: getColor(day.level, isDark), // % of targets met
                          }}
                          onMouseEnter={() => setHoveredDay(day)}
                          onMouseLeave={() => setHoveredDay(null)}
                          onFocus={() => {
                            setFocusKey(dayKey);
                            setHoveredDay(day);
                          }}
                          onBlur={() => setHoveredDay(null)}
                          onTouchStart={() => setHoveredDay(day)}
                          onTouchEnd={() => {
                            setTimeout(() => setHoveredDay(null), 2000);
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover/touch/focus details, below the calendar */}
      <div className="min-h-20 max-w-sm mb-4 max-h-20 p-3 bg-gray-50 dark:bg-primary-700 rounded-lg border border-gray-200 dark:border-gray-600">
        {hoveredDay ? (
          <div>
            <div className="flex items-center gap-2 mb-1">
              {today === hoveredDay.date.toDateString() && (
                <span className="px-2 py-0.5 bg-secondary-500 text-gray-800 text-xs font-medium rounded">
                  Today
                </span>
              )}
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {format(hoveredDay.date, "EEEE, MMMM d, yyyy")}
              </p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-200">
              {formatDayStats(hoveredDay)}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-200">
            {/* Touch screens can't hover */}
            <span className="hidden [@media(hover:hover)]:inline">
              Hover over a day
            </span>
            <span className="[@media(hover:hover)]:hidden">Tap a day</span>
          </p>
        )}
      </div>

      {/* Stats - RESPONSIVE GRID (centered on mobile) */}
      <div className="pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
          <div className="text-center md:text-left bg-amber-100 dark:bg-amber-950 p-6 rounded-2xl">
            <p className="text-xs text-gray-600 dark:text-gray-200 mb-1">
              Best Active Streak
            </p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {maxStreak}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">days</p>
          </div>
          <div className="text-center md:text-left bg-green-100 dark:bg-green-950 p-6 rounded-2xl">
            <p className="text-xs text-gray-600 dark:text-gray-200 mb-1">
              Busiest Day
            </p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {calculateBusiestDay(weeks)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              completions
            </p>
          </div>
          <div className="text-center md:text-left bg-red-100 dark:bg-red-950 p-6 rounded-2xl">
            <p className="text-xs text-gray-600 dark:text-gray-200 mb-1">
              Total Days
            </p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {calculateActiveDays(weeks)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              with activity
            </p>
          </div>
          <div className="text-center md:text-left bg-blue-100 p-6 dark:bg-blue-950 rounded-2xl">
            <p className="text-xs text-gray-600 dark:text-gray-200 mb-1">
              Avg per Day
            </p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {calculateAvgPerDay(weeks)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              completions
            </p>
          </div>
          <div className="text-center md:text-left bg-fuchsia-100 dark:bg-fuchsia-950 p-6 rounded-2xl">
            <p className="text-xs text-gray-600 dark:text-gray-200 mb-1">
              Today
            </p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {getTodayCount(weeks)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              completions
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Row labels, matching the Sunday-first weeks built by useActivityHeatmap
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Days per arrow key: rows are weekdays, columns are weeks */
const KEY_STEPS: Record<string, number> = {
  ArrowUp: -1,
  ArrowDown: 1,
  ArrowLeft: -7,
  ArrowRight: 7,
};

/** Day key the arrow/Home/End key moves to, or null if the key isn't handled */
function getNextDayKey(
  weeks: WeekActivity[],
  currentKey: string,
  key: string,
): string | null {
  const dayKeys = getDaysInRange(weeks).map((d) => toDayKey(d.date));
  if (dayKeys.length === 0) return null;
  if (key === "Home") return dayKeys[0];
  if (key === "End") return dayKeys[dayKeys.length - 1];

  const step = KEY_STEPS[key];
  if (step === undefined) return null;
  const index = Math.max(0, dayKeys.indexOf(currentKey));
  const next = Math.min(dayKeys.length - 1, Math.max(0, index + step));
  return dayKeys[next];
}

/** e.g. "3 completions · 75% of targets met" */
function formatDayStats(day: DayActivity): string {
  const completions = `${day.count} ${day.count === 1 ? "completion" : "completions"}`;
  const targets =
    day.rate === null ? "no habits yet" : `${day.rate}% of targets met`;
  return `${completions} · ${targets}`;
}

function describeDay(day: DayActivity, isToday: boolean): string {
  const date = format(day.date, "EEEE, MMMM d, yyyy");
  return `${isToday ? "Today, " : ""}${date}: ${formatDayStats(day).replace(" · ", ", ")}`;
}

// Helper functions — all ignore padding cells outside the year
function getDaysInRange(weeks: WeekActivity[]) {
  return weeks.flatMap((w) => w.days).filter((d) => d.inRange);
}

function calculateTotalCompletions(weeks: WeekActivity[]): number {
  return getDaysInRange(weeks).reduce((sum, d) => sum + d.count, 0);
}

function calculateBusiestDay(weeks: WeekActivity[]): number {
  return Math.max(0, ...getDaysInRange(weeks).map((d) => d.count));
}

function calculateActiveDays(weeks: WeekActivity[]): number {
  return getDaysInRange(weeks).filter((d) => d.count > 0).length;
}

function calculateAvgPerDay(weeks: WeekActivity[]): number {
  const days = getDaysInRange(weeks);
  const total = days.reduce((sum, d) => sum + d.count, 0);
  return days.length > 0 ? Math.round((total / days.length) * 10) / 10 : 0;
}

function getTodayCount(weeks: WeekActivity[]): number {
  const today = new Date().toDateString();
  const todayData = getDaysInRange(weeks).find(
    (d) => d.date.toDateString() === today,
  );
  return todayData?.count || 0;
}
