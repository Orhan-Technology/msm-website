import { Eye, Target } from "lucide-react";
import Reveal from "@/components/Reveal";
import { section } from "@/lib/cms/content";

type VisionMissionContent = {
  visionTitle: string;
  visionBody: string;
  missionTitle: string;
  missionBody: string;
  image: string;
};

export default async function VisionMission({ eyebrowNumber }: { eyebrowNumber?: string }) {
  const content = await section<VisionMissionContent>("about.visionMission");

  const blocks = [
    {
      icon: Eye,
      label: content.visionTitle,
      body: content.visionBody,
      image: content.image || "/images/plant/molten-stream.jpg",
    },
    {
      icon: Target,
      label: content.missionTitle,
      body: content.missionBody,
      image: "/images/plant/worker-furnace-2.jpg",
    },
  ];

  return (
    <section className="section bg-charcoal text-sand">
      <div className="container-x">
        {/* Heading */}
        <Reveal>
          <div className="flex items-center gap-3">
            {eyebrowNumber && (
              <span className="font-display text-5xl font-bold leading-none text-accent md:text-6xl">
                {eyebrowNumber}
              </span>
            )}
            <span className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-accent/75">
              Vision &amp; mission
            </span>
          </div>
          <h2 className="mt-6 max-w-2xl text-sand" style={{ fontStretch: "115%" }}>
            What we&apos;re building, and the standard we hold
          </h2>
        </Reveal>

        {/* Two cinematic panels */}
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {blocks.map((block, index) => {
            const Ic = block.icon;
            return (
              <Reveal key={block.label} delay={index * 0.12}>
                <div className="group relative flex min-h-[460px] flex-col justify-end overflow-hidden rounded-card md:min-h-[520px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={block.image}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/85 to-charcoal/25" />

                  <div className="relative p-8 md:p-10">
                    <span className="grid h-14 w-14 place-items-center rounded-btn bg-accent text-white shadow-lg shadow-accent/20">
                      <Ic className="h-7 w-7" strokeWidth={1.5} />
                    </span>
                    <h3 className="mt-6 text-2xl text-sand md:text-[1.75rem]" style={{ fontStretch: "115%" }}>
                      {block.label}
                    </h3>
                    <span className="mt-3 block h-[2px] w-10 bg-accent transition-all duration-500 group-hover:w-20" />
                    <p className="mt-5 max-w-md text-[15px] leading-relaxed text-sand/85 md:text-base">
                      {block.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
