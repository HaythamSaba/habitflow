import { Component, ReactNode } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useInRouterContext, useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Card } from "./Card";
import { Button } from "./Button";

function RouterBackToDashboardButton({ onRetry }: { onRetry: () => void }) {
  const navigate = useNavigate();
  return (
    <Button
      variant="outline"
      onClick={() => {
        // Reset too, so the button still works when the error is on /dashboard
        onRetry();
        navigate("/dashboard");
      }}
    >
      Back to Dashboard
    </Button>
  );
}

/**
 * Client-side navigation when inside the router (page-level boundaries).
 * The root boundary in App wraps BrowserRouter, so there a full page load
 * is the only option — and after an app-level crash, a clean reload is wanted.
 */
function BackToDashboardButton({ onRetry }: { onRetry: () => void }) {
  const inRouter = useInRouterContext();
  if (inRouter) {
    return <RouterBackToDashboardButton onRetry={onRetry} />;
  }
  return (
    <Button
      variant="outline"
      onClick={() => window.location.assign("/dashboard")}
    >
      Back to Dashboard
    </Button>
  );
}

interface FallbackProps {
  error: Error | null;
  fullScreen?: boolean;
  onRetry: () => void;
}

function DefaultFallback({ error, fullScreen, onRetry }: FallbackProps) {
  return (
    <div
      className={`flex items-center justify-center p-4 ${
        fullScreen ? "min-h-screen" : "min-h-[60vh]"
      }`}
    >
      <Card className="max-w-md w-full text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          This page ran into an unexpected error. You can try again or head
          back to your dashboard.
        </p>
        {import.meta.env.DEV && error && (
          <pre className="text-xs text-left bg-gray-100 dark:bg-gray-900 text-red-600 dark:text-red-400 rounded-lg p-3 mb-6 overflow-auto max-h-40">
            {error.message}
          </pre>
        )}
        <div className="flex flex-wrap gap-3 justify-center">
          <BackToDashboardButton onRetry={onRetry} />
          <Button onClick={onRetry}>Try Again</Button>
        </div>
      </Card>
    </div>
  );
}

interface ErrorBoundaryClassProps {
  children: ReactNode;
  fullScreen?: boolean;
  onReset: () => void;
}

interface ErrorBoundaryClassState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryClass extends Component<
  ErrorBoundaryClassProps,
  ErrorBoundaryClassState
> {
  state: ErrorBoundaryClassState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    console.error("ErrorBoundary caught an error:", error, info.componentStack);
  }

  handleRetry = () => {
    this.props.onReset();
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <DefaultFallback
          error={this.state.error}
          fullScreen={this.props.fullScreen}
          onRetry={this.handleRetry}
        />
      );
    }
    return this.props.children;
  }
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fullScreen?: boolean;
}

/**
 * Catches render-time errors in its subtree. Paired with QueryErrorResetBoundary
 * so "Try Again" also clears any React Query error state that may have caused the crash.
 */
export function ErrorBoundary({ children, fullScreen }: ErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundaryClass onReset={reset} fullScreen={fullScreen}>
          {children}
        </ErrorBoundaryClass>
      )}
    </QueryErrorResetBoundary>
  );
}
