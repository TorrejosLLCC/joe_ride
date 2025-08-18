import type { FC, ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
}) => {
  return (
    <button onClick={onClick} className={`btn ${variant}`} disabled={disabled}>
      {children}
    </button>
  );
};
