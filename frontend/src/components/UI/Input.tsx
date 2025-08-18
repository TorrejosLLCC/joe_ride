import type { ChangeEvent, FC } from "react";

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}

export const Input: FC<InputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  label,
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
      />
    </div>
  );
};
