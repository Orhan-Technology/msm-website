import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ProductsCatalog from "@/components/ProductsCatalog";
import { getPageHero, getProductCategories, getProducts } from "@/lib/cms/site-data";

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHero("products.hero");
  return { title: "Products", description: hero.lead, alternates: { canonical: "/products" } };
}

export default async function ProductsPage() {
  const [hero, products, categories] = await Promise.all([
    getPageHero("products.hero"),
    getProducts(),
    getProductCategories(),
  ]);

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
        <section className="section bg-sand text-ink">
          <div className="container-x">
            <ProductsCatalog products={products} categories={categories} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
