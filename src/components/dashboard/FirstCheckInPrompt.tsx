/**
 * Step 2 of the first run: shown while the user has habits but has never
 * checked one off. Disappears on its own after the first check-in.
 */
export function FirstCheckInPrompt() {
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-2xl border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/30 p-4"
    >
      <span className="text-2xl shrink-0" aria-hidden="true">
        👇
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-400">
          Step 2 of 2
        </p>
        <p className="font-semibold text-gray-900 dark:text-gray-100">
          Check off your first habit
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Done one today already? Tap the circle next to it below. Your
          streak, points and first achievement start there.
        </p>
      </div>
    </div>
  );
}
