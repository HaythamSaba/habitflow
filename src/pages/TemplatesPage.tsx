import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TemplateGallery } from "@/components/templates/TemplateGallery";
import { CreateHabitModal } from "@/components/habits/CreateHabitModal";
import { HabitTemplate } from "@/types";
import { useCategories } from "@/hooks/useCategories";
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

  const handleHabitCreated = () => {
    toast.success("Habit created from template! 🎉");
    navigate("/dashboard");
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 lg:space-y-8 overflow-x-hidden p-4 sm:p-6">
        <PageHeader
          title="Habit Templates"
          description="Choose from popular habits or customize them to fit your needs"
          emoji="✨"
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
    </DashboardLayout>
  );
}
