import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "danger";
  style?: React.CSSProperties;
}

/**
 * The app's one card surface: white / gray-950, rounded-3xl, a light
 * border and standard padding. `className` adds to or overrides these
 * (merged with tailwind-merge, so e.g. a custom padding wins cleanly).
 */
export function Card({
  children,
  variant = "default",
  className = "",
  style,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-4 sm:p-6",
        variant === "danger"
          ? "bg-red-100 dark:bg-red-950 border-red-200 dark:border-red-900"
          : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
