import { useCallback, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useApiList } from "../../../../hooks/useApiList";
import type { PartnerItem } from "../../../../services/types";
import { resolveAssetUrl } from "../../../../services/assets";
import styles from "./Partners.module.scss";

type SlideDirection = "next" | "prev" | null;

type PartnerView = {
  id: number;
  name: string;
  description: string;
  logo: string;
};

const FALLBACK_RAW: PartnerItem[] = [
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

function toView(items: PartnerItem[]): PartnerView[] {
  return items.map((p) => ({
    id: p.id,
    name: p.title,
    description: p.description,
    logo: p.image_path || "",
  }));
}

function getVisible(partners: PartnerView[], active: number, total: number) {
  const prev = (active - 1 + total) % total;
  const next = (active + 1) % total;
  return [
    { partner: partners[prev], index: prev, slot: "left" as const },
    { partner: partners[active], index: active, slot: "center" as const },
    { partner: partners[next], index: next, slot: "right" as const },
  ];
}

function Partners() {
  const apiItems = useApiList<PartnerItem>("/partners", FALLBACK_RAW);
  const partners = useMemo(() => toView(apiItems), [apiItems]);

  const [active, setActive] = useState(0);
  const [slide, setSlide] = useState<SlideDirection>(null);
  const [animating, setAnimating] = useState(false);
  const total = partners.length;
  const safeActive = total > 0 ? active % total : 0;
  const visible = total > 0 ? getVisible(partners, safeActive, total) : [];

  const finishSlide = useCallback(() => {
    setSlide(null);
    setAnimating(false);
  }, []);

  const goTo = useCallback(
    (index: number, direction: SlideDirection) => {
      if (total === 0 || index === safeActive || animating || !direction) return;
      setAnimating(true);
      setSlide(direction);
      setActive(index);
    },
    [safeActive, animating, total],
  );

  const goPrev = useCallback(() => {
    if (total === 0) return;
    goTo((safeActive - 1 + total) % total, "prev");
  }, [safeActive, goTo, total]);

  const goNext = useCallback(() => {
    if (total === 0) return;
    goTo((safeActive + 1) % total, "next");
  }, [safeActive, goTo, total]);

  const cardAnimClass = (slot: "left" | "center" | "right") => {
    if (!slide) return "";
    if (slide === "next") {
      if (slot === "left") return styles.cardToLeft;
      if (slot === "center") return styles.cardToCenter;
      return styles.cardFromRight;
    }
    if (slot === "right") return styles.cardToRight;
    if (slot === "center") return styles.cardToCenterRev;
    return styles.cardFromLeft;
  };

  if (total === 0) {
    return (
      <section className={styles.partners} aria-label="Партнёры">
        <p className={styles.empty}>Партнёры пока не добавлены</p>
      </section>
    );
  }

  return (
    <section className={styles.partners} aria-label="Партнёры">
      <div className={styles.slider}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={goPrev}
          disabled={animating || total < 2}
          aria-label="Предыдущий партнёр"
        >
          <ChevronLeft size={28} strokeWidth={2} />
        </button>

        <div className={styles.viewport}>
          <div className={styles.track}>
            {visible.map(({ partner, index, slot }) => (
              <article
                key={`${partner.id}-${slot}`}
                className={[
                  styles.card,
                  slot === "center" ? styles.cardCenter : styles.cardSide,
                  cardAnimClass(slot),
                ]
                  .filter(Boolean)
                  .join(" ")}
                onAnimationEnd={
                  slot === "center" && slide
                    ? (e) => {
                        if (e.target === e.currentTarget) finishSlide();
                      }
                    : undefined
                }
                onClick={() => {
                  if (slot === "left") goTo(index, "prev");
                  else if (slot === "right") goTo(index, "next");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (slot === "left") goTo(index, "prev");
                    else if (slot === "right") goTo(index, "next");
                  }
                }}
                role="button"
                tabIndex={slot === "center" ? -1 : 0}
                aria-current={slot === "center" ? "true" : undefined}
              >
                {partner.logo ? (
                  <img
                    src={resolveAssetUrl(partner.logo)}
                    alt={`Логотип ${partner.name}`}
                    className={styles.logo}
                    width={64}
                    height={64}
                  />
                ) : null}
                <h3 className={styles.name}>{partner.name}</h3>
                <p className={styles.description}>{partner.description}</p>
              </article>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={styles.navBtn}
          onClick={goNext}
          disabled={animating || total < 2}
          aria-label="Следующий партнёр"
        >
          <ChevronRight size={28} strokeWidth={2} />
        </button>
      </div>

      {total > 1 && (
        <div className={styles.dots} role="tablist" aria-label="Выбор партнёра">
          {partners.map((partner, index) => (
            <button
              key={partner.id}
              type="button"
              role="tab"
              aria-selected={index === safeActive}
              aria-label={partner.name}
              disabled={animating}
              className={[
                styles.dot,
                index === safeActive && styles.dotActive,
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                const dir =
                  index === (safeActive + 1) % total
                    ? "next"
                    : index === (safeActive - 1 + total) % total
                      ? "prev"
                      : index > safeActive
                        ? "next"
                        : "prev";
                goTo(index, dir);
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Partners;
