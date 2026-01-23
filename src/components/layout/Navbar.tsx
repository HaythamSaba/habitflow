import { ChevronDown, LogOut, Moon, Settings } from "lucide-react";
import { Button } from "../ui/Button";
import { useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function Navbar({
  displayName,
  signOut,
}: {
  displayName: string;
  signOut: () => void;
}) {
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const dropdownWrapperRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownWrapperRef, () => {
    setIsShowDropdown(false);
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  // Get current day
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  // Get first letter of each word of the display name

  const userInitials = displayName
    .split(" ")
    .slice(0, 2) // Only take first 2 words
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  const handleLogout = () => {
    setIsLoggingOut(true);
    signOut();
    // No need to setIsLoggingOut(false) because user will be redirected
  };

  return (
    <header className="bg-white border-b border-gray-300 sticky top-0 z-10">
      <div className="container mx-auto flex items-center">
        <div className="flex items-center gap-3 border-r border-gray-300 pr-4 md:pr-8 p-4 h-22 w-76">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="/logo.png" alt="HabitFlow" />
          </div>
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            HabitFlow
          </h1>
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3>Happy {currentDay} !</h3>
              <p className="text-gray-600 text-sm">{currentDate}</p>
            </div>
            <div className="flex items-center gap-4 relative">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                <Moon className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <div ref={dropdownWrapperRef} className="relative">
                <div
                  className={`flex items-center justify-between gap-4 cursor-pointer ${
                    isShowDropdown ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setIsShowDropdown((show) => !show)}
                >
                  <span className="bg-primary-500 rounded-full text-white p-2 font-bold">
                    {userInitials}
                  </span>
                  <p>{displayName}</p>
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </div>

                {isShowDropdown && (
                  <div className="flex flex-col items-start absolute right-0 top-14 mt-2 w-36 border rounded-lg shadow-lg py-1 glass-card">
                    <Button variant="ghost" size="sm">
                      Profile
                    </Button>
                    <Button variant="ghost" size="sm">
                      Settings
                    </Button>
                    <div className="border-t border-gray-200 my-2 w-full" />
                    <Button
                      variant="ghost"
                      className="text-danger-500"
                      size="sm"
                      onClick={handleLogout}
                      isLoading={isLoggingOut}
                      leftIcon={<LogOut className="w-5 h-5" />}
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
