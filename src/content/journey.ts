export type JourneyStageId = "assess" | "choose" | "route" | "practice" | "transition";

export interface JourneyStage {
  readonly id: JourneyStageId;
  readonly title: string;
  readonly body: string;
  readonly outcome: string;
  readonly checkpoints: readonly string[];
  readonly artDescription: string;
}

export const JOURNEY_STAGES: readonly JourneyStage[] = [
  {
    id: "assess",
    title: "Understand your starting point",
    body:
      "A focused conversation identifies your current skills, available time, preferred format, and the work you want to move toward.",
    outcome: "A realistic starting level",
    checkpoints: ["Current knowledge", "Available time", "Learning goal"],
    artDescription: "An animated diagnostic radar scanning a protected skill profile",
  },
  {
    id: "choose",
    title: "Choose the role, not the hype",
    body:
      "Compare the actual work behind cybersecurity, cloud, networking, software, data, and enterprise systems before committing.",
    outcome: "A direction you can explain",
    checkpoints: ["Cybersecurity", "Cloud and networking", "Software and data"],
    artDescription: "An animated decision map branching into three technology paths",
  },
  {
    id: "route",
    title: "Build a visible learning route",
    body:
      "Foundations, tools, labs, and applied work are sequenced so you know what you are learning and why it comes next.",
    outcome: "A clear roadmap",
    checkpoints: ["Core foundations", "Tools and labs", "Applied work"],
    artDescription: "An animated learning route connecting foundations, tools, and applied work",
  },
  {
    id: "practice",
    title: "Practise, review, repeat",
    body:
      "Hands-on work exposes weak spots. Targeted feedback turns each attempt into a more useful one.",
    outcome: "Work you can demonstrate",
    checkpoints: ["Attempt the work", "Review weak spots", "Repeat with purpose"],
    artDescription: "An animated practice loop moving through attempt, feedback, and repetition",
  },
  {
    id: "transition",
    title: "Prepare for the next conversation",
    body:
      "Resume preparation, mock interviews, referrals, and internship support can help you present your learning with more confidence.",
    outcome: "Stronger career readiness",
    checkpoints: ["Resume preparation", "Mock interviews", "Opportunity support"],
    artDescription: "An animated evidence document moving toward a verified opportunity",
  },
] as const;
