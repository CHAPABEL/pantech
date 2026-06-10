import { useCallback, useRef, useState } from "react";
import ConfirmDialog, { type ConfirmVariant } from "./ConfirmDialog";

export type ConfirmOptions = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
};

type Pending = ConfirmOptions & {
  action: () => void | Promise<void>;
};

export function useConfirmDialog() {
  const [pending, setPending] = useState<Pending | null>(null);
  const [loading, setLoading] = useState(false);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback(
    (opts: ConfirmOptions & { action: () => void | Promise<void> }): Promise<boolean> => {
      return new Promise((resolve) => {
        resolveRef.current = resolve;
        setPending(opts);
      });
    },
    [],
  );

  const handleCancel = useCallback(() => {
    if (loading) return;
    resolveRef.current?.(false);
    resolveRef.current = null;
    setPending(null);
  }, [loading]);

  const handleConfirm = useCallback(async () => {
    if (!pending) return;
    setLoading(true);
    try {
      await pending.action();
      resolveRef.current?.(true);
    } catch {
      resolveRef.current?.(false);
    } finally {
      resolveRef.current = null;
      setPending(null);
      setLoading(false);
    }
  }, [pending]);

  const dialog = (
    <ConfirmDialog
      open={!!pending}
      title={pending?.title ?? ""}
      message={pending?.message}
      confirmLabel={pending?.confirmLabel}
      cancelLabel={pending?.cancelLabel}
      variant={pending?.variant}
      loading={loading}
      onCancel={handleCancel}
      onConfirm={() => void handleConfirm()}
    />
  );

  return { confirm, dialog };
}
