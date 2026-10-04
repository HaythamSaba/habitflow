import { useEffect } from "react";

/**
 * Calls `handler` when the user clicks/taps outside `ref` or presses Escape.
 * Used to dismiss dropdown menus.
 */
export function useClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent | KeyboardEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler(event);
    };

    const keyListener = (event: KeyboardEvent) => {
      if (event.key === "Escape") handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    document.addEventListener("keydown", keyListener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
      document.removeEventListener("keydown", keyListener);
    };
  }, [ref, handler]);
}
