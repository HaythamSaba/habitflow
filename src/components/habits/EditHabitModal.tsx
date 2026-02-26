import { useState, useEffect, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useUpdateHabit } from "@/hooks/useUpdateHabit";
import { habitSchema, HabitFormData } from "@/constants/habits";
import { HabitForm } from "./HabitForm";
import { Habit } from "@/types";

interface EditHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit | null;
}

export function EditHabitModal({
  isOpen,
  onClose,
  habit,
}: EditHabitModalProps) {
  const [selectedIcon, setSelectedIcon] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [targetCount, setTargetCount] = useState(1);

  const updateHabit = useUpdateHabit();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      frequency: "daily",
      target_count: 1,
    },
  });

  // ⭐ FIXED: Wrap state updates in startTransition
  useEffect(() => {
    if (habit) {
      startTransition(() => {
        reset({
          name: habit.name,
          description: habit.description || "",
          icon: habit.icon,
          color: habit.color,
          frequency: habit.frequency,
          target_count: habit.target_count,
          category_id: habit.category_id,
        });
        setSelectedIcon(habit.icon);
        setSelectedColor(habit.color);
        setTargetCount(habit.target_count);
      });
    }
  }, [habit, reset]);

  const handleClose = () => {
    reset();
    setSelectedIcon("");
    setSelectedColor("");
    setTargetCount(1);
    onClose();
  };

  const handleFormSubmit = async (data: HabitFormData) => {
    if (!habit) return;

    try {
      await updateHabit.mutateAsync({
        habitId: habit.id,
        updates: data,
      });
      onClose();
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };

  if (!habit) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Habit"
      size="lg"
      footer={
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto sm:justify-end">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={updateHabit.isPending}
            className="min-h-11 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(handleFormSubmit)}
            isLoading={updateHabit.isPending}
            className="min-h-11 w-full sm:w-auto"
          >
            Save Changes
          </Button>
        </div>
      }
    >
      <HabitForm
        register={register}
        errors={errors}
        setValue={setValue}
        selectedIcon={selectedIcon}
        selectedColor={selectedColor}
        targetCount={targetCount}
        onIconSelect={setSelectedIcon}
        onColorSelect={setSelectedColor}
        onTargetChange={setTargetCount}
      />
    </Modal>
  );
}
