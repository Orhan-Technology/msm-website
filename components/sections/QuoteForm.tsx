import { Mail, Phone, MapPin } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import { company } from "@/lib/company";

export default function QuoteForm() {
  return (
    <section id="quote" className="section bg-charcoal text-sand">
      <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            eyebrowNumber="08"
            eyebrowLabel="Contact"
            tone="dark"
            title="Contact us to request a quote"
            description="Tell us your sizes, quantities and delivery province. Our technical team responds with a quote and lead time — usually within 24 hours."
          />
          <div className="mt-8 space-y-4">
            <a
              href={`mailto:${company.email}`}
              className="flex items-center gap-4 rounded-card border border-line-dark bg-elevated p-5 transition-colors hover:border-white/20"
            >
              <span className="grid h-11 w-11 place-items-center rounded-btn bg-accent text-white">
                <Mail className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm text-mist">Email us</span>
                <span className="font-display text-sand">{company.email}</span>
              </span>
            </a>
            <a
              href={`tel:${company.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-4 rounded-card border border-line-dark bg-elevated p-5 transition-colors hover:border-white/20"
            >
              <span className="grid h-11 w-11 place-items-center rounded-btn bg-accent text-white">
                <Phone className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm text-mist">Call us</span>
                <span className="font-display text-sand">{company.phone}</span>
              </span>
            </a>
            <a
              href={company.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-card border border-line-dark bg-elevated p-5 transition-colors hover:border-white/20"
            >
              <span className="grid h-11 w-11 place-items-center rounded-btn bg-accent text-white">
                <MapPin className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm text-mist">Visit us</span>
                <span className="font-display text-sand">{company.address}</span>
              </span>
            </a>
          </div>
        </div>

        <div className="rounded-card border border-line-dark bg-elevated p-7 md:p-9">
          <ContactForm tone="dark" />
        </div>
      </div>
    </section>
  );
}
