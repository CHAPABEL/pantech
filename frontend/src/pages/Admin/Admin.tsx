import module from "./Admin.module.scss";
import Button from "./components/Button/Button";
import { Command, LayoutDashboard, LogOut, Mail } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Seo from "../../components/Seo/Seo";

const navItems = [
  { name: "Главная", icon: LayoutDashboard, to: "/a", end: true },
  { name: "Почта", icon: Mail, to: "/a/mail" },
  { name: "Контент", icon: Command, to: "/a/content" },
];

const Admin = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/in", { replace: true });
  };

  return (
    <main className={module.main}>
      <Seo
        title="Админ-панель"
        description="Управление контентом сайта Pantech."
        path="/a"
        noindex
      />
      <aside className={module.main__leftSide}>
        <div>
          <div className={module.main__leftSideTop}>
            <img
              src="/images/Logo2.svg"
              alt="logo"
              className={module.main__leftSideTopImg}
            />
            <span className={module.main__leftSideTopSpan}>Pan-tech</span>
          </div>

          <nav className={module.main__leftSideContent}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? "active-nav" : "")}
              >
                {({ isActive }) => (
                  <Button Component={item.icon} status={isActive}>
                    {item.name}
                  </Button>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className={module.main__bottomLine}>
          <button
            className={module.main__bottomButton}
            onClick={handleLogout}
            type="button"
          >
            <LogOut size={20} style={{ verticalAlign: "middle" }} /> Выйти
          </button>
        </div>
      </aside>
      <section className={module.main__rightSide}>
        <Outlet />
      </section>
    </main>
  );
};

export default Admin;
