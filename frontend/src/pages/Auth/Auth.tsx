import module from "./Auth.module.scss";
import Seo from "../../components/Seo/Seo";
import { EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ApiError } from "../../services/api";

const Auth = () => {
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, loading, login: doLogin } = useAuth();

  useEffect(() => {
    if (!loading && user) navigate("/a", { replace: true });
  }, [loading, user, navigate]);

  const handleAuth = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await doLogin(login, password);
      navigate("/a", { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Неверный логин или пароль");
      } else {
        setError("Не удалось войти. Попробуйте позже.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={module.main}>
      <Seo
        title="Вход в админ-панель"
        description="Авторизация администратора Pantech."
        path="/in"
        noindex
      />
      <div className={module.main__top}>
        <img
          src="/images/Logo2.svg"
          alt="Pantech"
          className={module.main__topImg}
          width={70}
          height={70}
        />
        <div className={module.main__topLine}>
          <span className={module.main__topSpan}>Pan-tech </span>
        </div>
      </div>
      <div className={module.auth}>
        <span className={module.auth__authSpan}>Admin panel</span>
        <div className={module.auth__authDiv}>
          <input
            className={module.auth__authInput}
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            autoComplete="username"
          />
          <label className={module.auth__authLabel}>
            <input
              className={module.auth__authInputPass}
              placeholder="Password"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleAuth();
              }}
            />
            <EyeOff
              className={module.auth__authEye}
              onClick={() => setShowPass(!showPass)}
            />
          </label>
        </div>
        {error && (
          <span style={{ color: "#d83030", fontSize: 14 }}>{error}</span>
        )}
        <button
          className={module.auth__button}
          onClick={handleAuth}
          disabled={submitting || !login || !password}
        >
          {submitting ? "Входим…" : "Sign in"}
        </button>
      </div>
    </main>
  );
};

export default Auth;
