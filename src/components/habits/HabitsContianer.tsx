import { CheckCircle2, Info, Plus } from "lucide-react";
import { Button } from "../ui/Button";
import { useState } from "react";
import { CreateHabitModal } from "./CreateHabitModal";
import { EditHabitModal } from "./EditHabitModal"; // ⭐ Import
import { HabitList } from "./HabitList";
import { useHabits } from "@/hooks/useHabits";
import { useDeleteHabit } from "@/hooks/useDeleteHabit";
import { Habit } from "@/types";
import { HabitCardSkeleton } from "./HabitCardSkeleton";

export default function HabitsContainer() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null); // ⭐ Add state
  const { isLoading, habits, error } = useHabits();
  const deleteHabit = useDeleteHabit();

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit); // ⭐ Set the habit to edit
  };

  const handleDelete = (habitId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this habit? This action cannot be undone.",
    );

    if (confirmed) {
      deleteHabit.mutate(habitId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <HabitCardSkeleton />
        <HabitCardSkeleton />
        <HabitCardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Info className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Failed to Load Habits
        </h3>
        <p className="text-gray-600 mb-6">
          {error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."}
        </p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="">
      {habits && habits.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-primary-500">
              Today's Habits
            </h3>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-5 h-5" />}
              onClick={() => setIsCreateModalOpen(true)}
              className="hover:shadow-lg hover:shadow-primary/50 transition-all" // ✅ Add this
            >
              Create New Habit
            </Button>
          </div>

          <HabitList
            habits={habits}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No habits yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start your journey by creating your first habit!
          </p>
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Plus className="w-5 h-5" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Your First Habit
          </Button>
        </div>
      )}

      {/* Create Modal */}
      <CreateHabitModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* ⭐ Edit Modal */}
      <EditHabitModal
        isOpen={!!editingHabit}
        onClose={() => setEditingHabit(null)}
        habit={editingHabit}
      />
    </div>
  );
}
