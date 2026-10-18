interface HeaderCardFormProps {
  Title: string;
  Description: string;
}
export default function HeaderCardForm({
  Title,
  Description,
}: HeaderCardFormProps) {
  return (
    <div className="text-center mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {Title}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
        {Description}
      </p>
    </div>
  );
}
