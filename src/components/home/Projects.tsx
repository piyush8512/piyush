import { ProjectCard } from "@/components/ProjectCard";
import { MainTitle, SubTitle } from "@/components/Titile";
import { Section, WrapSection } from "@/components/Section";
import Link from "next/link";
import AppLink from "@/components/app-link";
import DotsSVG from "../assets/DotsSVG";
import RectangleSVG from "../assets/RectangleSVG";
import { getFeaturedProjects } from "@/sanity/lib/sanityApi";

const projectsData = await getFeaturedProjects();
const projectsfeatured = Array.isArray(projectsData) ? projectsData : [];

const Projects = ({ home = false }) => {
  return (
    <Section className="relative overflow-hidden">
      <WrapSection>
        {home ? (
          <div className="grid grid-cols-1 md:grid-cols-[4fr_1fr] gap-y-4 gap-x-10">
            <SubTitle line>
              <span>
                <span className="">&nbsp;GET&nbsp;</span>
                /api/projects
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

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectsfeatured
            .slice(0, home ? 3 : projectsfeatured.length)
            .map((project, index) => (
              <ProjectCard key={index} project={project} />
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

export default Projects;
