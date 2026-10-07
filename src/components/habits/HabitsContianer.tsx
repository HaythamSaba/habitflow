import { CheckCircle2, Info, Plus, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";
import { useState } from "react";
import { CreateHabitModal } from "./CreateHabitModal";
import { EditHabitModal } from "./EditHabitModal";
import { HabitList } from "./HabitList";
import { useHabits } from "@/hooks/useHabits";
import { useDeleteHabit } from "@/hooks/useDeleteHabit";
import { Habit } from "@/types";
import { HabitCardSkeleton } from "./HabitCardSkeleton";
import { useNavigate } from "react-router-dom";
import { confirmDialog } from "@/lib/confirmDialog";

interface HabitsContainerProps {
  filteredHabits?: Habit[];
}

export default function HabitsContainer({
  filteredHabits,
}: HabitsContainerProps) {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const {
    isLoading,
    isFetching,
    habits: allHabits,
    error,
    refetch,
  } = useHabits();
  const deleteHabit = useDeleteHabit();

  const activeHabits = allHabits.filter((habit) => !habit.archived);

  const habits = filteredHabits !== undefined ? filteredHabits : activeHabits;

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
  };

  const handleDelete = async (habitId: string) => {
    const habitName =
      allHabits.find((h) => h.id === habitId)?.name ?? "this habit";
    const confirmed = await confirmDialog({
      title: "Delete Habit",
      message: `Permanently delete "${habitName}" and all of its check-in history? This can't be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (confirmed) {
      deleteHabit.mutate(habitId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 sm:gap-4">
        <HabitCardSkeleton />
        <HabitCardSkeleton />
        <HabitCardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-8 sm:py-12 px-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <Info className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">
          Failed to Load Habits
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
          {error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."}
        </p>
        <Button
          variant="primary"
          onClick={() => refetch()}
          isLoading={isFetching}
          className="min-h-11"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      {habits && habits.length > 0 ? (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-primary-700 dark:text-primary-400">
              Today's Habits
            </h3>
            <div className="flex gap-2 sm:gap-3">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
                onClick={() => setIsCreateModalOpen(true)}
                className="hover:shadow-lg hover:shadow-primary/50 transition-all sm:w-auto text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Create New Habit</span>
                <span className="sm:hidden">New Habit</span>
              </Button>
            </div>
          </div>

          <HabitList
            habits={habits}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      ) : (
        <div className="max-w-md mx-auto text-center ">
          <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-950 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle2 className="w-7 h-7 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
            No habits yet
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
            Start your journey by creating your first habit!
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 justify-center">
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              size="md"
              leftIcon={<Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
              className=""
            >
              Create Custom Habit
            </Button>
            <Button
              variant="secondary"
              size="md"
              leftIcon={<Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />}
              onClick={() => navigate("/templates")}
              className=""
            >
              Browse Templates
            </Button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <CreateHabitModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit Modal */}
      <EditHabitModal
        isOpen={!!editingHabit}
        onClose={() => setEditingHabit(null)}
        habit={editingHabit}
      />
    </div>
  );
}
