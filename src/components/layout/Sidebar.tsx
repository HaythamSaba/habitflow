import {
  ChartSpline,
  LayoutDashboard,
  Settings,
  Sparkles,
  SquareCheckBig,
  Trophy,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/habits", icon: SquareCheckBig, label: "Habits" },
  { path: "/achievements", icon: Trophy, label: "Achievements" },
  { path: "/analytics", icon: ChartSpline, label: "Analytics" },
  { path: "/settings", icon: Settings, label: "Settings" },
  {
    path: "/templates",
    icon: Sparkles,
    label: "Templates",
    badge: "30+",
  },
];

const MotionLink = motion.create(Link);

export default function SideBar({
  onNavigate,
}: {
  onNavigate?: () => void;
} = {}) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className="
        w-76 h-full border-r border-gray-300 dark:border-gray-700
        bg-white dark:bg-gray-950 overflow-hidden
      "
    >
      <div className="flex lg:hidden items-center gap-3 p-4 border-b border-gray-300 dark:border-gray-700">
        <div className="w-10 h-10 flex items-center justify-center">
          <img src="/logo.png" alt="HabitFlow" />
        </div>
        <h1
          className="text-xl font-bold text-gray-900 dark:text-gray-100"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          HabitFlow
        </h1>
      </div>

      <nav className="p-4">
        {/* ⭐ FIXED: Simpler container animation */}
        <motion.div
          className="flex flex-col gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <MotionLink
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                // ⭐ FIXED: Explicit animation per item
                initial={{ opacity: 0, y: 12, scale: 1.2 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.05, // Stagger effect
                  ease: "easeOut",
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`flex flex-row items-center gap-3
                  p-3 min-h-12 md:min-h-11
                  rounded-2xl font-semibold text-md cursor-pointer 
                  transition-all duration-300 ease-in-out ${
                    active
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                {/* ⭐ FIXED: Simpler icon animation */}
                <motion.div
                  animate={
                    active
                      ? {
                          scale: [1, 1.2, 1],
                        }
                      : {
                          scale: 1,
                        }
                  }
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>

                <span className="flex-1">{item.label}</span>

                {/* Badge */}
                {item.badge && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-medium"
                  >
                    {item.badge}
                  </motion.span>
                )}
              </MotionLink>
            );
          })}
        </motion.div>
      </nav>
    </aside>
  );
}
