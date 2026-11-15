import { Habit } from "@/types";
import { useMenu } from "@/hooks/useMenu";
import { YesterdayCheckIn } from "@/hooks/useHabitCheckIn";
import {
  Archive,
  Edit2,
  History,
  MoreVertical,
  RotateCcw,
  Trash2,
} from "lucide-react";

interface HabitActionsMenuProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onArchive?: (habitId: string) => void;
  onRestore?: (habitId: string) => void;
  /** Log or remove yesterday's check-in; omit (or null) to hide the item */
  yesterday?: YesterdayCheckIn | null;
  disabled?: boolean;
}

/** "Check in for yesterday", with progress for multi-count habits */
function yesterdayLabel({ count, target, isFullyCompleted }: YesterdayCheckIn) {
  const progress = target > 1 ? ` (${count}/${target})` : "";
  return isFullyCompleted
    ? `Remove yesterday's check-in${progress}`
    : `Check in for yesterday${progress}`;
}

const ITEM_CLASS =
  "w-full text-left px-4 py-3 min-h-11 text-sm transition-colors flex items-center gap-2 cursor-pointer";
const NEUTRAL_ITEM_CLASS = `${ITEM_CLASS} hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300`;

/**
 * The ⋮ overflow menu for a habit: Edit, Archive (or Restore when archived)
 * and Delete. Shared by the dashboard row and the Habits page card.
 */
export function HabitActionsMenu({
  habit,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
  yesterday,
  disabled = false,
}: HabitActionsMenuProps) {
  const menu = useMenu();
  // Close first so focus returns to the ⋮ button (and to it again when an
  // edit or confirm dialog that opens next is closed)
  const pick = (action: () => void) => {
    menu.close();
    action();
  };

  return (
    <div className="relative shrink-0" {...menu.wrapperProps}>
      <button
        {...menu.triggerProps}
        type="button"
        disabled={disabled}
        className="p-1.5 sm:p-2 min-h-11 min-w-11 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={`More actions for ${habit.name}`}
      >
        <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
      </button>
      {menu.isOpen && (
        <div
          {...menu.menuProps}
          className="absolute top-full right-0 mt-2 w-60 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 shadow-2xl overflow-hidden z-10"
        >
          <button
            type="button"
            role="menuitem"
            tabIndex={-1}
            onClick={() => pick(() => onEdit(habit))}
            className={NEUTRAL_ITEM_CLASS}
          >
            <Edit2 className="w-4 h-4" />
            Edit Habit
          </button>
          {/* A missed day can still be logged until the end of the next day */}
          {yesterday && !habit.archived && (
            <button
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={() => pick(yesterday.toggle)}
              className={NEUTRAL_ITEM_CLASS}
            >
              <History className="w-4 h-4 shrink-0" />
              {yesterdayLabel(yesterday)}
            </button>
          )}
          {habit.archived
            ? onRestore && (
                <button
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => pick(() => onRestore(habit.id))}
                  className={NEUTRAL_ITEM_CLASS}
                >
                  <RotateCcw className="w-4 h-4" />
                  Restore
                </button>
              )
            : onArchive && (
                <button
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => pick(() => onArchive(habit.id))}
                  className={NEUTRAL_ITEM_CLASS}
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
              )}
          <button
            type="button"
            role="menuitem"
            tabIndex={-1}
            onClick={() => pick(() => onDelete(habit.id))}
            className={`${ITEM_CLASS} hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400`}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
