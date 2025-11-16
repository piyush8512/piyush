"use client";

import { QUOTES } from '@/utils/data';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiSolidQuoteLeft, BiSolidQuoteRight } from "react-icons/bi";

const QuoteCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % QUOTES.length);
    }, 10000); // Keep 10 seconds total display time

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-10">
      <div className="w-fit flex flex-col items-end justify-end">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }} // Much shorter transition time
              className="w-fit border border-tertiary py-3 px-3 text-tertiary relative"
            >
              <span className="absolute text-2xl bg-secondary -top-3 left-[5%]"><BiSolidQuoteLeft /></span>
              <span>{QUOTES[currentIndex].quote}</span>
              <span className="absolute text-2xl bg-secondary -bottom-3 right-[5%]"><BiSolidQuoteRight /></span>
            </motion.p>
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={`author-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }} // Match the quote transition time
            className="w-fit border border-tertiary py-3 px-3 text-tertiary border-t-transparent"
          >
            - {QUOTES[currentIndex].author}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuoteCarousel;
