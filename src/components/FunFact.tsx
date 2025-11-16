import { SubTitle } from "@/components/Titile";
import { FUN_FACTS, SKILLS } from "@/utils/data";
import { Section, WrapSection } from "@/components/Section";

import DotsSVG from "@/components/assets/DotsSVG";
import DesignSVG from "@/components/assets/DesignSVG";
import RectangleSVG from "@/components/assets/RectangleSVG";

export default function FunFacts() {
  return (
    <Section>
      <WrapSection>
        <div
          className={`grid grid-cols-1 gap-y-4 gap-x-10 md:grid-cols-[4fr_1fr]`}
        >
          <SubTitle>my-fun-facts</SubTitle>
          <div className="hidden md:block"></div>

          <ul className="flex flex-wrap gap-4">
            {FUN_FACTS.map((fact, index) => (
              <li key={index} className="py-1 px-2 border border-primary text-primary">{fact}</li>
            ))}
          </ul>

          <div className="relative hidden w-full h-[282px] md:block">
            <DotsSVG className="absolute top-0 left-0 w-20 h-20" />

            <DesignSVG className="absolute bottom-0 right-0 w-38 h-38" />
          </div>
        </div>
      </WrapSection>
      
      <DotsSVG className="w-20 h-20 absolute bottom-[5%] -right-4 hidden md:block" />
      <RectangleSVG className="w-30 h-30 absolute top-[30%] -left-8 hidden md:block" />
    </Section>
  );
}
