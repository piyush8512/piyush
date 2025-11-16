import { SubTitle } from "@/components/Titile";
import { PROFILE_LINKS } from "@/utils/data";
import { Section, WrapSection } from "@/components/Section";
import {
  FaLinkedinIn,
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaMastodon,
  FaGithub,
} from "react-icons/fa6";

import DotsSVG from "@/components/assets/DotsSVG";
import DesignSVG from "@/components/assets/DesignSVG";
import RectangleSVG from "@/components/assets/RectangleSVG";

export default function AllMedia() {
  return (
    <Section>
      <WrapSection>
        <div
          className={`grid grid-cols-1 gap-y-4 gap-x-10 md:grid-cols-[4fr_1fr]`}
        >
          <SubTitle>all-media</SubTitle>
          <div className="hidden md:block"></div>

          <ul className="h-fit grid grid-cols-2 space-y-4 md:grid-cols-3">
            <li className="h-fit">
              <a
                href={PROFILE_LINKS.GITHUB.LINK}
                target="_blank"
                className="p-0.5 h-fit flex items-center gap-3 transition-all duration-100 ease-in-out text-primary hover:text-tertiary hover:underline"
                title="My GitHub Profile"
                aria-label="My GitHub Profile"
                aria-describedby="github-profile-link"
              >
                <FaGithub className="h-8 w-8" />
                {PROFILE_LINKS.GITHUB.LABEL}
              </a>
            </li>

            <li className="h-fit">
              <a
                href={PROFILE_LINKS.LINKEDIN.LINK}
                target="_blank"
                className="p-0.5 h-fit flex items-center gap-3 transition-all duration-100 ease-in-out text-primary hover:text-tertiary hover:underline"
                title="My LinkedIn Profile"
                aria-label="My LinkedIn Profile"
                aria-describedby="linkedin-profile-link"
              >
                <FaLinkedinIn className="h-8 w-8" />
                {PROFILE_LINKS.LINKEDIN.LABEL}
              </a>
            </li>

            <li className="h-fit">
              <a
                href={PROFILE_LINKS.TWITTER.LINK}
                target="_blank"
                className="p-0.5 h-fit flex items-center gap-3 transition-all duration-100 ease-in-out text-primary hover:text-tertiary hover:underline"
                title="My X(Twitter) Profile"
                aria-label="My X(Twitter) Profile"
                aria-describedby="x-twitter-profile-link"
              >
                <FaXTwitter className="h-8 w-8" />
                {PROFILE_LINKS.TWITTER.LABEL}
              </a>
            </li>

            {/* <li className="h-fit">
              <a
                href={PROFILE_LINKS.MASTODON.LINK}
                target="_blank"
                className="p-0.5 h-fit flex items-center gap-3 transition-all duration-100 ease-in-out text-primary hover:text-tertiary hover:underline"
                title="My Mastodon Profile"
                aria-label="My Mastodon Profile"
                aria-describedby="masterdon-profile-link"
              >
                <FaMastodon className="h-8 w-8" />
                {PROFILE_LINKS.MASTODON.LABEL}
              </a>
            </li> */}

            <li className="h-fit">
              <a
                href={PROFILE_LINKS.FACEBOOK.LINK}
                target="_blank"
                className="p-0.5 h-fit flex items-center gap-3 transition-all duration-100 ease-in-out text-primary hover:text-tertiary hover:underline"
                title="My Facebook Profile"
                aria-label="My Facebook Profile"
                aria-describedby="facebook-profile-link"
              >
                <FaFacebookF className="h-8 w-8" />
                {PROFILE_LINKS.FACEBOOK.LABEL}
              </a>
            </li>
          </ul>

          <div className="relative hidden w-full md:block">
            {/* <DotsSVG className="absolute top-0 left-0 w-20 h-20" />

            <DesignSVG className="absolute bottom-0 right-0 w-38 h-38" /> */}
          </div>
        </div>
      </WrapSection>
      
      <DotsSVG className="w-20 h-20 absolute bottom-[5%] -right-4 hidden md:block" />
      <RectangleSVG className="w-20 h-20 absolute top-[30%] -left-8 hidden md:block" />
    </Section>
  );
}
