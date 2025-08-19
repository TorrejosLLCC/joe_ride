import type { ChangeEvent, FC } from "react";

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  required?: boolean;
  min?: string;
  max?: string;
}

export const Input: FC<InputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  label,
  required = false,
  min,
  max,
}) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input-field"
        required={required}
        min={min}
        max={max}
      />
    </div>
  );
};
