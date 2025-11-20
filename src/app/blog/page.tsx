import React from "react";
import { Section, WrapSection } from "@/components/Section";
import { MainTitle, SubTitle } from "@/components/Titile"; // Adjust path if needed
import { getBlogPosts } from "@/sanity/lib/sanityApi";
import { BlogListCard } from "@/components/BlogListCard";

// This ensures the page is dynamic and fetches fresh data
export const dynamic = "force-dynamic";

const BlogPage = async () => {
  // 1. Fetch data from Sanity
  const posts = await getBlogPosts();

  return (
    <Section>
      <WrapSection>
        {/* Header */}
        <div className="mb-10">
          <MainTitle subText="Read my thoughts">My Blog</MainTitle>
          <SubTitle>Latest Articles</SubTitle>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts && posts.length > 0 ? (
            posts.map((post: any) => (
              <BlogListCard 
                key={post._id} 
                blog={post} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-500">
              No blog posts found yet.
            </div>
          )}
        </div>

      </WrapSection>
    </Section>
  );
};

export default BlogPage;