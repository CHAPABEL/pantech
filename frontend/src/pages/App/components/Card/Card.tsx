import styles from "./Card.module.scss";
import { useRef } from "react";

const dataObject = [
  {
    mainText: "Pichta",
    discription:
      "Система построения индивидуальной траектории развития специалиста",
    stackPath: [
      "images/stack/python.svg",
      "images/stack/docker.svg",
      "images/stack/carbon.svg",
      "images/stack/fastapi.svg",
    ],
  },
  {
    mainText: "Brialin",
    discription: "Разработка сервиса знакомств Breolin, скоро будет анонс!",
    mainImg: "images/Brialin3.svg",
    stackPath: [
      "images/stack/python.svg",
      "images/stack/docker.svg",
      "images/stack/carbon.svg",
      "images/stack/fastapi.svg",
    ],
  },
];

type servProps = {
  prop: boolean;
  setProp: React.Dispatch<React.SetStateAction<boolean>>;
};

function Card({ setProp }: servProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // const handleScroll = () => {
  //   const container = containerRef.current;
  //   if (!container) return;

  //   const cardWidth = (container.firstChild as HTMLElement)?.offsetWidth || 0;

  //   container.scrollBy({
  //     left: cardWidth,
  //     behavior: "smooth",
  //   });
  // };
  return (
    <div className={styles.app_productCards}>
      <div className={styles.productCards_Container} ref={containerRef}>
        {dataObject.map((item, index) => (
          <div
            key={index}
            className={styles.cardCon}
            onClick={
              item.mainImg !== "images/Brialin3.svg"
                ? () => setProp(true)
                : undefined
            }
          >
            <div className={styles.cardCon_leftSide}>
              <img
                src={item.mainImg ? item.mainImg : "images/full.png"}
                alt=""
                className={`${
                  item.mainImg === "images/Brialin3.svg"
                    ? styles.leftSide_brialin
                    : styles.leftSide_image
                }`}
              />
            </div>
            <div className={styles.cardCon_textCon}>
              <span className={styles.textCon_mainText}>{item.mainText}</span>
              <span className={styles.textCon_disc}>{item.discription}</span>
              <div className={styles.textCon_stack}>
                <span className={styles.stack_mnText}>
                  Технологический стэк
                </span>
                <div className={styles.stack_logoCon}>
                  {item.stackPath.map((logo, index) => (
                    <img
                      key={index}
                      src={logo}
                      className={styles.stack_logos}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div key="item" className={styles.cardCon}>
          <div className={styles.cardCon_leftSide}>
            <img
              src="images/fullload.png"
              alt=""
              className={styles.leftSide_imageL}
            />
          </div>
          <div className={styles.cardCon_textCon}>
            <span className={styles.textCon_mainText}>Coming soon</span>
            <span className={styles.textCon_disc}>
              Разработка новых проектов в работе
            </span>
          </div>
        </div>
      </div>

      {/* <svg
        onClick={handleScroll}
        className={styles.arrow}
        viewBox="0 0 93 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0.5"
          y="0.5"
          width="92"
          height="279"
          rx="14.5"
          fill="#BFD9FF"
          stroke="#BFD9FF"
        />
        <path d="M62 140L26.75 249.985L26.75 30.0148L62 140Z" fill="#3075D8" />
        <rect
          x="42"
          y="31.2432"
          width="5"
          height="115.808"
          transform="rotate(-16.2845 42 31.2432)"
          fill="#3075D8"
        />
        <rect
          width="5"
          height="115.808"
          transform="matrix(-0.959881 -0.280406 -0.280406 0.959881 79.1523 139.243)"
          fill="#3075D8"
        />
      </svg> */}
    </div>
  );
}

export default Card;
