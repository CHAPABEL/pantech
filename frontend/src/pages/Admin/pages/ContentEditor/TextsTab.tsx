import { useEffect, useMemo, useState } from "react";
import shared from "../admin-shared.module.scss";
import styles from "./ContentEditor.module.scss";
import { api, ApiError } from "../../../../services/api";
import type { AdminContentItem } from "../../../../services/types";
import { useContent } from "../../../../contexts/ContentContext";

type Props = {
  onToast: (msg: string) => void;
};

function groupByPrefix(items: AdminContentItem[]): Map<string, AdminContentItem[]> {
  const map = new Map<string, AdminContentItem[]>();
  for (const item of items) {
    const prefix = item.key.split(".")[0] ?? "other";
    const list = map.get(prefix) ?? [];
    list.push(item);
    map.set(prefix, list);
  }
  for (const list of map.values()) {
    list.sort((a, b) => a.key.localeCompare(b.key));
  }
  return map;
}

export default function TextsTab({ onToast }: Props) {
  const [items, setItems] = useState<AdminContentItem[]>([]);
  const [originalMap, setOriginalMap] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { reload } = useContent();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.get<AdminContentItem[]>("/admin/content");
        if (cancelled) return;
        setItems(data);
        setOriginalMap(new Map(data.map((d) => [d.key, d.value])));
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? `Ошибка ${err.status}: ${err.message}`
              : "Не удалось загрузить контент",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const dirty = useMemo(
    () => items.filter((it) => originalMap.get(it.key) !== it.value),
    [items, originalMap],
  );

  const groups = useMemo(() => groupByPrefix(items), [items]);

  const updateValue = (key: string, value: string) => {
    setItems((prev) =>
      prev.map((it) => (it.key === key ? { ...it, value } : it)),
    );
  };

  const handleSave = async () => {
    if (dirty.length === 0) return;
    setSaving(true);
    setError(null);
    try {
      await api.put("/admin/content", {
        items: dirty.map((d) => ({
          key: d.key,
          value: d.value,
          value_type: d.value_type,
        })),
      });
      setOriginalMap(new Map(items.map((d) => [d.key, d.value])));
      onToast(`Сохранено: ${dirty.length}`);
      void reload();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? `Ошибка ${err.status}: ${err.message}`
          : "Не удалось сохранить",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={shared.empty}>Загрузка…</div>;
  if (error) return <div className={shared.error}>{error}</div>;
  if (items.length === 0) {
    return (
      <div className={shared.empty}>
        Контент пуст. Запустите сид-скрипт: <code>python -m seeds.initial</code>
      </div>
    );
  }

  return (
    <div className={shared.page}>
      <div className={shared.spaceBetween}>
        <span className={shared.subtitle}>
          {dirty.length > 0
            ? `Несохранённых изменений: ${dirty.length}`
            : "Изменений нет"}
        </span>
        <button
          className={shared.btnPrimary}
          disabled={saving || dirty.length === 0}
          onClick={handleSave}
        >
          {saving ? "Сохраняем…" : "Сохранить"}
        </button>
      </div>

      <div className={styles.contentList}>
        {[...groups.entries()].map(([prefix, list]) => (
          <div key={prefix} className={styles.contentGroup}>
            <span className={styles.groupTitle}>{prefix}</span>
            {list.map((item) => {
              const isLong =
                item.value.length > 80 ||
                item.value.includes("\n") ||
                item.value_type === "json";
              return (
                <div key={item.key} className={styles.contentRow}>
                  <code className={styles.keyLabel}>{item.key}</code>
                  {isLong ? (
                    <textarea
                      className={shared.textarea}
                      value={item.value}
                      onChange={(e) => updateValue(item.key, e.target.value)}
                      rows={item.value_type === "json" ? 8 : 4}
                      spellCheck={false}
                    />
                  ) : (
                    <input
                      className={shared.input}
                      value={item.value}
                      onChange={(e) => updateValue(item.key, e.target.value)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
