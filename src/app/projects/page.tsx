import { Seperator } from "@/components/Section";
import AIProjects from "@/components/AiProjects";
import Projects from "@/components/CompletedProjects";
import OtherProjects from "@/components/OtherProject";
import UtilProjects from "@/components/UtilProjects";
export const metadata = {
  title: "Piyush Projects | Software Engineer & Web Developer",
  description:
    "Discover Piyush projects, showcasing his expertise in software engineering and web development.",
};

export default function ProjectsPage() {
  return (
    <>
      <Projects />
      <Seperator />
      <AIProjects />
      <Seperator />
      <UtilProjects />
      <Seperator />
      <OtherProjects />
    </>
  );
}
