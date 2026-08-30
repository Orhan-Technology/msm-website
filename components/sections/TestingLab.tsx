import TestingLabClient, { type LabTest } from "@/components/sections/TestingLabClient";
import { section } from "@/lib/cms/content";
import { flattenValues } from "@/lib/cms/site-data";

type LabContent = {
  eyebrowNumber: string;
  eyebrow: string;
  title: string;
  lead: string;
  tests: LabTest[];
  standards: unknown;
};

export default async function TestingLab({ eyebrowNumber }: { eyebrowNumber?: string }) {
  const content = await section<LabContent>("home.lab");
  return (
    <TestingLabClient
      eyebrowNumber={eyebrowNumber ?? content.eyebrowNumber}
      eyebrow={content.eyebrow}
      title={content.title}
      lead={content.lead}
      tests={content.tests ?? []}
      standards={flattenValues(content.standards)}
    />
  );
}
