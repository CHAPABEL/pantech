import React, { useState, useEffect } from "react";
import styles from "./PopupProject.module.scss";
import { X } from "lucide-react";

type servProps = {
  prop: boolean;
  setProp: React.Dispatch<React.SetStateAction<boolean>>;
};

function PopupProject({ setProp }: servProps) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setProp(false);
    }, 300);
  };
  return (
    <div
      className={`${styles.app_prod} ${closing ? styles.hide : styles.fadeOut}`}
    >
      <div className={styles.prod_conteiner}>
        <div className={styles.conteiner_left}>
          <img
            src="images/Pichta.png"
            className={styles.left_img}
            alt="image of produnct"
          />
        </div>
        <div>
          <div className={styles.conteiner_right}>
            <div className={styles.textCon_top}>
              <div className={styles.top_main}>
                <span className={styles.main_mainText}>pichta</span>
                <X
                  className={styles.main_svg}
                  size="20px"
                  onClick={handleClose}
                  // onClick={handleClose}
                />
              </div>
              <span className={styles.top_disc}>
                Система построения индивидуальной траектории развития
                специалиста, которая помогает студентам понять, какие навыки у
                них уже есть, а какие необходимо развить для достижения
                профессиональных целей.
              </span>
            </div>
            <div className={styles.center}>
              <div className={styles.center_task}>
                <span className={styles.task_mainText}>ЗАДАЧА</span>
                <span className={styles.task_dics}>
                  Упростить процесс составления индивидуальной образовательной
                  траектории и помочь пользователям соответствовать требованиям
                  современного рынка труда.
                </span>
              </div>
              <div className={styles.center_realisation}>
                <span className={styles.realisation_mainText}>РЕАЛИЗАЦИЯ</span>
                <span className={styles.realisation_dics}>
                  Система использует данные с платформ, таких как hh.ru, чтобы
                  сравнивать навыки пользователей с актуальными требованиями
                  работодателей.
                </span>
              </div>
            </div>
            <div className={styles.bottom}>
              <div className={styles.bottom_technologies}>
                <span className={styles.technologies_text}>Python</span>
                <span className={styles.technologies_text}>Docker</span>
                <span className={styles.technologies_text}>FastAPI</span>
                <span className={styles.technologies_text}>Графы</span>
              </div>
              <a
                href="public/images/pichta.pdf"
                target="_blank"
                className={styles.bottom_pres}
              >
                Презентация продукта
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PopupProject;
