import { whatsappHref } from "./contact";

export type PageTemplate = "marketing" | "editorial" | "organisation" | "support";

export type PageLink = { label: string; href: string; note?: string };

export type PageDefinition = {
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  imageAlt: string;
  focus: string[];
  action: { label: string; href: string };
  template: PageTemplate;
  /** Optional linked child pages, rendered as a card grid (e.g. Services hub). */
  links?: PageLink[];
};

export const pages: Record<string, PageDefinition> = {
  "about-us": {
    title: "Not sure which course actually hires? Ask us before you pay a rupee.",
    eyebrow: "About Yojo",
    description:
      "Yojo is a Visakhapatnam IT training and cybersecurity company. We train graduates and working professionals for real jobs — with trainers who have done the work, live labs, and interview prep that runs until you are placed. We will tell you what hires in 2026 even if the answer is not us.",
    image: "/media/cyber/student-lab.jpg",
    imageAlt: "A learner and instructor working together in a cybersecurity lab",
    focus: [
      "We will talk you out of the wrong course",
      "You meet the trainer first, in a free demo",
      "Placement support in writing — not a guarantee",
    ],
    action: { label: "Book a free demo class", href: "/contact#enquiry" },
    template: "marketing",
  },
  events: {
    title: "Sit in before you sign up.",
    eyebrow: "Webinars and events",
    description:
      "Free demo classes, career Q&As, and hands-on workshops — most of them live in Visakhapatnam or online. Come watch a real session before you decide on any course. No fee, no obligation to enrol.",
    image: "/media/official/live/resource-1.jpg",
    imageAlt: "A technology learning session",
    focus: [
      "Free demo class — watch a real lesson",
      "Career Q&A — which skill hires in 2026",
      "Hands-on workshop — one tool, one evening",
    ],
    action: {
      label: "Get the next event dates on WhatsApp",
      href: whatsappHref("Hello Yojo Solutions, please send me the next demo class and event dates."),
    },
    template: "editorial",
  },
  blog: {
    title: "Plain answers to the questions you're Googling anyway.",
    eyebrow: "Blogs and articles",
    description:
      "No filler posts. Just the things people ask us before enrolling — is CEH worth it, can a non-coder do cloud, what does a SOC analyst actually do all day — answered by trainers who work in the field.",
    image: "/media/official/live/resource-2.jpg",
    imageAlt: "Technology learning resources",
    focus: ["Career paths, decoded", "Tool and certification guides", "What the job is really like"],
    action: { label: "Browse programmes", href: "/courses" },
    template: "editorial",
  },
  careers: {
    title: "Teach, defend, or build — with a team that stays small on purpose.",
    eyebrow: "Careers",
    description:
      "We hire people who have done the work and can explain it without jargon. Trainers who have run real incidents. Security engineers who have handled live ones. If that is you, send your profile even when nothing is posted — we keep a bench.",
    image: "/media/cyber/consulting-review.jpg",
    imageAlt: "A cybersecurity team reviewing network infrastructure",
    focus: ["Trainers and mentors", "Cybersecurity and IT services", "Placement and operations"],
    action: {
      label: "Send your profile on WhatsApp",
      href: whatsappHref("Hello Yojo Solutions, I would like to share my profile for a role at Yojo."),
    },
    template: "editorial",
  },
  faqs: {
    title: "The questions that actually change your decision.",
    eyebrow: "FAQs",
    description:
      "Fees, duration, whether you need to code, whether placement is guaranteed — answered straight. If a number depends on your track, we say so and give you a range instead of dodging.",
    image: "/media/cyber/hero-signal.jpg",
    imageAlt: "A controlled security signal moving through dark infrastructure",
    focus: [
      "Fees, duration, and batches",
      "Do I have the background for this?",
      "Placement — what's promised, what isn't",
    ],
    action: {
      label: "Ask your own question on WhatsApp",
      href: whatsappHref("Hello Yojo Solutions, I have a question about your programmes."),
    },
    template: "support",
  },
  contact: {
    title: "Let us find the right place to begin.",
    eyebrow: "Contact Yojo",
    description:
      "Tell us what you want to learn, secure, or improve. An advisor can help you choose the next useful conversation.",
    image: "/media/cyber/hero-signal.jpg",
    imageAlt: "A precise cyan signal moving through dark security infrastructure",
    focus: ["Programme guidance", "Classroom and live-online options", "Organisation enquiries"],
    action: { label: "Start an enquiry", href: "#enquiry" },
    template: "support",
  },
  login: {
    title: "Student portal is coming. Enrolment isn't waiting on it.",
    eyebrow: "Login and register",
    description:
      "The learner login will go live once sign-in and account security are properly built — we are not shipping a half-secure portal for a cybersecurity company. Until then, enrol and get support directly through an advisor.",
    image: "/media/generated/student/student-security-practice.webp",
    imageAlt: "A learner working through a security exercise",
    focus: ["Secure account access — soon", "Batch and schedule updates", "Enrolment help now, on WhatsApp"],
    action: {
      label: "Enrol or ask on WhatsApp",
      href: whatsappHref("Hello Yojo Solutions, I would like to enrol or ask about learner access."),
    },
    template: "support",
  },
  services: {
    title: "Security and technology support for real operations.",
    eyebrow: "For organisations",
    description:
      "Yojo supports organisations through cybersecurity, IT consulting, physical security, and staff augmentation — scoped around the systems you actually operate.",
    image: "/media/cyber/consulting-review.jpg",
    imageAlt: "Cybersecurity consultants conducting an infrastructure review",
    focus: ["Cybersecurity services", "IT consulting", "Physical security and staffing"],
    action: { label: "Discuss your requirement", href: "/contact#enquiry" },
    template: "organisation",
    links: [
      {
        label: "Cybersecurity services",
        href: "/cyber-security-services",
        note: "Assessment, monitoring, and incident response for your environment.",
      },
      {
        label: "IT consulting",
        href: "/it-consulting-services",
        note: "Clarify the next technology decision with context.",
      },
      {
        label: "Physical security",
        href: "/physical-security-services",
        note: "Access control, surveillance, and site security planning.",
      },
      {
        label: "Staff augmentation",
        href: "/staff-augmentation",
        note: "Bring relevant technical capacity into the work.",
      },
    ],
  },
  "cyber-security-services": {
    title: "Improve security with a clear operating plan.",
    eyebrow: "Cybersecurity services",
    description:
      "Discuss your environment, risk, and desired outcome. Scope, assessment, and delivery are defined around the systems you actually operate.",
    image: "/media/cyber/consulting-review.jpg",
    imageAlt: "Cybersecurity specialists reviewing network risk",
    focus: ["Security assessment", "Security operations", "Risk-aware delivery"],
    action: { label: "Start a security conversation", href: "/contact#enquiry" },
    template: "organisation",
  },
  "it-consulting-services": {
    title: "Make the next technology decision with context.",
    eyebrow: "IT consulting",
    description:
      "Bring the requirement, current systems, and desired outcome. Yojo can help clarify a practical next move.",
    image: "/media/cyber/consulting-review.jpg",
    imageAlt: "Consultants reviewing infrastructure and technical risk",
    focus: ["Technology direction", "Infrastructure decisions", "Implementation support"],
    action: { label: "Discuss consulting", href: "/contact#enquiry" },
    template: "organisation",
  },
  "physical-security-services": {
    title: "Protect people, facilities, and critical assets.",
    eyebrow: "Physical security",
    description:
      "Plan access control, surveillance, monitoring, and site security around the operational context and actual risk.",
    image: "/media/official/live/resource-3.jpg",
    imageAlt: "A professional security operations environment",
    focus: ["Site requirements", "Security planning", "Support and coordination"],
    action: { label: "Discuss physical security", href: "/contact#enquiry" },
    template: "organisation",
  },
  "staff-augmentation": {
    title: "Bring relevant technical capacity into the work.",
    eyebrow: "Staff augmentation",
    description:
      "Define the role, technical context, and delivery expectation. Yojo can support a focused staffing conversation.",
    image: "/media/cyber/consulting-review.jpg",
    imageAlt: "A technology team working through an infrastructure review",
    focus: ["Role definition", "Technical capacity", "Delivery alignment"],
    action: { label: "Discuss staffing", href: "/contact#enquiry" },
    template: "organisation",
  },
  "placement-and-career-services": {
    title: "Present your learning with more confidence.",
    eyebrow: "Career support",
    description:
      "Yojo supports resume preparation, mock interviews, job referrals, and internship programmes where relevant. Support does not guarantee employment — see our outcomes for what that looks like in practice.",
    image: "/media/cyber/student-lab.jpg",
    imageAlt: "A learner receiving guidance during a cybersecurity lab",
    focus: ["Resume preparation", "Mock interviews", "Opportunity support"],
    action: { label: "See placement outcomes", href: "/outcomes" },
    template: "marketing",
  },
};

export type NavLink = { label: string; href: string; note?: string };
export type NavColumn = { heading: string; items: NavLink[] };
export type NavFeature = { title: string; body: string; href: string; cta: string };
export type NavGroup = {
  label: string;
  href?: string;
  /** Mega-menu columns. Groups without columns are plain top-level links. */
  columns?: NavColumn[];
  /** Optional promo card shown beside the columns. */
  feature?: NavFeature;
};

/**
 * Primary navigation, structured to the Nexara 10-page proposal plus the live
 * organisation Services line. Rendered as an animated mega-menu: each group's
 * optional `href` is its overview page; `columns` drive the multi-column panel
 * and `feature` an optional promo card. Courses holds the learner cluster,
 * Services only the true B2B lines.
 */
export const nav: NavGroup[] = [
  {
    label: "Courses",
    href: "/courses",
    columns: [
      {
        heading: "Start here",
        items: [
          { label: "All programmes", href: "/courses", note: "Every track with fees and batches" },
          { label: "Student journey", href: "/student-journey", note: "From demo class to first job" },
          { label: "Outcomes and placements", href: "/outcomes", note: "Real numbers and where learners landed" },
          { label: "Career support", href: "/placement-and-career-services", note: "Resume, mock interviews, referrals" },
        ],
      },
      {
        heading: "Course tracks",
        items: [
          { label: "Cybersecurity", href: "/courses/cybersecurity", note: "SOC, VAPT, blue team" },
          { label: "AI and Machine Learning", href: "/courses/ai-machine-learning", note: "Python, ML, applied projects" },
          { label: "Cloud", href: "/courses/cloud", note: "AWS and Azure, hands-on" },
          { label: "Networking", href: "/courses/networking", note: "CCNA-aligned, real labs" },
          { label: "Software Development", href: "/courses/software-development", note: "Full-stack, ship real apps" },
          { label: "SAP", href: "/courses/sap", note: "Enterprise modules" },
          { label: "Databases", href: "/courses/databases", note: "SQL, admin, data" },
          { label: "Storage", href: "/courses/storage", note: "SAN, NAS, backup" },
        ],
      },
    ],
    feature: {
      title: "Not sure which track fits?",
      body: "Sit in on a free demo class and ask a trainer directly before you decide.",
      href: "/contact#enquiry",
      cta: "Book a free demo",
    },
  },
  {
    label: "Services",
    href: "/services",
    columns: [
      {
        heading: "For organisations",
        items: [
          { label: "All services", href: "/services", note: "Overview of what we offer" },
          { label: "Cybersecurity services", href: "/cyber-security-services", note: "Assessment, monitoring, response" },
          { label: "IT consulting", href: "/it-consulting-services", note: "Clarify your next tech move" },
          { label: "Physical security", href: "/physical-security-services", note: "Access, surveillance, sites" },
          { label: "Staff augmentation", href: "/staff-augmentation", note: "Add technical capacity" },
        ],
      },
    ],
    feature: {
      title: "Need a security assessment?",
      body: "Tell us your environment and desired outcome, and we'll scope it around what you run.",
      href: "/contact#enquiry",
      cta: "Request a proposal",
    },
  },
  {
    label: "Company",
    columns: [
      {
        heading: "The company",
        items: [
          { label: "About Us", href: "/about-us", note: "Who we are and how we work" },
          { label: "Faculty", href: "/faculty", note: "Trainers who've done the job" },
          { label: "Careers", href: "/careers", note: "Work with us" },
        ],
      },
    ],
  },
  {
    label: "Resources",
    columns: [
      {
        heading: "Resources",
        items: [
          { label: "Webinars and events", href: "/events", note: "Free demos and career Q&As" },
          { label: "Blogs and articles", href: "/blog", note: "Plain guides from trainers" },
          { label: "FAQs", href: "/faqs", note: "Fees, duration, placement" },
        ],
      },
    ],
  },
  { label: "Contact", href: "/contact" },
];

/** Account entry, shown as a distinct action rather than a primary nav item. */
export const authLink: NavLink = { label: "Login / Register", href: "/login" };
