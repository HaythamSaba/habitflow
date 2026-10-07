import { describe, expect, it } from "vitest";
import { HABIT_FORM_DEFAULTS, HABIT_ICONS, habitSchema } from "./habits";
import { HABIT_COLORS } from "@/lib/utils";

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
