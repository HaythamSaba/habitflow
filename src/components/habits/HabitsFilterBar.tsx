import { useState, useRef } from "react";
import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Table,
} from "lucide-react";
import { Category } from "@/types";
import { useClickOutside } from "@/hooks/useClickOutside";

interface HabitsFilterBarProps {
  // Search
  searchQuery: string;
  onSearchChange: (query: string) => void;

  // Status filter
  statusFilter: "all" | "active" | "archived";
  onStatusFilterChange: (status: "all" | "active" | "archived") => void;
  activeCount: number;
  archivedCount: number;
  totalCount: number;

  // Category filter
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;

  // Sort
  sortBy: "name" | "streak" | "rate" | "date";
  onSortChange: (sort: "name" | "streak" | "rate" | "date") => void;

  // View mode
  viewMode: "cards" | "list" | "table";
  onViewModeChange: (mode: "cards" | "list" | "table") => void;

  // Active filters
  onClearAllFilters: () => void;
}

export function HabitsFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  activeCount,
  archivedCount,
  totalCount,
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onClearAllFilters,
}: HabitsFilterBarProps) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const dropDownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropDownRef, () => {
    setShowStatusDropdown(false);
    setShowCategoryDropdown(false);
    setShowSortDropdown(false);
  });

  const hasActiveFilters =
    searchQuery || selectedCategory || statusFilter !== "active";

  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 shadow-xl relative ">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-70">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search habits..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap" ref={dropDownRef}>
          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowStatusDropdown(!showStatusDropdown);
                setShowCategoryDropdown(false);
                setShowSortDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>
                {statusFilter === "all"
                  ? "All Habits"
                  : statusFilter === "active"
                    ? "Active"
                    : "Archived"}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showStatusDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 z-40">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
                  <button
                    onClick={() => {
                      onStatusFilterChange("active");
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      statusFilter === "active"
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Active ({activeCount})
                  </button>
                  <button
                    onClick={() => {
                      onStatusFilterChange("archived");
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      statusFilter === "archived"
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Archived ({archivedCount})
                  </button>
                  <button
                    onClick={() => {
                      onStatusFilterChange("all");
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      statusFilter === "all"
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    All ({totalCount})
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowStatusDropdown(false);
                  setShowSortDropdown(false);
                }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <span>
                  {selectedCategory
                    ? categories.find((c) => c.id === selectedCategory)?.icon +
                      " " +
                      categories.find((c) => c.id === selectedCategory)?.name
                    : "All Categories"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-2 w-56 z-40">
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden max-h-80 overflow-y-auto">
                    <button
                      onClick={() => {
                        onCategoryChange(null);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        !selectedCategory
                          ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          onCategoryChange(category.id);
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 ${
                          selectedCategory === category.id
                            ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sort Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSortDropdown(!showSortDropdown);
                setShowStatusDropdown(false);
                setShowCategoryDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <span>Sort: </span>
              <span className="text-primary-600 dark:text-primary-400">
                {sortBy === "name"
                  ? "Name"
                  : sortBy === "date"
                    ? "Newest"
                    : sortBy === "streak"
                      ? "Streak"
                      : "Rate"}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 z-40">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
                  <button
                    onClick={() => {
                      onSortChange("name");
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      sortBy === "name"
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Name (A-Z)
                  </button>
                  <button
                    onClick={() => {
                      onSortChange("date");
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      sortBy === "date"
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Newest First
                  </button>
                  <button
                    onClick={() => {
                      onSortChange("streak");
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      sortBy === "streak"
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Best Streak
                  </button>
                  <button
                    onClick={() => {
                      onSortChange("rate");
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      sortBy === "rate"
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Completion Rate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* View Mode Toggles */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 rounded-xl p-1 ml-auto">
          <button
            onClick={() => onViewModeChange("cards")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "cards"
                ? "bg-white dark:bg-gray-800 shadow-md"
                : "hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <LayoutGrid className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "list"
                ? "bg-white dark:bg-gray-800 shadow-md"
                : "hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <List className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={() => onViewModeChange("table")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "table"
                ? "bg-white dark:bg-gray-800 shadow-md"
                : "hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <Table className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Active filters:
            </span>

            {statusFilter !== "active" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm">
                {statusFilter === "all" ? "All Habits" : "Archived"}
                <button
                  onClick={() => onStatusFilterChange("active")}
                  className="ml-1 hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            )}

            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm">
                {categories.find((c) => c.id === selectedCategory)?.icon}{" "}
                {categories.find((c) => c.id === selectedCategory)?.name}
                <button
                  onClick={() => onCategoryChange(null)}
                  className="ml-1 hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm">
                Search: "{searchQuery}"
                <button
                  onClick={() => onSearchChange("")}
                  className="ml-1 hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            )}

            <button
              onClick={onClearAllFilters}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
