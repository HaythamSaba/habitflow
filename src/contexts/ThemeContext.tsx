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

const DARK_QUERY = "(prefers-color-scheme: dark)";

function readSavedTheme(): Theme | null {
  try {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || saved === "light" ? saved : null;
  } catch {
    return null;
  }
}

/** Saved choice, else the OS preference. Keep in sync with index.html. */
function getInitialTheme(): Theme {
  return (
    readSavedTheme() ??
    (window.matchMedia(DARK_QUERY).matches ? "dark" : "light")
  );
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // index.html already applied this before first paint, so no light flash
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Apply theme to the HTML element; color-scheme makes native controls
  // (scrollbars, selects, date inputs) match
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);

  // Until the user picks a theme, follow OS changes (e.g. auto dark at night)
  useEffect(() => {
    const mediaQuery = window.matchMedia(DARK_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      if (!readSavedTheme()) setTheme(event.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

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

    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    // Saved only on an explicit choice, so users who never toggle keep
    // following their OS setting
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {
      // Storage unavailable (e.g. private mode): the toggle still works this session
    }
    setTheme(nextTheme);
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
