import { PageFrame } from "../../components/layout/page-frame";
import { JourneySequence } from "../../components/journey/journey-sequence";

export const metadata = { title: "Student journey" };

export default function StudentJourneyPage() {
  return (
    <PageFrame>
      <JourneySequence standalone />
    </PageFrame>
  );
}
