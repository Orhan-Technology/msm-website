import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import ContactDetails from "@/components/ContactDetails";
import { section } from "@/lib/cms/content";
import { getCompany, getPageHero } from "@/lib/cms/site-data";

type ContactFormContent = {
  formTitle: string;
  detailsTitle: string;
  submitLabel: string;
  successMessage: string;
  showMap: boolean;
  mapLinkLabel: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHero("contact.hero");
  return { title: "Contact", description: hero.lead, alternates: { canonical: "/contact" } };
}

export default async function ContactPage() {
  const [hero, form, company] = await Promise.all([
    getPageHero("contact.hero"),
    section<ContactFormContent>("contact.form"),
    getCompany(),
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
          <div className="container-x grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div className="rounded-card border border-line-light bg-white p-7 md:p-9">
              <h2 className="mb-6">{form.formTitle}</h2>
              <ContactForm
                tone="light"
                submitLabel={form.submitLabel}
                successMessage={form.successMessage}
              />
            </div>
            <div>
              <h3 className="mb-6">{form.detailsTitle}</h3>
              <ContactDetails layout="stack" tone="light" />
            </div>
          </div>

          {form.showMap !== false && company.mapEmbed && (
            <div className="container-x mt-12">
              <div className="overflow-hidden rounded-card border border-line-light">
                <iframe
                  title={`${company.name} location — ${company.address}`}
                  src={company.mapEmbed}
                  width="100%"
                  height="420"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block w-full"
                  style={{ border: 0 }}
                  allowFullScreen
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-ink/60">
                <MapPin className="h-4 w-4 text-accent" />
                <span>{company.address}</span>
                {company.mapLink && (
                  <a
                    href={company.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-accent hover:text-accent-hover"
                  >
                    {form.mapLinkLabel}
                  </a>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
