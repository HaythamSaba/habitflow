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
    <div className="text-center py-16">
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 bg-linear-to-r from-primary-500/20 to-secondary-500/20 blur-2xl" />
        <div className="relative w-24 h-24 bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900 shadow-xl">
          <Search className="w-12 h-12 text-gray-400 dark:text-gray-500" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
        {searchQuery || selectedCategory || statusFilter !== "active"
          ? "No habits match your filters"
          : "No habits yet"}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
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
          className="px-6 py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/50 transition-all"
        >
          Clear all filters
        </button>
      ) : (
        <div className="flex items-center gap-3 justify-center">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/50 transition-all"
          >
            Create Habit
          </button>
          <button
            onClick={() => (window.location.href = "/templates")}
            className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all"
          >
            Browse Templates
          </button>
        </div>
      )}
    </div>
  );
}
