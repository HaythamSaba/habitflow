import { useState, useEffect, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useCreateHabit } from "@/hooks/useCreateHabit";
import { habitSchema, HabitFormData } from "@/constants/habits";
import { HabitForm } from "./HabitForm";

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledData?: Partial<HabitFormData>;
  onSuccess?: () => void;
}

export function CreateHabitModal({
  isOpen,
  onClose,
  prefilledData,
  onSuccess,
}: CreateHabitModalProps) {
  const [selectedIcon, setSelectedIcon] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [targetCount, setTargetCount] = useState(1);

  const createHabit = useCreateHabit();

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

  const handleFormSubmit = async (data: HabitFormData) => {
    try {
      await createHabit.mutateAsync(data);
      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating habit:", error);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedIcon("");
    setSelectedColor("");
    setTargetCount(1);
    onClose();
  };

  useEffect(() => {
    if (prefilledData && isOpen) {
      startTransition(() => {
        reset(prefilledData as HabitFormData);
        setSelectedIcon(prefilledData.icon || "");
        setSelectedColor(prefilledData.color || "");
        setTargetCount(prefilledData.target_count || 1);
      });
    }
  }, [isOpen, prefilledData, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Habit"
      size="lg"
      footer={
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto sm:justify-end">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={createHabit.isPending}
            className="min-h-11 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(handleFormSubmit)}
            isLoading={createHabit.isPending}
            className="min-h-11 w-full sm:w-auto"
          >
            Create Habit
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
