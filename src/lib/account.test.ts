import { describe, expect, it, vi } from "vitest";

// account.ts imports the Supabase client, which needs env vars; the
// functions tested here don't touch it
vi.mock("./supabase", () => ({ supabase: {} }));

import { exportFileName, fetchAllPages } from "./account";

describe("exportFileName", () => {
  it("uses the local date", () => {
    expect(exportFileName(new Date(2026, 10, 17, 23, 30))).toBe(
      "habitflow-export-2026-11-17.json",
    );
  });
});

describe("fetchAllPages", () => {
  const rows = (from: number, count: number) =>
    Array.from({ length: count }, (_, i) => ({ n: from + i }));

  it("keeps fetching until a page comes back short", async () => {
    const fetchPage = vi.fn(async (from: number, to: number) => {
      const total = 5;
      return rows(from, Math.max(0, Math.min(to, total - 1) - from + 1));
    });

    const result = await fetchAllPages(fetchPage, 2);

    expect(result.map((r) => r.n)).toEqual([0, 1, 2, 3, 4]);
    expect(fetchPage.mock.calls).toEqual([
      [0, 1],
      [2, 3],
      [4, 5],
    ]);
  });

  it("stops after one request when there's less than a page", async () => {
    const fetchPage = vi.fn(async () => rows(0, 3));
    expect(await fetchAllPages(fetchPage, 1000)).toHaveLength(3);
    expect(fetchPage).toHaveBeenCalledTimes(1);
  });

  it("asks for one more page when the last one is exactly full", async () => {
    const fetchPage = vi.fn(async (from: number) =>
      from === 0 ? rows(0, 2) : [],
    );
    expect(await fetchAllPages(fetchPage, 2)).toHaveLength(2);
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it("passes errors on", async () => {
    const fetchPage = vi.fn(async () => {
      throw new Error("network down");
    });
    await expect(fetchAllPages(fetchPage, 2)).rejects.toThrow("network down");
  });
});
