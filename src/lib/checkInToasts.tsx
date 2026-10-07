import toast from "react-hot-toast";

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
      <span className="flex items-center gap-3">
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
            className="shrink-0 rounded-lg px-2 py-1 text-sm font-semibold text-primary-700 hover:bg-primary-50"
          >
            Undo
          </button>
        )}
      </span>
    ),
    { id: `check-in-${habitId}`, icon: added ? "✅" : "↩️", duration: 4000 },
  );
}

export function showPerfectDayToast(habitCount: number) {
  toast.success(
    `Perfect day! All ${habitCount} ${habitCount === 1 ? "habit" : "habits"} done 🎉`,
    { id: "perfect-day", duration: 5000 },
  );
}
