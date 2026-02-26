import React from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  emoji?: string;
  actions?: React.ReactNode;
  styledSubtitle?: string;
}

export default function PageHeader({
  title,
  description,
  emoji,
  actions,
  styledSubtitle,
}: PageHeaderProps) {
  return (
    <div className="w-full md:w-1/2 text-center md:text-left">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 md:mb-2">
        {title}{" "}
        {styledSubtitle && (
          <span className="text-primary-500">{styledSubtitle}</span>
        )}
        {emoji && <span>{emoji}</span>}
      </h1>
      {description && (
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-2">
          {description}
        </p>
      )}
      {actions && actions}
    </div>
  );
}
