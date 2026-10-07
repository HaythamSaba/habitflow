/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";

type Theme = "light" | "dark";

const THEME_TRANSITION_MS = 350;

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Load theme from localStorage or default to 'light'
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme");
    return (savedTheme as Theme) || "light";
  });

  // Apply theme to HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Fade colors only while switching themes (see .theme-transition in
  // index.css); the rest of the time color changes are instant.
  const transitionTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(transitionTimer.current), []);

  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    window.clearTimeout(transitionTimer.current);
    // A little longer than the 0.3s fade, since .dark flips after the re-render
    transitionTimer.current = window.setTimeout(() => {
      root.classList.remove("theme-transition");
    }, THEME_TRANSITION_MS);

    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
