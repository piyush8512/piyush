"use client";
// import { PrimaryText } from "@/components/text";
import { ContactForm } from "@/components/ContactForm";
import { SubTitle } from "@/components/Titile";
import { Section, WrapSection } from "@/components/Section";

export default function Contact({ home = false }: { home?: boolean }) {
  return (
    <Section className="relative overflow-hidden">
      <div id={home ? "contact" : undefined}>
        <WrapSection className="grid grid-cols-1 gap-y-4 gap-x-10 md:grid-cols-[2fr_3fr] ">
          <SubTitle line>
            {" "}
            GET /api/contact
            <span className="text-green-500">&nbsp; 200 OK</span>
          </SubTitle>
          <div className="hidden md:block"></div>
          <div className="mb-auto flex flex-col gap-8">
            I&lsquo;m interested in working on ambitious projects with positive people
            and goal-oriented companies.
            <br /> However, if you have other request or question, don&lsquo;t
            hesitate to contact me.
          </div>
          <ContactForm />
        </WrapSection>
      </div>
    </Section>
  );
} 
