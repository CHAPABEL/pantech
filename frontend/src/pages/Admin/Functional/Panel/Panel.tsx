import module from "./Panel.module.scss";
import Card from "../../components/Card/Card";
import Projects from "../../components/Projects/Projects";
import Services from "../../components/Services/Services";

const dataArray = [
  {
    text: "Карточки продуктов",
    component: Card,
  },
  {
    text: "Услуги",
    component: Services,
  },
  {
    text: "Проекты",
    component: Projects,
  },
];

const Panel = () => {
  return (
    <section className={module.main_panel}>
      {dataArray.map((item, index) => {
        const ItemComponent = item.component;

        return (
          <div key={index} className={module.panel__change}>
            <span className={module.change_text}>{item.text}</span>
            <ItemComponent key={index} />
          </div>
        );
      })}
    </section>
  );
};

export default Panel;
