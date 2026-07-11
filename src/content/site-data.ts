export type Service = {
  slug: string;
  number: string;
  name: string;
  short: string;
  detail: string;
  image: string;
  alt: string;
};

export const services: Service[] = [
  {
    slug: "eecp-therapy",
    number: "01",
    name: "EECP Therapy",
    short: "A considered, non-invasive pathway for heart health.",
    detail:
      "Enhanced External Counterpulsation is delivered as an outpatient therapy with clinical monitoring and a calm, step-by-step experience.",
    image: "/images/eecp-treatment.webp",
    alt: "Patient receiving EECP therapy while a clinician monitors the session",
  },
  {
    slug: "diagnostics",
    number: "02",
    name: "Diagnostic Services",
    short: "Clear answers, handled with precision.",
    detail:
      "Modern diagnostic support designed to help your care team move from questions to a confident next step.",
    image: "/images/diagnostics.webp",
    alt: "Technician preparing a patient for a diagnostic scan",
  },
  {
    slug: "pharmacy",
    number: "03",
    name: "Pharmacy Services",
    short: "Reliable medication access, close to care.",
    detail:
      "An in-house pharmacy experience centred on authenticity, guidance, and everyday ease.",
    image: "/images/pharmacy.webp",
    alt: "Pharmacist speaking with a patient at a modern pharmacy counter",
  },
  {
    slug: "opd",
    number: "04",
    name: "OPD Services",
    short: "Thoughtful consultations across specialties.",
    detail:
      "Outpatient consultations that make space for questions, context, and a clear plan forward.",
    image: "/images/opd-consultation.webp",
    alt: "Doctor listening to a patient in a calm consultation room",
  },
];

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/eecp-therapy", label: "EECP Therapy" },
  { href: "/services", label: "Care services" },
  { href: "/doctors", label: "Doctors" },
  { href: "/resources", label: "Resources" },
];

export const contact = {
  phone: "+91 98000 49696",
  phoneHref: "tel:+919800049696",
  whatsappHref: "https://wa.me/919800049696",
  email: "info@risemedicalhub.com",
  address: "#2-156, MIG 664, Revenue Ward 5, Madhurawada, Visakhapatnam, Andhra Pradesh 530048",
};

/* ——— Departments & specialties ——— */
export type Department = { name: string; short: string; note?: string };

export const departments: Department[] = [
  { name: "Cardiology & EECP", short: "Heart health consultations, risk assessment, and our signature non-surgical EECP programme.", note: "Signature" },
  { name: "General & Internal Medicine", short: "First-line care for fevers, infections, fatigue, and the everyday questions in between." },
  { name: "Diabetology", short: "Structured diabetes care — sugar control, complication screening, and practical routines." },
  { name: "Hypertension & Lipid Clinic", short: "Blood pressure and cholesterol managed with clear targets and regular review." },
  { name: "Pulmonology", short: "Breathing difficulties, asthma, and COPD assessed with calm, methodical care." },
  { name: "Orthopedics & Joint Care", short: "Bone, joint, and back concerns — from first assessment to recovery guidance." },
  { name: "Women's Health", short: "Consultations and screening built around comfort, privacy, and unhurried time." },
  { name: "Physiotherapy & Rehab", short: "Guided recovery programmes that keep you moving between consultations." },
];

/* ——— Doctors directory ———
   Placeholder profiles: replace names, qualifications, and timings with
   verified details from the clinical team before launch. */
export type Doctor = {
  name: string;
  role: string;
  department: string;
  qualifications: string;
  focus: string;
  languages: string;
  timings: string;
  initials: string;
};

export const doctors: Doctor[] = [
  { name: "Dr. Ramesh Kumar", role: "Consultant Cardiologist", department: "Cardiology & EECP", qualifications: "MBBS, MD (General Medicine), DM (Cardiology)", focus: "Refractory angina, EECP therapy planning, and long-term heart failure care.", languages: "Telugu · English · Hindi", timings: "Mon–Sat · 10:00–14:00", initials: "RK" },
  { name: "Dr. Sailaja Devi", role: "Consultant Physician", department: "General & Internal Medicine", qualifications: "MBBS, MD (Internal Medicine)", focus: "Complex multi-system conditions, preventive reviews, and second opinions.", languages: "Telugu · English", timings: "Mon–Sat · 09:30–13:30", initials: "SD" },
  { name: "Dr. Anil Varma", role: "Diabetologist", department: "Diabetology", qualifications: "MBBS, MD, Fellowship in Diabetology", focus: "Type 2 diabetes reversal programmes, insulin optimisation, and foot care.", languages: "Telugu · English · Hindi", timings: "Mon–Fri · 17:00–20:00", initials: "AV" },
  { name: "Dr. Padma Priya", role: "Consultant — Women's Health", department: "Women's Health", qualifications: "MBBS, MS (OBG)", focus: "Well-woman checks, menopause care, and preventive screening.", languages: "Telugu · English", timings: "Tue–Sat · 11:00–14:00", initials: "PP" },
  { name: "Dr. Suresh Babu", role: "Consultant Pulmonologist", department: "Pulmonology", qualifications: "MBBS, MD (Pulmonary Medicine)", focus: "Asthma and COPD programmes, sleep-related breathing concerns.", languages: "Telugu · English", timings: "Mon–Sat · 18:00–20:30", initials: "SB" },
  { name: "Dr. Kavitha Rao", role: "Physiotherapist — Rehab Lead", department: "Physiotherapy & Rehab", qualifications: "BPT, MPT (Cardio-respiratory)", focus: "Post-EECP conditioning, cardiac rehab, and mobility programmes.", languages: "Telugu · English · Hindi", timings: "Mon–Sat · 08:00–13:00", initials: "KR" },
];

/* ——— Diagnostic & laboratory services ——— */
export type LabCategory = { name: string; note: string; tests: string[] };

export const labCategories: LabCategory[] = [
  { name: "Cardiac diagnostics", note: "The heart, measured properly", tests: ["12-lead ECG", "2D Echocardiogram", "Treadmill Test (TMT)", "24hr Holter monitoring", "Ambulatory BP monitoring"] },
  { name: "Pathology & blood work", note: "Everyday answers, same-day reports", tests: ["Complete blood count (CBC)", "Lipid profile", "HbA1c & fasting glucose", "Thyroid profile (T3, T4, TSH)", "Liver & kidney function", "Vitamin D and B12"] },
  { name: "Imaging", note: "See clearly before deciding", tests: ["Digital X-ray", "Ultrasound abdomen & pelvis", "Doppler studies"] },
  { name: "Preventive panels", note: "Built into every health package", tests: ["Executive health panel", "Diabetes risk panel", "Cardiac risk panel", "Women's wellness panel"] },
];

/* ——— Health packages ——— */
export type HealthPackage = {
  slug: string;
  name: string;
  tagline: string;
  idealFor: string;
  duration: string;
  inclusions: string[];
  highlight?: boolean;
};

export const healthPackages: HealthPackage[] = [
  { slug: "essential", name: "Rise Essential Check", tagline: "The sensible annual once-over.", idealFor: "Adults 25+ who want a clear yearly baseline.", duration: "~2 hours · reports in 24h", inclusions: ["Physician consultation", "Complete blood count", "Fasting glucose & HbA1c", "Lipid profile", "Kidney & liver function", "12-lead ECG", "BMI & BP assessment", "Diet & lifestyle review"] },
  { slug: "heart", name: "Comprehensive Heart Check", tagline: "Know your heart before it asks.", idealFor: "Anyone 35+ with family history, BP, diabetes, or chest discomfort.", duration: "~3 hours · cardiologist reviewed", inclusions: ["Cardiologist consultation", "2D Echocardiogram", "Treadmill Test (TMT)", "12-lead ECG", "Lipid profile & hs-CRP", "Blood sugar panel", "Cardiac risk scoring", "Personalised prevention plan"], highlight: true },
  { slug: "diabetes", name: "Diabetes Care Package", tagline: "Sugar control, seen whole.", idealFor: "People living with diabetes or newly diagnosed.", duration: "~2.5 hours · with diabetologist", inclusions: ["Diabetologist consultation", "HbA1c & glucose profile", "Kidney function & microalbumin", "Lipid profile", "Foot & neuropathy screening", "Eye check referral", "ECG", "Meal-plan consultation"] },
  { slug: "senior", name: "Senior Wellness 60+", tagline: "Unhurried care for a fuller picture.", idealFor: "Seniors who want one calm, complete review.", duration: "~3 hours · family debrief included", inclusions: ["Physician & cardiology review", "Complete blood work", "2D Echo & ECG", "Bone & vitamin panel", "Memory & mobility screen", "Medication review", "Fall-risk assessment", "Written family summary"] },
];

/* ——— Health camps & community programmes ——— */
export type CommunityProgram = { name: string; short: string; cadence: string };

export const communityPrograms: CommunityProgram[] = [
  { name: "Heart health screening camps", short: "Free BP, sugar, and cardiac-risk screening with on-the-spot physician guidance.", cadence: "Monthly · Madhurawada & nearby wards" },
  { name: "Workplace wellness drives", short: "Half-day screening and awareness sessions brought to offices and campuses.", cadence: "On request · teams of 20+" },
  { name: "Diabetes awareness programmes", short: "Practical sessions on food, movement, and monitoring — in Telugu and English.", cadence: "Quarterly · community halls" },
  { name: "School & college health talks", short: "Age-appropriate sessions on nutrition, screen habits, and everyday first aid.", cadence: "On invitation · academic year" },
];

/* ——— Patient testimonials ———
   Placeholder quotes: replace with consented, verified patient words before launch. */
export type Testimonial = { quote: string; name: string; context: string };

export const testimonials: Testimonial[] = [
  { quote: "After 35 EECP sessions I can walk to the temple and back without stopping. Nobody rushed me, and everything was explained in Telugu.", name: "Venkat R.", context: "EECP programme · 68" },
  { quote: "The doctor spent twenty minutes just listening. I have never had a consultation like that before.", name: "Lakshmi S.", context: "OPD consultation" },
  { quote: "Reports were ready the same evening and someone actually called to explain them. That phone call is why we keep coming back.", name: "Prasad K.", context: "Diagnostics · health package" },
  { quote: "My father's medicines, tests, and cardiology review all happen under one roof now. It has removed so much stress from our month.", name: "Divya M.", context: "Caregiver · senior wellness" },
  { quote: "I was told surgery was my only option. EECP gave me another road, and my breathlessness has genuinely eased.", name: "Syed A.", context: "EECP programme · 61" },
  { quote: "Clean, calm, and on time. The pharmacy had everything ready before I finished my consultation.", name: "Ramya T.", context: "OPD & pharmacy" },
];

/* ——— Health awareness blog ——— */
export type Post = {
  slug: string;
  title: string;
  tag: string;
  date: string;
  readMinutes: number;
  excerpt: string;
  intro: string;
  sections: { heading: string; body: string }[];
  takeaways: string[];
};

export const posts: Post[] = [
  {
    slug: "understanding-eecp",
    title: "EECP, explained simply: how pressure becomes blood flow",
    tag: "Heart health",
    date: "2026-06-18",
    readMinutes: 6,
    excerpt: "A plain-language walkthrough of Enhanced External Counterpulsation — what happens in a session, who it helps, and what the course involves.",
    intro: "Enhanced External Counterpulsation (EECP) sounds technical, but the idea is beautifully simple: use carefully timed pressure on the legs to help blood reach the heart — without surgery, anaesthesia, or recovery beds.",
    sections: [
      { heading: "What actually happens in a session", body: "You lie on a treatment bed while inflatable cuffs are wrapped around your calves, thighs, and hips. Guided by your own ECG, the cuffs inflate in quick sequence — calves first, hips last — in the resting phase between heartbeats, gently pushing blood back toward the heart. Just before the next beat, all cuffs release at once. A session lasts about an hour, and most people read, listen to music, or doze." },
      { heading: "Who it is considered for", body: "EECP is typically discussed for people with persistent angina or reduced exercise tolerance despite medicines, and for those who are not good candidates for — or prefer to avoid — another procedure. Your cardiologist will assess your history, echo, and current medicines before recommending a course." },
      { heading: "What a course looks like", body: "A standard course is 35 sessions, usually one hour a day over about seven weeks. Improvement is gradual: many patients first notice they can walk further before symptoms appear. You walk in and walk out of every session — no admission required." },
    ],
    takeaways: ["EECP is non-surgical and done as an outpatient therapy", "Sessions are timed to your own heartbeat using ECG", "A standard course is 35 one-hour sessions over ~7 weeks", "Suitability is always a cardiologist's decision"],
  },
  {
    slug: "blood-pressure-basics",
    title: "The two numbers: making sense of your blood pressure",
    tag: "Prevention",
    date: "2026-06-02",
    readMinutes: 5,
    excerpt: "What systolic and diastolic actually mean, why one reading is never the full story, and how to measure at home properly.",
    intro: "Blood pressure is the most frequently measured — and most frequently misunderstood — number in medicine. Understanding it takes two minutes and pays off for decades.",
    sections: [
      { heading: "What the numbers mean", body: "The higher number (systolic) is the pressure when your heart contracts; the lower number (diastolic) is the pressure when it rests between beats. Both matter. Readings vary through the day, which is why a single high reading at a clinic is rarely a diagnosis by itself." },
      { heading: "Measuring at home, properly", body: "Sit quietly for five minutes first. Feet flat, back supported, cuff at heart level, no coffee or exercise in the previous half hour. Take two readings a minute apart, morning and evening, for a week — that pattern tells your doctor far more than any single number." },
      { heading: "When to act", body: "Persistently elevated readings deserve a consultation — not panic. Lifestyle changes genuinely move these numbers, and where medicines are needed, they work best when started early and reviewed regularly." },
    ],
    takeaways: ["Both numbers matter — bring the pattern, not one reading", "Home readings beat clinic readings for spotting real trends", "Measure seated, rested, cuff at heart level", "Persistent elevation deserves a calm consultation"],
  },
  {
    slug: "hba1c-what-it-tells-you",
    title: "HbA1c: the three-month story your sugar tells",
    tag: "Diabetes",
    date: "2026-05-20",
    readMinutes: 4,
    excerpt: "Why one blood test reveals your average sugar over three months, and how to read yours with your doctor.",
    intro: "A fasting glucose test is a photograph; HbA1c is the film. It reflects your average blood sugar over roughly three months — which is why it has become the anchor test of diabetes care.",
    sections: [
      { heading: "How one test sees three months", body: "Sugar in your blood attaches to haemoglobin in red blood cells, and those cells live for about 120 days. Measuring the percentage of sugar-coated haemoglobin therefore reveals your average sugar across that whole period — no fasting required." },
      { heading: "Reading your result", body: "Broadly, values below 5.7% are typical, 5.7–6.4% suggests prediabetes, and 6.5% or above supports a diabetes diagnosis — but targets are personal. For someone living with diabetes, the right goal depends on age, other conditions, and medicines, which is a conversation, not a chart." },
      { heading: "Moving the number", body: "HbA1c responds to steady habits: regular meals, daily movement, sleep, and consistent medicines. Because it moves slowly, retesting every three months is usually the honest interval — anything sooner mostly measures noise." },
    ],
    takeaways: ["HbA1c reflects ~3 months of average blood sugar", "No fasting needed for the test itself", "Targets are personal — set them with your doctor", "Retest around every three months, not weekly"],
  },
  {
    slug: "chest-pain-when-to-worry",
    title: "Chest discomfort: what to watch, when to move fast",
    tag: "Heart health",
    date: "2026-05-06",
    readMinutes: 5,
    excerpt: "Not all chest pain is a heart attack — but some is. A calm guide to the warning signs that should never wait.",
    intro: "Most chest discomfort is not a heart attack. But the discomfort that is cannot wait — and knowing the difference in advance is one of the most useful pieces of health knowledge a family can share.",
    sections: [
      { heading: "Signs that need emergency care now", body: "Pressure, heaviness, or squeezing in the centre of the chest lasting more than a few minutes; pain spreading to the arm, jaw, neck, or back; discomfort with sweating, nausea, or breathlessness; sudden symptoms during rest. If any of these occur, treat it as an emergency — call for help, do not drive yourself, and do not wait to see if it passes." },
      { heading: "Patterns worth a planned consultation", body: "Discomfort that appears predictably with exertion and eases with rest deserves prompt — but planned — cardiology review. So does new breathlessness on stairs you managed easily last year. These patterns are your heart asking for attention before it demands it." },
      { heading: "What happens at a review", body: "A consultation typically involves your history, an ECG, and often an echo or treadmill test. The goal is a clear answer: reassurance where the heart is fine, and an early plan where it is not. Either outcome is a win compared to not knowing." },
    ],
    takeaways: ["Central pressure lasting minutes = emergency, act immediately", "Exertion-related discomfort that eases with rest needs planned review", "Never drive yourself during a suspected cardiac event", "An ECG and echo answer most first questions"],
  },
  {
    slug: "annual-health-check-guide",
    title: "The annual check-up: what is actually worth testing",
    tag: "Prevention",
    date: "2026-04-15",
    readMinutes: 5,
    excerpt: "A no-nonsense look at which yearly tests earn their place, by age and risk — and which add little.",
    intro: "A good annual check-up is not about ticking every test on the menu. It is about a short list of measurements that reliably catch the conditions worth catching early.",
    sections: [
      { heading: "The core that earns its place", body: "For most adults: blood pressure, fasting glucose or HbA1c, a lipid profile, body weight trends, and — from the late thirties onward or earlier with family history — a baseline ECG. These are inexpensive, repeatable, and directly linked to decisions that change outcomes." },
      { heading: "Add-ons that depend on you", body: "Thyroid testing if there are symptoms or family history; vitamin D and B12 where diet or sunlight is limited; kidney and liver panels if you take long-term medicines; age-appropriate cancer screening as advised. A physician consultation turns this from a menu into a plan." },
      { heading: "The most important part is the conversation", body: "Reports without a review are just paper. The value of a check-up is the twenty minutes where a doctor connects your numbers to your life — sleep, stress, food, movement — and agrees one or two changes you will actually keep." },
    ],
    takeaways: ["BP, sugar, lipids, and weight trends are the reliable core", "A baseline ECG earns its place from the late 30s", "Add-on tests should follow your history, not a menu", "Always book the review conversation, not just the tests"],
  },
  {
    slug: "walking-for-heart-health",
    title: "Thirty minutes: what walking honestly does for your heart",
    tag: "Lifestyle",
    date: "2026-03-28",
    readMinutes: 4,
    excerpt: "The evidence behind the most under-rated prescription in cardiology — and how to build it into a Vizag day.",
    intro: "If walking were a pill, every cardiologist would prescribe it. Thirty minutes of brisk walking most days measurably improves blood pressure, sugar control, cholesterol, mood, and sleep — with a side-effect list of zero.",
    sections: [
      { heading: "What 'brisk' really means", body: "Brisk is a pace where you can talk but not sing — roughly 100 steps a minute for most people. Speed matters less than consistency: five days a week of honest walking beats one heroic Sunday trek every time." },
      { heading: "Building it into a real day", body: "Early morning on the beach road, the cooler hour after sunset, or three ten-minute walks scattered through the day — the heart counts all of it. Pair it with an existing habit, keep footwear by the door, and track streaks rather than distance." },
      { heading: "If you have a heart condition", body: "Movement remains medicine, but the dose needs a doctor. After a cardiac event or during therapies like EECP, walking programmes are built gradually and reviewed — our rehab team does exactly this. Breathlessness or chest discomfort during a walk is always a signal to stop and consult." },
    ],
    takeaways: ["Aim for ~30 brisk minutes, most days of the week", "Talk-but-can't-sing is the right pace", "Three 10-minute walks count as much as one 30-minute walk", "With a heart condition, build the plan with your care team"],
  },
];
