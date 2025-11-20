import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PrimaryText } from "@/components/text";
import AppLink from "@/components/app-link";

// 1. Define your fallback image path (Place this image in your 'public' folder)
const FALLBACK_IMAGE =
  "https://www.digitalons.com/wp-content/uploads/2022/05/four-wooden-blocks-with-letters-blog.jpg";

export const BlogListCard = ({
  blog,
  lineClamp = 3,
}: {
  blog: any;
  lineClamp?: number;
}) => {
  // 2. LOGIC: Check if the blog has an image. If not, use the fallback.
  // This ensures 'finalImage' is never null.
  const finalImage = blog.image_url ? blog.image_url : FALLBACK_IMAGE;

  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="w-full h-fit border border-tertiary flex flex-col  group hover:border-purple/50 transition-colors duration-300">
      {/* 3. REMOVED the '{blog.image_url && ...}' check. 
             We always render this div now because we always have an image (real or fallback). */}
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
