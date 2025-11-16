import React from "react";
import { Section, WrapSection } from "@/components/Section";
import { MainTitle } from "@/components/Titile";
import { Calendar, MapPin } from "lucide-react";

const ExperienceCard = () => {
  return (
    <div className="rounded-md border border-green-600 p-6 bg-black/80 text-white shadow-lg shadow-green-600 transition hover:shadow-xl mt-12">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-green-400 font-mono text-sm">$</span>
            <h3 className="text-xl font-semibold text-white">
              Senior Full Stack Developer
            </h3>
          </div>
          <h4 className="text-green-400 text-lg font-medium mb-2">
            TechCorp Solutions
          </h4>
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>2022 - Present</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>Remote</span>
            </div>
          </div>
        </div>
        <div>
          <button className="text-green-400 hover:text-green-300 transition">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      <p className="text-gray-300 mb-4">
        Leading development of enterprise-scale web applications and IoT
        systems. Architecting scalable solutions using modern technologies and
        mentoring junior developers.
      </p>

      <div>
        <h5 className="text-green-400 font-mono text-sm mb-2">
          &lt;/&gt; Technologies:
        </h5>
        <div className="flex flex-wrap gap-2">
          {[
            "React",
            "Node.js",
            "TypeScript",
            "Python",
            "AWS",
            "Docker",
            "MongoDB",
            "PostgreSQL",
          ].map((tech) => (
            <span
              key={tech}
              className="bg-green-900 text-green-300 px-3 py-1 rounded-md text-xs font-semibold"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <Section className="relative overflow-hidden">
      <WrapSection>
        <MainTitle>whoami:~$ cd experience</MainTitle>
        <div className="mt-8 ">
          <ExperienceCard />
          <ExperienceCard />
        </div>
        <div className="text-center mt-16">
          <div className="bg-code-bg border border-primary/30 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-mono text-primary mb-4">
              $ cat contact.txt
            </h3>
            <p className="text-foreground/80 mb-6">
              Interested in working together? Let's build something amazing!
            </p>
            <div className="flex gap-4 justify-center">
              <div >Contact Me</div>
              <div >Download Resume</div>
            </div>
          </div>
        </div>
      </WrapSection>
    </Section>
  );
};

export default Page;
