import { MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import ContactDetails from "@/components/ContactDetails";
import { company } from "@/lib/company";

export const metadata = { title: "Contact — Maisam Steel Mill" };

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Contact"
          title={
            <>
              Let&apos;s build <span className="text-accent">something that lasts</span>
            </>
          }
          lead="Tell us your sizes, quantities and delivery province — we respond with a quote and lead time, usually within 24 hours."
        />

        <section className="section bg-sand text-ink">
          <div className="container-x grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div className="rounded-card border border-line-light bg-white p-7 md:p-9">
              <h2 className="mb-6">Send us a message</h2>
              <ContactForm tone="light" />
            </div>
            <div>
              <h3 className="mb-6">Contact details</h3>
              <ContactDetails layout="stack" tone="light" />
            </div>
          </div>

          {/* Google map */}
          <div className="container-x mt-12">
            <div className="overflow-hidden rounded-card border border-line-light">
              <iframe
                title={`${company.name} location — ${company.address}`}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3025!2d69.2831565!3d34.5552596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d16cb3eaa105d5%3A0xe4f019605915ab36!2sMaisam%20Steel%20Mill!5e0!3m2!1sen!2saf!4v1718900000000!5m2!1sen!2saf"
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
              <a
                href={company.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent hover:text-accent-hover"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
