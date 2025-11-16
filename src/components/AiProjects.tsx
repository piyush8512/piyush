import { AI_PROJECTS } from "@/utils/data";
import { ProjectCard } from "@/components/ProjectCard";
import { MainTitle, SubTitle } from "@/components/Titile";
import { Section, WrapSection } from "@/components/Section";

import Link from "next/link";
import DotsSVG from "@/components/assets/DotsSVG";
import RectangleSVG from "@/components/assets/RectangleSVG";

const AIProjects = () => {
  return (
    <Section className="relative overflow-hidden">
      <WrapSection >
        <SubTitle line>ai-projects</SubTitle>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_PROJECTS.map((project, index) => (
            <ProjectCard key={index} project={project} image={false} lineClamp={5} />
          ))}
        </div>
      </WrapSection>

      <RectangleSVG className="w-20 h-20 absolute bottom-[5%] -right-8 hidden md:block" />
    </Section>
  );
}

export default AIProjects;
