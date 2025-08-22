import type { ChangeEvent, FC } from "react";

interface InputProps {
  required?: boolean;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
}

export const Input: FC<InputProps> = ({
  required = true,
  type = "text",
  placeholder,
  value,
  onChange,
  label,
  disabled = false,
  autoComplete,
  className,
}) => {
  return (
    <div className={`input-group ${className || ''}`}>
      {label && <label className="input-label">{label}</label>}
      <input
        required={required}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        className="input-field"
      />
    </div>
  );
};
