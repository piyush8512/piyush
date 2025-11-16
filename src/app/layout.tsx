import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Fira_Code } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fira-code",
  weight: ["300", "400", "500", "600", "700"],
});

// export const metadata = {
//   title: "Piyush | Software Engineer & Web Developer",
//   description:
//     "Portfolio of Piyush, a Software Engineer specializing in UI creation, animations, and dynamic user experiences with expertise in JavaScript, TypeScript, React, and NextJS.",
//   keywords:
//     "Piyush, Software Engineer, Frontend Developer, Web Developer, NextJS, React, JavaScript, TypeScript,India  Portfolio",
//   authors: [{ name: "Piyush", url: "/" }],
//   creator: "Piyush",
//   publisher: "Piyush",
//   openGraph: {
//     title: "Piyush | Software Engineer & Web Developer",
//     description:
//       "Portfolio of Piyush, a Software Engineer specializing in UI creation, animations, and dynamic user experiences.",
//     url: "/",
//     siteName: "Piyush Portfolio",
//     locale: "en_US",
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Piyush | Software Engineer & Web Developer",
//     description:
//       "Portfolio of Piyush, a Software Engineer specializing in UI creation, animations, and dynamic user experiences.",
//     creator: "@Piyush",
//   },
//   robots: {
//     index: true,
//     follow: true,
//   },
//   viewport: "width=device-width, initial-scale=1",
//   themeColor: "#2d2d2d",
//   colorScheme: "dark light",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={firaCode.className}>
      <body
        className={`w-full md:px-40 min-h-screen bg-secondary flex flex-col antialiased`}
      ><ThemeProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
