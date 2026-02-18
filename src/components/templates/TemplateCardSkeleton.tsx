export function TemplateCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6 animate-pulse">
      <div className="flex justify-end mb-3 lg:mb-4">
        <div className="h-5 sm:h-6 w-16 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>

      <div className="w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-200 dark:bg-gray-700 rounded-xl sm:rounded-2xl mb-3 lg:mb-4" />

      <div className="h-5 sm:h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-1.5 sm:mb-2" />

      <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
        <div className="h-3 sm:h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 sm:h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>

      <div className="h-5 sm:h-6 w-16 sm:w-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 sm:mb-4" />

      <div className="h-10 sm:h-11 w-full bg-gray-200 dark:bg-gray-700 rounded-lg" />
    </div>
  );
}
