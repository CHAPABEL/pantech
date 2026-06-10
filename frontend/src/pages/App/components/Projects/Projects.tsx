import styles from "./Projects.module.scss";
import { useApiList } from "../../../../hooks/useApiList";
import type { ProjectItem } from "../../../../services/types";
import { resolveAssetUrl } from "../../../../services/assets";

const FALLBACK: ProjectItem[] = [
  {
    id: -1,
    title: "Автоматизация бизнес-процессов Порта",
    description:
      "Был проведён аудит существующих систем, аудит процессов обработки информации в Компании и были сформированы рекомендации по оптимизации ключевых бизнес-процессов.",
    image_path: "images/projects/bgCover1.png",
    position: 0,
    is_published: true,
  },
  {
    id: -2,
    title:
      "Создание программно-аппаратного комплекса для мониторинга состояния груза",
    description:
      "Создание комплексного решения для контроля температурно-влажностных показателей груза во время перевозки и хранения.",
    image_path: "images/projects/bgCover2.png",
    position: 1,
    is_published: true,
  },
  {
    id: -3,
    title:
      "Создание программно-аппаратного комплекса для строительного концерна",
    description:
      "Создание ПО для проверки соответствия нормам требований по безопасности труда и контролю сроков обеспечения стройки подрядчиками.",
    image_path: "images/projects/bgCover3.png",
    position: 2,
    is_published: true,
  },
];

function Projects() {
  const items = useApiList<ProjectItem>("/projects", FALLBACK);

  return (
    <div className={styles.projects_container}>
      {items.map((item) => (
        <div key={item.id} className={styles.container_card}>
          <div className={styles.card_topSide}>
            {item.image_path && (
              <img
                className={styles.topSide_img}
                src={resolveAssetUrl(item.image_path)}
                alt={item.title}
              />
            )}
          </div>
          <div className={styles.card_cardInfo}>
            <div className={styles.cardInfo_textCon}>
              <span className={styles.textCon_mainText}>{item.title}</span>
              <span className={styles.textCon_discription}>
                {item.description}
              </span>
            </div>
            <div className={styles.cardInfo_bottomSide}>
              <div className={styles.bottomSide_stack}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Projects;
