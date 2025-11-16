import { WrapSection } from "@/components/Section";
import SkillCard from "@/components/SkillCard";
import Link from "next/link";
import { FaEnvelope, FaPhone } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="mt-auto p-4 flex flex-col justify-center items-center  text-primary text-base animate-fade-up animate-ease-in-out md:p-8">
      <WrapSection className="mt-7 mb-12 flex flex-col items-center justify-center gap-14">
        <div className="w-full flex flex-col md:flex-row md:justify-center md:items-center">
          <div className="mt-0 grid grid-cols-1 gap-3 md:grid-cols-1">
            <div className="mt-5 md:mt-0">
              <SkillCard
                title="Piyush: Software engineer"
                skills={[
                  <Link
                    href={`mailto:Prajapatipiyush851@gmail.com`}
                    key="email"
                    className="flex items-center gap-3 py-2 px-3 hover:underline"
                  >
                    <FaEnvelope className="text-2xl" />
                    Prajapatipiyush851@gmail.com
                  </Link>,
                  <Link
                    href={`tel:+919650235842`}
                    key="phone"
                    className="flex items-center gap-3 py-2 px-3 hover:underline"
                  >
                    <FaPhone className="text-2xl" />
                    +919650235842
                  </Link>,
                ]}
                block
              />
            </div>
          </div>
        </div>
        <p>&copy; Copyright {new Date().getFullYear()}, Piyush</p>
      </WrapSection>
    </footer>
  );
};

export default Footer;
