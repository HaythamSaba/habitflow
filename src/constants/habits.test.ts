import { describe, expect, it } from "vitest";
import { HABIT_FORM_DEFAULTS, HABIT_ICONS, habitSchema } from "./habits";
import { MAX_STARTER_PICKS, STARTER_HABITS } from "./starterHabits";
import { HABIT_COLORS } from "@/lib/utils";

describe("starter habits (first-run welcome)", () => {
  it.each(STARTER_HABITS.map((s) => [s.key, s]))(
    "%s is a valid habit with a renderable icon and palette color",
    (_key, starter) => {
      const result = habitSchema.safeParse({
        ...HABIT_FORM_DEFAULTS,
        name: starter.name,
        description: starter.description,
        icon: starter.icon,
        color: starter.color,
      });
      expect(result.success).toBe(true);
      expect(HABIT_ICONS.map((icon) => icon.name)).toContain(starter.icon);
      expect(HABIT_COLORS).toContain(starter.color);
    },
  );

  it("has unique keys and more options than the pick limit", () => {
    const keys = STARTER_HABITS.map((s) => s.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(STARTER_HABITS.length).toBeGreaterThan(MAX_STARTER_PICKS);
  });
});

describe("new habit defaults", () => {
  it("only need a name to pass validation", () => {
    const result = habitSchema.safeParse({
      ...HABIT_FORM_DEFAULTS,
      name: "Read",
    });
    expect(result.success).toBe(true);
  });

  it("still require a name", () => {
    expect(habitSchema.safeParse(HABIT_FORM_DEFAULTS).success).toBe(false);
  });

  it("use an icon and color the pickers can show as selected", () => {
    expect(HABIT_ICONS.map((icon) => icon.name)).toContain(
      HABIT_FORM_DEFAULTS.icon,
    );
    expect(HABIT_COLORS).toContain(HABIT_FORM_DEFAULTS.color);
  });
});
