import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  return {
    title: p ? `${p.name} — Maisam Steel Mill` : "Product",
    description: p?.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();
  const related = products
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <>
      <Header />
      <main>
        <section className="bg-charcoal pb-16 pt-28 text-sand md:pt-32">
          <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="overflow-hidden rounded-card border border-line-dark">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <Link
                href="/products"
                className="text-sm text-mist transition-colors hover:text-accent"
              >
                ← All products
              </Link>
              <span className="eyebrow mt-4">{product.category}</span>
              <h1 className="mt-3 text-sand">{product.name}</h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-mist">
                {product.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="sheen-btn inline-flex items-center justify-center rounded-btn bg-accent px-7 py-3.5 font-display text-sm font-medium text-white transition-colors hover:bg-accent-hover"
                >
                  Request a quote
                </Link>
                <a
                  href="#specs"
                  className="sheen-btn inline-flex items-center justify-center rounded-btn border border-sand/25 px-7 py-3.5 font-display text-sm font-medium text-sand transition-colors hover:bg-sand hover:text-ink"
                >
                  View specifications
                </a>
              </div>
              <p className="mt-4 text-xs text-mist">
                Custom sizes, grades and volumes available. Our team prepares a
                quote with delivery to your province.
              </p>
            </div>
          </div>
        </section>

        {/* Specs */}
        <section id="specs" className="section bg-sand text-ink">
          <div className="container-x grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2>Specifications</h2>
              <div className="mt-6 overflow-hidden rounded-card border border-line-light">
                <table className="w-full text-left text-sm">
                  <tbody>
                    {product.specs.map((s, i) => (
                      <tr
                        key={s.key}
                        className={i % 2 === 0 ? "bg-white" : "bg-sand"}
                      >
                        <th className="w-1/3 px-6 py-4 font-display font-medium text-ink">
                          {s.key}
                        </th>
                        <td className="px-6 py-4 text-ink/70">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <aside>
              <div className="rounded-card bg-charcoal p-7 text-sand">
                <h3 className="text-sand">Need a custom order?</h3>
                <p className="mt-2 text-sm text-mist">
                  Talk to our team about sizes, grades and volumes for your
                  project.
                </p>
                <Link
                  href="/contact"
                  className="sheen-btn mt-5 inline-flex w-full items-center justify-center rounded-btn bg-accent px-5 py-3.5 font-display text-sm font-medium text-white transition-colors hover:bg-accent-hover"
                >
                  Request a quote
                </Link>
              </div>
            </aside>
          </div>
        </section>

        {/* Related */}
        <section className="section bg-white text-ink">
          <div className="container-x">
            <h2 className="mb-10">Related products</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.08}>
                  <Link
                    href={`/product/${p.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-card border border-line-light bg-sand transition-all duration-300 hover:-translate-y-1 hover:border-ink/20"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="flex flex-1 flex-col p-5">
                      <span className="text-xs uppercase tracking-wide text-accent">
                        {p.category}
                      </span>
                      <h3 className="mt-1 text-lg group-hover:text-accent">
                        {p.name}
                      </h3>
                      <span className="mt-3 inline-flex items-center gap-1 font-display text-sm font-medium text-accent">
                        View product →
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
