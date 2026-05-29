type HighlightStatCardProps = {
  value: string;
  label: string;
};

export function HighlightStatCard({
  value,
  label,
}: HighlightStatCardProps) {
  return (
    <div className="text-center bg-primary-200 dark:bg-primary-800 p-4 rounded-3xl">
      <div className="text-4xl font-bold text-primary-700 dark:text-primary-300 mb-2">
        {value}
      </div>

      <div className="text-sm text-gray-900 dark:text-gray-100">
        {label}
      </div>
    </div>
  );
}