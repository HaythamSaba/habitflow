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
    // No need to setIsLoggingOut(false) because user will be redirected
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-4 lg:mb-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-primary-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Profile</h2>
            </div>
            <form
              onSubmit={handleSubmit(handleUpdateUserData)}
              className="space-y-4"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  size="md"
                  disabled={!canSave}
                  className={!canSave ? "opacity-50 cursor-not-allowed" : ""}
                >
                  {updateUserInfo.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleCancel}
                  disabled={!hasChanges}
                  className={!hasChanges ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
          {/* Preferences Section (Placeholder) */}
          <div className="card bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Settings2 className="w-5 h-5 text-primary-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Preferences</h2>
            </div>

            <div className="space-y-4">
              {/* Dark Mode (Coming Soon) */}
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {theme === "dark" ? "🌙" : "☀️"}{" "}
                    {theme === "dark" ? "Dark Mode" : "Light Mode"}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {theme === "dark"
                      ? "Dark theme active"
                      : "Light theme active"}
                  </p>
                </div>
                <ThemeToggle /> {/* ⭐ REPLACE the placeholder toggle */}
              </div>

              {/* Notifications (Coming Soon) */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    🔔 Notifications
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Coming soon!</p>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-full opacity-50 cursor-not-allowed" />
              </div>
            </div>
          </div>

          {/* Security Section (Placeholder) */}
          <div className="card bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Security</h2>
            </div>
            <div className="space-y-4">
              {/* Dark Mode (Coming Soon) */}
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-2">
                    <RectangleEllipsis className="w-4 h-4 text-gray-500" />
                    <h3 className="text-sm font-medium text-gray-900">
                      Change Password
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-6">
                    Coming soon!
                  </p>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-full opacity-50 cursor-not-allowed" />
              </div>

              {/* Notifications (Coming Soon) */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <KeyRound />
                  <h3 className="text-sm font-medium text-gray-900">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Coming soon!</p>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-full opacity-50 cursor-not-allowed" />
              </div>
            </div>
          </div>

          {/* Delete Account Section (Placeholder) */}
          <div className="card bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-danger-100 rounded-lg flex items-center justify-center">
                <Trash className="w-5 h-5 text-danger-500" />
              </div>
              <h2 className="text-xl font-bold text-danger-600">Danger Zone</h2>
            </div>
            <div className="space-y-4">
              {/* Dark Mode (Coming Soon) */}
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <UserX />
                  <h3 className="text-sm font-medium text-gray-900">
                    Delete Account
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Coming soon!</p>
                </div>
                <Button variant="danger">Delete</Button>
              </div>

              {/* Notifications (Coming Soon) */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <LogOut />
                  <h3 className="text-sm font-medium text-gray-900">Logout</h3>
                </div>
                <Button
                  variant="outline"
                  isLoading={isLoggingOut}
                  onClick={handleLogout}
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
