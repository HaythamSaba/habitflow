import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { HABIT_TEMPLATES } from "@/lib/habitTemplates";

export function FeaturedTemplates() {
  const navigate = useNavigate();

  const featuredTemplates = HABIT_TEMPLATES.slice(0, 3);

  return (
    <div className="card bg-linear-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded--2xl border border-primary-200 dark:border-primary-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Popular Templates
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={() => navigate("/templates")}
          className="text-primary-600 dark:text-primary-400"
        >
          View All
        </Button>
      </div>

      {/* Template Card(Compact) */}
      <div className="space-y-3">
        {featuredTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => navigate("/templates")}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md hover:scale-[1.02] transition-all text-left"
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0"
              style={{
                backgroundColor: `${template.color}15`,
                border: `2px solid ${template.color}40`,
              }}
            >
              {template.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm">{template.name}</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {template.description}
              </p>
            </div>
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full whitespace-nowrap">
              {template.frequency === "daily"
                ? `Daily • ${template.target_count}x`
                : `${template.target_count}x/week`}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
