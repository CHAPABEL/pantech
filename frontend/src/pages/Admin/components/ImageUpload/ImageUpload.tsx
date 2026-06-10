import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImageIcon, Upload, X } from "lucide-react";
import shared from "../../pages/admin-shared.module.scss";
import styles from "./ImageUpload.module.scss";
import { api, ApiError } from "../../../../services/api";
import { resolveAssetUrl } from "../../../../services/assets";

type ImageAsset = {
  path: string;
  name: string;
  source: string;
};

type Props = {
  value: string;
  onChange: (path: string) => void;
  category?: "media" | "partners" | "cards" | "services" | "projects";
  label?: string;
};

function displayName(path: string): string {
  if (!path) return "Не выбрано";
  try {
    if (path.startsWith("http")) {
      const url = new URL(path);
      return decodeURIComponent(url.pathname.split("/").pop() || path);
    }
  } catch {
    /* ignore */
  }
  return path.split("/").pop() || path;
}

export default function ImageUpload({
  value,
  onChange,
  category = "media",
  label = "Изображение",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [library, setLibrary] = useState<ImageAsset[]>([]);

  const loadLibrary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<{ items: ImageAsset[] }>(
        `/admin/images?category=${category}`,
      );
      setLibrary(res.items);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Не удалось загрузить галерею",
      );
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    if (!open) return;
    void loadLibrary();
  }, [open, loadLibrary]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return library;
    return library.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.path.toLowerCase().includes(q),
    );
  }, [library, search]);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("category", category);
      const res = await api.postForm<{ path: string; name: string }>(
        "/admin/upload",
        form,
      );
      onChange(res.path);
      await loadLibrary();
      setOpen(false);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Не удалось загрузить файл",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const selectImage = (path: string) => {
    onChange(path);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className={styles.wrap}>
      <span className={shared.label}>{label}</span>

      <div className={styles.picker}>
        <button
          type="button"
          className={`${styles.previewBtn} ${value ? styles.previewBtnFilled : ""}`}
          onClick={() => setOpen(true)}
          aria-label="Выбрать изображение"
        >
          {value ? (
            <img
              src={resolveAssetUrl(value)}
              alt=""
              className={styles.previewImg}
            />
          ) : (
            <span className={styles.previewPlaceholder}>
              <ImageIcon size={28} />
            </span>
          )}
        </button>

        <div className={styles.meta}>
          <span className={styles.fileName}>{displayName(value)}</span>
          <div className={styles.actions}>
            <button
              type="button"
              className={shared.btnPrimary}
              onClick={() => setOpen(true)}
            >
              Выбрать
            </button>
            <button
              type="button"
              className={shared.btnGhost}
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              <Upload size={14} style={{ verticalAlign: "middle" }} />{" "}
              {uploading ? "…" : "Загрузить"}
            </button>
            {value ? (
              <button
                type="button"
                className={shared.btnGhost}
                onClick={() => onChange("")}
                aria-label="Убрать изображение"
              >
                <X size={14} />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className={styles.hidden}
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      {error && !open && <span className={shared.error}>{error}</span>}

      {open && (
        <div
          className={styles.overlay}
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="image-picker-title"
            onClick={(e) => e.stopPropagation()}
          >
            <header className={styles.modalHeader}>
              <h3 id="image-picker-title" className={styles.modalTitle}>
                {label}
              </h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setOpen(false)}
                aria-label="Закрыть"
              >
                <X size={20} />
              </button>
            </header>

            <div className={styles.modalToolbar}>
              <input
                className={`${shared.input} ${styles.toolbarInput}`}
                placeholder="Поиск по названию…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="button"
                className={shared.btnGhost}
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
              >
                <Upload size={14} style={{ verticalAlign: "middle" }} />{" "}
                {uploading ? "Загрузка…" : "Новый файл"}
              </button>
            </div>

            {error && open && (
              <p className={shared.error}>{error}</p>
            )}

            <div className={styles.grid}>
              {loading && (
                <p className={styles.gridMessage}>Загрузка галереи…</p>
              )}
              {!loading && filtered.length === 0 && (
                <p className={styles.gridMessage}>
                  Ничего не найдено. Загрузите файл кнопкой «Новый файл».
                </p>
              )}
              {!loading &&
                filtered.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    className={`${styles.gridItem} ${
                      value === item.path ? styles.gridItemActive : ""
                    }`}
                    onClick={() => selectImage(item.path)}
                    title={item.name}
                  >
                    <img
                      src={resolveAssetUrl(item.path)}
                      alt=""
                      className={styles.gridImg}
                    />
                    <span className={styles.gridName}>{item.name}</span>
                    {item.source === "upload" && (
                      <span className={styles.gridBadge}>загружено</span>
                    )}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
