import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import shared from "../admin-shared.module.scss";
import styles from "./ContentEditor.module.scss";
import ImageUpload from "../../components/ImageUpload/ImageUpload";
import { useConfirmDialog } from "../../components/ConfirmDialog/useConfirmDialog";
import { api, ApiError } from "../../../../services/api";
import { resolveAssetUrl } from "../../../../services/assets";

type EntityKind = "cards" | "services" | "projects" | "partners";

type EntityRecord = {
  id: number;
  title: string;
  description: string;
  image_path: string | null;
  position: number;
  is_published: boolean;
  stack?: string[];
  is_clickable?: boolean;
  popup_content_key?: string | null;
};

type Props = {
  kind: EntityKind;
  onToast: (msg: string) => void;
};

const LABEL: Record<EntityKind, string> = {
  cards: "Карточки продуктов",
  services: "Услуги",
  projects: "Проекты",
  partners: "Партнеры",
};

function makeEmpty(kind: EntityKind): EntityRecord {
  const base: EntityRecord = {
    id: 0,
    title: "",
    description: "",
    image_path: "",
    position: 0,
    is_published: true,
  };
  if (kind === "cards") {
    base.stack = [];
    base.is_clickable = false;
    base.popup_content_key = "";
  }
  return base;
}

export default function EntityTab({ kind, onToast }: Props) {
  const [items, setItems] = useState<EntityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<EntityRecord | null>(null);
  const { confirm, dialog: confirmDialog } = useConfirmDialog();

  const path = `/admin/${kind}`;

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<EntityRecord[]>(path);
      setItems(data);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? `Ошибка ${err.status}: ${err.message}`
          : "Не удалось загрузить данные",
      );
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const updateLocal = (id: number, patch: Partial<EntityRecord>) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    );
  };

  const handleSave = async (record: EntityRecord) => {
    const name = record.title || "(без названия)";
    await confirm({
      title: "Сохранить изменения?",
      message: `Обновить запись «${name}»?`,
      confirmLabel: "Сохранить",
      variant: "primary",
      action: async () => {
        try {
          const payload = serialize(record, kind);
          await api.put(`${path}/${record.id}`, payload);
          onToast("Сохранено");
          void reload();
        } catch (err) {
          onToast(
            err instanceof ApiError
              ? `Ошибка: ${err.message}`
              : "Не удалось сохранить",
          );
          throw err;
        }
      },
    });
  };

  const handleDelete = async (id: number) => {
    const record = items.find((it) => it.id === id);
    const name = record?.title || "эту запись";
    await confirm({
      title: "Удалить запись?",
      message: `«${name}» будет удалена без возможности восстановления.`,
      confirmLabel: "Удалить",
      variant: "danger",
      action: async () => {
        try {
          await api.del(`${path}/${id}`);
          onToast("Удалено");
          void reload();
        } catch (err) {
          onToast(
            err instanceof ApiError
              ? `Ошибка: ${err.message}`
              : "Не удалось удалить",
          );
          throw err;
        }
      },
    });
  };

  const handleCreate = async () => {
    if (!draft) return;
    const name = draft.title || "(без названия)";
    await confirm({
      title: "Создать запись?",
      message: `Добавить «${name}» в список?`,
      confirmLabel: "Создать",
      variant: "primary",
      action: async () => {
        try {
          const payload = serialize(draft, kind);
          await api.post(path, payload);
          onToast("Создано");
          setDraft(null);
          void reload();
        } catch (err) {
          onToast(
            err instanceof ApiError
              ? `Ошибка: ${err.message}`
              : "Не удалось создать",
          );
          throw err;
        }
      },
    });
  };

  if (loading) return <div className={shared.empty}>Загрузка…</div>;
  if (error) return <div className={shared.error}>{error}</div>;

  return (
    <div className={shared.page}>
      {confirmDialog}
      <div className={shared.spaceBetween}>
        <span className={shared.subtitle}>
          {LABEL[kind]} · {items.length}
        </span>
        <button
          className={shared.btnPrimary}
          onClick={() => setDraft(makeEmpty(kind))}
          disabled={!!draft}
        >
          <Plus size={14} style={{ verticalAlign: "middle" }} /> Добавить
        </button>
      </div>

      {draft && (
        <div className={styles.entityCard}>
          <div className={styles.entityHeader}>
            <span className={styles.entityTitle}>Новая запись</span>
            <div className={styles.entityActions}>
              <button
                className={shared.btnGhost}
                onClick={() => setDraft(null)}
              >
                Отмена
              </button>
              <button
                className={shared.btnPrimary}
                onClick={handleCreate}
                disabled={!draft.title}
              >
                Создать
              </button>
            </div>
          </div>
          <EntityForm
            value={draft}
            kind={kind}
            onField={(field, val) =>
              setDraft((prev) => (prev ? { ...prev, [field]: val } : prev))
            }
          />
        </div>
      )}

      <div className={styles.entityList}>
        {items.length === 0 && (
          <div className={shared.empty}>Записей пока нет</div>
        )}
        {items.map((item) => (
          <div key={item.id} className={styles.entityCard}>
            <div className={styles.entityHeader}>
              <div className={shared.row}>
                {item.image_path && (
                  <img
                    src={resolveAssetUrl(item.image_path)}
                    alt=""
                    className={styles.preview}
                  />
                )}
                <span className={styles.entityTitle}>
                  {item.title || "(без названия)"}
                </span>
              </div>
              <div className={styles.entityActions}>
                <button
                  className={shared.btnGhost}
                  onClick={() => handleSave(item)}
                >
                  Сохранить
                </button>
                <button
                  className={shared.btnDanger}
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 size={14} style={{ verticalAlign: "middle" }} />
                </button>
              </div>
            </div>
            <EntityForm
              value={item}
              kind={kind}
              onField={(field, val) => updateLocal(item.id, { [field]: val })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function serialize(record: EntityRecord, kind: EntityKind): Record<string, unknown> {
  const base: Record<string, unknown> = {
    title: record.title,
    description: record.description,
    image_path: record.image_path || null,
    position: Number(record.position) || 0,
    is_published: !!record.is_published,
  };
  if (kind === "cards") {
    base.stack = record.stack ?? [];
    base.is_clickable = !!record.is_clickable;
    base.popup_content_key = record.popup_content_key || null;
  }
  return base;
}

type FormProps = {
  value: EntityRecord;
  kind: EntityKind;
  onField: <K extends keyof EntityRecord>(field: K, val: EntityRecord[K]) => void;
};

function EntityForm({ value, kind, onField }: FormProps) {
  return (
    <div className={styles.entityForm}>
      <label className={`${shared.label} ${styles.full}`}>
        {kind === "partners" ? "Название компании" : "Заголовок"}
        <input
          className={shared.input}
          value={value.title}
          onChange={(e) => onField("title", e.target.value)}
        />
      </label>
      <label className={`${shared.label} ${styles.full}`}>
        Описание
        <textarea
          className={shared.textarea}
          value={value.description}
          onChange={(e) => onField("description", e.target.value)}
        />
      </label>
      <ImageUpload
        label={kind === "partners" ? "Логотип" : "Картинка"}
        value={value.image_path ?? ""}
        onChange={(path) => onField("image_path", path)}
        category={kind}
      />
      <label className={shared.label}>
        Позиция
        <input
          className={shared.input}
          type="number"
          value={value.position}
          onChange={(e) => onField("position", Number(e.target.value) as never)}
        />
      </label>

      {kind === "cards" && (
        <>
          <label className={`${shared.label} ${styles.full}`}>
            Стек (по одной строке: путь к иконке)
            <textarea
              className={shared.textarea}
              value={(value.stack ?? []).join("\n")}
              onChange={(e) =>
                onField(
                  "stack",
                  e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
            />
          </label>
          <label className={shared.label}>
            Ключ модалки (popup_content_key)
            <input
              className={shared.input}
              placeholder="popup_project.pichta"
              value={value.popup_content_key ?? ""}
              onChange={(e) => onField("popup_content_key", e.target.value)}
            />
          </label>
          <label className={shared.labelCheckbox}>
            <input
              type="checkbox"
              checked={!!value.is_clickable}
              onChange={(e) => onField("is_clickable", e.target.checked)}
            />
            <span>Открывать модалку по клику</span>
          </label>
        </>
      )}

      <label className={shared.labelCheckbox}>
        <input
          type="checkbox"
          checked={!!value.is_published}
          onChange={(e) => onField("is_published", e.target.checked)}
        />
        <span>Опубликовано</span>
      </label>
    </div>
  );
}
