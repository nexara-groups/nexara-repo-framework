import { CourseLedger } from "../../components/course-ledger";
import { PageFrame } from "../../components/layout/page-frame";
import { programmes } from "../../content/site";

export default function CoursesPage() { return <PageFrame><CourseLedger programmes={programmes} /></PageFrame>; }
