import { ReactNode } from "react";
import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Category } from "@/types";
import { useMenu } from "@/hooks/useMenu";
import { Card } from "@/components/ui/Card";

interface HabitsFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: "all" | "active" | "archived";
  onStatusFilterChange: (status: "all" | "active" | "archived") => void;
  activeCount: number;
  archivedCount: number;
  totalCount: number;
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  sortBy: "name" | "streak" | "rate" | "date";
  onSortChange: (sort: "name" | "streak" | "rate" | "date") => void;
  onClearAllFilters: () => void;
}

const TRIGGER_CLASS =
  "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 min-h-11 rounded-xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap";

interface MenuOptionProps {
  isSelected: boolean;
  onSelect: () => void;
  className?: string;
  children: ReactNode;
}

/** One choice in a filter dropdown; aria-checked exposes the current pick. */
function MenuOption({
  isSelected,
  onSelect,
  className = "",
  children,
}: MenuOptionProps) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={isSelected}
      tabIndex={-1}
      onClick={onSelect}
      className={`w-full text-left px-4 py-3 min-h-11 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${className} ${
        isSelected
          ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold"
          : "text-gray-700 dark:text-gray-300"
      }`}
    >
      {children}
    </button>
  );
}

const STATUS_LABELS = { all: "All", active: "Active", archived: "Archived" };
const SORT_LABELS = {
  name: "Name",
  date: "Newest",
  streak: "Streak",
  rate: "Rate",
};

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
  onClearAllFilters,
}: HabitsFilterBarProps) {
  // Each dropdown has its own menu; opening one counts as a click outside
  // the others, so they close
  const statusMenu = useMenu();
  const categoryMenu = useMenu();
  const sortMenu = useMenu();

  const hasActiveFilters =
    searchQuery || selectedCategory || statusFilter !== "active";

  const selectedCategoryData = categories.find(
    (c) => c.id === selectedCategory,
  );

  const statusOptions = [
    { value: "active", label: `Active (${activeCount})` },
    { value: "archived", label: `Archived (${archivedCount})` },
    { value: "all", label: `All (${totalCount})` },
  ] as const;

  const sortOptions = [
    { value: "name", label: "Name (A-Z)" },
    { value: "date", label: "Newest First" },
    { value: "streak", label: "Current Streak" },
    { value: "rate", label: "Completion Rate" },
  ] as const;

  return (
    <Card className="p-3 sm:p-4 lg:p-6 shadow-xl relative z-20">
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-auto sm:flex-1 sm:min-w-70">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search habits..."
            aria-label="Search habits"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 min-h-11 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Filters group */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap shrink-0">
            {/* Status Filter — `relative` so the dropdown anchors to this div */}
            <div className="relative" {...statusMenu.wrapperProps}>
              <button
                {...statusMenu.triggerProps}
                type="button"
                aria-label={`Status: ${STATUS_LABELS[statusFilter]}`}
                className={TRIGGER_CLASS}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>{STATUS_LABELS[statusFilter]}</span>
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              </button>

              {statusMenu.isOpen && (
                <div className="absolute top-full left-0 mt-2 w-44 sm:w-48 z-50">
                  <div
                    {...statusMenu.menuProps}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden"
                  >
                    {statusOptions.map((option) => (
                      <MenuOption
                        key={option.value}
                        isSelected={statusFilter === option.value}
                        onSelect={() => {
                          onStatusFilterChange(option.value);
                          statusMenu.close();
                        }}
                      >
                        {option.label}
                      </MenuOption>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="relative" {...categoryMenu.wrapperProps}>
                <button
                  {...categoryMenu.triggerProps}
                  type="button"
                  aria-label={`Category: ${selectedCategoryData?.name ?? "All"}`}
                  className={TRIGGER_CLASS}
                >
                  <span className="max-w-20 sm:max-w-none truncate">
                    {selectedCategoryData
                      ? `${selectedCategoryData.icon} ${selectedCategoryData.name}`
                      : "Category"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                </button>

                {categoryMenu.isOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 sm:w-56 z-40">
                    <div
                      {...categoryMenu.menuProps}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden max-h-64 sm:max-h-80 overflow-y-auto"
                    >
                      <MenuOption
                        isSelected={!selectedCategory}
                        onSelect={() => {
                          onCategoryChange(null);
                          categoryMenu.close();
                        }}
                      >
                        All Categories
                      </MenuOption>
                      {categories.map((category) => (
                        <MenuOption
                          key={category.id}
                          isSelected={selectedCategory === category.id}
                          onSelect={() => {
                            onCategoryChange(category.id);
                            categoryMenu.close();
                          }}
                          className="flex items-center gap-2"
                        >
                          <span aria-hidden="true">{category.icon}</span>
                          <span className="truncate">{category.name}</span>
                        </MenuOption>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sort Filter */}
            <div className="relative" {...sortMenu.wrapperProps}>
              <button
                {...sortMenu.triggerProps}
                type="button"
                aria-label={`Sort: ${SORT_LABELS[sortBy]}`}
                className={TRIGGER_CLASS}
              >
                <span className="hidden sm:inline">Sort: </span>
                <span className="text-primary-600 dark:text-primary-400">
                  {SORT_LABELS[sortBy]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              </button>

              {sortMenu.isOpen && (
                <div className="absolute top-full right-0 mt-2 w-44 sm:w-48 z-40">
                  <div
                    {...sortMenu.menuProps}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden"
                  >
                    {sortOptions.map((option) => (
                      <MenuOption
                        key={option.value}
                        isSelected={sortBy === option.value}
                        onSelect={() => {
                          onSortChange(option.value);
                          sortMenu.close();
                        }}
                      >
                        {option.label}
                      </MenuOption>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Filters:
            </span>

            {statusFilter !== "active" && (
              <span className="inline-flex items-center gap-1 pl-2 sm:pl-3 pr-1 py-0.5 sm:py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs sm:text-sm">
                {statusFilter === "all" ? "All" : "Archived"}
                <button
                  type="button"
                  aria-label="Remove status filter"
                  onClick={() => onStatusFilterChange("active")}
                  className="ml-0.5 sm:ml-1 hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full min-w-5 min-h-5 "
                >
                  ×
                </button>
              </span>
            )}

            {selectedCategory && (
              <span className="inline-flex items-center gap-1 pl-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs sm:text-sm max-w-37.5 sm:max-w-none">
                <span className="truncate">
                  {selectedCategoryData?.icon} {selectedCategoryData?.name}
                </span>
                <button
                  type="button"
                  aria-label="Remove category filter"
                  onClick={() => onCategoryChange(null)}
                  className="ml-0.5 sm:ml-1 hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5 shrink-0 min-w-5 min-h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 pl-2 sm:pl-3 py-0.5 sm:py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs sm:text-sm max-w-45 sm:max-w-none">
                <span className="truncate">"{searchQuery}"</span>
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => onSearchChange("")}
                  className="ml-0.5 sm:ml-1 hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5 shrink-0 min-w-5 min-h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </span>
            )}

            <button
              onClick={onClearAllFilters}
              className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:underline min-h-7 flex items-center"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
