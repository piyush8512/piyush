import { SubTitle } from "@/components/Titile";
import { Section, WrapSection } from "@/components/Section";
import DotsSVG from "@/components/assets/DotsSVG";
import RectangleSVG from "@/components/assets/RectangleSVG";
import Carousel from "@/components/home/carousel";
import { getTestimonials } from "@/sanity/lib/sanityApi";

const testimonialsData = await getTestimonials();
const testimonials = Array.isArray(testimonialsData) ? testimonialsData : [];

export default function Testimonials() {
  return (
    <Section>
      <WrapSection>
        <SubTitle className="mb-4">testimonials</SubTitle>

        <div className="mt-10">
          <Carousel testimonials={testimonials} />
        </div>
      </WrapSection>

      <DotsSVG className="w-20 h-20 absolute bottom-[5%] -right-4 hidden md:block" />
      <RectangleSVG className="w-30 h-30 absolute top-[30%] -left-8 hidden md:block" />
    </Section>
  );
}
