import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TemplateGallery } from "@/components/templates/TemplateGallery";
import { CreateHabitModal } from "@/components/habits/CreateHabitModal";
import { HabitTemplate } from "@/types";
import { useCategories } from "@/hooks/useCategories";
import { HABIT_CREATED_TOAST_ID } from "@/hooks/useCreateHabit";
import toast from "react-hot-toast";
import PageHeader from "@/components/ui/PageHeader";

export function TemplatesPage() {
  const navigate = useNavigate();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<HabitTemplate | null>(null);

  const handleUseTemplate = (template: HabitTemplate) => {
    setSelectedTemplate(template);
    setIsCreateModalOpen(true);
  };

  // Find matching category ID from user's categories
  const getCategoryId = (categoryName: string): string | null => {
    const matchedCategory = categories.find(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase(),
    );
    return matchedCategory?.id || null;
  };

  // Pre-fill data for modal
  const getPrefilledData = () => {
    if (!selectedTemplate) return undefined;

    return {
      name: selectedTemplate.name,
      description: selectedTemplate.description,
      icon: selectedTemplate.icon,
      color: selectedTemplate.color,
      frequency: selectedTemplate.frequency,
      target_count: selectedTemplate.target_count,
      category_id: getCategoryId(selectedTemplate.category_name),
    };
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setSelectedTemplate(null);
  };

  // Replace useCreateHabit's toast (same id) with one that offers a way to
  // today, and stay on the gallery so another template can be added
  const handleHabitCreated = () => {
    toast.success(
      (t) => (
        <span className="flex items-center gap-3">
          <span className="text-sm">Habit created</span>
          <button
            type="button"
            onClick={() => {
              toast.dismiss(t.id);
              navigate("/dashboard");
            }}
            className="shrink-0 rounded-lg px-2 py-1 text-sm font-semibold text-primary-700 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-900/40"
          >
            Go to today
          </button>
        </span>
      ),
      { id: HABIT_CREATED_TOAST_ID, duration: 5000 },
    );
  };

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8 overflow-x-hidden p-4 sm:p-6">
      <PageHeader
        title="Habit Templates"
        description="Start from a popular habit and adjust it to fit you"
      />
      <TemplateGallery
        onUseTemplate={handleUseTemplate}
        isLoading={categoriesLoading}
      />

      {/* Create Habit Modal with pre-filled template data */}
      <CreateHabitModal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        prefilledData={getPrefilledData()}
        onSuccess={handleHabitCreated}
      />
    </div>
  );
}
