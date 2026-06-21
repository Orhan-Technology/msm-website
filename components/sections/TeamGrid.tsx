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
                className="group block overflow-hidden rounded-card border border-line-light bg-white transition-all duration-300 hover:-translate-y-1 hover:border-ink/20"
              >
                <div className="relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.image}
                    alt={m.name}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg group-hover:text-accent">{m.name}</h3>
                  <p className="mt-1 text-sm text-ink/55">{m.role}</p>
                  <div className="mt-3 flex gap-2">
                    {m.socials.map((s) => (
                      <span
                        key={s.label}
                        className="grid h-8 w-8 place-items-center rounded-btn border border-line-light text-ink/50 transition-colors group-hover:border-accent group-hover:text-accent"
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
