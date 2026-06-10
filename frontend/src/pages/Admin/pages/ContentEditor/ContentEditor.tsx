import { useEffect, useState } from "react";
import shared from "../admin-shared.module.scss";
import styles from "./ContentEditor.module.scss";
import TextsTab from "./TextsTab";
import EntityTab from "./EntityTab";

type TabId = "texts" | "cards" | "services" | "projects" | "partners";

const TABS: { id: TabId; label: string }[] = [
  { id: "texts", label: "Тексты" },
  { id: "cards", label: "Карточки" },
  { id: "services", label: "Услуги" },
  { id: "projects", label: "Проекты" },
  { id: "partners", label: "Партнеры" },
];

export default function ContentEditor() {
  const [tab, setTab] = useState<TabId>("texts");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <div className={shared.page}>
      <header className={shared.pageHeader}>
        <div>
          <h1 className={shared.title}>Контент</h1>
          <span className={shared.subtitle}>
            Редактирование текстов и сущностей лендинга
          </span>
        </div>
      </header>

      <div className={shared.tabs}>
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`${shared.tab} ${tab === t.id ? shared.tabActive : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "texts" && <TextsTab onToast={setToast} />}
      {tab === "cards" && <EntityTab kind="cards" onToast={setToast} />}
      {tab === "services" && <EntityTab kind="services" onToast={setToast} />}
      {tab === "projects" && <EntityTab kind="projects" onToast={setToast} />}
      {tab === "partners" && <EntityTab kind="partners" onToast={setToast} />}

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
