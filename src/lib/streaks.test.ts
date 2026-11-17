import { describe, expect, it } from "vitest";
import {
  calculateCurrentStreak,
  calculateLongestStreak,
  getBestStreaks,
  getCompletedDayKeys,
  getFrozenDayKeys,
  getHabitStreaks,
} from "./streaks";

// Dates are built in LOCAL time, so these tests hold in any time zone
// (run e.g. `TZ=America/New_York npm test` to try one explicitly).
const local = (y: number, m: number, d: number, h = 12, min = 0) =>
  new Date(y, m - 1, d, h, min);

const check = (habitId: string, date: Date) => ({
  habit_id: habitId,
  completed_at: date.toISOString(),
});

/** One check-in at noon on each listed day of October 2026 */
const octoberDays = (habitId: string, days: number[]) =>
  days.map((d) => check(habitId, local(2026, 10, d)));

const daily = { id: "read", target_count: 1 };
const threeTimes = { id: "water", target_count: 3 };
const TODAY = local(2026, 10, 15, 18);

describe("getCompletedDayKeys", () => {
  it("only counts days where the daily target was met", () => {
    const completions = [
      ...octoberDays("water", [14, 14, 14]), // 3/3 → counts
      ...octoberDays("water", [13, 13]), // 2/3 → doesn't
    ];
    expect([...getCompletedDayKeys(threeTimes, completions)]).toEqual([
      "2026-10-14",
    ]);
  });

  it("ignores other habits' completions", () => {
    const completions = [...octoberDays("read", [14]), ...octoberDays("other", [13])];
    expect([...getCompletedDayKeys(daily, completions)]).toEqual(["2026-10-14"]);
  });

  it("keys late-evening check-ins to the local day, not the UTC date", () => {
    const completions = [check("read", local(2026, 10, 14, 23, 30))];
    expect([...getCompletedDayKeys(daily, completions)]).toEqual(["2026-10-14"]);
  });
});

describe("current streak", () => {
  const streak = (completions: ReturnType<typeof check>[], habit = daily) =>
    getHabitStreaks(habit, completions, TODAY).current;

  it("counts back from today when today is done", () => {
    expect(streak(octoberDays("read", [13, 14, 15]))).toBe(3);
  });

  it("stays alive from yesterday while today isn't done yet", () => {
    expect(streak(octoberDays("read", [12, 13, 14]))).toBe(3);
  });

  it("is 0 when the last completed day was before yesterday", () => {
    expect(streak(octoberDays("read", [11, 12, 13]))).toBe(0);
  });

  it("stops at the first missed day", () => {
    expect(streak(octoberDays("read", [10, 11, 13, 14, 15]))).toBe(3);
  });

  it("doesn't count a partial today, but doesn't break the streak either", () => {
    const completions = [
      ...octoberDays("water", [13, 13, 13, 14, 14, 14]),
      ...octoberDays("water", [15]), // 1/3 so far today
    ];
    expect(streak(completions, threeTimes)).toBe(2);
  });

  it("breaks on a partial day in the past", () => {
    const completions = octoberDays("water", [12, 12, 12, 13, 14, 14, 14]);
    expect(streak(completions, threeTimes)).toBe(1);
  });

  it("is 0 with no completions", () => {
    expect(calculateCurrentStreak(new Set(), TODAY)).toBe(0);
  });
});

describe("longest streak", () => {
  const longest = (completions: ReturnType<typeof check>[]) =>
    getHabitStreaks(daily, completions, TODAY).longest;

  it("finds the longest run in history", () => {
    expect(longest(octoberDays("read", [1, 2, 3, 6, 7, 8, 9, 10, 14]))).toBe(5);
  });

  it("is not broken by several check-ins on the same day", () => {
    expect(longest(octoberDays("read", [5, 5, 6, 6, 6, 7]))).toBe(3);
  });

  it("is 0 with no completions", () => {
    expect(calculateLongestStreak(new Set())).toBe(0);
  });

  it("continues across month and year boundaries", () => {
    const completions = [
      check("read", local(2026, 12, 30)),
      check("read", local(2026, 12, 31)),
      check("read", local(2027, 1, 1)),
    ];
    expect(longest(completions)).toBe(3);
  });

  it("continues across a daylight-saving change", () => {
    // US clocks fall back on 2026-11-01; EU on 2026-10-25
    const completions = [24, 25, 26, 31].map((d) => check("read", local(2026, 10, d)))
      .concat([1, 2].map((d) => check("read", local(2026, 11, d))));
    expect(longest(completions)).toBe(3);
  });
});

describe("streak freezes (one per habit per Mon–Sun week)", () => {
  // November 2026: Mon 2–Sun 8 is one week, Mon 9–Sun 15 the next
  const START = "2026-11-01";
  const novemberDays = (days: number[]) =>
    days.map((d) => check("read", local(2026, 11, d)));
  const at = (day: number, hour = 18) => local(2026, 11, day, hour);
  const streaks = (days: number[], today: Date, start = START) =>
    getHabitStreaks(daily, novemberDays(days), today, start);
  const frozen = (days: number[], today: Date, start = START) =>
    [
      ...getFrozenDayKeys(
        getCompletedDayKeys(daily, novemberDays(days)),
        today,
        start,
      ),
    ].sort();

  it("bridges a single missed day without adding it to the count", () => {
    expect(frozen([2, 3, 4, 6, 7], at(7))).toEqual(["2026-11-05"]);
    expect(streaks([2, 3, 4, 6, 7], at(7)).current).toBe(5);
  });

  it("keeps the streak alive when yesterday was missed and today isn't done yet", () => {
    expect(frozen([3, 4, 5], at(7))).toEqual(["2026-11-06"]);
    expect(streaks([3, 4, 5], at(7)).current).toBe(3);
  });

  it("never freezes today, which isn't missed yet", () => {
    expect(frozen([5, 6], at(7))).toEqual([]);
    expect(streaks([5, 6], at(7)).current).toBe(2);
  });

  it("allows only one freeze per week", () => {
    expect(frozen([2, 4, 6], at(6))).toEqual(["2026-11-03"]);
    expect(streaks([2, 4, 6], at(6)).current).toBe(1);
  });

  it("gives a new freeze each week", () => {
    expect(frozen([6, 8, 10], at(10))).toEqual(["2026-11-07", "2026-11-09"]);
    expect(streaks([6, 8, 10], at(10)).current).toBe(3);
  });

  it("doesn't bridge two missed days in a row", () => {
    expect(frozen([2, 3, 6], at(6))).toEqual([]);
    expect(streaks([2, 3, 6], at(6)).current).toBe(1);
  });

  it("isn't used up by a gap it can't bridge", () => {
    // 3–4 missed (streak breaks), so the week's freeze is still there for 6
    expect(frozen([2, 5, 7], at(7))).toEqual(["2026-11-06"]);
    expect(streaks([2, 5, 7], at(7)).current).toBe(2);
  });

  it("doesn't apply before the feature's start day", () => {
    expect(frozen([2, 4, 5], at(5), "2026-11-05")).toEqual([]);
    expect(streaks([2, 4, 5], at(5), "2026-11-05").current).toBe(2);
  });

  it("bridges the longest streak too, without counting the frozen day", () => {
    expect(streaks([2, 3, 5, 6], at(20)).longest).toBe(4);
  });

  it("is released when the missed day is logged late", () => {
    expect(frozen([2, 3, 4, 5, 6, 7], at(7))).toEqual([]);
    expect(streaks([2, 3, 4, 5, 6, 7], at(7)).current).toBe(6);
  });
});

describe("getBestStreaks", () => {
  it("returns the best current and best longest across habits", () => {
    const completions = [
      ...octoberDays("read", [13, 14, 15]), // current 3, longest 3
      ...octoberDays("water", [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4]), // current 0, longest 4
    ];
    expect(getBestStreaks([daily, threeTimes], completions, TODAY)).toEqual({
      current: 3,
      longest: 4,
    });
  });

  it("is 0/0 for no habits", () => {
    expect(getBestStreaks([], [], TODAY)).toEqual({ current: 0, longest: 0 });
  });
});
