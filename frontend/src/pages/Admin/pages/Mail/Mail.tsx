import { useEffect, useMemo, useState } from "react";
import shared from "../admin-shared.module.scss";
import styles from "./Mail.module.scss";
import { api, ApiError } from "../../../../services/api";
import type { MessageItem } from "../../../../services/types";

type ListResponse = { items: MessageItem[]; total: number };

const PAGE_SIZE = 20;

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("ru-RU", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function statusLabel(status: string) {
  if (status === "sent") return { text: "отправлено", cls: styles.statusOk };
  if (status === "error") return { text: "ошибка", cls: styles.statusErr };
  return { text: status, cls: styles.statusPending };
}

export default function Mail() {
  const [items, setItems] = useState<MessageItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({
      limit: String(PAGE_SIZE),
      offset: String(page * PAGE_SIZE),
    });
    if (debouncedSearch) params.set("q", debouncedSearch);
    (async () => {
      try {
        const data = await api.get<ListResponse>(
          `/admin/messages?${params.toString()}`,
        );
        if (cancelled) return;
        setItems(data.items);
        setTotal(data.total);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? `Ошибка ${err.status}: ${err.message}`
              : "Не удалось загрузить сообщения",
          );
          setItems([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / PAGE_SIZE)),
    [total],
  );

  return (
    <div className={shared.page}>
      <header className={shared.pageHeader}>
        <div>
          <h1 className={shared.title}>Почта</h1>
          <span className={shared.subtitle}>
            Сообщения, отправленные через форму на сайте
          </span>
        </div>
        <span className={shared.subtitle}>Всего: {total}</span>
      </header>

      <div className={styles.toolbar}>
        <input
          className={`${shared.input} ${styles.search}`}
          placeholder="Поиск по имени, email или тексту"
          value={search}
          onChange={(e) => {
            setPage(0);
            setSearch(e.target.value);
          }}
        />
      </div>

      {error && <div className={shared.error}>{error}</div>}

      <div className={styles.list}>
        {loading && items.length === 0 ? (
          <div className={shared.empty}>Загрузка…</div>
        ) : items.length === 0 ? (
          <div className={shared.empty}>Сообщений нет</div>
        ) : (
          items.map((m) => {
            const expanded = openId === m.id;
            const status = statusLabel(m.status);
            return (
              <div
                key={m.id}
                className={styles.row}
                onClick={() => setOpenId(expanded ? null : m.id)}
              >
                <div className={styles.rowHeader}>
                  <div>
                    <span className={styles.name}>{m.name}</span>{" "}
                    <span className={styles.email}>&lt;{m.email}&gt;</span>
                  </div>
                  <div className={styles.meta}>
                    <span className={status.cls}>{status.text}</span>
                    {" · "}
                    {formatDate(m.created_at)}
                  </div>
                </div>
                <div className={styles.preview}>{m.about || "—"}</div>
                {expanded && (
                  <dl className={styles.expanded}>
                    <div>
                      <dt>Телефон</dt>
                      <dd>{m.phone || "—"}</dd>
                    </div>
                    <div>
                      <dt>Направление</dt>
                      <dd>{m.direction || "—"}</dd>
                    </div>
                    <div>
                      <dt>Файл</dt>
                      <dd>{m.file_path || "—"}</dd>
                    </div>
                    {m.error && (
                      <div>
                        <dt>Ошибка</dt>
                        <dd className={shared.error}>{m.error}</dd>
                      </div>
                    )}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <dt>Сообщение</dt>
                      <dd style={{ whiteSpace: "pre-wrap" }}>{m.about}</dd>
                    </div>
                  </dl>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className={styles.pager}>
        <button
          className={shared.btnGhost}
          disabled={page === 0 || loading}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          Назад
        </button>
        <span className={shared.subtitle}>
          {page + 1} / {totalPages}
        </span>
        <button
          className={shared.btnGhost}
          disabled={page + 1 >= totalPages || loading}
          onClick={() => setPage((p) => p + 1)}
        >
          Далее
        </button>
      </div>
    </div>
  );
}
