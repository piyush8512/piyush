import Intro from "@/components/home/Intro";
import { Seperator } from "@/components/Section";
import Projects from "@/components/home/Projects";
import Skills from "@/components/home/Skills";
import About from "@/components/home/About";
import Contact from "@/components/home/Contact";
import Blog from "@/components/home/Blog";

export default async function Home() {
  return (
    <>
      <Intro />
      <Projects home />
      <Seperator />
      <Blog home />
      <Seperator />
      <Skills home />
      <Seperator />
      <About home />
      <Seperator />
      <Contact home />
    </>
  );
}
