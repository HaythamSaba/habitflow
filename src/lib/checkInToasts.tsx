import toast from "react-hot-toast";

interface CheckInToastOptions {
  habitId: string;
  habitName: string;
  /** true when a check-in was added, false when one was removed */
  added: boolean;
  points: number;
  /** Omitted when the change can't be undone (e.g. the saved row has no id) */
  onUndo?: () => void;
  /**
   * Celebration lines for this check-in (perfect day, level up). Shown in
   * the same toast, so one check-in doesn't stack several toasts.
   */
  celebrations?: string[];
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
  celebrations = [],
}: CheckInToastOptions) {
  const isCelebrating = celebrations.length > 0;

  toast(
    (t) => (
      // Full width on phones (a fixed 576px would overflow), wider from sm up
      <span className="w-full sm:w-xl flex items-center gap-3">
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
          {celebrations.map((line) => (
            <span key={line} className="block mt-0.5 font-semibold">
              {line}
            </span>
          ))}
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
    {
      id: `check-in-${habitId}`,
      icon: isCelebrating ? "🎉" : added ? "✅" : "↩️",
      // Celebrations get a little longer on screen
      duration: isCelebrating ? 6000 : 4000,
    },
  );
}
