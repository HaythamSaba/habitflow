import { ReactNode } from "react";
import Navbar from "./Navbar";
import { useAuth } from "@/hooks/useAuth";
import SideBar from "./Sidebar";
import { useTheme } from "@/contexts/ThemeContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { theme } = useTheme(); // ⭐ Add this
  console.log("Current theme:", theme); // ⭐ Add this debug log

  const { user, signOut } = useAuth();
  const displayName =
    user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen">
      <Navbar displayName={displayName} signOut={signOut} />
      <div className="flex bg-linear-to-r from-white to-primary-100 min-h-screen">
        <SideBar />
        <main className="flex-1 flex flex-col p-4 gap-8 ml-76 dark:bg-gray-900">{children}</main>
      </div>
    </div>
  );
}
