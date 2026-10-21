import { NavLink } from "react-router-dom";
import {
  ChartSpline,
  LayoutDashboard,
  Menu,
  SquareCheckBig,
  Trophy,
} from "lucide-react";

const tabs = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Today" },
  { path: "/habits", icon: SquareCheckBig, label: "Habits" },
  { path: "/analytics", icon: ChartSpline, label: "Stats" },
  { path: "/achievements", icon: Trophy, label: "Achievements" },
];

const tabClass =
  "flex flex-1 flex-col items-center justify-center gap-0.5 min-h-14 text-xs font-medium transition-colors";

interface BottomTabBarProps {
  /** Opens the full navigation drawer (Templates, Settings, About…) */
  onOpenMenu: () => void;
  menuOpen: boolean;
}

/**
 * Phone navigation: the main sections one thumb-tap away at the bottom of
 * the screen, plus "More" for everything else. Hidden from lg up, where
 * the sidebar is always visible.
 */
export function BottomTabBar({ onOpenMenu, menuOpen }: BottomTabBarProps) {
  return (
    <nav
      aria-label="Primary"
      className="lg:hidden fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex">
        {tabs.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `${tabClass} ${
                isActive
                  ? "text-primary-700 dark:text-primary-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className="w-6 h-6"
                  strokeWidth={isActive ? 2.5 : 2}
                  aria-hidden="true"
                />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}

        <button
          type="button"
          onClick={onOpenMenu}
          aria-expanded={menuOpen}
          aria-controls="app-sidebar"
          className={`${tabClass} text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200`}
        >
          <Menu className="w-6 h-6" aria-hidden="true" />
          <span>More</span>
        </button>
      </div>
    </nav>
  );
}
