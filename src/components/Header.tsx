"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaLinkedinIn,
  FaGithub,
  FaEnvelope,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa6";
import { SiLeetcode, SiPeerlist } from "react-icons/si";
import { ThemeToggle } from "./ThemsToggle";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import { WrapSection } from "@/components/Section";
import { motion } from "framer-motion";
import { socialLinks } from "@/utils/socialConfig";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { label: "home", path: "/" },
    { label: "works", path: "/work" },
    { label: "about-me", path: "/about" },
    { label: "projects", path: "/projects" },
    { label: "blog", path: "/blog" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 px-4 flex flex-col justify-center items-center md:px-8 bg-secondary">
      <WrapSection className="pt-8 pb-2 flex items-center justify-between gap-4 w-full">
        <Link href="/" className="text-base font-bold flex items-center gap-2">
          Piyush@coder
        </Link>

        <nav
          className={`${
            isMenuOpen ? "fixed inset-0 top-[72px] z-40 bg-secondary" : "hidden"
          } md:static md:inset-auto md:top-auto md:z-auto md:ml-auto md:block`}
        >
          <ul className="flex flex-col items-center justify-center gap-8 h-full md:h-auto md:flex-row md:justify-start">
            {links.map((link) => {
              const isActive = pathname === link.path;
              return (
                <li
                  key={`${link.label}-${link.path}`}
                  className="w-full text-center md:w-auto md:text-left"
                >
                  <Link
                    className={`${
                      isActive
                        ? "text-tertiary font-medium border-y-purple"
                        : "border-y-transparent hover:text-tertiary"
                    } w-full py-4 block border-y text-primary hover:font-medium hover:border-y-purple transition-colors duration-200 md:border-b-transparent border-t-5 md:hover:border-b-transparent md:w-auto md:py-2`}
                    href={link.path}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-purple">#</span> {link.label}
                  </Link>
                </li>
              );
            })}

            {/* Side Social Links (Desktop) with Framer Motion */}
            {/* Side Social Links (Desktop) with Animated Line & Icons */}
            <motion.li
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className={`${
                isMenuOpen ? "block" : "hidden"
              } w-full mt-24 md:w-auto md:mt-0 md:block md:fixed md:top-0 md:left-1 md:text-primary lg:left-[4%]`}
            >
              {/* Vertical Line (Bouncy from Top) */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "35vh" }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  bounce: 0.5,
                }}
                className="hidden mb-4 w-[2px] bg-primary rounded-full m-auto md:block"
              ></motion.div>

              {/* Icons: Slide in after line completes */}
              <ul className="flex justify-center gap-8 h-fit md:flex-col md:items-center md:justify-start md:gap-3">
                {[
                  {
                    icon: <FaGithub className="h-6 w-6 md:h-8 md:w-8" />,
                    link: socialLinks.github,
                    label: "My GitHub Profile",
                  },
                  {
                    icon: <FaLinkedinIn className="h-6 w-6 md:h-8 md:w-8" />,
                    link: socialLinks.linkedin,
                    label: "My LinkedIn Profile",
                  },
                  {
                    icon: <FaTwitter className="h-6 w-6 md:h-8 md:w-8" />,
                    link: socialLinks.twitter,
                    label: "My Twitter Profile",
                  },
                  {
                    icon: <SiLeetcode className="h-6 w-6 md:h-8 md:w-8" />,
                    link: socialLinks.leetcode,
                    label: "My LeetCode Profile",
                  },
                  {
                    icon: <SiPeerlist className="h-6 w-6 md:h-8 md:w-8" />,
                    link: socialLinks.peerlist,
                    label: "My PeerList Profile",
                  },
                  {
                    icon: <FaWhatsapp className="h-6 w-6 md:h-8 md:w-8" />,
                    link: socialLinks.whatsapp,
                    label: "Chat on WhatsApp",
                  },
                  {
                    icon: <FaEnvelope className="h-6 w-6 md:h-8 md:w-8" />,
                    link: `mailto:${socialLinks.email}`,
                    label: "Email me",
                  },
                ].map(({ icon, link, label }, index) => (
                  <motion.li
                    key={label}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 1.2 + index * 0.2, // ensure it starts after the line
                    }}
                    className="h-fit"
                  >
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-0.5 h-fit flex items-center justify-center transition-all duration-100 ease-in-out transform hover:text-tertiary hover:scale-110 hover:-translate-y-1 md:hover:translate-x-1"
                      title={label}
                      aria-label={label}
                    >
                      {icon}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.li>
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <button
            className="md:hidden text-primary p-1 focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <HiOutlineX className="h-6 w-6" />
            ) : (
              <HiOutlineMenuAlt3 className="h-6 w-6" />
            )}
          </button>
        </div>
      </WrapSection>
    </header>
  );
};

export default Header;
