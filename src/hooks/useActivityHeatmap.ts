import { useMemo } from "react";
import { Completion } from "@/types";
import {
  startOfDay,
  eachDayOfInterval,
  subDays,
  format,
  parseISO,
  addDays,
  getDay,
} from "date-fns";

export interface DayActivity {
  date: Date;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // Activity level for color intensity
}

export interface WeekActivity {
  days: DayActivity[];
}

interface HeatmapData {
  weeks: WeekActivity[];
  months: { name: string; startCol: number }[];
  maxCount: number;
}

export function useActivityHeatmap(
  completions: Completion[],
  daysToShow: number = 365,
): HeatmapData {
  return useMemo(() => {
    const today = startOfDay(new Date());
    const startDate = subDays(today, daysToShow - 1);

    // Get all days in range
    const allDays = eachDayOfInterval({
      start: startDate,
      end: today,
    });

    // Count completions per day
    const activityMap = new Map<string, number>();
    completions.forEach((completion) => {
      const date = startOfDay(parseISO(completion.completed_at));
      const dateKey = format(date, "yyyy-MM-dd");
      activityMap.set(dateKey, (activityMap.get(dateKey) || 0) + 1);
    });

    // Find max count for scaling
    const maxCount = Math.max(...Array.from(activityMap.values()), 1);

    // Create day activities with levels
    const dayActivities: DayActivity[] = allDays.map((date) => {
      const dateKey = format(date, "yyyy-MM-dd");
      const count = activityMap.get(dateKey) || 0;

      // Calculate level (0-4) based on count
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count === 0) level = 0;
      else if (count <= 3) level = 1;
      else if (count <= 6) level = 2;
      else if (count <= 9) level = 3;
      else level = 4;

      return { date, count, level };
    });

    // Organize into weeks (Sunday-Saturday)
    const weeks: WeekActivity[] = [];
    let currentWeek: DayActivity[] = [];

    // Add empty cells for first week if it doesn't start on Sunday
    const firstDayOfWeek = getDay(dayActivities[0].date);
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({
        date: subDays(dayActivities[0].date, firstDayOfWeek - i),
        count: 0,
        level: 0,
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
            level: 0,
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
  }, [completions, daysToShow]);
}
