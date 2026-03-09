import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center rounded-full transition-colors duration-300 focus:outline-none  min-h-8 min-w-15 cursor-pointer"
      style={{ backgroundColor: theme === "dark" ? "#10b981" : "#e5e7eb" }}
      aria-label="Toggle theme"
    >
      <span
        className="inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white transition-transform duration-300 ease-in-out outline-none shadow-md"
        style={{
          transform: theme === "dark" ? "translateX(32px)" : "translateX(4px)",
        }}
      >
        {theme === "dark" ? (
          <Moon className="h-3 w-3 text-gray-700" />
        ) : (
          <Sun className="h-3 w-3 text-yellow-500" />
        )}
      </span>
    </button>
  );
}
