import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import { team } from "@/lib/team";

export default function TeamGrid() {
  return (
    <section id="team" className="section bg-sand text-ink">
      <div className="container-x">
        <SectionHeading
          eyebrowNumber="05"
          eyebrowLabel="Team"
          align="center"
          title="The people behind the steel"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <Reveal key={m.slug} delay={i * 0.08}>
              <Link
                href={`/team/${m.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-card shadow-[0_18px_40px_-26px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-28px_rgba(0,0,0,0.5)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.image}
                  alt={m.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* legibility gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/25 to-transparent transition-colors duration-300 group-hover:from-charcoal group-hover:via-charcoal/40" />
                {/* accent line draws across on hover */}
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />

                <div className="absolute inset-x-0 bottom-0 p-5 text-sand">
                  <h3 className="text-lg text-sand transition-colors group-hover:text-accent">
                    {m.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-sand/70">{m.role}</p>
                  {/* socials slide up on hover */}
                  <div className="mt-3 flex translate-y-1.5 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {m.socials.map((s) => (
                      <span
                        key={s.label}
                        className="grid h-8 w-8 place-items-center rounded-btn border border-white/25 text-sand/85 transition-colors hover:border-accent hover:bg-accent hover:text-white"
                      >
                        <Icon name={s.icon} className="h-3.5 w-3.5" />
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
