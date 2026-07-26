export type Programme = {
  slug: string;
  legacySlug: string;
  title: string;
  category: string;
  summary: string;
  image: string;
};

export const programmes: Programme[] = [
  { slug: "cybersecurity", legacySlug: "cyber-security-trainings", title: "Cybersecurity", category: "Security", summary: "Security foundations, defensive practice and role-aware preparation.", image: "/media/generated/courses/cybersecurity.webp" },
  { slug: "ai-machine-learning", legacySlug: "ai-ml-programs", title: "AI and Machine Learning", category: "Software and data", summary: "Applied data and machine learning foundations.", image: "/media/generated/courses/ai-ml.webp" },
  { slug: "networking", legacySlug: "networking-trainings", title: "Networking", category: "Infrastructure", summary: "Network concepts, systems and operations.", image: "/media/generated/courses/networking.webp" },
  { slug: "cloud", legacySlug: "cloud-trainings", title: "Cloud", category: "Infrastructure", summary: "Cloud and infrastructure learning paths.", image: "/media/generated/courses/cloud.webp" },
  { slug: "software-development", legacySlug: "software-trainings", title: "Software Development", category: "Software and data", summary: "Software development foundations and practice.", image: "/media/generated/courses/software.webp" },
  { slug: "sap", legacySlug: "sap-training", title: "SAP", category: "Enterprise", summary: "Enterprise systems learning paths.", image: "/media/generated/courses/sap.webp" },
  { slug: "databases", legacySlug: "database-trainings", title: "Databases", category: "Software and data", summary: "Database concepts and practical skills.", image: "/media/generated/courses/database.webp" },
  { slug: "storage", legacySlug: "storage-trainings", title: "Storage", category: "Infrastructure", summary: "Storage systems and infrastructure learning.", image: "/media/generated/courses/storage.webp" },
];

export type PageDefinition = {
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  focus: string[];
  action: { label: string; href: string };
  kind?: "organisation" | "editorial" | "support" | "portal";
};

export const pages: Record<string, PageDefinition> = {
  "about-us": { title: "A more deliberate start in technology.", eyebrow: "About Yojo", description: "Yojo Solutions is built around focused technology learning, personal attention and a clearer transition from training to work.", image: "/media/generated/home/quality-desk.webp", focus: ["Learner-first guidance", "Classroom learning in Visakhapatnam", "Live-online learning"], action: { label: "Talk to Yojo", href: "/contact" } },
  faculty: { title: "Learn with people who can make the work clear.", eyebrow: "Faculty", description: "Meet the teaching approach behind practical learning. Programme-specific faculty, schedules and current credentials are confirmed during an advisor conversation.", image: "/media/generated/home/workstation-threshold-security-clean.webp", focus: ["Practical explanation", "Targeted review", "Programme-specific expertise"], action: { label: "Ask about faculty", href: "/contact" } },
  events: { title: "See the work before you choose the route.", eyebrow: "Webinars and events", description: "Upcoming sessions and learning events are shared here when confirmed. Ask the team about the next relevant session.", image: "/media/official/live/resource-1.jpg", focus: ["Course discovery", "Technology introductions", "Advisor-led questions"], action: { label: "Ask about events", href: "/contact" } },
  insights: { title: "Useful reading for a better next decision.", eyebrow: "Articles", description: "Guides and updates from Yojo across technology learning, cybersecurity and career preparation.", image: "/media/official/live/resource-2.jpg", focus: ["Technology learning", "Career preparation", "Security and infrastructure"], action: { label: "Browse programmes", href: "/courses" }, kind: "editorial" },
  careers: { title: "Work with a team that cares how people learn.", eyebrow: "Careers", description: "Current opportunities are shared when confirmed. Send an enquiry to discuss relevant roles and future openings.", image: "/media/generated/home/quality-security-desk.webp", focus: ["Teaching and mentoring", "Technology services", "Operational support"], action: { label: "Contact Yojo", href: "/contact" } },
  faqs: { title: "Start with the questions that change your decision.", eyebrow: "FAQs", description: "Course level, delivery format, schedules, fees and support are confirmed directly so your route matches your situation.", image: "/media/generated/student/curriculum-map.webp", focus: ["Choosing a programme", "Learning formats", "Career support"], action: { label: "Ask a question", href: "/contact" }, kind: "support" },
  contact: { title: "Let’s find the right place to begin.", eyebrow: "Contact Yojo", description: "Tell us what you want to learn, where you are starting and how you prefer to study. A Yojo advisor can guide the next step.", image: "/media/generated/student/feedback-sheet.webp", focus: ["Programme guidance", "Classroom and online options", "Organisation enquiries"], action: { label: "Email Yojo", href: "mailto:info@yojosolutions.com?subject=Yojo%20learning%20enquiry" }, kind: "support" },
  portal: { title: "Learner access is being prepared with care.", eyebrow: "Student portal", description: "Secure student sign-in and registration will appear here when the guarded account service is ready. For now, use the advisor route for enrolment questions.", image: "/media/generated/student/practice-lab.webp", focus: ["Account access", "Learning updates", "Support requests"], action: { label: "Talk to an advisor", href: "/contact" }, kind: "portal" },
  services: { title: "Technology and security support for organisations.", eyebrow: "For organisations", description: "Yojo Solutions also supports organisations through cybersecurity, IT consulting, physical security and staff augmentation services.", image: "/media/atlas/security-field-1600.webp", focus: ["Cybersecurity services", "IT consulting", "Physical security and staffing"], action: { label: "Discuss your requirement", href: "/contact?interest=Organisation" }, kind: "organisation" },
  "cyber-security-services": { title: "Security services with a clear operating path.", eyebrow: "Cybersecurity services", description: "Discuss your organisation’s security requirement with Yojo. Scope, assessment and delivery are defined around the actual environment.", image: "/media/atlas/security-field-1600.webp", focus: ["Security assessment", "Security operations", "Risk-aware delivery"], action: { label: "Start a conversation", href: "/contact?interest=Cybersecurity" }, kind: "organisation" },
  "it-consulting-services": { title: "IT consulting grounded in the work that has to happen next.", eyebrow: "IT consulting", description: "Bring the requirement, systems and desired outcome. Yojo can help clarify the next technical move.", image: "/media/generated/home/workstation-threshold-security.webp", focus: ["Technology direction", "Infrastructure decisions", "Implementation support"], action: { label: "Discuss consulting", href: "/contact?interest=IT%20consulting" }, kind: "organisation" },
  "physical-security-services": { title: "Physical security needs a considered operating plan.", eyebrow: "Physical security", description: "Talk through your site, operational context and security requirement with a Yojo specialist.", image: "/media/generated/home/learning-system-security-console.webp", focus: ["Site requirements", "Security planning", "Support and coordination"], action: { label: "Discuss physical security", href: "/contact?interest=Physical%20security" }, kind: "organisation" },
  "staff-augmentation": { title: "Bring the right technical capacity into the work.", eyebrow: "Staff augmentation", description: "Yojo supports organisation requirements with technology talent and delivery conversations tailored to the role.", image: "/media/generated/home/quality-desk.webp", focus: ["Role definition", "Technical capacity", "Delivery alignment"], action: { label: "Discuss staffing", href: "/contact?interest=Staff%20augmentation" }, kind: "organisation" },
  "placement-and-career-services": { title: "Turn your learning evidence into a stronger next conversation.", eyebrow: "Career support", description: "Yojo supports resume preparation, mock interviews, job referrals and internship programmes where relevant. Support does not guarantee employment.", image: "/media/generated/student/placement-desk.webp", focus: ["Resume preparation", "Mock interviews", "Opportunity support"], action: { label: "Ask about career support", href: "/contact?interest=Career%20support" }, kind: "support" },
};

export const nav = [
  { label: "Programmes", href: "/courses" },
  { label: "Learning system", href: "/#learning-system" },
  { label: "Student trail", href: "/student-journey" },
  { label: "About", href: "/about-us" },
  { label: "Articles", href: "/insights" },
  { label: "For organisations", href: "/services" },
];
