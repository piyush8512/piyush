"use client";

import { useRef, ReactNode } from "react";
import { motion, useInView, Variants } from "framer-motion";

type SectionProps = {
  children: ReactNode;
  className?: string;
};

export const Section = ({ children, className = "" }: SectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    amount: 0.05,
  });

  const sectionVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: -15,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <motion.section
      ref={ref}
      className={`my-8 p-4 flex items-center justify-center relative overflow-hidden md:p-8 ${className}`}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      exit="exit"
      variants={sectionVariants}
    >
      {children}
    </motion.section>
  );
};

export const WrapSection = ({ children, className = "" }: SectionProps) => {
  const wrapVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.99,
      x: -5,
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.25,
        ease: "easeOut",
        delayChildren: 0.03,
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return (
    <motion.div
      className={`w-full max-w-[1024px] ${className}`}
      variants={wrapVariants}
    >
      {children}
    </motion.div>
  );
};

export const Seperator = () => {
  return (
    <motion.div
      className="w-full h-px bg-transparent my-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    />
  );
};
