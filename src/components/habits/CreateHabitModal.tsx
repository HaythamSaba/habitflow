import { useState, useEffect, useId, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useCreateHabit } from "@/hooks/useCreateHabit";
import {
  habitSchema,
  HabitFormData,
  HABIT_FORM_DEFAULTS,
  DEFAULT_HABIT_COLOR,
  DEFAULT_HABIT_ICON,
} from "@/constants/habits";
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
  // Icon and color start filled in, so typing a name and pressing Enter is enough
  const [selectedIcon, setSelectedIcon] = useState(DEFAULT_HABIT_ICON);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_HABIT_COLOR);
  const [targetCount, setTargetCount] = useState(1);
  const formId = useId();

  const createHabit = useCreateHabit();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: HABIT_FORM_DEFAULTS,
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
    reset(HABIT_FORM_DEFAULTS);
    setSelectedIcon(DEFAULT_HABIT_ICON);
    setSelectedColor(DEFAULT_HABIT_COLOR);
    setTargetCount(1);
    onClose();
  };

  useEffect(() => {
    if (prefilledData && isOpen) {
      startTransition(() => {
        reset({ ...HABIT_FORM_DEFAULTS, ...prefilledData } as HabitFormData);
        setSelectedIcon(prefilledData.icon || DEFAULT_HABIT_ICON);
        setSelectedColor(prefilledData.color || DEFAULT_HABIT_COLOR);
        setTargetCount(prefilledData.target_count || 1);
      });
    }
  }, [isOpen, prefilledData, reset]);

  // Start typing right away. Runs after Modal's focus trap moves focus in.
  useEffect(() => {
    if (isOpen) setFocus("name");
  }, [isOpen, setFocus]);

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
          {/* Outside the <form> (footer), so it's linked with form= */}
          <Button
            type="submit"
            form={formId}
            variant="primary"
            isLoading={createHabit.isPending}
            className="min-h-11 w-full sm:w-auto"
          >
            Create Habit
          </Button>
        </div>
      }
    >
      {/* A real form: Enter in the name field creates the habit */}
      <form
        id={formId}
        noValidate
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <HabitForm
          register={register}
          control={control}
          errors={errors}
          setValue={setValue}
          selectedIcon={selectedIcon}
          selectedColor={selectedColor}
          targetCount={targetCount}
          onIconSelect={setSelectedIcon}
          onColorSelect={setSelectedColor}
          onTargetChange={setTargetCount}
        />
      </form>
    </Modal>
  );
}
