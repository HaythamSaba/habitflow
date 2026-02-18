import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { TemplateCard } from "./TemplateCard";
import { TemplateCardSkeleton } from "./TemplateCardSkeleton";
import {
  HABIT_TEMPLATES,
  getTemplateCategories,
  filterTemplates,
} from "@/lib/habitTemplates";
import { HabitTemplate } from "@/types";

interface TemplateGalleryProps {
  onUseTemplate: (template: HabitTemplate) => void;
  isLoading?: boolean;
}

export function TemplateGallery({
  onUseTemplate,
  isLoading = false,
}: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = getTemplateCategories();
  const filteredTemplates = filterTemplates(selectedCategory, searchQuery);

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="text-center max-w-2xl mx-auto px-2">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-primary-500" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Habit Templates
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Choose from popular habits or customize them to fit your needs
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 min-h-11 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide justify-start sm:justify-center -mx-1 px-1 pb-1">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 min-h-11 rounded-full font-medium text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 ${
            selectedCategory === null
              ? "bg-primary-500 text-white shadow-lg scale-105"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          All
          <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs opacity-75">
            ({HABIT_TEMPLATES.length})
          </span>
        </button>

        {categories.map((category) => {
          const count = HABIT_TEMPLATES.filter(
            (t) => t.category_name === category,
          ).length;

          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 min-h-11 rounded-full font-medium text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === category
                  ? "bg-primary-500 text-white shadow-lg scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {category}
              <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs opacity-75">
                ({count})
              </span>
            </button>
          );
        })}
      </div>
      
      {(selectedCategory || searchQuery) && (
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {filteredTemplates.length} template
            {filteredTemplates.length !== 1 ? "s" : ""} found
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {[...Array(6)].map((_, i) => (
            <TemplateCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onUseTemplate={onUseTemplate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12 lg:py-16 px-4">
          <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Search className="w-7 h-7 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">
            No templates found
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory(null);
            }}
            className="text-primary-500 hover:text-primary-600 font-medium text-sm sm:text-base min-h-11"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
