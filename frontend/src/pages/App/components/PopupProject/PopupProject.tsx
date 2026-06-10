import { useState, useEffect } from "react";
import styles from "./PopupProject.module.scss";
import { X } from "lucide-react";
import { useContent } from "../../../../contexts/ContentContext";

type servProps = {
  prop: boolean;
  setProp: React.Dispatch<React.SetStateAction<boolean>>;
  contentKey: string;
};

function PopupProject({ setProp, contentKey }: servProps) {
  const [closing, setClosing] = useState(false);
  const { t, json } = useContent();

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

  const title = t(`${contentKey}.title`, "pichta");
  const description = t(
    `${contentKey}.description`,
    "Система построения индивидуальной траектории развития специалиста.",
  );
  const task = t(
    `${contentKey}.task`,
    "Упростить процесс составления индивидуальной образовательной траектории.",
  );
  const realization = t(
    `${contentKey}.realization`,
    "Система использует данные с платформ, таких как hh.ru.",
  );
  const tech = json<string[]>(`${contentKey}.tech`, [
    "Python",
    "Docker",
    "FastAPI",
    "Графы",
  ]);
  const presentation = t(`${contentKey}.presentation_url`, "/pichta.pdf");
  const image = t(`${contentKey}.image`, "images/Pichta.png");

  return (
    <div
      className={`${styles.app_prod} ${closing ? styles.hide : styles.fadeOut}`}
    >
      <div className={styles.prod_conteiner}>
        <div className={styles.conteiner_left}>
          <img src={image} className={styles.left_img} alt={title} />
        </div>
        <div>
          <div className={styles.conteiner_right}>
            <div className={styles.textCon_top}>
              <div className={styles.top_main}>
                <span className={styles.main_mainText}>{title}</span>
                <X
                  className={styles.main_svg}
                  size="20px"
                  onClick={handleClose}
                />
              </div>
              <span className={styles.top_disc}>{description}</span>
            </div>
            <div className={styles.center}>
              <div className={styles.center_task}>
                <span className={styles.task_mainText}>ЗАДАЧА</span>
                <span className={styles.task_dics}>{task}</span>
              </div>
              <div className={styles.center_realisation}>
                <span className={styles.realisation_mainText}>РЕАЛИЗАЦИЯ</span>
                <span className={styles.realisation_dics}>{realization}</span>
              </div>
            </div>
            <div className={styles.bottom}>
              <div className={styles.bottom_technologies}>
                {tech.map((label) => (
                  <span key={label} className={styles.technologies_text}>
                    {label}
                  </span>
                ))}
              </div>
              <a
                href={presentation}
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
