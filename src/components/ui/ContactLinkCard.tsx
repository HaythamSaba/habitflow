import { ArrowRight } from "lucide-react";
import React from "react";

interface ContactLinkCardProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}

export default function ContactLinkCard({
  href,
  icon,
  label,
  color,
}: ContactLinkCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-${color}-50 dark:hover:bg-${color}-900/20 hover:border-${color}-300 dark:hover:border-${color}-600 border border-transparent transition-all group`}
    >
      <div
        className={`w-5 h-5 text-${color}-600 group-hover:scale-110 transition-transform flex items-center justify-center`}
      >
        {icon}
      </div>
      <span
        className={`text-sm font-medium text-gray-900 dark:text-gray-100`}
      >
        {label}
      </span>
      <ArrowRight
        className={`w-4 h-4 ml-auto text-gray-400 group-hover:text-${color}-600 dark:group-hover:text-${color}-300 group-hover:translate-x-1 transition-all`}
      />
    </a>
  );
}
