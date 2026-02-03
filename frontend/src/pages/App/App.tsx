import styles from "./App.module.scss";
import Header from "./components/Header/Header";
import Card from "./components/Card/Card";
import Services from "./components/Services/Services";
import Projects from "./components/Projects/Projects";
import Tech from "./components/Tech/Tech";
import PopupSend from "./components/PopupSend/PopupSend";
import PopupProject from "./components/PopupProject/PopupProject";
import { Helmet } from "react-helmet";
import { useState } from "react";
function App() {
  const [state, setState] = useState(false);
  const [projectPopup, setProjectPopup] = useState(false);
  const [selectedServ, setSelectedServ] = useState<string>("");

  const handleSelectService = (service: string) => {
    setSelectedServ(service);
    setState(true);
    console.log("Selected service:", service);
  };

  return (
    <>
      <Helmet>
        <title>Pantech — интегратор IT-решений и разработка ПО"</title>
        <meta
          name="description"
          content="Мы создаём IT-решения и проекты под ключ, вдохновляясь потребностями общества и задачами наших клиентов."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
      <Header setSelectedService={handleSelectService} />
      <main className={styles.app_main}>
        <section className={styles.main_initial}>
          <div className={styles.initial_textCon}>
            <div className={styles.textCon_mainText}>
              <span className={styles.mainText_Pan}>Pan</span>
              <span className={styles.mainText_tech}>-Tech</span>
            </div>
            <div className={styles.textCon_discriptionCon}>
              <span className={styles.textCon_slogan}>
                Интергатор - это про доверие!
              </span>
              <span className={styles.textCon_discription}>
                Мы являемся разработчиком ПО, вдохновляемые потребностями
                общества! Вместе с этим, мы создаем решения для конкретных
                задач, которые нам ставят наши Заказчики
              </span>
            </div>
          </div>

          <img
            src="images/mainImage.png"
            className={styles.initial_image}
            alt="Главное изображение"
          />
        </section>
        <section className={styles.main_content}>
          <div id="products" className={styles.main_productCards}>
            <span className={styles.productCards_maintext}>Наши продукты</span>
            <Card prop={projectPopup} setProp={setProjectPopup} />
          </div>
          <div id="services" className={styles.main_services}>
            <span className={styles.services_maintext}>Наши услуги</span>
            <Services setSelectedService={handleSelectService} />
          </div>
          <div id="projects" className={styles.main_projects}>
            <span className={styles.projects_maintext}>Наши проекты</span>
            <Projects />
          </div>
          <div id="tech" className={styles.main_tech}>
            <span className={styles.tech_maintext}>Технологии</span>
            <Tech />
          </div>
        </section>
        {projectPopup && (
          <PopupProject prop={projectPopup} setProp={setProjectPopup} />
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
        {/* <img src="/images/Logo.svg" className={styles.footer_Logo} /> */}
        <span className={styles.footer_contakt}>Контакты</span>
        <div className={styles.footer_linkCon}>
          <div className={styles.linCon_linksStay}>
            <span className={styles.linksStay_span}>Телефон</span>
            <a href="#" className={styles.leftSide_link}>
              +7 (495) 211-00-07
            </a>
          </div>
          <div className={styles.linCon_linksStay}>
            <span className={styles.linksStay_span}>Телефон</span>
            <a href="#" className={styles.leftSide_link}>
              info@pan-tech.ru
            </a>
          </div>
          <div className={styles.linCon_linksStay}>
            <span className={styles.linksStay_span}>Телефон</span>
            <a href="#" className={styles.leftSide_link}>
              123100, Город Москва, ул Мантулинская, дом 16, помещение 2Ц
            </a>
          </div>
        </div>
        <span className={styles.footer_copyright}>
          © 2025г. Политика конфиденциальности ООО «ВСЕ ТЕХНОЛОГИИ» ИНН
          9703209450 ОГРН 1257700165250
        </span>
      </footer>
    </>
  );
}

export default App;
