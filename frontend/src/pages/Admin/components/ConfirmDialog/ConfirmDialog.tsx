import { useEffect } from "react";
import styles from "./ConfirmDialog.module.scss";

export type ConfirmVariant = "primary" | "danger";

type Props = {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Подтвердить",
  cancelLabel = "Отмена",
  variant = "primary",
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onClick={() => !loading && onCancel()}
    >
      <div
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby={message ? "confirm-dialog-desc" : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-dialog-title" className={styles.title}>
          {title}
        </h2>
        {message ? (
          <p id="confirm-dialog-desc" className={styles.message}>
            {message}
          </p>
        ) : null}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`${styles.confirmBtn} ${
              variant === "danger" ? styles.confirmDanger : styles.confirmPrimary
            }`}
            onClick={onConfirm}
            disabled={loading}
            autoFocus
          >
            {loading ? "Подождите…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
