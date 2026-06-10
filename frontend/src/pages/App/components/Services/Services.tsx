import styles from "./Services.module.scss";
import { useApiList } from "../../../../hooks/useApiList";
import type { ServiceItem } from "../../../../services/types";
import { resolveAssetUrl } from "../../../../services/assets";

const FALLBACK: ServiceItem[] = [
  {
    id: -1,
    title: "ИТ/ИБ Аудит",
    description:
      "Профессиональный аудит ИТ-инфраструктуры и кибербезопасности с разработкой дорожной карты по автоматизации ключевых бизнес-процессов для роста эффективности и безопасности вашей компании.",
    image_path: "images/services/audi.svg",
    position: 0,
    is_published: true,
  },
  {
    id: -2,
    title: "Искусственный интеллект",
    description:
      "Экспертный аудит по интеграции ИИ-решений в компанию: проанализируем данные, процессы и инфраструктуру, построим пошаговую стратегию внедрения решений с использованием технологий искусственного интеллекта для оптимизации бизнес-процессов компании.",
    image_path: "images/services/Ai.png",
    position: 1,
    is_published: true,
  },
  {
    id: -3,
    title: "Разработка",
    description:
      "Проектирование и разработка ПО под ключ: от глубокого анализа бизнес-процессов и сбора требований до создания, внедрения и постоянного сопровождения IT решения.",
    image_path: "images/services/dev.svg",
    position: 2,
    is_published: true,
  },
  {
    id: -4,
    title: "Jira",
    description:
      "Внедряем и поддерживаем ITSM/ESM-системы на базе Atlassian, автоматизируя рабочие процессы IT, HR, финансов и других отделов под задачи малого, среднего и крупного бизнеса.",
    image_path: "images/services/jira.svg",
    position: 3,
    is_published: true,
  },
];

type servProps = {
  setSelectedService: (service: string) => void;
};

function Services({ setSelectedService }: servProps) {
  const items = useApiList<ServiceItem>("/services", FALLBACK);

  return (
    <div className={styles.services}>
      {items.map((item) => (
        <div key={item.id} className={styles.services_container}>
          <div className={styles.container_leftSide}>
            <div className={styles.leftSide_imageCon}>
              {item.image_path && (
                <img
                  src={resolveAssetUrl(item.image_path)}
                  className={styles.imageCon_image}
                  alt={item.title}
                />
              )}
            </div>
            <div className={styles.leftSide_textCon}>
              <span className={styles.textCon_mainText}>{item.title}</span>
              <span className={styles.textCon_discription}>
                {item.description}
              </span>
            </div>
          </div>
          <div className={styles.container_buttonCon}>
            <button
              onClick={() => setSelectedService(item.title)}
              className={styles.buttonCon_button}
            >
              Выбрать услугу
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Services;
