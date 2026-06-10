import styles from "./App.module.scss";
import Header from "./components/Header/Header";
import Card from "./components/Card/Card";
import Services from "./components/Services/Services";
import Projects from "./components/Projects/Projects";
import Tech from "./components/Tech/Tech";
import Partners from "./components/Partners/Partners";
import PopupSend from "./components/PopupSend/PopupSend";
import PopupProject from "./components/PopupProject/PopupProject";
import { useState } from "react";
import { useContent } from "../../contexts/ContentContext";
import Seo from "../../components/Seo/Seo";

function App() {
  const [state, setState] = useState(false);
  const [projectPopup, setProjectPopup] = useState(false);
  const [selectedServ, setSelectedServ] = useState<string>("");
  const [popupKey, setPopupKey] = useState<string | null>(null);
  const { t } = useContent();

  const handleSelectService = (service: string) => {
    setSelectedServ(service);
    setState(true);
  };

  const handleOpenProject = (key: string | null) => {
    if (!key) return;
    setPopupKey(key);
    setProjectPopup(true);
  };

  return (
    <>
      <Seo
        title="Pantech — интегратор IT-решений и разработка ПО"
        description="Pantech: разработка ПО, IT-аудит, внедрение облачных и корпоративных систем, машинное обучение и сопровождение проектов под ключ."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Pantech",
          url: typeof window !== "undefined" ? window.location.origin : undefined,
          logo: `${typeof window !== "undefined" ? window.location.origin : ""}/images/Logo2.svg`,
          description:
            "Интегратор IT-решений: разработка ПО, аудит инфраструктуры и внедрение технологий для бизнеса.",
          email: "info@pan-tech.ru",
        }}
      />
      <Header setSelectedService={handleSelectService} />
      <main className={styles.app_main}>
        <section className={styles.main_initial}>
          <div className={styles.initial_textCon}>
            <div className={styles.textCon_mainText}>
              <span className={styles.mainText_Pan}>{t("hero.title.pan", "Pan")}</span>
              <span className={styles.mainText_tech}>{t("hero.title.tech", "-Tech")}</span>
            </div>
            <div className={styles.textCon_discriptionCon}>
              <span className={styles.textCon_slogan}>
                {t("hero.slogan", "Интегратор — это про доверие!")}
              </span>
              <span className={styles.textCon_discription}>
                {t(
                  "hero.description",
                  "Мы делаем ставку на компетенции своих сотрудников и высокое качество работы. Команда компании решает задачи любого масштаба для наших заказчиков.",
                )}
              </span>
            </div>
          </div>

          <img
            src="images/mainImage.png"
            className={styles.initial_image}
            alt="Pantech — интегратор IT-решений и разработка программного обеспечения"
            width={800}
            height={600}
            fetchPriority="high"
          />
        </section>
        <section className={styles.main_content}>
          <div id="products" className={styles.main_productCards}>
            <span className={styles.productCards_maintext}>
              {t("section.products.title", "Наши продукты")}
            </span>
            <Card onOpenProject={handleOpenProject} />
          </div>
          <div id="services" className={styles.main_services}>
            <span className={styles.services_maintext}>
              {t("section.services.title", "Наши услуги")}
            </span>
            <Services setSelectedService={handleSelectService} />
          </div>
          <div id="projects" className={styles.main_projects}>
            <span className={styles.projects_maintext}>
              {t("section.projects.title", "Наши проекты")}
            </span>
            <Projects />
          </div>
          <div id="tech" className={styles.main_tech}>
            <span className={styles.tech_maintext}>
              {t("section.tech.title", "Технологии")}
            </span>
            <Tech />
          </div>
          <div id="partners" className={styles.main_partners}>
            <span className={styles.partners_maintext}>
              {t("section.partners.title", "Партнеры")}
            </span>
            <Partners />
          </div>
        </section>
        {projectPopup && popupKey && (
          <PopupProject
            contentKey={popupKey}
            prop={projectPopup}
            setProp={setProjectPopup}
          />
        )}
        {state && selectedServ && (
          <PopupSend
            selectedService={selectedServ}
            prop={state}
            setProp={setState}
          />
        )}
      </main>
      <footer className={styles.footer}>
        <div className={styles.footer_linkCon}>
          <div className={styles.linCon_linksStay}>
            <span className={styles.linksStay_span}>
              {t("footer.contacts.title", "Контакты")}
            </span>
            <a href="#" className={styles.leftSide_link}>
              {t("footer.contacts.phone", "+7 (495) 211-00-07")}
            </a>
            <a href="#" className={styles.leftSide_link}>
              {t("footer.contacts.email", "info@pan-tech.ru")}
            </a>
          </div>
          <div className={styles.linCon_linksStay}>
            <span className={styles.linksStay_span}>
              {t("footer.address.title", "Адрес")}
            </span>
            <a href="#" className={styles.leftSide_link}>
              {t(
                "footer.address.value",
                "123100, г. Москва, ул. Мантулинская, дом 16, помещение 2Ц",
              )}
            </a>
          </div>
        </div>
        <span className={styles.footer_copyright}>
          {t(
            "footer.copyright",
            "© 2026г. Политика конфиденциальности ООО «ВСЕ ТЕХНОЛОГИИ» ИНН 9703209450 ОГРН 1257700165250",
          )}
        </span>
      </footer>
    </>
  );
}

export default App;
