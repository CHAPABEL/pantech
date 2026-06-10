import styles from "./PartnersPageHeader.module.scss";

type Props = {
  email?: string;
};

function PartnersPageHeader({ email = "info@pan-tech.ru" }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <a href="/" className={styles.logoLink}>
          <img src="/images/Logo2.svg" alt="Pantech" className={styles.logo} />
        </a>
        <nav className={styles.nav} aria-label="Основная навигация">
          <a href="/" className={styles.navLink}>
            Главная
          </a>
          <a href="/partners" className={`${styles.navLink} ${styles.navLinkActive}`}>
            Партнёры
          </a>
        </nav>
      </div>
      <div className={styles.right}>
        <a href={`mailto:${email}`} className={styles.email}>
          {email}
        </a>
        <a href="/#services" className={styles.cta}>
          Связаться с нами
        </a>
      </div>
    </header>
  );
}

export default PartnersPageHeader;
