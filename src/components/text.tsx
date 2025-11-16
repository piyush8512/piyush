import { ReactNode } from "react";

type TextProps = {
  children: ReactNode;
  className?: string;
};

export const PurpleText = ({ children, className = "" }: TextProps) => {
  return <span className={`text-purple ${className}`}>{children}</span>;
};

export const PrimaryText = ({ children, className = "" }: TextProps) => {
  return <p className={`text-primary ${className}`}>{children}</p>;
};

export const SecondaryText = ({ children, className = "" }: TextProps) => {
  return <p className={`text-secondary ${className}`}>{children}</p>;
};

export const TertiaryText = ({ children, className = "" }: TextProps) => {
  return <p className={`text-tertiary ${className}`}>{children}</p>;
};
