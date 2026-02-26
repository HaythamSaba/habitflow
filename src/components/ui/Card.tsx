import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "danger";
}

export function Card({
  children,
  variant = "default",
  className = "",
}: CardProps) {
  return (
    <div
      className={`${variant === "danger" ? "bg-red-100 dark:bg-red-950" : "bg-white dark:bg-gray-900"} rounded-xl p-4 sm:p-6 shadow-md ${className}`}
    >
      {children}
    </div>
  );
}
