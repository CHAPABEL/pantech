import styles from "./Card.module.scss";
import { useRef } from "react";
import { useApiList } from "../../../../hooks/useApiList";
import type { CardItem } from "../../../../services/types";
import { resolveAssetUrl } from "../../../../services/assets";

const FALLBACK: CardItem[] = [
  {
    id: -1,
    title: "Pichta",
    description:
      "Система построения индивидуальной траектории развития специалиста.",
    image_path: "images/full.png",
    stack: [
      "images/stack/python.svg",
      "images/stack/docker.svg",
      "images/stack/carbon.svg",
      "images/stack/fastapi.svg",
    ],
    is_clickable: true,
    popup_content_key: "popup_project.pichta",
    position: 0,
    is_published: true,
  },
  {
    id: -2,
    title: "Breolin",
    description: "Разработка сервиса знакомств Breolin, скоро будет анонс!",
    image_path: "images/Brialin3.svg",
    stack: [],
    is_clickable: false,
    popup_content_key: null,
    position: 1,
    is_published: true,
  },
];

const BREOLIN_IMG = "images/Brialin3.svg";

type CardProps = {
  onOpenProject?: (contentKey: string | null) => void;
};

function Card({ onOpenProject }: CardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const items = useApiList<CardItem>("/cards", FALLBACK);

  return (
    <div className={styles.app_productCards}>
      <div className={styles.productCards_Container} ref={containerRef}>
        {items.map((item) => {
          const img = resolveAssetUrl(item.image_path || "images/full.png");
          const isBrialin = img === BREOLIN_IMG;
          return (
            <div
              key={item.id}
              className={styles.cardCon}
              onClick={
                item.is_clickable && onOpenProject
                  ? () => onOpenProject(item.popup_content_key)
                  : undefined
              }
            >
              <div className={styles.cardCon_leftSide}>
                <img
                  src={img}
                  alt={item.title}
                  className={
                    isBrialin ? styles.leftSide_brialin : styles.leftSide_image
                  }
                />
              </div>
              <div className={styles.cardCon_textCon}>
                <span className={styles.textCon_mainText}>{item.title}</span>
                <span className={styles.textCon_disc}>{item.description}</span>
                {item.stack.length > 0 ? (
                  <div className={styles.textCon_stack}>
                    <span className={styles.stack_mnText}>
                      Технологический стэк
                    </span>
                    <div className={styles.stack_logoCon}>
                      {item.stack.map((logo, idx) => (
                        <img
                          key={`${item.id}-${idx}`}
                          src={resolveAssetUrl(logo)}
                          className={styles.stack_logos}
                          alt={`Stack logo ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Card;
