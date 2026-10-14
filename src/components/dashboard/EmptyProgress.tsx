export default function EmptyProgress() {
  return (
    <div className="flex items-center justify-center h-full py-4">
      <div className="text-center">
        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          No progress yet
        </h4>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Add a habit and check it off to see today's progress here.
        </p>
      </div>
    </div>
  );
}
