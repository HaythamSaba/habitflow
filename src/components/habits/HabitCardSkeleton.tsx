export function HabitCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 border-l-4 border-gray-200 dark:border-gray-700 shadow-sm animate-pulse">
      <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4">
        {/* Left side - checkbox */}
        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0 mt-1 sm:mt-0"></div>

        {/* Middle - content */}
        <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
          {/* Title + badges row */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <div className="w-7 h-7 sm:w-9 sm:h-9 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0"></div>
            <div className="h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 sm:w-32"></div>
            <div className="flex gap-1.5 sm:gap-2">
              <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded w-12 sm:w-16"></div>
              <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded w-14 sm:w-20"></div>
            </div>
          </div>

          <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 sm:w-1/2"></div>
        </div>

        {/* Right side - buttons */}
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}
