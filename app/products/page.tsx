import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ProductsCatalog from "@/components/ProductsCatalog";

export const metadata = {
  title: "Products — Maisam Steel Mill",
  description:
    "Certified steel rebar, angles, T-bars, billets, plate and structural sections — built to international standard.",
};

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Products"
          title={
            <>
              Steel built to <span className="text-accent">specification</span>
            </>
          }
          lead="A complete structural portfolio — each grade rolled to international standard and stamped MSM."
        />
        <section className="section bg-sand text-ink">
          <div className="container-x">
            <ProductsCatalog />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
