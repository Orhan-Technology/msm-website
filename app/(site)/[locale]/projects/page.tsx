import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ProjectsShowcase from "@/components/sections/ProjectsShowcase";
import TestingLab from "@/components/sections/TestingLab";
import CtaBanner from "@/components/sections/CtaBanner";
import { getPageHero } from "@/lib/cms/site-data";

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHero("projects.hero");
  return { title: "Projects", description: hero.lead, alternates: { canonical: "/projects" } };
}

export default async function ProjectsPage() {
  const hero = await getPageHero("projects.hero");

  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow={hero.eyebrow}
          title={
            <>
              {hero.titleLead} {hero.titleAccent && <span className="text-accent">{hero.titleAccent}</span>}
            </>
          }
          lead={hero.lead}
        />
        <ProjectsShowcase />
        <TestingLab eyebrowNumber="" />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
