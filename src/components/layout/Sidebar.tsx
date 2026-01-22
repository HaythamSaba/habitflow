import {
  ChartSpline,
  LayoutDashboard,
  Settings,
  SquareCheckBig,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/habits", icon: SquareCheckBig, label: "Habits" },
  { path: "/analytics", icon: ChartSpline, label: "Analytics" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export default function SideBar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-76 min-h-screen border-r border-gray-300 bg-white fixed  ">
      <nav className="p-4">
        <div className="flex flex-col gap-1">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-row gap-2 p-2 rounded-xl font-semibold cursor-pointer transition duration-300 ease-in-out ${
                isActive(path)
                  ? "bg-primary-500 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}
