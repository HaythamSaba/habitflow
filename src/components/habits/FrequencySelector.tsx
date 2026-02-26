import { UseFormRegister } from "react-hook-form";
import { HabitFormData } from "@/constants/habits";

interface FrequencySelectorProps {
  register: UseFormRegister<HabitFormData>;
}

export function FrequencySelector({ register }: FrequencySelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
        Frequency
      </label>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {["daily", "weekly", "custom"].map((freq) => (
          <label
            key={freq}
            className="relative flex items-center justify-center px-2 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary transition-colors min-h-11"
          >
            <input
              type="radio"
              value={freq}
              {...register("frequency")}
              className="sr-only peer"
            />
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 peer-checked:text-primary capitalize">
              {freq}
            </span>
            <div className="absolute inset-0 border-2 border-primary rounded-lg opacity-0 peer-checked:opacity-100 pointer-events-none" />
          </label>
        ))}
      </div>
    </div>
  );
}
