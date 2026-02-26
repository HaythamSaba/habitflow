import LevelProgress from "./LevelProgress";
import { Button } from "../ui/Button";
import { Sparkles } from "lucide-react";
import PageHeader from "../ui/PageHeader";

interface DashboardHeaderProps {
  displayName: string;
  onBrowseTemplates: () => void;
}

export default function DashboardHeader({
  displayName,
  onBrowseTemplates,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-3">
      <PageHeader
        emoji="👋"
        title={`Welcome back,`}
        styledSubtitle={displayName}
        description="Ready to continue your habit journey? Let's make today count!"
        actions={
          <Button
            variant="primary"
            className="mt-2"
            leftIcon={<Sparkles className="w-4 h-4" />}
            onClick={() => onBrowseTemplates()}
          >
            Browse Templates
          </Button>
        }
      />
      <div className="w-full flex-1 md:w-auto">
        <LevelProgress />
      </div>
    </div>
  );
}
