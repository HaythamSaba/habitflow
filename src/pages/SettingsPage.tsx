import { CategoryManager } from "@/components/categories/CategoryManager";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateUserInfo } from "@/hooks/useUpdateUserInfo";
import {
  KeyRound,
  LogOut,
  RectangleEllipsis,
  Settings2,
  Shield,
  Trash,
  User,
  UserX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type SettingsFormData = {
  name: string;
};

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const updateUserInfo = useUpdateUserInfo();

  const [originalName, setUserName] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SettingsFormData>();

  const currentName = watch("name");

  const handleLogout = () => {
    setIsLoggingOut(true);
    signOut();
  };

  useEffect(() => {
    if (user?.user_metadata?.display_name) {
      const name = user.user_metadata.display_name;
      reset({
        name,
      });
      setUserName(name);
    }
  }, [user, reset]);

  const handleUpdateUserData = async (data: SettingsFormData) => {
    if (!user) return;
    try {
      await updateUserInfo.mutateAsync(data.name);
      setUserName(data.name);
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  const handleCancel = () => {
    reset({
      name: originalName,
    });
  };

  const isNameValid = currentName?.trim() !== "";
  const hasChanges = currentName !== originalName;
  const canSave = isNameValid && hasChanges && !updateUserInfo.isPending;

  return (
    <DashboardLayout>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Settings
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
          Manage your account settings and preferences
        </p>
      </div>
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <div className="card bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-0">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                Profile
              </h2>
            </div>
            <form
              onSubmit={handleSubmit(handleUpdateUserData)}
              className="space-y-3 sm:space-y-4"
            >
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your name"
                error={errors.name?.message}
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 min-h-11 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm sm:text-base cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Email cannot be changed
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <Button
                  type="submit"
                  size="md"
                  disabled={!canSave}
                  className={`min-h-11 w-full sm:w-auto ${!canSave ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {updateUserInfo.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleCancel}
                  disabled={!hasChanges}
                  className={`min-h-11 w-full sm:w-auto ${!hasChanges ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>

          <div className="card bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <CategoryManager />
          </div>

          <div className="card bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center shrink-0">
                <Settings2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                Preferences
              </h2>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between gap-3 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {theme === "dark" ? "🌙" : "☀️"}{" "}
                    {theme === "dark" ? "Dark Mode" : "Light Mode"}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                    {theme === "dark"
                      ? "Dark theme active"
                      : "Light theme active"}
                  </p>
                </div>
                <ThemeToggle />
              </div>

              <div className="flex items-center justify-between gap-3 py-2 sm:py-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    🔔 Notifications
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                    Coming soon!
                  </p>
                </div>
                <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full opacity-50 cursor-not-allowed shrink-0" />
              </div>
            </div>
          </div>

          <div className="card bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                Security
              </h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between gap-3 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <RectangleEllipsis className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Change Password
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1 ml-5.5 sm:ml-6">
                    Coming soon!
                  </p>
                </div>
                <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full opacity-50 cursor-not-allowed shrink-0" />
              </div>

              <div className="flex items-center justify-between gap-3 py-2 sm:py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <KeyRound className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Two-Factor Auth
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1 ml-5.5 sm:ml-6">
                    Coming soon!
                  </p>
                </div>
                <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full opacity-50 cursor-not-allowed shrink-0" />
              </div>
            </div>
          </div>

          <div className="card bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 lg:col-span-2">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center shrink-0">
                <Trash className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400">
                Danger Zone
              </h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <UserX className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Delete Account
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Coming soon!
                  </span>
                </div>
                <Button variant="danger" className="min-h-11 w-full sm:w-auto">
                  Delete
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 py-2 sm:py-3">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <LogOut className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Logout
                  </h3>
                </div>
                <Button
                  variant="outline"
                  isLoading={isLoggingOut}
                  onClick={handleLogout}
                  className="min-h-11 w-full sm:w-auto"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
