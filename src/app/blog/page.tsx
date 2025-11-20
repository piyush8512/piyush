import React from "react";
import { Section, WrapSection } from "@/components/Section";
import { MainTitle, SubTitle } from "@/components/Titile";
import { getBlogPosts } from "@/sanity/lib/sanityApi";
import { BlogListCard } from "@/components/BlogListCard";

// 1. Define the Type for your Blog Post
// This matches the data you fetch in sanityApi.js
interface BlogPost {
  _id: string;
  title: string;
  description: string;
  image_url?: string; // '?' means it's optional (might be null)
  link?: string;
  content?: string;
}

export const dynamic = "force-dynamic";

const BlogPage = async () => {
  const posts = await getBlogPosts();

  return (
    <Section>
      <WrapSection>
        <div className="mb-10">
          <MainTitle subText="Read my thoughts">My Blog</MainTitle>
          <SubTitle>Latest Articles</SubTitle>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts && posts.length > 0 ? (
            // 2. Use the 'BlogPost' type here instead of 'any'
            posts.map((post: BlogPost) => (
              <BlogListCard key={post._id} blog={post} />
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
