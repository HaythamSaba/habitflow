import { describe, expect, it } from "vitest";
import {
  LEVELS,
  POINTS_PER_COMPLETION,
  calculateLevel,
  getLevelData,
  getLevelProgress,
  getPointsToNextLevel,
} from "./points";

describe("level tiers", () => {
  it("are numbered 1..N with strictly increasing thresholds", () => {
    LEVELS.forEach((levelData, i) => {
      expect(levelData.level).toBe(i + 1);
      if (i > 0) expect(levelData.minPoints).toBeGreaterThan(LEVELS[i - 1].minPoints);
    });
    expect(LEVELS[0].minPoints).toBe(0);
  });

  it("keep the original thresholds for levels 1–4 (no one is demoted)", () => {
    expect(LEVELS.slice(0, 4).map((l) => l.minPoints)).toEqual([0, 100, 300, 600]);
  });

  it("get steadily harder: each gap at least as big as the one before", () => {
    for (let i = 2; i < LEVELS.length; i++) {
      const gap = LEVELS[i].minPoints - LEVELS[i - 1].minPoints;
      const previousGap = LEVELS[i - 1].minPoints - LEVELS[i - 2].minPoints;
      expect(gap).toBeGreaterThanOrEqual(previousGap);
    }
  });

  it("last roughly a year of daily check-ins with 3 habits", () => {
    const maxPoints = LEVELS[LEVELS.length - 1].minPoints;
    const daysWithThreeHabits = maxPoints / (3 * POINTS_PER_COMPLETION);
    expect(daysWithThreeHabits).toBeGreaterThan(300);
  });

  it("have unique labels", () => {
    const labels = LEVELS.map((l) => l.label);
    expect(new Set(labels).size).toBe(labels.length);
  });
});

describe("calculateLevel", () => {
  it("returns the highest level reached, at and around thresholds", () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(99)).toBe(1);
    expect(calculateLevel(100)).toBe(2);
    expect(calculateLevel(999)).toBe(4);
    expect(calculateLevel(1000)).toBe(5);
    expect(calculateLevel(11_500)).toBe(11);
    expect(calculateLevel(1_000_000)).toBe(11);
  });

  it("treats negative points as level 1", () => {
    expect(calculateLevel(-10)).toBe(1);
  });
});

describe("getPointsToNextLevel", () => {
  it("counts down to the next threshold, and is 0 at the max level", () => {
    expect(getPointsToNextLevel(0)).toBe(100);
    expect(getPointsToNextLevel(950)).toBe(50);
    expect(getPointsToNextLevel(1000)).toBe(600); // Lv 5 → Lv 6 at 1,600
    expect(getPointsToNextLevel(11_500)).toBe(0);
  });
});

describe("getLevelProgress", () => {
  it("is the share of the current level earned, 0–100", () => {
    expect(getLevelProgress(0)).toBe(0);
    expect(getLevelProgress(50)).toBe(50); // halfway from 0 to 100
    expect(getLevelProgress(1300)).toBe(50); // halfway from 1,000 to 1,600
    expect(getLevelProgress(12_000)).toBe(100); // max level
  });

  it("never goes below 0", () => {
    expect(getLevelProgress(-50)).toBe(0);
  });
});

describe("getLevelData", () => {
  it("finds a level and falls back to level 1", () => {
    expect(getLevelData(8).label).toBe("Master");
    expect(getLevelData(99)).toBe(LEVELS[0]);
  });
});
