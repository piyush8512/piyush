import Link from "next/link";
import { ReactNode, AnchorHTMLAttributes } from "react";

type Variant = "PRIMARY" | "SECONDARY";

interface AppLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  PRIMARY: "border-purple hover:bg-purple/20",
  SECONDARY: "border-tertiary hover:bg-tertiary/20",
};

const AppLink = ({
  href = "",
  children,
  className = "",
  variant = "PRIMARY",
  ...rest
}: AppLinkProps) => {
  return (
    <Link
      href={href}
      className={`w-fit py-2 px-4 border text-tertiary text-center font-medium hover:opacity-75 ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default AppLink;
