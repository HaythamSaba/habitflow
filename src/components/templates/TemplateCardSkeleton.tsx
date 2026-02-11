export function TemplateCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
      {/* Category Badge Skeleton */}
      <div className="flex justify-end mb-4">
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      </div>

      {/* Icon Skeleton */}
      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-4 animate-pulse" />

      {/* Name Skeleton */}
      <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />

      {/* Description Skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>

      {/* Metadata Skeleton */}
      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 animate-pulse" />

      {/* Button Skeleton */}
      <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
    </div>
  );
}
