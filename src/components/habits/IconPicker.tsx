import { HABIT_ICONS } from "@/constants/habits";

interface IconPickerProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
  error?: string;
}

export function IconPicker({
  selectedIcon,
  onIconSelect,
  error,
}: IconPickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
        Choose an Icon
      </label>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 sm:gap-2">
        {HABIT_ICONS.map(({ name, icon: Icon, label }) => (
          <button
            key={name}
            type="button"
            onClick={() => onIconSelect(name)}
            className={`flex flex-col items-center justify-center p-2 sm:p-3 min-h-11 rounded-lg border-2 transition-all hover:border-primary hover:bg-emerald-50 dark:hover:bg-emerald-900/20 ${
              selectedIcon === name
                ? "border-primary bg-emerald-50 dark:bg-emerald-900/20 ring-2 ring-primary ring-offset-1 sm:ring-offset-2 dark:ring-offset-gray-800"
                : "border-gray-200 dark:border-gray-700"
            }`}
            title={label}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
