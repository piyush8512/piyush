"use client";
import { Section, WrapSection } from "@/components/Section";
import { SubTitle } from "@/components/Titile";
import dynamic from "next/dynamic";

const ProfileMetrics = dynamic(() => import("@/components/ProfileMetrics"), { ssr: false });
import {
  Gamepad2,
  Heart,
  Code,
  Coffee,
  Music,
  Book,
  Camera,
  Plane,
} from "lucide-react";

// export const metadata = {
//   title: "About Piyush | Software Engineer & Web Developer",
//   description:
//     "Learn about Piyush's journey, skills, and experience as a Software Engineer specializing in UI development and animations.",
// };

const games = [
  "Cyberpunk 2077", "The Witcher 3", "Valorant", "CS2",
  "Apex Legends", "Elden Ring", "Red Dead Redemption 2", "GTA V"
];

const hobbies = [
  { name: "Gaming", icon: Gamepad2, description: "Exploring virtual worlds and competitive gaming" },
  { name: "Coding", icon: Code, description: "Building projects and learning new technologies" },
  { name: "Coffee", icon: Coffee, description: "Brewing the perfect cup for those late coding sessions" },
  { name: "Music", icon: Music, description: "Listening to everything from synthwave to lo-fi" },
  { name: "Reading", icon: Book, description: "Tech blogs, sci-fi novels, and programming books" },

  { name: "Travel", icon: Plane, description: "Exploring new places and cultures" },
];


export default function AboutPage() {
  return (
    <Section className="relative overflow-hidden">
      <WrapSection className="grid grid-cols-1 gap-y-12">
        <SubTitle line>
          GET /api/about<span className="text-green-500"> &nbsp;200 OK</span>
        </SubTitle>


        {/* About Header */}
        <div>
          <h1 className="text-4xl font-bold mb-4">About Me</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            A passionate developer who loves to code, game, and explore new technologies. 
            Here&apos;s a glimpse into my world beyond the terminal.
          </p>
        </div>

        {/* Profile Metrics */}
        <div className="mb-6">
          <ProfileMetrics />
        </div>

        

        {/* Games Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Gamepad2 className="text-primary w-6 h-6" />
            <h2 className="text-2xl font-bold">Games I Play</h2>
          </div>
          <div className="border  /50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Current Gaming Library</h3>
            <div className="flex flex-wrap gap-2">
              {games.map((game) => (
                <span key={game} className="px-3 py-1 text-sm bg-white/10 border   rounded-full">
                  {game}
                </span>
              ))}
            </div>
            <p className="text-muted-foreground mt-4">
              Always looking for new co-op partners or competitive teammates. Hit me up if you want to squad up!
            </p>
          </div>
        </section>

        {/* Hobbies */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Heart className="text-primary w-6 h-6" />
            <h2 className="text-2xl font-bold">Hobbies & Interests</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hobbies.map((hobby) => (
              <div
                key={hobby.name}
                className="border  /50 p-4 rounded-lg hover:  transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <hobby.icon className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">{hobby.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{hobby.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fun Facts */}
        {/* <section>
          <h2 className="text-2xl font-bold mb-4">Random Facts About Me</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {facts.map((fact, index) => (
              <div
                key={index}
                className="border  /50 p-4 rounded-lg hover:bg-white/5 transition-colors"
              >
                <span className="text-primary font-mono text-sm">#{index + 1}</span>
                <p className="text-muted-foreground mt-1">{fact}</p>
              </div>
            ))}
          </div>
        </section> */}

        {/* Quote */}
        <section className="text-center pt-12">
          <blockquote className="italic text-muted-foreground text-xl max-w-2xl mx-auto mb-2">
            &quot;Code is poetry, games are art, and coffee is life. Always learning, always building, always gaming.&quot;
          </blockquote>
          <div className="text-primary font-mono">— Me, probably at 3 AM</div>
        </section>
      </WrapSection>
    </Section>
  );
}
