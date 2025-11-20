"use client";

// import { PurpleText } from "@/components/text"; // Assuming this is for generic purple text, adjust if specific to quotes
// import { FaLinkedin } from "react-icons/fa"; // Not directly used in the current render, but kept if needed elsewhere
import { ORIENTATION } from "@/utils/contant"; // Constant for carousel orientation
// import React, { useState, useEffect, useRef, RefObject } from "react";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
// import Image from "next/image";
// import DotsSVG from "../assets/DotsSVG"; // Decorative SVG for top
// import DesignSVG from "../assets/DesignSVG"; // Decorative SVG for bottom

type Testimonial = {
  name: string;
  quote: string;
  location: string;
  profile_picture: string;
  link: string;
};

interface CarouselProps {
  testimonials: Testimonial[];
  orientation?: "HORIZONTAL" | "VERTICAL";
}

const Carousel = ({
  testimonials,
  orientation = ORIENTATION.HORIZONTAL,
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isVertical = orientation === ORIENTATION.VERTICAL;

  // Effect to manage auto-play interval
  useEffect(() => {
    if (!isHovering) {
      intervalRef.current = setInterval(() => {
        goToNextSlide();
      }, 10000); // Auto-advances every 10 seconds
    }

    // Cleanup function to clear interval on unmount or hover
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovering]); // Re-run effect when hover state changes

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  // Function to move to the next slide
  const goToNextSlide = () => {
    if (isTransitioning) return; // Prevent multiple transitions

    setIsTransitioning(true); // Start transition
    setCurrentIndex((prev) => (prev + 1) % testimonials.length); // Loop to next slide
    setTimeout(() => setIsTransitioning(false), 1000); // End transition state after 1 second (matches slide transition duration)
  };

  // Function to move to the previous slide
  const goToPrevSlide = () => {
    if (isTransitioning) return; // Prevent multiple transitions

    setIsTransitioning(true); // Start transition
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    ); // Loop to previous slide
    setTimeout(() => setIsTransitioning(false), 700); // End transition state after 0.7 seconds
  };

  // --- Tailwind CSS Classes (Dynamically assigned based on orientation) ---
  const containerClasses = isVertical
    ? "relative h-[400px] w-full overflow-hidden rounded-xl"
    : "relative h-[330px] md:h-[250px] w-full overflow-hidden rounded-xl";

  const carouselContainerClasses = isVertical
    ? "absolute w-full h-[600px] top-1/2 -translate-y-1/2 z-10"
    : "absolute h-full w-[300%] left-1/2 -translate-x-1/2 z-10";

  const dotsContainerClasses = isVertical
    ? "absolute right-1 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-30"
    : "absolute bottom-1 left-1/2 transform -translate-x-1/2 flex flex-row gap-2 z-30";

  // const topSvgClasses = isVertical
  //   ? "absolute top-2 left-[0%] flex flex-col z-0"
  //   : "absolute top-2 left-0 flex flex-col z-0 md:left-[18%] lg:left-[25%]";

  // const bottomSvgClasses = isVertical
  //   ? "absolute bottom-2 right-[10%] flex flex-col z-0"
  //   : "absolute bottom-2 right-0 flex flex-col z-0 md:right-[20%] lg:right-[25%]";

  return (
    <div
      className={containerClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={carouselContainerClasses}>
        {testimonials.map((testimonial, index) => {
          // Calculate position relative to the current index for visual stacking
          let position = index - currentIndex;
          // Adjust position for circular loop (e.g., if on last slide, next is 0)
          if (position < -1) position += testimonials.length;
          if (position > 1) position -= testimonials.length;

          // Base slide classes for transition
          let slideClasses = "absolute transition-all duration-700 ease-in-out";

          if (isVertical) {
            slideClasses += " w-full h-1/3"; // Each slide takes 1/3 height in vertical mode
            if (position === -1) {
              // Slide above current
              slideClasses += " -top-[10%] opacity-40 scale-70 z-10";
            } else if (position === 0) {
              // Current slide
              slideClasses += " top-[30%] opacity-100 scale-100 z-50";
            } else if (position === 1) {
              // Slide below current
              slideClasses += " top-[70%] opacity-40 scale-70 z-10";
            } else {
              // Hidden slides
              slideClasses += " opacity-0 scale-75 -z-10";
              slideClasses += position < 0 ? " -top-1/3" : " top-full";
            }
          } else {
            slideClasses += " h-full w-1/3";
            if (position === -1) {
              slideClasses += " -left-0 opacity-40 scale-75 z-10 md:left-[20%]";
            } else if (position === 0) {
              slideClasses += " left-[33.333%] opacity-100 scale-100 z-50";
            } else if (position === 1) {
              slideClasses +=
                " right-0 opacity-40 scale-75 z-10 md:right-[20%]";
            } else {
              // Hidden slides
              slideClasses += " opacity-0 scale-75 -z-10";
              slideClasses += position < 0 ? " right-1/3" : " left-full";
            }
          }
          const testimonialContainerClasses = isVertical
            ? "relative h-fit w-[90%] max-w-xl mx-auto flex flex-col gap-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden font-mono"
            : "relative h-full w-[90%] max-w-md mx-auto flex flex-col gap-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden font-mono";

          return (
            <div key={index} className={slideClasses}>
              <div className={testimonialContainerClasses}>
                <div className="flex-none h-5 bg-gray-900 flex items-center px-2 rounded-t-lg">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                  <span className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                </div>
                <blockquote className="text-xs text-lime-400 flex flex-col gap-2 rounded-b-lg p-4 shadow-lg bg-black flex-grow font-mono">
                  <p className="text-green-400">
                    ➜ ~ <span className="text-gray-400">Piyush/testimonal</span>
                  </p>
                  <span className="text-gray-200">{testimonial.quote}</span>
                  <p className="text-green-400">
                    ➜ ~{" "}
                    {testimonial.link ? (
                      <Link
                        href={testimonial.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {testimonial.name}
                      </Link>
                    ) : (
                      <span className="text-gray-400">{testimonial.name}</span>
                    )}
                    /{" "}
                    {/* <h1 className="text-xs text-gray-400">
                      {testimonial.location}
                    </h1> */}
                  </p>
                </blockquote>

                {/* <div className="relative ">
                  <div className="absolute right-0 bottom-2 bg-gray-700 shadow shadow-purple-500/50 h-16 w-16 rounded-full overflow-hidden border-2 border-purple">
                    <Link
                      href={testimonial.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={testimonial.profile_picture}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </Link>
                  </div>
                </div> */}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Dots */}
      <div className={dotsContainerClasses}>
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrentIndex(index);
                setTimeout(() => setIsTransitioning(false), 700);
              }
            }}
            className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 disabled:cursor-not-allowed ${
              index === currentIndex
                ? "bg-purple scale-150" // Active dot style
                : "bg-primary/30 hover:bg-primary/50"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
            disabled={isTransitioning} // Disable clicking dots during transition
          />
        ))}
      </div>

      {/* Navigation Arrows (only for horizontal orientation) */}
      {!isVertical && (
        <>
          <button
            onClick={goToPrevSlide}
            disabled={isTransitioning}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-secondary/80 backdrop-blur-sm rounded-full p-2 z-40 text-primary cursor-pointer hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous testimonial"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
              />
            </svg>
          </button>
          <button
            onClick={goToNextSlide}
            disabled={isTransitioning}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-secondary/80 backdrop-blur-sm rounded-full p-2 z-40 text-primary cursor-pointer hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next testimonial"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </button>
        </>
      )}

      {/* Decorative SVGs in the background */}
      {/* <div className={topSvgClasses}>
        <DesignSVG className="w-24 h-24" />
      </div>

      <div className={bottomSvgClasses}>
        <DotsSVG className="w-16 h-16" />
      </div> */}
    </div>
  );
};

export default Carousel;
