import type { FC } from "react";

interface SelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
}

export const Select: FC<SelectProps> = ({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder = "Select an option...",
  required = true 
}) => {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <select
        className="input-field"
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};