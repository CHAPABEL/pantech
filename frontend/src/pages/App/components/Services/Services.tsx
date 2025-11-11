import styles from "./Services.module.scss";

const dataList = [
  {
    urlImg: "images/services/audi.svg",
    mainText: "Аудит",
    discript:
      "Аудит информационных технологий с возможностью автоматизации бизнес-процессов компании",
  },

  {
    urlImg: "images/services/dev.svg",
    mainText: "Разработка",
    discript:
      "Проектирование и разработка ПО под ваши задачи, начиная со сбора требований и заканчивая обеспечением сопровождения IT решения",
  },

  {
    urlImg: "images/services/jira.svg",
    mainText: "Jira",
    discript:
      "Проектирование и разработка ПО под ваши задачи, начиная со сбора требований и заканчивая обеспечением сопровождения IT решения",
  },
];

type servProps = {
  prop: boolean;
  setProp: React.Dispatch<React.SetStateAction<boolean>>;
};
function Services({ setProp }: servProps) {
  return (
    <div className={styles.services}>
      {dataList.map((item, index) => (
        <div key={index} className={styles.services_container}>
          <div className={styles.container_leftSide}>
            <div className={styles.leftSide_imageCon}>
              <img
                src={item.urlImg}
                className={styles.imageCon_image}
                loading="lazy"
              />
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
              onClick={() => setProp(true)}
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
