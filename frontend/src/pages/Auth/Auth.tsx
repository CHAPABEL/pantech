import module from "./Auth.module.scss";
import { EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Auth = () => {
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");
  const navigate = useNavigate();

  const handleAuth = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth_in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });

      if (response.ok) {
        navigate("/a");
      } else {
        alert("Invalid login or password");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  return (
    <main className={module.main}>
      <div className={module.main__top}>
        <img
          src="/images/Logo2.svg"
          alt="logo"
          className={module.main__topImg}
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
          />
          <label className={module.auth__authLabel}>
            <input
              className={module.auth__authInputPass}
              placeholder="Password"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <EyeOff
              className={module.auth__authEye}
              onClick={() => setShowPass(!showPass)}
            />
          </label>
        </div>
        <button className={module.auth__button} onClick={handleAuth}>
          Sign in
        </button>
      </div>
    </main>
  );
};

export default Auth;
