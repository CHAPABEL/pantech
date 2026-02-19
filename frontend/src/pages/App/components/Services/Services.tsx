import styles from "./Services.module.scss";

const dataList = [
  {
    urlImg: "images/services/audi.svg",
    mainText: "ИТ/ИБ Аудит",
    discript:
      "Профессиональный аудит ИТ-инфраструктуры и кибербезопасности с разработкой дорожной карты по автоматизации ключевых бизнес-процессов для роста эффективности и безопасности вашей компании.",
  },
  {
    urlImg: "images/services/Ai.png",
    mainText: "Искусственный интелект",
    discript:
      "Экспертный аудит по интеграции ИИ-решений в компанию: проанализируем данные, процессы и инфраструктуру,  построим пошаговую стратегию внедрения решений с использованием технологий искуственного интеллекта для оптимизации бизнес-процессов компании.",
  },

  {
    urlImg: "images/services/dev.svg",
    mainText: "Разработка",
    discript:
      "Проектирование и разработка ПО под ключ: от глубокого анализа бизнес-процессов и сбора требований до создания, внедрения и постоянного сопровождения IT решения.",
  },

  {
    urlImg: "images/services/jira.svg",
    mainText: "Jira",
    discript:
      "Внедряем и поддерживаем ITSM/ESM-системы на базе Atlassian, автоматизируя рабочие процессы IT, HR, финансов и других отделов под задачи малого среднего и крупного бизнеса.",
  },
];

type servProps = {
  setSelectedService: (service: string) => void;
};

function Services({ setSelectedService }: servProps) {
  return (
    <div className={styles.services}>
      {dataList.map((item, index) => (
        <div key={index} className={styles.services_container}>
          <div className={styles.container_leftSide}>
            <div className={styles.leftSide_imageCon}>
              <img src={item.urlImg} className={styles.imageCon_image} />
            </div>
            <div className={styles.leftSide_textCon}>
              <span className={styles.textCon_mainText}>{item.mainText}</span>
              <span className={styles.textCon_discription}>
                {item.discript}
              </span>
            </div>
          </div>
          <div className={styles.container_buttonCon}>
            <button
              onClick={() => {
                setSelectedService(item.mainText);
              }}
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
