import { HABIT_COLORS } from "@/lib/utils";

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  error?: string;
}

export function ColorPicker({ selectedColor, onColorSelect, error }: ColorPickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
        Choose a Color
      </label>
      <div className="flex gap-2 sm:gap-3 flex-wrap">
        {HABIT_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onColorSelect(color)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all hover:scale-110 ${
              selectedColor === color
                ? "ring-4 ring-offset-2 dark:ring-offset-gray-800"
                : "hover:ring-2 ring-offset-1 dark:ring-offset-gray-800"
            }`}
            style={{
              backgroundColor: color,
              borderColor: color,
            }}
            title={color}
          />
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