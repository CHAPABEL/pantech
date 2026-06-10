import styles from "./Header.module.scss";
import { useContent } from "../../../../contexts/ContentContext";

type headProp = {
  setSelectedService: (service: string) => void;
};

function Header({ setSelectedService }: headProp) {
  const { t } = useContent();
  const email = t("header.email", "info@pan-tech.ru");
  return (
    <header className={styles.header}>
      <div className={styles.header_leftSide}>
        <a href="/">
          <img
            src="/images/Logo2.svg"
            className={styles.leftSide_Logo}
            alt="Pantech — на главную"
            width={42}
            height={42}
          />
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
          <a href={`mailto:${email}`} className={styles.Linkcon_adress}>
            {email}
          </a>
        </div>
        <button
          className={styles.rightSide_Contact}
          onClick={() => setSelectedService("Не указано")}
        >
          {t("header.contact_btn", "Связаться с нами")}
        </button>
      </div>
    </header>
  );
}

export default Header;
