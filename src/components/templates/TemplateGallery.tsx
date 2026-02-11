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

  // Get all categories
  const categories = getTemplateCategories();

  // Filter templates
  const filteredTemplates = filterTemplates(selectedCategory, searchQuery);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-8 h-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Habit Templates
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Choose from popular habits or customize them to fit your needs
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {/* All Categories Chip */}
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full font-medium transition-all ${
            selectedCategory === null
              ? "bg-primary-500 text-white shadow-lg scale-105"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          All Templates
          <span className="ml-2 text-xs opacity-75">
            ({HABIT_TEMPLATES.length})
          </span>
        </button>

        {/* Category Chips */}
        {categories.map((category) => {
          const count = HABIT_TEMPLATES.filter(
            (t) => t.category_name === category,
          ).length;

          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? "bg-primary-500 text-white shadow-lg scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {category}
              <span className="ml-2 text-xs opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      {(selectedCategory || searchQuery) && (
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredTemplates.length} template
            {filteredTemplates.length !== 1 ? "s" : ""} found
          </p>
        </div>
      )}

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <TemplateCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onUseTemplate={onUseTemplate}
            />
          ))}
        </div>
      ) : (
        // Empty State
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            No templates found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory(null);
            }}
            className="text-primary-500 hover:text-primary-600 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
