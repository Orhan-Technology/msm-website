import { Link } from "@/i18n/navigation";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import { section } from "@/lib/cms/content";
import { getTeam } from "@/lib/cms/site-data";

type TeamContent = {
  eyebrowNumber: string;
  eyebrowLabel: string;
  title: string;
  description: string;
};

export default async function TeamGrid({ eyebrowNumber }: { eyebrowNumber?: string }) {
  const [content, team] = await Promise.all([section<TeamContent>("about.team"), getTeam()]);
  if (!team.length) return null;

  return (
    <section id="team" className="section bg-sand text-ink">
      <div className="container-x">
        <SectionHeading
          eyebrowNumber={eyebrowNumber ?? content.eyebrowNumber}
          eyebrowLabel={content.eyebrowLabel}
          align="center"
          title={content.title}
          description={content.description}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, index) => (
            <Reveal key={member.slug} delay={index * 0.08}>
              <Link
                href={`/team/${member.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-card shadow-[0_18px_40px_-26px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-28px_rgba(0,0,0,0.5)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-display text-lg font-semibold text-sand">{member.name}</p>
                  <p className="mt-0.5 text-sm text-accent">{member.role}</p>
                  {member.socials?.length > 0 && (
                    <div className="mt-3 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {member.socials.map((social) => (
                        <span
                          key={social.label}
                          className="grid h-8 w-8 place-items-center rounded-btn border border-white/25 text-sand"
                        >
                          <Icon name={social.icon} className="h-3.5 w-3.5" />
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
