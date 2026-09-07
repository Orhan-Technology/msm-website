import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import IntroSection from "@/components/sections/IntroSection";
import ProductsShowcase from "@/components/sections/ProductsShowcase";
import ServicesGrid from "@/components/sections/ServicesGrid";
import ProcessSteps from "@/components/sections/ProcessSteps";
import QualitySection from "@/components/sections/QualitySection";
import TestingLab from "@/components/sections/TestingLab";
import GlobalPresence from "@/components/sections/GlobalPresence";
import ProjectsShowcase from "@/components/sections/ProjectsShowcase";
import EventsTeaser from "@/components/sections/EventsTeaser";
import CtaBanner from "@/components/sections/CtaBanner";
import Testimonials from "@/components/sections/Testimonials";
import LogoStrip from "@/components/sections/LogoStrip";
import CatalogDownload from "@/components/sections/CatalogDownload";
import BlogTeaser from "@/components/sections/BlogTeaser";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <IntroSection />
        <ProductsShowcase />
        <ServicesGrid />
        <ProcessSteps />
        <QualitySection />
        <TestingLab />
        <GlobalPresence />
        <ProjectsShowcase showCta />
        <EventsTeaser />
        <CtaBanner />
        <Testimonials />
        <LogoStrip />
        <CatalogDownload />
        <BlogTeaser />
      </main>
      <Footer />
    </>
  );
}
