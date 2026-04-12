import module from "./Button.module.scss";
import type React from "react";

type ButtonProps = {
  children: React.ReactNode;
  Component: React.ElementType;
  status?: boolean;
  onClick?: () => void;
};

const Button = ({ children, Component, status, onClick }: ButtonProps) => {
  return (
    <label
      onClick={onClick}
      className={`${status === true ? module.buttonConActive : module.buttonCon}`}
    >
      <Component className={module.svg} />
      <button className={module.button}>{children}</button>
    </label>
  );
};

export default Button;
