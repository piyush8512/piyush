"use client";

import {
  useState,
  ChangeEvent,
  FocusEvent,
  TextareaHTMLAttributes,
} from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  value: string;
  label: string;
  placeholder?: string;
  error?: string;
  rows?: number;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
}

const Textarea = ({
  name,
  value,
  error,
  label,
  placeholder = "",
  rows = 5,
  onBlur = () => {},
  onFocus = () => {},
  onChange = () => {},
  ...rest
}: TextareaProps) => {
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
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={!focus || !value ? "" : placeholder}
        className="w-full bg-secondary border border-primary text-primary py-2 px-3 placeholder:text-secondary/30 focus:outline-none focus:ring-none focus:border-2 focus:border-tertiary"
        onFocus={(e) => {
          setFocus(true);
          onFocus(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          onBlur(e);
        }}
        rows={rows}
        {...rest}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </label>
  );
};

export default Textarea;
