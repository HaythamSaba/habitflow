import { create } from "zustand";

export type ConfirmVariant = "danger" | "warning" | "info";

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
}

interface ConfirmState {
  options: ConfirmOptions | null;
  resolve: ((confirmed: boolean) => void) | null;
}

export const useConfirmStore = create<ConfirmState>(() => ({
  options: null,
  resolve: null,
}));

/**
 * Open the app-wide confirmation dialog (rendered by <ConfirmDialogHost />).
 * Resolves true on confirm, false on cancel / Escape / backdrop click.
 *
 * @example
 * if (await confirmDialog({ title: "Delete habit?", message: "...", variant: "danger" })) { ... }
 */
export function confirmDialog(options: ConfirmOptions): Promise<boolean> {
  // Only one dialog at a time: a new request cancels any pending one
  useConfirmStore.getState().resolve?.(false);

  return new Promise<boolean>((resolve) => {
    useConfirmStore.setState({ options, resolve });
  });
}

export function settleConfirmDialog(confirmed: boolean) {
  const { resolve } = useConfirmStore.getState();
  useConfirmStore.setState({ options: null, resolve: null });
  resolve?.(confirmed);
}
