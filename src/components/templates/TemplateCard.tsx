import { HabitTemplate } from "@/types";
import { Button } from "../ui/Button";
import { Plus } from "lucide-react";

interface TemplateCardProps {
  template: HabitTemplate;
  onUseTemplate: (template: HabitTemplate) => void;
}

export function TemplateCard({ template, onUseTemplate }: TemplateCardProps) {
  // Format frequency text
  const getFrequencyText = () => {
    if (template.frequency === "daily") {
      return `Daily - ${template.target_count} times`;
    } else if (template.frequency === "weekly") {
      return `Weekly - ${template.target_count} times`;
    }
    return template.frequency;
  };

  return (
    <div className="group relative bg-white dark:bg-gray-950 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
      <div className="absolute top-4 right-4">
        <span
          className="text-xs px-2 py-1 rounded-full font-medium"
          style={{
            backgroundColor: `${template.color}15`,
            color: template.color,
            border: `1px solid ${template.color}40`,
          }}
        >
          {template.category_name}
        </span>
      </div>

      {/* Icon */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-4"
        style={{
          backgroundColor: `${template.color}15`,
          border: `2px solid ${template.color}40`,
        }}
      >
        {template.icon}
      </div>

      {/* Name */}
      <div className="text-xl font-bold mb-2" style={{ color: template.color }}>
        {template.name}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 min-h-10">
        {template.description}
      </p>

      {/* Metadata */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full font-medium">
          {getFrequencyText()}
        </span>
      </div>

      <Button
        variant="primary"
        size="sm"
        leftIcon={<Plus className="w-4 h-4" />}
        onClick={() => onUseTemplate(template)}
        className="w-full"
        style={{ backgroundColor: template.color }}
      >
        Use This Template
      </Button>
    </div>
  );
}
