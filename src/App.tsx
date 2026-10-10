import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { useCheckAchievements } from "@/hooks/useCheckAchievements";
import { Toaster } from "react-hot-toast";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { HabitsPage } from "./pages/HabitsPage";
import { SettingsPage } from "./pages/SettingsPage";

import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AchievementsPage } from "./pages/AchievementsPage";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { MotionConfig } from "framer-motion";
import { TemplatesPage } from "./pages/TemplatesPage";
import { AboutPage } from "./pages/AboutPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { EmailConfirmationPage } from "./pages/EmailConfirmationPage";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ConfirmDialogHost } from "@/components/ui/ConfirmDialogHost";
import { CelebrationHost } from "@/components/ui/CelebrationHost";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

function AppContent() {
  // Initialize auth on app mount
  useAuth();

  // Check for newly unlocked achievements on every page, not just /achievements
  useCheckAchievements();

  // Toasts are styled inline by react-hot-toast, so follow the theme here
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: isDark ? "#1f2937" : "#fff", // gray-800 / white
            color: isDark ? "#f3f4f6" : "#111827", // gray-100 / gray-900
            boxShadow: isDark
              ? "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
              : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`, // gray-700 / gray-200
            padding: "16px",
            borderRadius: "12px",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: isDark ? "#1f2937" : "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: isDark ? "#1f2937" : "#fff",
            },
          },
          custom: {
            position: "top-center",
            duration: 5000,
          },
        }}
      />

      {/* App-wide confirmation dialog, opened via confirmDialog() */}
      <ConfirmDialogHost />

      {/* Confetti burst, fired via celebrate() (e.g. on a perfect day) */}
      <CelebrationHost />

      {/* Routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/email-confirmation" element={<EmailConfirmationPage />} />

        {/* Protected Routes */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/habits"
          element={
            <ProtectedRoute>
              <HabitsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <AchievementsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/templates"
          element={
            <ProtectedRoute>
              <TemplatesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AboutPage />
            </ProtectedRoute>
          }
        />
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary fullScreen>
      {/* Every framer-motion animation follows the OS "reduce motion" setting:
          transform/layout animations are skipped, opacity fades remain */}
      <MotionConfig reducedMotion="user">
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </QueryClientProvider>
        </ThemeProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}

export default App;
