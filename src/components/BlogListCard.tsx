import React from "react";
import Image from "next/image";
import { PrimaryText } from "@/components/text";
import AppLink from "@/components/app-link";

// 1. Define the fallback image
const FALLBACK_IMAGE =
  "https://www.digitalons.com/wp-content/uploads/2022/05/four-wooden-blocks-with-letters-blog.jpg";

// 2. FIX TYPE ERROR: Define the structure of the blog prop
interface BlogPost {
  _id: string;
  title: string;
  description: string;
  image_url?: string; // Optional string
  date?: string;      // Optional string (if your sanity schema has it)
  _createdAt?: string; // Sanity always provides this
}

export const BlogListCard = ({
  blog,
  lineClamp = 3,
}: {
  blog: BlogPost; // <--- CHANGED FROM 'any' TO 'BlogPost'
  lineClamp?: number;
}) => {
  
  const finalImage = blog.image_url ? blog.image_url : FALLBACK_IMAGE;

  // 3. FIX DATE LOGIC: Use the blog's date, not the current date
  // If 'blog.date' exists use it, otherwise use '_createdAt', otherwise fallback to today.
  const dateString = blog.date || blog._createdAt || new Date().toISOString();
  
  const formattedDate = new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="w-full h-fit border border-tertiary flex flex-col group hover:border-purple/50 transition-colors duration-300">
      <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
        <Image
          src={finalImage}
          alt={blog.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={false}
        />
      </div>

      {/* Middle Bar: Date */}
      <div className="border-y border-y-tertiary flex items-center gap-2 p-2">
        <PrimaryText className="whitespace-nowrap text-xs uppercase tracking-widest">
          {formattedDate}
        </PrimaryText>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-4 flex-grow">
        <h4 className="font-medium text-lg group-hover:text-purple transition-colors">
          {blog.title}
        </h4>

        <PrimaryText className={`line-clamp-${lineClamp} flex-grow`}>
          {blog.description}
        </PrimaryText>

        <div className="flex items-center gap-4 mt-auto">
          <AppLink href={`/blog/${blog._id}`} title={`Read ${blog.title}`}>
            {`${"Read Article ~~>"}`}
          </AppLink>
        </div>
      </div>
    </div>
  );
};