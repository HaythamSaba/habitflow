import {
  ChartSpline,
  LayoutDashboard,
  Settings,
  Sparkles,
  SquareCheckBig,
  Trophy,
  User,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react"; // ⭐ ADD useEffect

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
  {
    path: "/about",
    icon: User,
    label: "About Us",
  },
];

const MotionLink = motion.create(Link);

export default function SideBar({
  onNavigate,
}: {
  onNavigate?: () => void;
} = {}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // ⭐ ADD
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // ⭐⭐⭐ DETECT MOBILE/DESKTOP
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ⭐ Show labels if mobile OR hovered
  const showLabels = isMobile || isHovered;

  return (
    <aside
      className={`transition-all duration-300 ease-out h-[calc(100vh-8rem)] 
        mt-22 lg:mt-4 ml-4 rounded-4xl border border-gray-200 dark:border-gray-800
        bg-white dark:bg-gray-950/80 backdrop-blur-xl
        shadow-xl shadow-gray-200 dark:shadow-gray-700
        overflow-hidden
        ${isHovered ? "w-72" : "w-72 lg:w-20"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <nav className="p-4">
        <motion.div
          className={`flex flex-col gap-1 ${isHovered ? "" : "items-center"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <div key={item.path} className="relative group">
                <MotionLink
                  to={item.path}
                  onClick={onNavigate}
                  initial={{ opacity: 0, y: 12, scale: 1.05 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.25,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 p-3 rounded-3xl
                    font-semibold text-sm cursor-pointer 
                    transition-all duration-200 relative
                    ${
                      active
                        ? "bg-primary-500 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                >
                  {/* Active Indicator (Desktop only) */}
                  {/* Icon */}
                  <motion.div
                    className="shrink-0 relative z-10"
                    animate={active ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>

                  {/* Label - Show on mobile OR when hovered */}
                  <AnimatePresence>
                    {showLabels && ( // ⭐ CHANGED: isMobile || isHovered
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-nowrap overflow-hidden flex-1"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Badge */}
                  {item.badge && (
                    <AnimatePresence>
                      {showLabels && ( // ⭐ CHANGED: isMobile || isHovered
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ delay: 0.1 }}
                          className={`ml-auto text-xs px-2 py-0.5 rounded-full font-semibold
                            ${
                              active
                                ? "bg-white/20 text-white"
                                : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                            }`}
                        >
                          {item.badge}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  )}
                </MotionLink>

                {/* Tooltip - Desktop only when collapsed */}
                {!isMobile && !isHovered && (
                  <div
                    className="absolute left-full ml-3 top-1/2 -translate-y-1/2 
                    px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs 
                    rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none 
                    transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg"
                  >
                    {item.label}
                    {item.badge && (
                      <span className="ml-2 px-1.5 py-0.5 bg-purple-500 rounded text-[10px]">
                        {item.badge}
                      </span>
                    )}
                    {/* Tooltip Arrow */}
                    <div
                      className="absolute right-full top-1/2 -translate-y-1/2 
                      border-4 border-transparent border-r-gray-900 dark:border-r-gray-700"
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>
      </nav>
    </aside>
  );
}
