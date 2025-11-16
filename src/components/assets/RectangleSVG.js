"use client";

import { useTheme } from "next-themes";

const RectangleSVG = ({ className }) => {
  const { resolvedTheme } = useTheme();

  return (
    <svg
      // width="86"
      // height="86"
      viewBox="0 0 86 86"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="0.5"
        width="85"
        height="85"
        stroke={` ${resolvedTheme === "dark" ? "#abb2bf" : "#282c33"}`}
      />
    </svg>
  );
};

export default RectangleSVG;
