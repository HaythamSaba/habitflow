import toast from "react-hot-toast";
import { AlertTriangle, Info, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

type ConfirmToastVariant = "danger" | "warning" | "info" | "success";

interface ConfirmToastOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmToastVariant;
}

/**
 * Show a confirmation toast that returns a Promise
 * @param options - Configuration options
 * @returns Promise<boolean> - true if confirmed, false if cancelled
 *
 * @example
 * const confirmed = await confirmToast({
 *   title: "Delete Habit",
 *   message: "This action cannot be undone.",
 *   variant: "danger"
 * });
 */
export function confirmToast(options: ConfirmToastOptions): Promise<boolean> {
  const {
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "info",
  } = options;

  return new Promise<boolean>((resolve) => {
    // Get variant styles
    const variantConfig = getVariantConfig(variant);

    // Create toast with infinite duration
    toast.custom(
      (t) => (
        <div
          className="bg-white dark:bg-gray-900 rounded-2xl p-5 flex flex-col gap-4 
            border border-gray-200 dark:border-gray-800 max-w-md shadow-2xl
            animate-fadeIn"
          role="alertdialog"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-message"
        >
          {/* Header with Icon */}
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-full shrink-0 ${variantConfig.iconBg}`}
            >
              <variantConfig.icon
                className={`w-5 h-5 ${variantConfig.iconColor}`}
              />
            </div>
            <div className="flex-1 min-w-0">
              {title && (
                <h3
                  id="confirm-title"
                  className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1"
                >
                  {title}
                </h3>
              )}
              <p
                id="confirm-message"
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                {message}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="min-h-10"
              autoFocus={variant !== "danger"} // Focus cancel for non-dangerous actions
            >
              {cancelText}
            </Button>
            <Button
              variant={variantConfig.buttonVariant}
              size="md"
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="min-h-10"
              autoFocus={variant === "danger"} // Focus confirm for dangerous actions
            >
              {confirmText}
            </Button>
          </div>
        </div>
      ),
      {
        duration: Infinity, // ⭐ CRITICAL: Don't auto-dismiss!
        position: "top-center",
      },
    );

    // ⭐ Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        toast.dismiss();
        resolve(false);
        cleanup();
      } else if (e.key === "Enter") {
        toast.dismiss();
        resolve(true);
        cleanup();
      }
    };

    const cleanup = () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

    window.addEventListener("keydown", handleKeyDown);
  });
}

// ⭐ Variant configurations
function getVariantConfig(variant: ConfirmToastVariant) {
  switch (variant) {
    case "danger":
      return {
        icon: Trash2,
        iconBg: "bg-red-100 dark:bg-red-900/30",
        iconColor: "text-red-600 dark:text-red-400",
        buttonVariant: "danger" as const,
      };
    case "warning":
      return {
        icon: AlertTriangle,
        iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
        iconColor: "text-yellow-600 dark:text-yellow-500",
        buttonVariant: "primary" as const,
      };
    case "success":
      return {
        icon: CheckCircle,
        iconBg: "bg-green-100 dark:bg-green-900/30",
        iconColor: "text-green-600 dark:text-green-400",
        buttonVariant: "primary" as const,
      };
    case "info":
    default:
      return {
        icon: Info,
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
        buttonVariant: "primary" as const,
      };
  }
}

// ⭐ Convenience functions for common use cases
export async function confirmDelete(itemName: string = "this item") {
  return confirmToast({
    title: "Confirm Deletion",
    message: `Are you sure you want to delete ${itemName}? This action cannot be undone.`,
    confirmText: "Delete",
    cancelText: "Cancel",
    variant: "danger",
  });
}

export async function confirmDiscard() {
  return confirmToast({
    title: "Discard Changes?",
    message: "You have unsaved changes. Are you sure you want to discard them?",
    confirmText: "Discard",
    cancelText: "Keep Editing",
    variant: "warning",
  });
}

export async function confirmAction(action: string, message: string) {
  return confirmToast({
    title: `Confirm ${action}`,
    message,
    confirmText: action,
    cancelText: "Cancel",
    variant: "info",
  });
}
