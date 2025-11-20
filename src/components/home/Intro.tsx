"use client";

import { ORIENTATION } from "@/utils/contant";
import { Section, WrapSection } from "@/components/Section";
import { PurpleText, PrimaryText } from "../text";
// AppLink removed: using in-place scroll button instead
import Carousel from "@/components/home/carousel";
import RectangleSVG from "@/components/assets/RectangleSVG";
import { getTestimonials, getSummary } from "@/sanity/lib/sanityApi";
import { getResume } from "@/sanity/lib/sanityApi";
// import { useEffect, useState } from "react";
import {  useState } from "react";
// import { Eye, X, Download } from "lucide-react";
import { Eye, X } from "lucide-react";

const testimonialsData = await getTestimonials();
const summaryData = await getSummary();
const resumeData = await getResume();
const summary = summaryData ? summaryData.text : "";
const testimonials = Array.isArray(testimonialsData) ? testimonialsData : [];

export default function intro() {
  const resumeUrl = resumeData ? resumeData[0]?.pdf_url : "";
  const [isDownloading, setIsDownloading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleDownloadResume = async () => {
    if (!resumeUrl) return;

    try {
      setIsDownloading(true);
      const response = await fetch(resumeUrl);
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download resume:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleViewResume = () => {
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };
  const showContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Section className="relative overflow-hidden">
      <WrapSection className="flex flex-col gap-2">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
          <div className="m-auto flex flex-col gap-4">
            <h1 className="text-[32px] font-bold">
              whoami:~$ <br />
              <PurpleText>IIOT Engineer</PurpleText> and{" "}
              <PurpleText>Full Stack Developer</PurpleText>
            </h1>
            <PrimaryText>{summary}</PrimaryText>
            <div className="flex flex-rows gap-4">
              <button
                onClick={showContact}
                className="w-fit py-2 px-4 border border-purple text-tertiary text-center font-medium hover:opacity-75 hover:bg-purple/20"
              >
                Contact me!!
              </button>
              <button
                onClick={handleDownloadResume}
                disabled={isDownloading}
                className="w-fit py-2 px-4 border border-purple text-tertiary text-center font-medium hover:opacity-75 hover:bg-purple/20"
              >
                {isDownloading ? "Downloading..." : "Download Resume"}
              </button>
              <button
                onClick={handleViewResume}
                className="w-fit py-2 px-4 border border-purple text-tertiary text-center font-medium hover:opacity-75 hover:bg-purple/20 flex items-center gap-2"
              >
                <Eye size={18} />
              </button>
            </div>
          </div>
          <div>
            <Carousel
              testimonials={testimonials}
              orientation={ORIENTATION.VERTICAL}
            />
          </div>
        </div>
      </WrapSection>
      <RectangleSVG className="w-20 h-20 absolute bottom-[5%] -right-8 hidden md:block" />

      {/* Resume Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-purple/30">
              <h2 className="text-xl font-semibold text-tertiary">Resume</h2>
              <button
                onClick={handleCloseOverlay}
                className="text-tertiary hover:text-purple transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-auto">
              <iframe
                src={resumeUrl}
                className="w-full h-full border-0"
                title="Resume PDF"
              />
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}

export const Intro = intro;
