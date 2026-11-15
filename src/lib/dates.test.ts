import { describe, expect, it } from "vitest";
import { toDayKey, yesterdayCheckInTime } from "./dates";

// Dates are built in LOCAL time, so these tests hold in any time zone
const local = (y: number, m: number, d: number, h = 0, min = 0) =>
  new Date(y, m - 1, d, h, min);

describe("yesterdayCheckInTime", () => {
  const now = local(2026, 11, 15, 9);

  it("uses local noon of yesterday", () => {
    const result = yesterdayCheckInTime(local(2026, 11, 1).toISOString(), now);

    expect(result).toBe(local(2026, 11, 14, 12).toISOString());
    expect(toDayKey(result!)).toBe("2026-11-14");
  });

  it("uses the creation time when the habit was made yesterday afternoon", () => {
    const createdAt = local(2026, 11, 14, 18, 30).toISOString();

    expect(yesterdayCheckInTime(createdAt, now)).toBe(createdAt);
  });

  it("returns null when the habit was created today", () => {
    const createdAt = local(2026, 11, 15, 8).toISOString();

    expect(yesterdayCheckInTime(createdAt, now)).toBeNull();
  });

  it("handles the first of the month", () => {
    const result = yesterdayCheckInTime(
      local(2026, 10, 1).toISOString(),
      local(2026, 11, 1, 7),
    );

    expect(toDayKey(result!)).toBe("2026-10-31");
  });
});
