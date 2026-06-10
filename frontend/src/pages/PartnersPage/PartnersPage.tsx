import { useMemo, useState } from "react";
import Seo from "../../components/Seo/Seo";
import { useApiList } from "../../hooks/useApiList";
import { resolveAssetUrl } from "../../services/assets";
import type { PartnerItem } from "../../services/types";
import PartnersPageHeader from "./PartnersPageHeader";
import { sortPartners } from "./partnersUtils";
import styles from "./PartnersPage.module.scss";

const PAGE_SIZE = 24;

const FALLBACK: PartnerItem[] = [
  {
    id: 1,
    title: "Google",
    description:
      "Корпоративные облачные решения и интеграция сервисов Google Workspace.",
    image_path: "https://cdn.simpleicons.org/google/4285F4",
    position: 0,
    is_published: true,
  },
  {
    id: 2,
    title: "Microsoft",
    description:
      "Внедрение платформ Azure и корпоративной экосистемы Microsoft 365.",
    image_path: "images/partners/microsoft.svg",
    position: 1,
    is_published: true,
  },
  {
    id: 3,
    title: "Amazon Web Services",
    description:
      "Построение масштабируемой облачной инфраструктуры на базе AWS.",
    image_path: "images/partners/aws.svg",
    position: 2,
    is_published: true,
  },
  {
    id: 4,
    title: "IBM",
    description:
      "Консалтинг и разработка enterprise-решений для крупного бизнеса.",
    image_path: "images/partners/ibm.svg",
    position: 3,
    is_published: true,
  },
  {
    id: 5,
    title: "Oracle",
    description:
      "Системы управления данными и корпоративные бизнес-приложения.",
    image_path: "images/partners/oracle.svg",
    position: 4,
    is_published: true,
  },
  {
    id: 6,
    title: "SAP",
    description: "ERP-интеграции и автоматизация ключевых бизнес-процессов.",
    image_path: "https://cdn.simpleicons.org/sap/0FAAFF",
    position: 5,
    is_published: true,
  },
  {
    id: 7,
    title: "Intel",
    description:
      "Аппаратные платформы и оптимизация высоконагруженных систем.",
    image_path: "https://cdn.simpleicons.org/intel/0071C5",
    position: 6,
    is_published: true,
  },
  {
    id: 8,
    title: "Samsung",
    description:
      "Технологические партнёрства в области IoT и мобильных решений.",
    image_path: "https://cdn.simpleicons.org/samsung/1428A0",
    position: 7,
    is_published: true,
  },
];

function PartnersPage() {
  const raw = useApiList<PartnerItem>("/partners", FALLBACK);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const sorted = useMemo(() => sortPartners(raw), [raw]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)),
    );
  }, [sorted, query]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleSearch = (value: string) => {
    setQuery(value);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className={styles.page}>
      <Seo
        title="Партнёры"
        description="Партнёры Pantech: технологические компании и вендоры для облачных, корпоративных и отраслевых IT-проектов любой сложности."
        path="/partners"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Партнёры Pantech",
            description:
              "Список технологических партнёров компании Pantech.",
            isPartOf: {
              "@type": "WebSite",
              name: "Pantech",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Главная",
                item:
                  typeof window !== "undefined"
                    ? `${window.location.origin}/`
                    : "/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Партнёры",
              },
            ],
          },
        ]}
      />

      <PartnersPageHeader />

      <main className={styles.main}>
        <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
          <a href="/" className={styles.breadcrumbLink}>
            Главная
          </a>
          <span className={styles.breadcrumbSep}>/</span>
          <span>Партнёры</span>
        </nav>

        <header className={styles.hero}>
          <h1 className={styles.title}>Партнёры</h1>
          <p className={styles.lead}>
            На базе проверенных технологий и решений ведущих вендоров мы реализуем
            проекты любой сложности — от аудита и консалтинга до разработки и
            сопровождения IT-систем.
          </p>
        </header>

        <section className={styles.panel} aria-labelledby="partners-catalog">
          <div className={styles.searchRow}>
            <input
              type="search"
              className={styles.search}
              placeholder="Поиск по названию или описанию…"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              aria-label="Поиск партнёров"
            />
          </div>

          <div className={styles.grid} id="partners-catalog">
            {visible.length === 0 ? (
              <p className={styles.empty}>
                {query
                  ? "По вашему запросу партнёров не найдено."
                  : "Список партнёров пока пуст."}
              </p>
            ) : (
              visible.map((partner) => {
                const logoUrl = partner.image_path
                  ? resolveAssetUrl(partner.image_path)
                  : "";
                const initial = partner.title.trim().charAt(0).toUpperCase();

                return (
                  <article key={partner.id} className={styles.card}>
                    <div className={styles.cardLogo}>
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={`Логотип ${partner.title}`}
                          width={160}
                          height={48}
                        />
                      ) : (
                        <div className={styles.cardLogoPlaceholder} aria-hidden>
                          {initial}
                        </div>
                      )}
                    </div>
                    <h2 className={styles.cardTitle}>{partner.title}</h2>
                    {partner.description ? (
                      <p className={styles.cardDesc}>{partner.description}</p>
                    ) : null}
                  </article>
                );
              })
            )}
          </div>

          {hasMore && (
            <div className={styles.moreWrap}>
              <button
                type="button"
                className={styles.moreBtn}
                onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
              >
                Показать ещё
              </button>
            </div>
          )}

          {filtered.length > 0 && (
            <p className={styles.countNote}>
              Показано {Math.min(visibleCount, filtered.length)} из {filtered.length}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default PartnersPage;
