import { ProjectCard } from "@/components/ProjectCard";
import { MainTitle, SubTitle } from "@/components/Titile";
import { Section, WrapSection } from "@/components/Section";
import Link from "next/link";
import AppLink from "@/components/app-link";
import DotsSVG from "../assets/DotsSVG";
import RectangleSVG from "../assets/RectangleSVG";
import { getBlogPosts } from "@/sanity/lib/sanityApi";
import { BlogCard } from "@/components/BlogCard";

const projectsData = await getBlogPosts();
const projectsfeatured = Array.isArray(projectsData) ? projectsData : [];
console.log("Projects Featured:", projectsfeatured);


const Blog = ({ home = false }) => {
  return (
    <Section className="relative overflow-hidden">
      <WrapSection>
        {home ? (
          <div className="grid grid-rows-1 md:grid-rows-[4fr_1fr] gap-y-4 gap-x-10">
            <SubTitle line>
              <span>
                <span className="">&nbsp;GET&nbsp;</span>
                /api/blogs
                <span className="text-green-500"> 200 OK</span>
              </span>
            </SubTitle>

            <Link
              href="projects"
              className="ml-auto hover:underline hover:text-purple hidden md:inline"
            >
              {`${"->"}`}
            </Link>
          </div>
        ) : (
          <div>
            <MainTitle subText="List of my projects">my-projects</MainTitle>

            <SubTitle>projects</SubTitle>
          </div>
        )}

        <div className="mt-10 ">
          {projectsfeatured
            .slice(0, home ? 3 : projectsfeatured.length)
            .map((blog) => (
              <BlogCard
                key={blog._id}
                blog={{
                  slug: `/blog/${blog._id}`,
                  title: blog.title,
                  description: blog.description,
                  date: new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }),
                  image: blog.image_url,
                  link: blog.link,
                }}
              />
            ))}
        </div>

        {home && (
          <div className="mt-10 md:hidden">
            <AppLink
              href="projects"
              className="ml-auto hover:underline hover:text-purple"
            >
              {`${"View all ~~>"}`}
            </AppLink>
          </div>
        )}
      </WrapSection>

      <DotsSVG className="w-20 h-20 absolute top-[5%] -left-14 hidden md:block" />
      <RectangleSVG className="w-20 h-20 absolute top-[30%] -right-8 hidden md:block" />
    </Section>
  );
};

export default Blog;
