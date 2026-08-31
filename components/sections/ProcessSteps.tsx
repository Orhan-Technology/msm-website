import ProcessStepsClient, {
  type ProcessStep,
  type ProcessTrack,
} from "@/components/sections/ProcessStepsClient";
import { section } from "@/lib/cms/content";

type ProcessContent = {
  eyebrowNumber: string;
  eyebrowLabel: string;
  title: string;
  lead: string;
  processes: ProcessTrack[];
  /** Pre-two-line shape. Kept so an overlay saved before this change still renders. */
  steps?: ProcessStep[];
  closingText: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
};

export default async function ProcessSteps({ eyebrowNumber }: { eyebrowNumber?: string }) {
  const content = await section<ProcessContent>("home.process");

  // The section used to hold one flat list of steps. If a stored overlay still
  // has that shape, wrap it as a single unnamed line rather than rendering
  // nothing at all.
  const processes: ProcessTrack[] = content.processes?.length
    ? content.processes
    : content.steps?.length
      ? [{ no: "01", label: "", caption: "", steps: content.steps }]
      : [];

  return (
    <ProcessStepsClient
      {...content}
      eyebrowNumber={eyebrowNumber ?? content.eyebrowNumber}
      processes={processes}
    />
  );
}
