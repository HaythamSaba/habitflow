import {
  KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useState,
} from "react";
import { nextMenuIndex } from "@/lib/menuNavigation";

const ITEM_SELECTOR = '[role^="menuitem"]:not([disabled])';

const getItems = (menu: HTMLElement | null) =>
  Array.from(menu?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? []);

/**
 * State and ARIA wiring for a dropdown menu button.
 *
 * - Opening moves focus into the menu: the checked option if there is one,
 *   otherwise the first item.
 * - Arrow keys, Home and End move between items; Tab closes the menu.
 * - Escape, or picking an item through `close()`, closes the menu and puts
 *   focus back on the trigger. A click outside closes it without moving focus.
 *
 * Put `wrapperProps` on an element that holds both the trigger and the menu,
 * spread `triggerProps` on the button and `menuProps` on the menu container.
 * Items need role="menuitem" (or "menuitemradio" with aria-checked) and
 * tabIndex={-1}.
 *
 * Elements are kept with callback refs in state rather than useRef, so the
 * returned props can be spread without the React Compiler lint flagging a
 * ref read during render.
 */
export function useMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null);
  const [menu, setMenu] = useState<HTMLDivElement | null>(null);
  const triggerId = useId();
  const menuId = useId();

  /** Close the menu. Pass restoreFocus: false when focus should stay put. */
  const close = useCallback(
    ({ restoreFocus = true }: { restoreFocus?: boolean } = {}) => {
      setIsOpen(false);
      if (restoreFocus) trigger?.focus();
    },
    [trigger],
  );

  // The menu element appears once it has rendered open: move focus into it
  useEffect(() => {
    const items = getItems(menu);
    const checked = items.find(
      (item) => item.getAttribute("aria-checked") === "true",
    );
    (checked ?? items[0])?.focus();
  }, [menu]);

  // Close on a click/tap outside (focus stays where the user put it) or on
  // Escape (focus returns to the trigger if it was inside this menu)
  useEffect(() => {
    if (!isOpen) return;
    const handlePointer = (event: MouseEvent | TouchEvent) => {
      if (wrapper?.contains(event.target as Node)) return;
      close({ restoreFocus: false });
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close({ restoreFocus: !!wrapper?.contains(document.activeElement) });
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, wrapper, close]);

  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Tab") {
      close({ restoreFocus: false });
      return;
    }
    const items = getItems(menu);
    const current = items.indexOf(document.activeElement as HTMLElement);
    const next = nextMenuIndex(event.key, current, items.length);
    if (next === null) return;
    event.preventDefault();
    items[next].focus();
  };

  return {
    isOpen,
    close,
    wrapperProps: { ref: setWrapper },
    triggerProps: {
      ref: setTrigger,
      id: triggerId,
      onClick: () => setIsOpen((open) => !open),
      "aria-haspopup": "menu" as const,
      "aria-expanded": isOpen,
      "aria-controls": isOpen ? menuId : undefined,
    },
    menuProps: {
      ref: setMenu,
      id: menuId,
      role: "menu",
      "aria-labelledby": triggerId,
      onKeyDown: handleMenuKeyDown,
    },
  };
}
