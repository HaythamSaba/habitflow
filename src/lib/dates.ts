import { endOfDay, format, parseISO, startOfDay, subDays } from "date-fns";

/**
 * Day handling for HabitFlow. A "day" is always the user's LOCAL calendar day:
 * a habit checked off at 9 pm in New York belongs to that day, even though
 * its UTC timestamp falls on the next date. Never derive days from
 * `toISOString()` / the UTC part of a timestamp.
 */

/** Local calendar day key, e.g. "2026-10-05". Accepts a Date or ISO timestamp. */
export function toDayKey(date: Date | string): string {
  const value = typeof date === "string" ? parseISO(date) : date;
  return format(value, "yyyy-MM-dd");
}

/** Day key for the local day before `dayKey` (DST-safe calendar arithmetic). */
export function previousDayKey(dayKey: string): string {
  // parseISO reads a date-only string as local midnight
  return toDayKey(subDays(parseISO(dayKey), 1));
}

/**
 * Start and end of the local day containing `date`, as UTC ISO timestamps
 * suitable for filtering a timestamptz column.
 */
export function getLocalDayRange(date: Date = new Date()): {
  start: string;
  end: string;
} {
  return {
    start: startOfDay(date).toISOString(),
    end: endOfDay(date).toISOString(),
  };
}
