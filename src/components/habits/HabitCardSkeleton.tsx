export function HabitCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 border-l-4 border-gray-200 shadow-sm animate-pulse">
      <div className="flex items-center justify-between gap-4">
        {/* Left side - checkbox */}
        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>

        {/* Middle - content */}
        <div className="flex-1 space-y-3">
          {/* Title */}
          <div className="flex items-center gap-2">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          </div>

          {/* Description */}
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>

          {/* Badges */}
        </div>

        {/* Right side - buttons */}
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
