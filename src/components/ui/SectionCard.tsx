import React from "react";
import { Card } from "./Card";

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  iconBgColor?: string;
  variant?: "default" | "danger";
  className?: string;
}

export default function SectionCard({
  title,
  icon,
  children,
  iconBgColor,
  variant,
  className,
}: SectionCardProps) {
  const defaultIconBg =
    variant === "danger"
      ? "bg-red-100 dark:bg-red-900"
      : "bg-primary-100 dark:bg-primary-900";

  const finalIconBg = iconBgColor || defaultIconBg;

  const titleColor =
    variant === "danger"
      ? "text-red-600 dark:text-red-400"
      : "text-gray-900 dark:text-gray-100";

  return (
    <Card className={className} variant={variant}>
      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 ${finalIconBg} rounded-lg flex items-center justify-center shrink-0`}
        >
          {icon}
        </div>
        <h2 className={`text-lg sm:text-xl font-bold ${titleColor}`}>
          {title}
        </h2>
      </div>
      {children}
    </Card>
  );
}
