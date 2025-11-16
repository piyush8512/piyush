"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";


const AnimatedSignature = () => {
  const { resolvedTheme } = useTheme();
  return (
    <motion.svg
      className="h-14"
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main signature path */}
      <motion.path
        d="M50,150 C80,50 150,50 180,110 C210,170 270,160 320,80 C330,60 340,90 300,140 C270,180 200,175 140,180"
        stroke={` ${resolvedTheme === "dark" ? "#c778dd" : "#6e11b0"}`}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 3.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Extra flourish under the signature */}
      <motion.path
        d="M80,170 C150,190 220,190 290,170"
        stroke={` ${resolvedTheme === "dark" ? "#c778dd" : "#6e11b0"}`}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 2.5,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 0.5,
        }}
      />
    </motion.svg>
  );
};

export default AnimatedSignature;
