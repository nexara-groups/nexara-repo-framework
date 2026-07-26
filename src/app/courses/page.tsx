import { CourseLedger } from "../../components/course-ledger";
import { PageFrame } from "../../components/site-shell";
import { programmes } from "../../content/site";

export default function CoursesPage() { return <PageFrame><CourseLedger programmes={programmes} /></PageFrame>; }
