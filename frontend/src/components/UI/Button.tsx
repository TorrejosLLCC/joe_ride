import type { FC, ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  className,
}) => {
  return (
    <button 
      type={type}
      onClick={onClick} 
      className={`btn ${variant} ${className || ''}`} 
      disabled={disabled}
    >
      {children}
    </button>
  );
};
