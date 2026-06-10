import { useEffect, useState } from "react";
import shared from "../admin-shared.module.scss";
import { api, ApiError } from "../../../../services/api";
import type { StatsResponse } from "../../../../services/types";

const DEFAULT: StatsResponse = {
  messages_total: 0,
  messages_today: 0,
  visitors_today: 0,
  visitors_7d: 0,
  visitors_30d: 0,
  page_views_today: 0,
};

export default function Dashboard() {
  const [stats, setStats] = useState<StatsResponse>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.get<StatsResponse>("/admin/stats");
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? `Ошибка ${err.status}: ${err.message}`
              : "Не удалось загрузить статистику",
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

  return (
    <div className={shared.page}>
      <header className={shared.pageHeader}>
        <div>
          <h1 className={shared.title}>Главная</h1>
          <span className={shared.subtitle}>
            Обзор активности сайта и форм связи
          </span>
        </div>
      </header>

      {error && <div className={shared.error}>{error}</div>}

      <div className={shared.metricGrid}>
        <div className={shared.metric}>
          <span className={shared.metricLabel}>Посетители сегодня</span>
          <span className={shared.metricValue}>
            {loading ? "…" : stats.visitors_today}
          </span>
          <span className={shared.metricHint}>
            Просмотров: {stats.page_views_today}
          </span>
        </div>
        <div className={shared.metric}>
          <span className={shared.metricLabel}>За 7 дней</span>
          <span className={shared.metricValue}>
            {loading ? "…" : stats.visitors_7d}
          </span>
          <span className={shared.metricHint}>уникальных визитов</span>
        </div>
        <div className={shared.metric}>
          <span className={shared.metricLabel}>За 30 дней</span>
          <span className={shared.metricValue}>
            {loading ? "…" : stats.visitors_30d}
          </span>
          <span className={shared.metricHint}>уникальных визитов</span>
        </div>
        <div className={shared.metric}>
          <span className={shared.metricLabel}>Сообщений всего</span>
          <span className={shared.metricValue}>
            {loading ? "…" : stats.messages_total}
          </span>
          <span className={shared.metricHint}>
            Сегодня: {stats.messages_today}
          </span>
        </div>
      </div>
    </div>
  );
}
