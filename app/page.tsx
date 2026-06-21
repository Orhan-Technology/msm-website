import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import IntroSection from "@/components/sections/IntroSection";
import ProductsShowcase from "@/components/sections/ProductsShowcase";
import ServicesGrid from "@/components/sections/ServicesGrid";
import ProcessSteps from "@/components/sections/ProcessSteps";
import QualitySection from "@/components/sections/QualitySection";
import CtaBanner from "@/components/sections/CtaBanner";
import Testimonials from "@/components/sections/Testimonials";
import LogoStrip from "@/components/sections/LogoStrip";
import QuoteForm from "@/components/sections/QuoteForm";
import BlogTeaser from "@/components/sections/BlogTeaser";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <IntroSection />
        <ProductsShowcase eyebrowNumber="02" />
        <ServicesGrid eyebrowNumber="03" />
        <ProcessSteps eyebrowNumber="04" />
        <QualitySection eyebrowNumber="05" />
        <CtaBanner />
        <Testimonials />
        <LogoStrip />
        <QuoteForm />
        <BlogTeaser />
      </main>
      <Footer />
    </>
  );
}
