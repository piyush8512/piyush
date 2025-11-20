import React from "react";
import { Section, WrapSection } from "@/components/Section";
import { MainTitle, SubTitle } from "@/components/Titile"; // Check your spelling: 'Titile' or 'Title' based on your folder
import { PrimaryText } from "@/components/text";
import Link from "next/link";
import { getBlogPostById } from "@/sanity/lib/sanityApi";
import Image from "next/image";

// 1. Define the interface for the page props
interface PageProps {
  params: {
    id: string;
  };
}

// 2. Convert to async function to fetch data on the server
const BlogPostPage = async ({ params }: PageProps) => {
  // Fetch the specific blog post using the ID from the URL
  const post = await getBlogPostById(params.id);

  // Handle case where post isn't found
  if (!post) {
    return (
      <Section>
        <WrapSection>
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <MainTitle>404</MainTitle>
            <PrimaryText>Blog post not found.</PrimaryText>
            <Link href="/blog" className="text-purple underline mt-4">
              Back to Blogs
            </Link>
          </div>
        </WrapSection>
      </Section>
    );
  }

  return (
    <Section>
      <WrapSection>
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/" className="hover:text-purple transition-colors">
             &larr; Back to Home
          </Link>
        </div>

        {/* Blog Header */}
        <div className="space-y-4 mb-10">
          <MainTitle>{post.title}</MainTitle>
          
          {/* Date or Description */}
          <div className="flex gap-4 items-center text-gray-500">
             <SubTitle>{post.description}</SubTitle>
          </div>
        </div>

        {/* Blog Image */}
        {post.image_url && (
          <div className="w-full h-64 md:h-96 relative mb-10 rounded-xl overflow-hidden border border-white/10">
            <Image 
              src={post.image_url} 
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Blog Content */}
        <article className="prose dark:prose-invert max-w-none">
          {/* NOTE: Since your schema defines 'content' as a simple string, 
             we render it here. If you decide to use Sanity's "Portable Text" 
             later (Rich Text), you will need a PortableText component here.
          */}
          <PrimaryText className="whitespace-pre-wrap leading-relaxed">
            {post.content}
          </PrimaryText>
        </article>

      </WrapSection>
    </Section>
  );
};

export default BlogPostPage;