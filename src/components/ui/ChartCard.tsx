import React from "react";
import { Card } from "./Card";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <Card className="min-w-0">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 md:mb-4">
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4">
          {subtitle}
        </p>
      )}
      <div className="w-full overflow-x-auto">{children}</div>
    </Card>
  );
}
