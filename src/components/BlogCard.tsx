"use client";
import { PrimaryText } from "@/components/text";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Define a type for the blog prop for better code safety and autocompletion
type BlogProp = {
  slug: string;
  title: string;
  description: string;
  date: string;
};

export const BlogCard = ({
  blog,
  lineClamp = 1, // A 2-line clamp is common for descriptions like this
}: {
  blog: BlogProp;
  lineClamp?: number;
}) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine border color based on theme
  const borderColor = mounted
    ? theme === "dark"
      ? "border-white"
      : "border-black"
    : "border-black";
  const textColor = mounted
    ? theme === "dark"
      ? "text-white"
      : "text-black"
    : "text-black";
  const dateColor = mounted
    ? theme === "dark"
      ? "text-gray-400"
      : "text-neutral-400"
    : "text-neutral-400";

  return (
    // 1. The entire card is a link.
    <Link
      href={blog.slug}
      className={`
        block w-full p-5
        border-2 ${borderColor}
        transition-colors duration-300
        hover:bg-purple/5
      `}
    >
      {/* 2. Flexbox container to separate left content from the right (date) */}
      <div className="flex justify-between items-start">
        {/* Left side: Title and Description */}
        <div className="flex flex-col gap-2">
          <h4 className={`font-medium text-lg ${textColor}`}>{blog.title}</h4>

          <PrimaryText
            className={`text-sm ${textColor} line-clamp-${lineClamp}`}
          >
            {blog.description}
          </PrimaryText>
        </div>

        {/* Right side: Date */}
        <p className={`text-sm ${dateColor} whitespace-nowrap`}>{blog.date}</p>
      </div>
    </Link>
  );
};
