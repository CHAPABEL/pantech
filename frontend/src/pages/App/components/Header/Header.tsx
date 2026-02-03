import styles from "./Header.module.scss";

type headProp = {
  setSelectedService: (service: string) => void;
};

function Header({ setSelectedService }: headProp) {
  return (
    <header className={styles.header}>
      <div className={styles.header_leftSide}>
        <a href="/">
          <img src="/images/Logo2.svg" className={styles.leftSide_Logo} />
        </a>
        <div className={styles.leftSide_buttonCon}>
          <a href="#" className={styles.buttonCon_link}>
            О нас
          </a>
          <a href="#products" className={styles.buttonCon_link}>
            Продукты
          </a>
          <a href="#services" className={styles.buttonCon_link}>
            Услуги
          </a>
          <a href="#projects" className={styles.buttonCon_link}>
            Проекты
          </a>
          <a href="#tech" className={styles.buttonCon_link}>
            Технологии
          </a>
        </div>
      </div>
      <div className={styles.header_rightSide}>
        <div className={styles.rightSide_LinkCon}>
          <a
            href="mailto:pochtadlyasvazi@gmail.com"
            className={styles.Linkcon_adress}
          >
            info@pan-tech.ru
          </a>
        </div>
        <button
          className={styles.rightSide_Contact}
          onClick={() => setSelectedService("Не указано")}
        >
          Связаться с нами
        </button>
      </div>
    </header>
  );
}

export default Header;
