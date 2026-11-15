import { describe, expect, it } from "vitest";
import { nextMenuIndex } from "./menuNavigation";

describe("nextMenuIndex", () => {
  it("moves down and wraps from the last item to the first", () => {
    expect(nextMenuIndex("ArrowDown", 0, 3)).toBe(1);
    expect(nextMenuIndex("ArrowDown", 2, 3)).toBe(0);
  });

  it("moves up and wraps from the first item to the last", () => {
    expect(nextMenuIndex("ArrowUp", 2, 3)).toBe(1);
    expect(nextMenuIndex("ArrowUp", 0, 3)).toBe(2);
  });

  it("starts at the first or last item when nothing has focus", () => {
    expect(nextMenuIndex("ArrowDown", -1, 3)).toBe(0);
    expect(nextMenuIndex("ArrowUp", -1, 3)).toBe(2);
  });

  it("jumps to the ends with Home and End", () => {
    expect(nextMenuIndex("Home", 1, 4)).toBe(0);
    expect(nextMenuIndex("End", 1, 4)).toBe(3);
  });

  it("returns null for other keys or an empty menu", () => {
    expect(nextMenuIndex("Enter", 0, 3)).toBeNull();
    expect(nextMenuIndex("ArrowDown", -1, 0)).toBeNull();
  });
});
