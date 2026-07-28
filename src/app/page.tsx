import { DomainMatrix } from "../components/home/domain-matrix";
import { EventsTeaser } from "../components/home/events-teaser";
import { GuidanceCard } from "../components/home/guidance-card";
import { ProofBand } from "../components/home/proof-band";
import { SecurityHero } from "../components/hero/security-hero";
import { JourneySequence } from "../components/journey/journey-sequence";
import { PageFrame } from "../components/layout/page-frame";
import { getPublicServices } from "./_services";

export default async function HomePage() {
  const { learningCatalogue } = getPublicServices();
  const result = await learningCatalogue.list();
  if (!result.ok) throw new Error(result.error.message);

  return (
    <PageFrame>
      <SecurityHero />
      <ProofBand />
      <DomainMatrix programmes={result.value} />
      <JourneySequence />
      <EventsTeaser />
      <GuidanceCard />
    </PageFrame>
  );
}
