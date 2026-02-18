export function PremiumHabitCardSkeleton() {
  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-3 lg:mb-4">
        <div className="flex items-center gap-2 sm:gap-3 flex-1">
          <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-200 dark:bg-gray-700 rounded-lg sm:rounded-xl shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="h-4 sm:h-5 w-24 sm:w-32 bg-gray-200 dark:bg-gray-700 rounded mb-1.5 sm:mb-2" />
            <div className="h-3 sm:h-4 w-32 sm:w-48 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
        <div className="flex gap-1 sm:gap-2 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>

      {/* Progress & Stats */}
      <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 mb-3 lg:mb-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0" />
        <div className="flex-1 grid grid-cols-2 gap-2 sm:gap-3">
          <div className="h-16 sm:h-18 lg:h-20 bg-gray-200 dark:bg-gray-700 rounded-lg sm:rounded-xl" />
          <div className="h-16 sm:h-18 lg:h-20 bg-gray-200 dark:bg-gray-700 rounded-lg sm:rounded-xl" />
        </div>
      </div>

      {/* Sparkline */}
      <div className="mb-3 lg:mb-4">
        <div className="h-3 sm:h-4 w-20 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded mb-1.5 sm:mb-2" />
        <div className="flex items-end gap-0.5 sm:gap-1 h-8 sm:h-10 lg:h-12">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-t-md sm:rounded-t-lg"
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 lg:pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="h-5 sm:h-6 w-20 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-3 sm:h-4 w-16 sm:w-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}
