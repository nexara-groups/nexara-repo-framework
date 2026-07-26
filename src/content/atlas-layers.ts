/**
 * The five Learning Atlas layers. This order is a visual contract: the approved
 * hero artifact (`public/design-reference/atlas-rise-v1.png`) shows these five
 * labels, in this sequence, on live plates. Changing the order or the labels is
 * a contract change, not a copy edit — see `tests/hero-contract.test.tsx`.
 */
export type AtlasLayerId = "guidance" | "curriculum" | "practice" | "feedback" | "placement";

export interface AtlasLayer {
  readonly id: AtlasLayerId;
  readonly label: string;
  readonly headline: string;
  readonly body: string;
}

export const ATLAS_LAYERS: readonly AtlasLayer[] = [
  {
    id: "guidance",
    label: "Guidance",
    headline: "Start with your actual position.",
    body: "Clarify your current skills, target role, available time and learning format before choosing a programme.",
  },
  {
    id: "curriculum",
    label: "Curriculum",
    headline: "Make the route visible.",
    body: "Foundations, tools and applied work are placed in a sequence you can understand before you commit.",
  },
  {
    id: "practice",
    label: "Practice",
    headline: "Turn recognition into capability.",
    body: "Labs, exercises and project work reveal what you can use independently and what needs another attempt.",
  },
  {
    id: "feedback",
    label: "Feedback",
    headline: "Create the next useful attempt.",
    body: "Specific review identifies what broke, why it broke and what to improve when you return to the work.",
  },
  {
    id: "placement",
    label: "Placement Support",
    headline: "Prepare the transition.",
    body: "Learning evidence becomes a clearer resume, interview preparation and relevant opportunity support where available.",
  },
];
