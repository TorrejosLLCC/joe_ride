import type { FC, ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  size?: "small" | "medium" | "large";
}

export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  size = "medium",
}) => {
  const className = `btn ${variant} ${size}`;
  
  return (
    <button 
      type={type}
      onClick={onClick} 
      className={className} 
      disabled={disabled}
    >
      {children}
    </button>
  );
};
