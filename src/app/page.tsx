import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import PortfolioGrid from "@/components/PortfolioGrid";
import StatsCounter from "@/components/StatsCounter";
import JourneyPath from "@/components/JourneyPath";
import ContactSection from "@/components/ContactSection";
import { getProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function Home() {
  const projects = getProjects();
  return (
    <>
      <Hero />
      <Marquee />
      <PortfolioGrid projects={projects} />
      <StatsCounter />
      <JourneyPath />
      <ContactSection />
    </>
  );
}
