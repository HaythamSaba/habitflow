import { UseFormRegister } from "react-hook-form";
import { HabitFormData } from "@/constants/habits";

interface TargetCounterProps {
  register: UseFormRegister<HabitFormData>;
  value: number;
  onChange: (value: number) => void;
}

export function TargetCounter({
  register,
  value,
  onChange,
}: TargetCounterProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
        Daily Target
      </label>
      <div className="flex items-center gap-3 sm:gap-4">
        <input
          type="range"
          min="1"
          max="10"
          {...register("target_count", {
            valueAsNumber: true,
            onChange: (e) => onChange(Number(e.target.value)),
          })}
          className="flex-1 h-2 min-h-11 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 w-10 sm:w-12 text-center shrink-0">
          {value}x
        </span>
      </div>
      <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        How many times per day?
      </p>
    </div>
  );
}
