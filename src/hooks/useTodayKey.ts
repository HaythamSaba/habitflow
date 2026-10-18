import { useSyncExternalStore } from "react";
import { addDays, startOfDay } from "date-fns";
import { toDayKey } from "@/lib/dates";

/**
 * Today's local day key (e.g. "2026-10-18") that updates at local midnight,
 * so a tab left open overnight moves on to the new day by itself.
 *
 * One shared timer for every subscriber. It also re-checks when the tab
 * becomes visible again, since timers can fire late after a device sleeps.
 */

const listeners = new Set<() => void>();
let midnightTimer: ReturnType<typeof setTimeout> | undefined;

function notify() {
  listeners.forEach((listener) => listener());
}

function scheduleMidnight() {
  clearTimeout(midnightTimer);
  const msUntilMidnight =
    startOfDay(addDays(new Date(), 1)).getTime() - Date.now();
  // A second's margin so the new day has definitely started
  midnightTimer = setTimeout(() => {
    notify();
    scheduleMidnight();
  }, msUntilMidnight + 1000);
}

function handleVisibilityChange() {
  if (document.visibilityState === "visible") {
    notify();
    scheduleMidnight();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    scheduleMidnight();
    document.addEventListener("visibilitychange", handleVisibilityChange);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearTimeout(midnightTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
  };
}

// A string, so React only re-renders when the day actually changes
const getSnapshot = () => toDayKey(new Date());

export function useTodayKey(): string {
  return useSyncExternalStore(subscribe, getSnapshot);
}
