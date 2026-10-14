import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Check, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CreateHabitModal } from "@/components/habits/CreateHabitModal";
import { createHabit } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { HABIT_ICONS } from "@/constants/habits";
import { MAX_STARTER_PICKS, STARTER_HABITS } from "@/constants/starterHabits";

/**
 * First-run step for users with no habits yet: pick 1–3 starter habits and
 * create them in one tap, instead of landing on a dashboard of zeros.
 * Once habits exist, the dashboard takes over and prompts the first check-in.
 */
export function FirstRunWelcome() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // One request per habit, but a single toast and refetch for the batch
  const createStarters = useMutation({
    mutationFn: async (keys: string[]) => {
      if (!user) throw new Error("Not authenticated");
      const starters = STARTER_HABITS.filter((s) => keys.includes(s.key));
      for (const starter of starters) {
        await createHabit(user.id, {
          name: starter.name,
          description: starter.description,
          icon: starter.icon,
          color: starter.color,
          frequency: "daily",
          target_count: 1,
          category_id: null,
        });
      }
      return starters.length;
    },
    onSuccess: (count) => {
      toast.success(
        `${count} ${count === 1 ? "habit" : "habits"} added. Check one off to get started!`,
      );
    },
    onError: (error) => {
      toast.error(`Couldn't add your habits: ${error.message}`);
    },
    // Some may have been created before a failure, so always refetch
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  const isFull = selected.length >= MAX_STARTER_PICKS;

  const toggle = (key: string) => {
    setSelected((current) =>
      current.includes(key)
        ? current.filter((k) => k !== key)
        : current.length < MAX_STARTER_PICKS
          ? [...current, key]
          : current,
    );
  };

  return (
    <section
      aria-labelledby="first-run-title"
      className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 sm:p-6 lg:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-400">
        Step 1 of 2
      </p>
      <h2
        id="first-run-title"
        className="mt-1 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100"
      >
        Pick up to {MAX_STARTER_PICKS} habits to start with
      </h2>
      <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400">
        Start small. You can edit them, or add your own, any time.
      </p>

      <div
        role="group"
        aria-label="Starter habits"
        className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3"
      >
        {STARTER_HABITS.map((starter) => {
          const isSelected = selected.includes(starter.key);
          const Icon = HABIT_ICONS.find((i) => i.name === starter.icon)?.icon;
          const isDisabled = !isSelected && isFull;

          return (
            <button
              key={starter.key}
              type="button"
              onClick={() => toggle(starter.key)}
              aria-pressed={isSelected}
              disabled={isDisabled}
              className={`flex items-center gap-3 min-h-14 rounded-2xl border-2 p-3 text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isSelected
                  ? "border-primary-600 bg-primary-50 dark:bg-primary-900/30"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <span
                className="flex w-10 h-10 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${starter.color}20` }}
                aria-hidden="true"
              >
                {Icon && <Icon className="w-5 h-5" style={{ color: starter.color }} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {starter.name}
                </span>
                <span className="block text-xs text-gray-600 dark:text-gray-400">
                  {starter.description}
                </span>
              </span>
              <span
                className={`flex w-6 h-6 shrink-0 items-center justify-center rounded-full border-2 ${
                  isSelected
                    ? "border-primary-600 bg-primary-600 text-white"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                aria-hidden="true"
              >
                {isSelected && <Check className="w-4 h-4" />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <Button
          onClick={() => createStarters.mutate(selected)}
          disabled={selected.length === 0}
          isLoading={createStarters.isPending}
          leftIcon={<Plus className="w-4 h-4" />}
          className="min-h-11 w-full sm:w-auto"
        >
          {selected.length === 0
            ? "Pick at least one"
            : `Add ${selected.length} ${selected.length === 1 ? "habit" : "habits"}`}
        </Button>
        <Button
          variant="ghost"
          onClick={() => setIsCreateModalOpen(true)}
          className="min-h-11 w-full sm:w-auto"
        >
          Create my own instead
        </Button>
        <Link
          to="/templates"
          className="inline-flex items-center justify-center gap-1.5 min-h-11 text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline"
        >
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          Browse all templates
        </Link>
      </div>

      <CreateHabitModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </section>
  );
}
