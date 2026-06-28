import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ProjectsShowcase from "@/components/sections/ProjectsShowcase";
import TestingLab from "@/components/sections/TestingLab";
import CtaBanner from "@/components/sections/CtaBanner";

export const metadata = {
  title: "Projects",
  description:
    "Flagship works and partnerships of Maisam Steel Mill — from the USAID-ABADE continuous-casting line to nationwide certified steel supply across Afghanistan.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Our work"
          title={
            <>
              Major <span className="text-accent">completed projects</span>
            </>
          }
          lead="From international partnerships to nationwide supply, Maisam steel is built into the projects rebuilding Afghanistan."
        />
        <ProjectsShowcase />
        <TestingLab eyebrowNumber="" />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
