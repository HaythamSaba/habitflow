import { Habit } from "@/types";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDeleteHabit } from "@/hooks/useDeleteHabit";
import { useCategories } from "@/hooks/useCategories";
import { useHabits } from "@/hooks/useHabits";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { EditHabitModal } from "@/components/habits/EditHabitModal";
import { PremiumHabitCard } from "@/components/habits/PremiumHabitCard";
import { ArchiveSection } from "@/components/habits/ArchiveSection";
import { CreateHabitModal } from "@/components/habits/CreateHabitModal";
import { PremiumHabitCardSkeleton } from "@/components/habits/PremiumHabitCardSkeleton";

import { Plus, Sparkles } from "lucide-react";
import HabitsStatsCards from "@/components/habits/HabitsStatsCards";
import { HabitsFilterBar } from "@/components/habits/HabitsFilterBar";
import EmptyState from "@/components/habits/EmptyState";

export function HabitsPage() {
  const { habits, isLoading } = useHabits();
  const { categories } = useCategories();
  const deleteHabit = useDeleteHabit();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "streak" | "rate" | "date">(
    "name",
  );
  const [viewMode, setViewMode] = useState<"list" | "cards" | "table">("cards");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "archived"
  >("active");

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const activeHabits = habits.filter((habit) => !habit.archived);
  const archivedHabits = habits.filter((habit) => habit.archived);

  const totalHabits = activeHabits.length;
  const avgCompletionRate = 85; // initial value
  const longestStreak = 12; // initial value

  const getFilterAndSortedHabits = () => {
    let filtered = activeHabits;

    if (statusFilter === "archived") {
      filtered = archivedHabits;
    } else if (statusFilter === "all") {
      filtered = habits || [];
    }
    if (selectedCategory) {
      filtered = filtered.filter(
        (habit) => habit.category_id === selectedCategory,
      );
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes(query) ||
          (h.description && h.description.toLowerCase().includes(query)),
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "date":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "streak":
          // todo
          return 0;
        case "rate":
          // todo
          return 0;
        default:
          return 0;
      }
    });
    return sorted;
  };

  const filteredHabits = getFilterAndSortedHabits();

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
  };

  const handleDelete = (habitId: string) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      deleteHabit.mutate(habitId);
    }
  };

  const handleArchive = (habitId: string) => {
    deleteHabit.mutate(habitId);
  };

  const handleRestore = (habitId: string) => {
    alert("Restore functionality coming soon! Habit ID: " + habitId);
  };

  const handleClearAllFilters = () => {
    setSelectedCategory(null);
    setStatusFilter("active");
    setSearchQuery("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 lg:space-y-8 overflow-x-hidden p-4 sm:p-6">
        {/* Hero Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-r from-primary-500 via-secondary-500/10 to-purple-500/10 blur-3xl dark:from-primary-400/10 dark:via-secondary-400/10 dark:to-purple-400/10" />
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 text-center md:text-left">
            <div className="flex flex-col gap-1 sm:gap-2 text-center md:text-left">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2 mx-auto md:mx-0">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary-500 shrink-0" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-primary-500 to-secondary-500 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent">
                  My Habits Library
                </h1>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400">
                Master your habits with elegance
              </p>
            </div>
            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0  mx-auto md:mx-0">
              <Button
                variant="ghost"
                onClick={() => navigate("/templates")}
                leftIcon={<Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />}
                className="border border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-sm sm:text-base min-h-11"
              >
                <span className="hidden sm:inline">Browse Templates</span>
                <span className="sm:hidden">Templates</span>
              </Button>
              <Button
                variant="primary"
                leftIcon={<Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
                onClick={() => setIsCreateModalOpen(true)}
                className="shadow-lg shadow-primary-500/50 hover:shadow-xl hover:shadow-primary-500/60 transition-all text-sm sm:text-base min-h-11"
              >
                <span className="hidden sm:inline">Create Habit</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Premium Stats Cards */}
        <HabitsStatsCards
          totalHabits={totalHabits}
          activeHabits={activeHabits.length}
          archivedHabits={archivedHabits.length}
          avgCompletionRate={avgCompletionRate}
          longestStreak={longestStreak}
        />

        {/* Premium Filters & View Controls */}
        <HabitsFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          activeCount={activeHabits.length}
          archivedCount={archivedHabits.length}
          totalCount={habits.length}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onClearAllFilters={handleClearAllFilters}
        />

        {/* Results Count */}
        {/* RESPONSIVE: Stack on mobile if both messages show, smaller text */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredHabits.length} of {habits?.length || 0} habits
          </p>

          {filteredHabits.length === 0 && (
            <p className="text-xs sm:text-sm text-amber-600 dark:text-amber-400">
              No habits match your filters
            </p>
          )}
        </div>
        
        {/* Habits Grid */}
        {isLoading ? (
          // Loading Skeletons
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {[...Array(6)].map((_, i) => (
              <PremiumHabitCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredHabits.length > 0 ? (
          <>
            {/* Cards Grid */}
            <div
              className={`
              ${viewMode === "cards" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6" : ""}
              ${viewMode === "list" ? "space-y-3 sm:space-y-4" : ""}
              ${viewMode === "table" ? "overflow-x-auto" : ""}
            `}
            >
              {viewMode === "cards" &&
                filteredHabits.map((habit, index) => (
                  <div
                    key={habit.id}
                    className="animate-fade-in-up opacity-0"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <PremiumHabitCard
                      habit={habit}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onArchive={handleArchive}
                    />
                  </div>
                ))}

              {viewMode === "list" && (
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 lg:p-12 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
                    📋 List view coming in a future update!
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-2">
                    For now, enjoy the beautiful card view ✨
                  </p>
                </div>
              )}

              {viewMode === "table" && (
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 lg:p-12 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
                    📊 Table view coming in a future update!
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-2">
                    For now, enjoy the beautiful card view ✨
                  </p>
                </div>
              )}
            </div>

            {/* Archive Section - Only show when viewing active habits */}
            {statusFilter === "active" && (
              <ArchiveSection
                archivedHabits={archivedHabits}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestore={handleRestore}
              />
            )}
          </>
        ) : (
          // Empty State
          <EmptyState
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            setIsCreateModalOpen={setIsCreateModalOpen}
          />
        )}
      </div>
      <CreateHabitModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditHabitModal
        isOpen={!!editingHabit}
        onClose={() => setEditingHabit(null)}
        habit={editingHabit}
      />
    </DashboardLayout>
  );
}
