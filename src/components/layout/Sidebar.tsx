import {
  ChartSpline,
  LayoutDashboard,
  Settings,
  Sparkles,
  SquareCheckBig,
  Trophy,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/habits", icon: SquareCheckBig, label: "Habits" },
  { path: "/achievements", icon: Trophy, label: "Achievements" },
  { path: "/analytics", icon: ChartSpline, label: "Analytics" },
  { path: "/settings", icon: Settings, label: "Settings" },
  { path: "/templates", icon: Sparkles, label: "Templates" },
];

export default function SideBar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-76 min-h-screen border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 fixed">
      <nav className="p-4">
        <div className="flex flex-col gap-1">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-row items-center gap-2 p-3 rounded-xl font-light text-md  cursor-pointer transition duration-300 ease-in-out ${
                isActive(path)
                  ? "bg-primary-500 text-white shadow-sm"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Icon className="font-light w-6 h-6" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}
