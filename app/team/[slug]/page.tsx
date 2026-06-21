import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import CtaBanner from "@/components/sections/CtaBanner";
import { team } from "@/lib/team";

export function generateStaticParams() {
  return team.map((m) => ({ slug: m.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const m = team.find((t) => t.slug === params.slug);
  return {
    title: m ? `${m.name} — Maisam Steel Mill` : "Team — Maisam Steel Mill",
    description: m?.bio,
  };
}

export default function TeamMemberPage({
  params,
}: {
  params: { slug: string };
}) {
  const member = team.find((m) => m.slug === params.slug);
  if (!member) notFound();

  return (
    <>
      <Header />
      <main>
        <section className="bg-charcoal text-sand">
          <div className="container-x pb-16 pt-36 md:pt-40">
            <Link
              href="/about#team"
              className="inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4" /> Back to team
            </Link>
            <div className="mt-8 grid gap-10 md:grid-cols-[340px_1fr] md:items-start">
              <div className="overflow-hidden rounded-card border border-line-dark">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <div>
                <span className="eyebrow">{member.role}</span>
                <h1 className="mt-3 text-sand">{member.name}</h1>
                <div className="mt-5 flex gap-2">
                  {member.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="sheen-btn grid h-10 w-10 place-items-center rounded-btn border border-line-dark text-mist transition-colors hover:border-accent hover:text-accent"
                    >
                      <Icon name={s.icon} className="h-4 w-4" />
                    </a>
                  ))}
                </div>
                <p className="mt-8 max-w-2xl text-base leading-relaxed text-mist">
                  {member.bio}
                </p>
              </div>
            </div>
          </div>
        </section>

        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
