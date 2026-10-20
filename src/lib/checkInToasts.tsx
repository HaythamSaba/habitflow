import toast from "react-hot-toast";
import type { LevelData } from "./points";

interface CheckInToastOptions {
  habitId: string;
  habitName: string;
  /** true when a check-in was added, false when one was removed */
  added: boolean;
  points: number;
  /** Omitted when the change can't be undone (e.g. the saved row has no id) */
  onUndo?: () => void;
}

/**
 * Confirms a check-in change with an Undo action. One toast per habit
 * (fixed id), so repeated taps update it instead of stacking toasts.
 */
export function showCheckInToast({
  habitId,
  habitName,
  added,
  points,
  onUndo,
}: CheckInToastOptions) {
  toast(
    (t) => (
      <span className="w-xl flex items-center gap-3">
        <span className="text-sm">
          {added ? (
            <>
              <strong>{habitName}</strong> checked in · +{points} pts
            </>
          ) : (
            <>
              Removed a <strong>{habitName}</strong> check-in · −{points} pts
            </>
          )}
        </span>
        {onUndo && (
          <button
            type="button"
            onClick={() => {
              toast.dismiss(t.id);
              onUndo();
            }}
            className="shrink-0 rounded-lg px-2 py-1 text-sm font-semibold text-primary-700 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-900/40"
          >
            Undo
          </button>
        )}
      </span>
    ),
    { id: `check-in-${habitId}`, icon: added ? "✅" : "↩️", duration: 4000 },
  );
}

/** Shown when a check-in's points reach a new level. */
export function showLevelUpToast(level: Pick<LevelData, "level" | "label" | "emoji">) {
  toast.success(`Level up! You're now Level ${level.level}: ${level.label} ${level.emoji}`, {
    id: "level-up",
    duration: 5000,
  });
}

export function showPerfectDayToast(habitCount: number) {
  toast.success(
    `Perfect day! All ${habitCount} ${habitCount === 1 ? "habit" : "habits"} done 🎉`,
    { id: "perfect-day", duration: 5000 },
  );
}
