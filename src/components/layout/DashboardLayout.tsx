import { ReactNode, useState } from "react";
import Navbar from "./Navbar";
import { useAuth } from "@/hooks/useAuth";
import SideBar from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut } = useAuth();
  const displayName =
    user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User";

  // RESPONSIVE: State to control mobile sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col">
      <Navbar
        displayName={displayName}
        signOut={signOut}
        onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div
          className={`
            fixed top-0 left-0 z-40 h-full
            transition-transform duration-300 ease-in-out
            lg:static lg:translate-x-0 lg:transition-none lg:shrink-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <SideBar onNavigate={() => setSidebarOpen(false)} />
        </div>

        <main
          className="
            flex-1 flex flex-col
            overflow-y-auto
            
            bg-linear-to-r from-white to-primary-100
            dark:bg-linear-to-r dark:from-gray-950 dark:to-primary-900
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}
