import React, { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";

const VARIANT_CLASSES = {
  PRIMARY: "border-purple hover:bg-purple/20",
  SECONDARY: "border-tertiary hover:bg-tertiary/20",
} as const;

type Variant = keyof typeof VARIANT_CLASSES;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  type = "submit",
  onClick = () => {},
  variant = "PRIMARY",
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-fit py-2 px-4 border text-tertiary text-center font-medium flex items-center gap-3 hover:opacity-75 ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
