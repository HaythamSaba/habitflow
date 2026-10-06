import { describe, expect, it } from "vitest";
import {
  countCompletionsInWindow,
  getAverageRate,
  getDailyTargetTrend,
  getHabitRate,
} from "./analytics";

// Dates are built in LOCAL time, so these tests hold in any time zone
const local = (y: number, m: number, d: number, h = 12) =>
  new Date(y, m - 1, d, h);

const TODAY = local(2026, 10, 30, 18);

const habit = (id: string, createdDay: number, target_count = 1) => ({
  id,
  target_count,
  created_at: local(2026, 10, createdDay, 9).toISOString(),
});

/** `times` check-ins at noon on each listed day of October 2026 */
const checks = (habitId: string, days: number[], times = 1) =>
  days.flatMap((d) =>
    Array.from({ length: times }, () => ({
      habit_id: habitId,
      completed_at: local(2026, 10, d).toISOString(),
    })),
  );

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

describe("getHabitRate", () => {
  it("only expects days since the habit was created (not 30)", () => {
    // Created 5 days ago (Oct 26), done every day through today
    const newHabit = habit("new", 26);
    expect(getHabitRate(newHabit, checks("new", range(26, 30)), 30, TODAY)).toBe(100);
  });

  it("uses the full window for older habits", () => {
    // Created in September, done 15 of the last 30 days (Oct 1–30)
    const old = { ...habit("old", 1), created_at: local(2026, 9, 1).toISOString() };
    expect(getHabitRate(old, checks("old", range(16, 30)), 30, TODAY)).toBe(50);
  });

  it("caps each day at the target, so extra check-ins can't cover a missed day", () => {
    const h = habit("h", 29); // 2 days in window: Oct 29, 30
    expect(getHabitRate(h, checks("h", [29], 5), 30, TODAY)).toBe(50);
  });

  it("measures multi-count habits against the daily target", () => {
    const water = habit("water", 29, 3); // 2 days × 3 = 6 expected
    const completions = [...checks("water", [29], 3), ...checks("water", [30], 1)];
    expect(getHabitRate(water, completions, 30, TODAY)).toBe(67); // 4/6
  });

  it("ignores check-ins outside the window", () => {
    const h = habit("h", 1); // window here is the last 7 days: Oct 24–30
    expect(getHabitRate(h, checks("h", range(1, 23)), 7, TODAY)).toBe(0);
  });
});

describe("getAverageRate", () => {
  it("weights habits by their expected check-ins and never exceeds 100", () => {
    const a = habit("a", 26); // 5 days, all done → 5/5
    const b = habit("b", 26, 3); // 5 days × 3 = 15, none done
    const completions = checks("a", range(26, 30), 4); // over-completion is capped
    expect(getAverageRate([a, b], completions, 30, TODAY)).toBe(25); // 5/20
  });

  it("is 0 with no habits", () => {
    expect(getAverageRate([], [], 30, TODAY)).toBe(0);
  });
});

describe("getDailyTargetTrend", () => {
  it("returns one point per day, oldest first, ending today", () => {
    const trend = getDailyTargetTrend([habit("a", 1)], [], 30, TODAY);
    expect(trend).toHaveLength(30);
    expect(trend[0].dayKey).toBe("2026-10-01");
    expect(trend[29].dayKey).toBe("2026-10-30");
  });

  it("is null before any habit existed, then % of that day's targets", () => {
    const a = habit("a", 28);
    const b = habit("b", 29, 2);
    const completions = [...checks("a", [28, 29]), ...checks("b", [29])];
    const byDay = Object.fromEntries(
      getDailyTargetTrend([a, b], completions, 30, TODAY).map((p) => [p.dayKey, p]),
    );

    expect(byDay["2026-10-27"].rate).toBeNull();
    expect(byDay["2026-10-28"]).toMatchObject({ rate: 100, done: 1, expected: 1 });
    expect(byDay["2026-10-29"]).toMatchObject({ rate: 67, done: 2, expected: 3 });
    expect(byDay["2026-10-30"]).toMatchObject({ rate: 0, done: 0, expected: 3 });
  });
});

describe("countCompletionsInWindow", () => {
  it("counts check-ins from the first window day through today", () => {
    const completions = checks("a", [1, 23, 24, 30]);
    expect(countCompletionsInWindow(completions, 7, TODAY)).toBe(2); // Oct 24–30
  });
});
