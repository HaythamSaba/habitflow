/**
 * Index of the menu item to focus after a navigation key, or null when the
 * key isn't a menu navigation key. Arrow keys wrap around; Home and End jump
 * to the ends. `current` is -1 when no item has focus yet.
 */
export function nextMenuIndex(
  key: string,
  current: number,
  count: number,
): number | null {
  if (count === 0) return null;
  switch (key) {
    case "ArrowDown":
      return current < 0 ? 0 : (current + 1) % count;
    case "ArrowUp":
      return current < 0 ? count - 1 : (current - 1 + count) % count;
    case "Home":
      return 0;
    case "End":
      return count - 1;
    default:
      return null;
  }
}
