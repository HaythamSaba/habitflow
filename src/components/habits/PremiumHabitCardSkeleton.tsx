export function PremiumHabitCardSkeleton() {
  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="flex-1">
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>

      {/* Progress & Stats */}
      <div className="flex items-center gap-6 mb-4">
        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="flex-1 grid grid-cols-2 gap-3">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
      </div>

      {/* Sparkline */}
      <div className="mb-4">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="flex items-end gap-1 h-12">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-t-lg"
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}
