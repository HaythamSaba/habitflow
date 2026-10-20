import { Card } from "@/components/ui/Card";

function ProgressCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="flex-1 p-4 sm:p-5 lg:p-6  hover:shadow-primary-100 hover:dark:shadow-primary-700 hover:dark:shadow-xl hover:shadow-lg transition-shadow duration-500">
      {children}
    </Card>
  );
}

export default ProgressCard;
