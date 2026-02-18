import { Search } from "lucide-react";

interface EmptyStateProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
  statusFilter: string;
  setStatusFilter: (status: "all" | "active" | "archived") => void;
  setIsCreateModalOpen: (isOpen: boolean) => void;
}

export default function EmptyState({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  statusFilter,
  setStatusFilter,
  setIsCreateModalOpen,
}: EmptyStateProps) {
  return (
    <div className="text-center py-8 sm:py-12 lg:py-16">
      <div className="relative inline-block mb-4 sm:mb-6">
        <div className="absolute inset-0 bg-linear-to-r from-primary-500/20 to-secondary-500/20 blur-2xl" />
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900 shadow-xl">
          <Search className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400 dark:text-gray-500" />
        </div>
      </div>

      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 px-2">
        {searchQuery || selectedCategory || statusFilter !== "active"
          ? "No habits match your filters"
          : "No habits yet"}
      </h3>

      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto px-4">
        {searchQuery || selectedCategory || statusFilter !== "active"
          ? "Try adjusting your search or filters to find what you're looking for"
          : "Create your first habit or browse our templates to get started!"}
      </p>

      {searchQuery || selectedCategory || statusFilter !== "active" ? (
        <button
          onClick={() => {
            setSearchQuery("");
            setSelectedCategory(null);
            setStatusFilter("active");
          }}
          className="px-5 sm:px-6 py-2.5 sm:py-3 min-h-11 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold text-sm sm:text-base hover:shadow-lg hover:shadow-primary-500/50 transition-all"
        >
          Clear all filters
        </button>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 justify-center px-4 sm:px-0">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 min-h-11 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold text-sm sm:text-base hover:shadow-lg hover:shadow-primary-500/50 transition-all"
          >
            Create Habit
          </button>
          <button
            onClick={() => (window.location.href = "/templates")}
            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 min-h-11 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl font-semibold text-sm sm:text-base border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all"
          >
            Browse Templates
          </button>
        </div>
      )}
    </div>
  );
}
