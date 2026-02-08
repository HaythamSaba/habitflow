import { useCategories } from "@/hooks/useCategories";
import { useCreateCategory } from "@/hooks/useCreateCategory";
import { Button } from "@/components/ui/Button";

export function CategoryTest() {
  const { categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();

  const handleTestCreate = () => {
    createCategory.mutate({
      name: "Test Category",
      color: "#10b981",
      icon: "🏃",
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
      <h3 className="font-bold mb-4">Category Test</h3>
      
      <Button onClick={handleTestCreate} className="mb-4">
        Create Test Category
      </Button>

      <div>
        <p>Categories: {categories.length}</p>
        {categories.map((cat) => (
          <div key={cat.id} className="p-2 bg-gray-100 dark:bg-gray-700 rounded mt-2">
            {cat.icon} {cat.name}
          </div>
        ))}
      </div>
    </div>
  );
}