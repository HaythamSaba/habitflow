import { HabitTemplate } from "@/types";
import { Button } from "../ui/Button";
import { Plus } from "lucide-react";

interface TemplateCardProps {
  template: HabitTemplate;
  onUseTemplate: (template: HabitTemplate) => void;
}

export function TemplateCard({ template, onUseTemplate }: TemplateCardProps) {
  const getFrequencyText = () => {
    if (template.frequency === "daily") {
      return `Daily - ${template.target_count}x`;
    } else if (template.frequency === "weekly") {
      return `Weekly - ${template.target_count}x`;
    }
    return template.frequency;
  };

  return (
    <div className="group relative bg-white dark:bg-gray-950 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
        <span
          className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium"
          style={{
            backgroundColor: `${template.color}15`,
            color: template.color,
            border: `1px solid ${template.color}40`,
          }}
        >
          {template.category_name}
        </span>
      </div>
      
      <div
        className="w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl mb-3 lg:mb-4"
        style={{
          backgroundColor: `${template.color}15`,
          border: `2px solid ${template.color}40`,
        }}
      >
        {template.icon}
      </div>

      <div
        className="text-base sm:text-lg lg:text-xl font-bold mb-1.5 sm:mb-2 truncate pr-16 sm:pr-20"
        style={{ color: template.color }}
      >
        {template.name}
      </div>

      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 min-h-8 sm:min-h-10 line-clamp-2">
        {template.description}
      </p>

      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <span className="text-[10px] sm:text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium">
          {getFrequencyText()}
        </span>
      </div>

      <Button
        variant="primary"
        size="sm"
        leftIcon={<Plus className="w-4 h-4" />}
        onClick={() => onUseTemplate(template)}
        className="w-full min-h-11 text-xs sm:text-sm"
        style={{ backgroundColor: template.color }}
      >
        Use Template
      </Button>
    </div>
  );
}
