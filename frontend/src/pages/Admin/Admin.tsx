import module from "./Admin.module.scss";
import Button from "./components/Button/Button";
import { Command, Mail, User } from "lucide-react";
import Panel from "./Functional/Panel/Panel";
import { useState } from "react";
const arrayMap = [
  {
    name: "Компоненты",
    component: Command,
    status: false,
    route: "/",
  },
  {
    name: "Письма",
    component: Mail,
    status: false,
    route: "/",
  },
  {
    name: "Пользователи",
    component: User,
    status: false,
    route: "/",
  },
];

const Admin = () => {
  const [activeButton, setActiveButton] = useState<number | null>(null);

  return (
    <main className={module.main}>
      <div className={module.main__leftSide}>
        <div>
          <div className={module.main__leftSideTop}>
            <img
              src="/images/Logo2.svg"
              alt="logo"
              className={module.main__leftSideTopImg}
            />
            <span className={module.main__leftSideTopSpan}>Pan-tech</span>
          </div>

          <div className={module.main__leftSideContent}>
            <div className={module.main__topLine}></div>
            {arrayMap.map((item, index) => (
              <Button
                onClick={() => setActiveButton(index)}
                status={activeButton === index}
                Component={item.component}
                key={index}
              >
                {item.name}
              </Button>
            ))}
          </div>
        </div>
        <div className={module.main__bottomLine}>
          <button className={module.main__bottomButton}>Выйти</button>
        </div>
      </div>
      <div className={module.main__rightSide}>
        <Panel />
      </div>
    </main>
  );
};

export default Admin;
