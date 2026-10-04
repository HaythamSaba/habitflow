import { ReactNode, useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { useAuth } from "@/hooks/useAuth";
import SideBar from "./Sidebar";
import { Footer } from "./Footer";
import { ScrollToTop } from "../ui/ScrollToTop";
import { ErrorBoundary } from "../ui/ErrorBoundary";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut } = useAuth();
  const displayName =
    user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User";

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Below lg the sidebar is an off-canvas drawer: trap focus while it's open,
  // and make it inert while closed so Tab doesn't walk through hidden links
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const isDrawerOpen = isMobile && sidebarOpen;
  useFocusTrap(sidebarRef, isDrawerOpen);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isDrawerOpen]);

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-white dark:bg-gray-950">
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
          ref={sidebarRef}
          id="app-sidebar"
          tabIndex={-1}
          inert={isMobile && !sidebarOpen}
          className={`
            focus:outline-none focus-visible:ring-0
            fixed top-0 left-0 z-40 h-full
            transition-transform duration-300 ease-in-out
            lg:static lg:translate-x-0 lg:transition-none lg:shrink-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <SideBar onNavigate={() => setSidebarOpen(false)} />
        </div>

        <main
          ref={mainRef}
          className="
            flex-1 flex flex-col
            overflow-y-auto
            
            bg-linear-to-r from-white to-primary-100
            dark:bg-linear-to-r dark:from-gray-950 dark:to-primary-900
          "
        >
          <div className="flex-1">
            <ErrorBoundary>{children}</ErrorBoundary>
          </div>
          <Footer />
        </main>

        <ScrollToTop containerRef={mainRef} />
      </div>
    </div>
  );
}
