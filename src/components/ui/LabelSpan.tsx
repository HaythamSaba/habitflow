export default function LabelSpan({ label }: { label: string }) {
  return (
    <span className="text-xs font-semibold px-2 py-0.5 sm:py-1 rounded-full bg-white text-gray-700 border dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600">
      {label}
    </span>
  );
}
