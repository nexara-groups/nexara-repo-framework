import { PageFrame } from "../../components/layout/page-frame";
import { StudentTrail } from "../../components/journey/student-trail";

export const metadata = { title: "Student journey" };

export default function StudentJourneyPage() {
  return (
    <PageFrame>
      <StudentTrail />
    </PageFrame>
  );
}
