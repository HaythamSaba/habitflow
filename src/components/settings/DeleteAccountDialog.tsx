import { useId, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";

/** What the user has to type before the delete button unlocks */
const CONFIRM_WORD = "DELETE";

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Confirms permanent account deletion (audit R17). The delete button stays
 * disabled until the user types DELETE, so it can't happen by accident.
 */
export function DeleteAccountDialog({ isOpen, onClose }: DeleteAccountDialogProps) {
  const [typed, setTyped] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const formId = useId();
  const deleteAccount = useDeleteAccount();

  const isConfirmed = typed.trim() === CONFIRM_WORD;

  const handleClose = () => {
    // Don't close mid-request: the result decides where the user goes
    if (deleteAccount.isPending) return;
    setTyped("");
    onClose();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isConfirmed) deleteAccount.mutate();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete account"
      size="sm"
      initialFocusRef={inputRef}
      footer={
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto sm:justify-end">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={deleteAccount.isPending}
            className="min-h-11 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form={formId}
            variant="danger"
            disabled={!isConfirmed}
            isLoading={deleteAccount.isPending}
            loadingText="Deleting…"
            className="min-h-11 w-full sm:w-auto"
          >
            Delete my account
          </Button>
        </div>
      }
    >
      <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full shrink-0 bg-red-100 dark:bg-red-900/30">
            <AlertTriangle
              className="w-5 h-5 text-red-600 dark:text-red-400"
              aria-hidden="true"
            />
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 pt-1.5">
            This permanently deletes your account, habits, check-ins,
            categories, points and achievements. It can't be undone. Export
            your data first if you want a copy.
          </p>
        </div>
        <Input
          ref={inputRef}
          label={`Type ${CONFIRM_WORD} to confirm`}
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          disabled={deleteAccount.isPending}
        />
      </form>
    </Modal>
  );
}
