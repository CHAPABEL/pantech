import styles from "./Projects.module.scss";

const data = [
  {
    imgSrc: "images/projects/bgCover1.png",
    mainText: "Автоматизация бизнес-процессов Порта",
    bottomText:
      "Был проведён аудит существующих систем, аудит процессов обработки информации в Компании и были сформированы рекомендации по оптимизации ключевых бизнес-процессов",
  },
  {
    imgSrc: "images/projects/bgCover2.png",
    mainText:
      "Создание программно-аппаратного комплекса для мониторинга состояния груза",
    bottomText:
      "Создание комплексного решения для контроля температурно-влажностных показателей груза во время перевозки и хранения.",
  },
  {
    imgSrc: "images/projects/bgCover3.png",
    mainText:
      "Создание программного-аппаратного комплекса для строительного концерна",
    bottomText:
      "Создание ПО для проверки соответствия нормам требований по безопасности труда и контролю сроков обеспечения стройки подрядчиками.",
  },
];

function Projects() {
  return (
    <div className={styles.projects_container}>
      {data.map((item, index) => (
        <div key={index} className={styles.container_card}>
          <div className={styles.card_topSide}>
            <img
              className={styles.topSide_img}
              src={item.imgSrc}
              loading="lazy"
              alt="Компонент проекта"
            />
          </div>
          <div className={styles.card_cardInfo}>
            <div className={styles.cardInfo_textCon}>
              <span className={styles.textCon_mainText}>{item.mainText}</span>
              <span className={styles.textCon_discription}>
                {item.bottomText}
              </span>
            </div>
            <div className={styles.cardInfo_bottomSide}>
              {/* <button className={styles.bottomSide_btn}>Подробнее</button> */}
              <div className={styles.bottomSide_stack}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Projects;
