import { useMemo } from "react";
import { Completion, Habit } from "@/types";
import {
  startOfDay,
  eachDayOfInterval,
  subDays,
  format,
  addDays,
  getDay,
} from "date-fns";
import {
  getDailyTargetTrend,
  HeatmapLevel,
  rateToHeatmapLevel,
} from "@/lib/analytics";

export interface DayActivity {
  date: Date;
  /** Check-ins that day (any habit) */
  count: number;
  /** % of that day's targets met, same rules as the trend chart; null before any habit existed */
  rate: number | null;
  /** Color intensity, from `rate` */
  level: HeatmapLevel;
  /** false for padding cells that fill out the first/last week (outside the range) */
  inRange: boolean;
}

export interface WeekActivity {
  days: DayActivity[];
}

interface HeatmapData {
  weeks: WeekActivity[];
  months: { name: string; startCol: number }[];
  maxCount: number;
}

/**
 * @param habits Habits whose daily targets set each day's color (pass active habits,
 *   like the rest of Analytics)
 * @param completions Check-ins to count per day
 */
export function useActivityHeatmap(
  habits: Pick<Habit, "id" | "target_count" | "created_at">[],
  completions: Completion[],
  daysToShow: number = 365,
): HeatmapData {
  return useMemo(() => {
    const today = startOfDay(new Date());

    // % of targets met per day (lib/analytics.ts), keyed by yyyy-MM-dd
    const rateByDay = new Map(
      getDailyTargetTrend(habits, completions, daysToShow, today).map(
        (point) => [point.dayKey, point.rate],
      ),
    );
    const startDate = subDays(today, daysToShow - 1);

    // Get all days in range
    const allDays = eachDayOfInterval({
      start: startDate,
      end: today,
    });

    // Count completions per day
    const activityMap = new Map<string, number>();
    completions.forEach((completion) => {
      const completionDate = new Date(completion.completed_at);
      const dateKey = format(startOfDay(completionDate), "yyyy-MM-dd");
      activityMap.set(dateKey, (activityMap.get(dateKey) || 0) + 1);
    }); 

    // Find max count for scaling
    const maxCount = Math.max(...Array.from(activityMap.values()), 1);

    // Create day activities with levels
    const dayActivities: DayActivity[] = allDays.map((date) => {
      const dateKey = format(date, "yyyy-MM-dd");
      const count = activityMap.get(dateKey) || 0;
      const rate = rateByDay.get(dateKey) ?? null;

      return { date, count, rate, level: rateToHeatmapLevel(rate), inRange: true };
    });

    // Organize into weeks (Sunday-Saturday; row 0 is Sunday)
    const weeks: WeekActivity[] = [];
    let currentWeek: DayActivity[] = [];

    // Add empty cells for first week if it doesn't start on Sunday
    const firstDayOfWeek = getDay(dayActivities[0].date);
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({
        date: subDays(dayActivities[0].date, firstDayOfWeek - i),
        count: 0,
        rate: null,
        level: 0,
        inRange: false,
      });
    }

    dayActivities.forEach((day, index) => {
      currentWeek.push(day);

      // If Sunday or last day, start new week
      if (getDay(day.date) === 6 || index === dayActivities.length - 1) {
        // Fill rest of week if needed
        while (currentWeek.length < 7) {
          const lastDate = currentWeek[currentWeek.length - 1].date;
          currentWeek.push({
            date: addDays(lastDate, 1),
            count: 0,
            rate: null,
            level: 0,
            inRange: false,
          });
        }
        weeks.push({ days: currentWeek });
        currentWeek = [];
      }
    });

    // Calculate month labels
    const months: { name: string; startCol: number }[] = [];
    let currentMonth = "";

    weeks.forEach((week, weekIndex) => {
      const firstDayOfWeek = week.days[0];
      const monthName = format(firstDayOfWeek.date, "MMM");

      if (monthName !== currentMonth) {
        months.push({ name: monthName, startCol: weekIndex });
        currentMonth = monthName;
      }
    });

    return { weeks, months, maxCount };
  }, [habits, completions, daysToShow]);
}
