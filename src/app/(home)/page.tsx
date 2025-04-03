import { BrainIcon, CalendarIcon, GridIcon } from "lucide-react";
import { ThemeToggle } from "./_components/theme-toggle";
import WorkflowDemo from "./_components/workflow-demo/workflow-demo";
import FeatureCard from "./_components/feature-card";
import Navbar from "./_components/navbar/navbar";
import Hero from "./_components/hero";
import SectionWrapper from "./_components/section-wrapper";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomePage() {
  return (
    <div className="from-primary/20 to-background min-h-screen bg-radial pt-16">
      <header className="fixed inset-x-0 top-0 z-50">
        <Navbar />
      </header>

      <main className="container px-6 pt-32 pb-0 sm:pt-30 md:pt-24 lg:px-16 xl:px-24">
        <SectionWrapper>
          <Hero />
        </SectionWrapper>

        <SectionWrapper>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <FeatureCard
              title="Drag &amp; Drop Interface"
              description="Design your scraping workflow with an intuitive visual editor. Drag and drop nodes effortlessly to build custom execution paths with seamless connectivity."
              icon={GridIcon}
            />
            <FeatureCard
              title=" Smart Scheduling"
              description="Automate your scraping tasks with a robust scheduling system. Set intervals, manage cron jobs, and run tasks on demand."
              icon={CalendarIcon}
            />
            <FeatureCard
              title="AI-Powered Scraping"
              description="Supercharge your data extraction with AI. Our AI-powered assistant processes raw HTML or text, delivering exactly what you need in clean JSON format—no fluff, no noise, just pure, structured data."
              icon={BrainIcon}
            />
          </div>
        </SectionWrapper>

        <SectionWrapper>
          <h3 className="mb-2 text-3xl font-semibold">Try it out</h3>
          <p className="text-muted-foreground mb-6 text-base text-pretty">
            Easily connect your nodes to create custom execution paths.
          </p>
          <WorkflowDemo />
        </SectionWrapper>
      </main>

      <footer className="bg-background border-t">
        <div className="container flex items-center justify-between px-6 lg:px-16 xl:px-24">
          <span className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} {siteConfig.name}.
          </span>
          <ThemeToggle />
        </div>
      </footer>
    </div>
  );
}
