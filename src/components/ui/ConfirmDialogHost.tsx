import { useCallback, useRef } from "react";
import { AlertTriangle, Info, Trash2 } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import {
  ConfirmVariant,
  settleConfirmDialog,
  useConfirmStore,
} from "@/lib/confirmDialog";

const VARIANTS: Record<
  ConfirmVariant,
  {
    icon: typeof Info;
    iconBg: string;
    iconColor: string;
    buttonVariant: "danger" | "primary";
  }
> = {
  danger: {
    icon: Trash2,
    iconBg: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600 dark:text-red-400",
    buttonVariant: "danger",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
    iconColor: "text-yellow-600 dark:text-yellow-500",
    buttonVariant: "primary",
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    buttonVariant: "primary",
  },
};

/**
 * Renders the dialog opened by confirmDialog(). Mount once near the app root.
 *
 * Keyboard handling is left to the browser: Enter/Space activate whichever
 * button has focus, and Modal closes on Escape. Focus starts on Cancel so an
 * accidental Enter never confirms a destructive action.
 */
export function ConfirmDialogHost() {
  const options = useConfirmStore((state) => state.options);
  const handleCancel = useCallback(() => settleConfirmDialog(false), []);
  const cancelRef = useRef<HTMLButtonElement>(null);

  if (!options) return null;

  const {
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "info",
  } = options;
  const config = VARIANTS[variant];

  return (
    <Modal
      isOpen
      onClose={handleCancel}
      title={title}
      size="sm"
      initialFocusRef={cancelRef}
      footer={
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto sm:justify-end">
          <Button
            ref={cancelRef}
            variant="outline"
            onClick={handleCancel}
            className="min-h-11 w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={() => settleConfirmDialog(true)}
            className="min-h-11 w-full sm:w-auto"
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full shrink-0 ${config.iconBg}`}>
          <config.icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 pt-1.5">
          {message}
        </p>
      </div>
    </Modal>
  );
}
