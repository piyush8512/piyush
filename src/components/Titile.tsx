import React, { FC, ReactNode } from "react";

interface MainTitleProps {
  className?: string;
  children: ReactNode;
  subText?: string;
}

export const MainTitle: FC<MainTitleProps> = ({
  className = "",
  children,
  subText,
}) => {
  return (
    <div className="mb-10">
      <h1
        className={`font-[800] text-[32px] text-tertiary flex items-center ${className}`}
      >
        <span className="text-purple">/ &nbsp;</span>
        {children}
      </h1>
      {subText && <p className="text-tertiary mt-2">{subText}</p>}
    </div>
  );
};

interface SubTitleProps {
  className?: string;
  children: ReactNode;
  line?: boolean;
}

export const SubTitle: FC<SubTitleProps> = ({
  className = "",
  children,
  line = false,
}) => {
  return (
    <h2
      className={`font-[600] text-[22px] text-tertiary flex items-center ${className}`}
    >
      <span className="text-purple">$&nbsp; </span>
      {children}
      {line && (
        <span className="ml-2 max-w-[500px] grow h-[2px] bg-purple"></span>
      )}
    </h2>
  );
};
