// import { PROJECTS } from "@/utils/data";
// import { ProjectCard } from "../project-card";
// import { MainTitle, SubTitle } from "../titles";
// import { Section, WrapSection } from "../sections";

// import Link from "next/link";
// import DotsSVG from "../assets/DotsSVG";
// import RectangleSVG from "../assets/RectangleSVG";

import { PROJECTS } from "@/utils/data";
import { ProjectCard } from "@/components/ProjectCard";
import {  SubTitle } from "@/components/Titile";
import { Section, WrapSection } from "@/components/Section";

// import Link from "next/link";
import DotsSVG from "@/components/assets/DotsSVG";
import RectangleSVG from "@/components/assets/RectangleSVG";


const OtherProjects = () => {
  return (
    <Section className="relative overflow-hidden">
      <WrapSection >
        <SubTitle line>other-projects</SubTitle>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </WrapSection>

      <DotsSVG className="w-20 h-20 absolute bottom-[5%] -right-4 hidden md:block" />
      <RectangleSVG className="w-30 h-30 absolute top-[30%] -left-8 hidden md:block" />
    </Section>
  );
}

export default OtherProjects;
