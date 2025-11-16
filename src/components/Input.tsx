"use client";

import { useState, ChangeEvent, FocusEvent, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  value: string;
  label: string;
  placeholder?: string;
  error?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
}

const Input = ({
  name,
  value,
  error,
  label,
  placeholder = '',
  type = "text",
  onBlur = () => {},
  onFocus = () => {},
  onChange = () => {},
  ...rest
}: InputProps) => {
  const [focus, setFocus] = useState(false);

  return (
    <label htmlFor={name} className="relative block w-full">
      <span
        className={`absolute py-0 px-2 bg-secondary text-primary pointer-events-none transition-all duration-300 ease-in-out ${
          focus || value
            ? "text-sm text-tertiary -top-3 left-5 border-x-2 border-x-tertiary"
            : "top-2 left-1"
        }`}
      >
        {label}
      </span>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={value ? "" : placeholder}
        className="w-full bg-secondary border border-primary text-primary py-2 px-3 placeholder:text-secondary/30 focus:outline-none focus:ring-none focus:border-2 focus:border-tertiary"
        onChange={onChange}
        onFocus={(e) => {
          setFocus(true);
          onFocus(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          onBlur(e);
        }}
        {...rest}
      />
      {/* Optional error display */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </label>
  );
};

export default Input;
