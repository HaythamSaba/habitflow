function ProgressCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-950 flex-1 rounded-3xl p-4 sm:p-5 lg:p-6 shadow-sm border shadow-secondary-100 dark:shadow-secondary-700 hover:dark:shadow-xl border-secondary-300 dark:border-secondary-700 hover:shadow-xl transition-shadow duration-500">
      {children}
    </div>
  );
}

export default ProgressCard;