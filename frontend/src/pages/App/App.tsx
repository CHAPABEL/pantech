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
                Интергатор - это про доверие
              </span>
              <span className={styles.textCon_discription}>
                Мы являемся разработчиком ПО, вдохновляемые потребностями
                общества! Вместе с этим, мы создаем решения для конкретных
                задач, которые нам ставят наши Заказчики
              </span>
            </div>
          </div>

          <img src="images/mainImage.png" className={styles.initial_image} />
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
        <span className={styles.footer_mnText}>Pan-Tech</span>
        <div className={styles.footer_linkCon}>
          <div className={styles.linkCon_links}>
            <a href="#" className={styles.leftSide_link}>
              Mobile app
            </a>
            <a href="#" className={styles.leftSide_link}>
              Community
            </a>
            <a href="#" className={styles.leftSide_link}>
              Company
            </a>
          </div>
          <div className={styles.linCon_center}>
            <a href="">
              <img
                src="images/mail.svg"
                className={styles.center_img}
                loading="lazy"
              />
            </a>
            <a href="">
              <img
                src="images/telega.svg"
                className={styles.center_img}
                loading="lazy"
              />
            </a>
          </div>
          <div className={styles.linkCon_links}>
            <a href="#" className={styles.links_link}>
              Help desk
            </a>
            <a href="#" className={styles.links_link}>
              Blog
            </a>
            <a href="#" className={styles.linsk_link}>
              Resources
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
