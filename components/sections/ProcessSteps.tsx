import ProcessStepsClient, { type ProcessStep } from "@/components/sections/ProcessStepsClient";
import { section } from "@/lib/cms/content";

type ProcessContent = {
  eyebrowNumber: string;
  eyebrowLabel: string;
  title: string;
  lead: string;
  steps: ProcessStep[];
  closingText: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
};

export default async function ProcessSteps({ eyebrowNumber }: { eyebrowNumber?: string }) {
  const content = await section<ProcessContent>("home.process");
  return (
    <ProcessStepsClient
      {...content}
      eyebrowNumber={eyebrowNumber ?? content.eyebrowNumber}
      steps={content.steps ?? []}
    />
  );
}
