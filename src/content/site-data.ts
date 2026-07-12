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
  { href: "/about", label: "About" },
  { href: "/heart-care", label: "Heart care" },
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
   Roster from the Rise Medical Hub clinical team (Madhurawada, Visakhapatnam).
   Bios are composed from published qualifications; timings confirmed at booking. */
export type Doctor = {
  slug: string;
  name: string;
  role: string;
  department: string;
  qualifications: string;
  focus: string;
  usp: string;
  expertise: string[];
  bio: string;
  languages: string;
  timings: string;
  initials: string;
};

export const doctors: Doctor[] = [
  {
    slug: "gv-ramana-kumar",
    name: "Dr. G. V. Ramana Kumar",
    role: "Cardiothoracic Surgeon",
    department: "Heart & Chest",
    qualifications: "MBBS, MS, MCh (Cardiothoracic Surgery)",
    focus: "Bypass, valve, and aortic surgery — and the surgical opinion behind our EECP pathway.",
    usp: "Heart surgery shaped across three schools — AIIMS Delhi, KEM Mumbai, and the Royal Adelaide Hospital, Australia.",
    expertise: ["Beating-heart bypass (OPCAB)", "Valve repair & replacement", "Aortic & endovascular surgery"],
    bio: "Dr. Ramana Kumar is a senior cardiothoracic and vascular surgeon with around 27 years of experience — trained at Andhra Medical College, AIIMS New Delhi, and KEM Hospital Mumbai, with an adult cardiac surgery fellowship at the Royal Adelaide Hospital, Australia. Two decades of practice at Visakhapatnam's leading heart centres span beating-heart bypass, valve repair, aortic aneurysm and TEVAR procedures, and minimally invasive cardiac surgery. At Rise, he anchors the judgement call that matters most: when surgery is truly needed, and when a non-surgical road like EECP is the better first step.",
    languages: "Telugu · English",
    timings: "By appointment",
    initials: "RK",
  },
  {
    slug: "pydi-krishna-rajeev",
    name: "Dr. Pydi Krishna Rajeev",
    role: "Consultant Neurosurgeon & Endoscopic Spine Surgeon",
    department: "Brain & Spine",
    qualifications: "MBBS, MS, MCh (Neurosurgery)",
    focus: "Brain and spine surgery, with a focus on keyhole endoscopic techniques for spinal conditions.",
    usp: "Vascular neurosurgery training in Japan — and a keyhole-first philosophy for the spine.",
    expertise: ["Endoscopic spine surgery", "Brain tumor surgery", "Skull base & trauma"],
    bio: "Dr. Krishna Rajeev trained at Andhra Medical College (MBBS, MCh Neurosurgery) and Rangaraya Medical College (MS), served at King George Hospital and VIMS Visakhapatnam, and received specialty training in vascular neurosurgery in Japan. With over a decade as a consultant, his practice spans endoscopic spine surgery, brain tumor and skull base surgery, and traumatic brain injury — favouring minimally invasive techniques wherever possible.",
    languages: "Telugu · English",
    timings: "By appointment",
    initials: "KR",
  },
  {
    slug: "nimmaka-sravan-raju",
    name: "Dr. Nimmaka Sravan Raju",
    role: "Orthopedic Surgeon — Spine",
    department: "Bone & Joint",
    qualifications: "MBBS, MS (Ortho), Fellowship in Spine Surgery",
    focus: "Back and neck pain, spinal injuries, and the orthopedic side of spine care.",
    usp: "A spine fellow who is candid about the line between physiotherapy and the operating theatre.",
    expertise: ["Spine surgery", "Back & neck pain", "Fracture care"],
    bio: "An orthopedic surgeon with dedicated fellowship training in spine surgery, Dr. Sravan Raju sees the spine problems that live between physiotherapy and the operating theatre — and is candid about which side of that line a patient is on.",
    languages: "Telugu · English",
    timings: "By appointment",
    initials: "SR",
  },
  {
    slug: "gnaneshwar-raju",
    name: "Dr. Gnaneshwar Raju",
    role: "Joint Replacement & Spine Surgeon",
    department: "Bone & Joint",
    qualifications: "MBBS, MS (Ortho), MRCS (UK), FIJR",
    focus: "Knee and hip replacement, joint preservation, and complex orthopedic decisions.",
    usp: "UK Royal College surgical credentials (MRCS) behind every replace-or-preserve joint decision.",
    expertise: ["Knee replacement", "Hip replacement", "Spine surgery"],
    bio: "Dr. Gnaneshwar Raju combines Indian orthopedic training with the MRCS from the UK's Royal College of Surgeons and a fellowship in joint replacement. His clinic answers the question most families arrive with: is it time to replace the joint, or can we still protect it?",
    languages: "Telugu · English",
    timings: "By appointment",
    initials: "GR",
  },
  {
    slug: "t-aditya",
    name: "Dr. T. Aditya",
    role: "Advanced Laparoscopy, GI & Bariatric Surgeon",
    department: "Laparoscopic & Bariatric",
    qualifications: "MBBS, MS, FIAGES",
    focus: "Keyhole surgery for gallbladder, hernia, and GI conditions — plus surgical weight-loss programmes.",
    usp: "FIAGES-fellowship keyhole surgery — smaller cuts, shorter stays, structured weight-loss care.",
    expertise: ["Laparoscopic surgery", "Hernia & gallbladder", "Bariatric surgery"],
    bio: "Dr. Aditya is a FIAGES-certified laparoscopic surgeon — the fellowship of the Indian Association of Gastrointestinal Endo-Surgeons. His practice centres on minimal-access surgery: smaller cuts, shorter stays, and structured bariatric care for patients where weight has become a medical problem.",
    languages: "Telugu · English",
    timings: "By appointment",
    initials: "TA",
  },
  {
    slug: "g-shanti-vardhan",
    name: "Dr. G. Shanti Vardhan",
    role: "Consultant Urologist & Andrologist",
    department: "Kidney & Urology",
    qualifications: "MBBS, DNB (Surgery), DrNB (Genitourinary Surgery)",
    focus: "Kidney stones, prostate care, and men's reproductive health, handled with discretion.",
    usp: "Super-specialty genitourinary surgeon offering Micro-TESE microsurgical fertility procedures.",
    expertise: ["Male infertility (Micro-TESE)", "Endo-urology & laparoscopy", "Kidney stones & prostate"],
    bio: "Dr. Shanti Vardhan holds the DrNB in genitourinary surgery from KIMS, Secunderabad, with surgical training at Meenakshi Mission Hospital, Madurai, and specialised training in microsurgical andrology and renal transplantation. His practice pairs advanced endo-urology and laparoscopic surgery with a dedicated andrology clinic — including male infertility procedures like Micro-TESE — for concerns most patients find hard to raise.",
    languages: "Telugu · English · Hindi",
    timings: "By appointment",
    initials: "SV",
  },
  {
    slug: "s-anil-kumar-patro",
    name: "Dr. S. Anil Kumar Patro",
    role: "Consultant Nephrologist",
    department: "Kidney & Urology",
    qualifications: "MBBS, MD, DNB (Nephrology)",
    focus: "Kidney function, hypertension-related kidney disease, and dialysis decisions.",
    usp: "A rare double: adult and pediatric kidney care in one nephrologist, via MD Paediatrics plus DNB Nephrology.",
    expertise: ["Adult & pediatric nephrology", "Chronic kidney disease", "Dialysis & transplant care"],
    bio: "Dr. Anil Kumar Patro is a senior nephrologist with over 14 years in kidney medicine and nearly three decades of clinical practice. Trained at MKCG Medical College, Berhampur, with an MD in Paediatrics and the DNB in Nephrology from Apollo Hospitals, Hyderabad, he is among the few specialists treating both adult and pediatric kidney disease — from early CKD to dialysis and transplant care. He is a member of the Indian Society of Nephrology.",
    languages: "Telugu · English · Hindi",
    timings: "By appointment",
    initials: "AP",
  },
  {
    slug: "p-alekhya",
    name: "Dr. P. Alekhya",
    role: "Consultant Pulmonologist",
    department: "Lungs & Breathing",
    qualifications: "MBBS, DTCD, DNB (Pulmonology)",
    focus: "Asthma, COPD, persistent cough, and breathing difficulties assessed methodically.",
    usp: "Dual chest-medicine training (DTCD + DNB) — breathlessness separated into cause, not managed as mystery.",
    expertise: ["Asthma & COPD", "Persistent cough", "Breathlessness workup"],
    bio: "Dr. Alekhya trained in chest medicine through the DTCD and the DNB in pulmonology. Her clinic takes breathlessness seriously and calmly — separating what belongs to the lungs from what belongs to the heart, and building inhaler and follow-up routines patients actually keep.",
    languages: "Telugu · English",
    timings: "By appointment",
    initials: "PA",
  },
  {
    slug: "nikhil-bandi",
    name: "Dr. Nikhil Bandi",
    role: "Consultant Physician",
    department: "General Medicine",
    qualifications: "MBBS, MD (General Medicine)",
    focus: "Fevers, diabetes, blood pressure, and the everyday conditions that need a careful first door.",
    usp: "The first door — a generalist's eye that decides what needs testing, referral, or simply reassurance.",
    expertise: ["General medicine", "Diabetes & BP", "Preventive reviews"],
    bio: "Dr. Nikhil Bandi is the first door at Rise for most adults — an MD physician for fevers, infections, sugar and pressure control, and the unclear symptoms that need a generalist's eye before a specialist's. He decides what needs testing, what needs referral, and what needs reassurance.",
    languages: "Telugu · English",
    timings: "By appointment",
    initials: "NB",
  },
  {
    slug: "gd-ravindranath",
    name: "Dr. G. D. Ravindranath",
    role: "Pediatrician — Neonatology",
    department: "Child Care",
    qualifications: "MBBS, MD (Pediatrics), Fellowship in Neonatology",
    focus: "Newborn and infant care, growth monitoring, and childhood illness.",
    usp: "Neonatology-fellowship care, tuned to a newborn's most delicate first weeks.",
    expertise: ["Newborn care", "Growth & vaccination", "Childhood illness"],
    bio: "Dr. Ravindranath is an MD pediatrician with fellowship training in neonatology — the care of newborns in their most delicate weeks. From first vaccinations to school-age fevers, his clinic gives parents a steady, unhurried place to bring their questions.",
    languages: "Telugu · English",
    timings: "By appointment",
    initials: "RN",
  },
  {
    slug: "varanasi-pundarikaksha",
    name: "Dr. Varanasi Pundarikaksha",
    role: "Children's Specialist",
    department: "Child Care",
    qualifications: "MD (Pediatrics)",
    focus: "Everyday pediatrics — fevers, feeding, development, and vaccination schedules.",
    usp: "Retired Professor and HOD of Pediatrics at Andhra Medical College & KGH — a teacher of pediatricians.",
    expertise: ["Child health", "Vaccination", "Development checks"],
    bio: "Dr. Pundarikaksha is a senior pediatrician and retired Professor and Head of the Department of Pediatrics at Andhra Medical College and King George Hospital, Visakhapatnam. After decades spent treating children and training doctors at one of Andhra Pradesh's largest teaching hospitals, he now brings that depth to everyday child health — fevers, feeding, growth, and vaccinations.",
    languages: "Telugu · English",
    timings: "By appointment",
    initials: "VP",
  },
  {
    slug: "satish-reddy",
    name: "Dr. Satish Reddy S",
    role: "ENT, Head & Neck Surgeon",
    department: "ENT, Head & Neck",
    qualifications: "MBBS, DNB (ENT)",
    focus: "Ear, nose, and throat conditions — from recurring infections to head and neck surgery.",
    usp: "Madhurawada's own ENT surgeon — a neighbourhood practice backed by board-qualified surgery.",
    expertise: ["Ear & hearing", "Sinus & nose", "Head & neck surgery"],
    bio: "Dr. Satish Reddy is a board-qualified ENT surgeon (DNB) who also runs his own ENT practice in Madhurawada. He covers the full span of the specialty — blocked noses and sinus disease, ear infections and hearing concerns, voice problems, and surgical conditions of the head and neck.",
    languages: "Telugu · English",
    timings: "By appointment",
    initials: "SS",
  },
  {
    slug: "swathi",
    name: "Dr. Swathi",
    role: "ENT Surgeon & Allergy Specialist",
    department: "ENT, Head & Neck",
    qualifications: "MBBS, MS (ENT)",
    focus: "Head and neck surgery with a special interest in allergy-driven ENT problems.",
    usp: "Cause-first ENT — treats the allergy driving the sinus problem, not just the flare-ups.",
    expertise: ["Allergy & sinus", "Tonsils & adenoids", "Head & neck surgery"],
    bio: "Dr. Swathi is an MS-qualified ENT surgeon whose clinic pays particular attention to allergy — the sneezing, blocked-nose, itchy-throat pattern that drives so many repeat ENT visits — treating the cause rather than only the flare-ups.",
    languages: "Telugu · English",
    timings: "By appointment",
    initials: "SW",
  },
  {
    slug: "goutami",
    name: "Dr. Goutami",
    role: "Consultant Gynecologist",
    department: "Women's Health",
    qualifications: "MBBS, MS (OBG)",
    focus: "Women's health across life stages — periods, pregnancy guidance, and preventive screening.",
    usp: "Clinician and assistant professor — academic rigour brought into unhurried women's health consultations.",
    expertise: ["Gynecology", "Pregnancy care", "Well-woman screening"],
    bio: "Dr. Goutami is an MS-qualified obstetrician-gynecologist with academic experience as an assistant professor. Her consultations make room for the questions women often run out of time to ask — cycles, fertility, menopause, and screening done on schedule.",
    languages: "Telugu · English",
    timings: "By appointment",
    initials: "GT",
  },
  {
    slug: "srikanth-bitra",
    name: "Dr. Srikanth Bitra",
    role: "Oral & Maxillofacial Surgeon",
    department: "Dental & Facial",
    qualifications: "MDS, FHNO, FHT",
    focus: "Surgery of the mouth, jaw, and face — wisdom teeth, injuries, and complex extractions.",
    usp: "A head-and-neck oncology fellowship (FHNO) behind every jaw and facial surgery decision.",
    expertise: ["Jaw & facial surgery", "Wisdom teeth", "Facial trauma"],
    bio: "Dr. Srikanth Bitra is an MDS oral and maxillofacial surgeon with nine years of practice and a fellowship in head-and-neck surgical oncology (FHNO), running dedicated head-and-neck and dental clinics in Visakhapatnam. He handles the surgical end of dentistry — impacted wisdom teeth, jaw problems, facial injuries, and lesions that need an oncology-informed eye.",
    languages: "Telugu · English",
    timings: "By appointment",
    initials: "SB",
  },
  {
    slug: "t-vijay-naidu",
    name: "Dr. T. Vijay Naidu",
    role: "General & Cosmetic Dental Surgeon",
    department: "Dental & Facial",
    qualifications: "BDS",
    focus: "Everyday dentistry and smile-focused cosmetic work.",
    usp: "Family dentistry and cosmetic work in one chair — smiles looked after, not just repaired.",
    expertise: ["General dentistry", "Cosmetic dentistry", "Preventive dental care"],
    bio: "Dr. Vijay Naidu covers the dentistry most families need most often — fillings, cleanings, extractions, and root-canal referrals — alongside cosmetic work for patients who want their smile looked after, not just repaired.",
    languages: "Telugu · English",
    timings: "By appointment",
    initials: "VN",
  },
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

/* ——— Pharmacy standards ——— */
export type PharmacyPoint = { title: string; copy: string };

export const pharmacyPoints: PharmacyPoint[] = [
  { title: "Genuine, tracked stock", copy: "Every medicine sourced from authorised distributors with batch-level tracking — no grey-market stock, ever." },
  { title: "Pharmacist counselling", copy: "Doses, timings, food interactions, and what to do about a missed dose — explained before you leave the counter." },
  { title: "Ready before you are", copy: "Prescriptions from Rise consultations are prepared while you finish — collect on your way out." },
  { title: "Chronic-care refills", copy: "Monthly refill reminders for BP, diabetes, and cardiac medicines, with a call before you run out." },
];

/* ——— OPD timings ———
   Mirrors the doctor roster; confirm against the final schedule before launch. */
export type OpdTiming = { dept: string; days: string; hours: string };

export const opdTimings: OpdTiming[] = [
  { dept: "Cardiology & EECP", days: "Mon–Sat", hours: "10:00–14:00" },
  { dept: "General & Internal Medicine", days: "Mon–Sat", hours: "09:30–13:30" },
  { dept: "Diabetology", days: "Mon–Fri", hours: "17:00–20:00" },
  { dept: "Women's Health", days: "Tue–Sat", hours: "11:00–14:00" },
  { dept: "Pulmonology", days: "Mon–Sat", hours: "18:00–20:30" },
  { dept: "Physiotherapy & Rehab", days: "Mon–Sat", hours: "08:00–13:00" },
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
  guideLink?: { href: string; label: string };
  sources: EvidenceSource[];
};

export type EvidenceSource = {
  title: string;
  publisher: string;
  href: string;
  type: "Guideline" | "Regulatory" | "Clinical trial" | "Systematic review" | "Patient guide" | "Recommendation";
  note: string;
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
    guideLink: { href: "/heart-care", label: "See where EECP fits in the full heart guide" },
    sources: [
      { title: "2023 guideline for chronic coronary disease", publisher: "American College of Cardiology", href: "https://www.acc.org/Guidelines/Guidelines/2023/07/20/12/34/Chronic-Coronary-Disease", type: "Guideline", note: "Places EECP within the wider treatment pathway for chronic coronary disease and refractory angina." },
      { title: "FDA 510(k) summary for the EECP Therapy System", publisher: "US Food & Drug Administration", href: "https://www.accessdata.fda.gov/cdrh_docs/pdf2/k020857.pdf", type: "Regulatory", note: "The device record, intended use, mechanism, and reviewed indications—not a claim that every patient should receive it." },
      { title: "MUST-EECP randomised sham-controlled trial", publisher: "PubMed · JACC", href: "https://pubmed.ncbi.nlm.nih.gov/10362181/", type: "Clinical trial", note: "The landmark controlled angina study; useful for understanding both measured benefits and trial limits." },
      { title: "Safety and effectiveness in refractory angina", publisher: "PubMed", href: "https://pubmed.ncbi.nlm.nih.gov/35047131/", type: "Systematic review", note: "A 2021 synthesis of 17 studies covering symptoms, walking distance, exercise testing, and safety." },
      { title: "Stable angina and heart failure: evidence and economic analysis", publisher: "PubMed · Health Technology Assessment", href: "https://pubmed.ncbi.nlm.nih.gov/19409154/", type: "Systematic review", note: "A deliberately cautious review highlighting uncertainty, adverse events, and the need for stronger long-term evidence." },
      { title: "The role of EECP in clinical practice", publisher: "PubMed Central", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3917995/", type: "Systematic review", note: "A readable clinical overview of proposed mechanisms, patient selection, evidence, and contraindications." },
    ],
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
    guideLink: { href: "/heart-care", label: "See all four numbers in the heart guide" },
    sources: [
      { title: "Home blood pressure monitoring", publisher: "American Heart Association", href: "https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings/monitoring-your-blood-pressure-at-home", type: "Patient guide", note: "How to select a validated upper-arm monitor, position the cuff, repeat readings, and know when to seek help." },
      { title: "Measurement of blood pressure in humans", publisher: "American Heart Association", href: "https://professional.heart.org/en/science-news/measurement-of-blood-pressure-in-humans", type: "Guideline", note: "The scientific statement behind accurate clinic, home, and ambulatory measurement." },
      { title: "Hypertension in adults: screening", publisher: "US Preventive Services Task Force", href: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hypertension-in-adults-screening", type: "Recommendation", note: "Why an elevated office reading should be confirmed outside the clinic before treatment begins." },
    ],
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
    sources: [
      { title: "The A1C test and diabetes", publisher: "US National Institute of Diabetes and Digestive and Kidney Diseases", href: "https://www.niddk.nih.gov/health-information/diagnostic-tests/a1c-test", type: "Patient guide", note: "Explains thresholds, confirmation, individual targets, and conditions that can make A1C misleading." },
      { title: "Diabetes tests and diagnosis", publisher: "NIDDK", href: "https://www.niddk.nih.gov/health-information/diabetes/overview/tests-diagnosis", type: "Patient guide", note: "Compares A1C with fasting glucose, random glucose, and oral glucose tolerance testing." },
      { title: "Managing diabetes", publisher: "NIDDK", href: "https://www.niddk.nih.gov/health-information/diabetes/overview/managing-diabetes", type: "Patient guide", note: "Connects A1C with blood pressure, cholesterol, medicines, and a personalised care plan." },
    ],
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
    guideLink: { href: "/heart-care", label: "Learn every warning sign in the heart guide" },
    sources: [
      { title: "Warning signs of a heart attack", publisher: "American Heart Association", href: "https://www.heart.org/en/health-topics/heart-attack/warning-signs-of-a-heart-attack", type: "Patient guide", note: "The symptom patterns that warrant emergency action, including less familiar presentations." },
      { title: "2021 guideline for the evaluation of chest pain", publisher: "American College of Cardiology", href: "https://www.acc.org/Guidelines/Guidelines/2021/10/28/12/34/Chest-Pain", type: "Guideline", note: "How clinicians separate acute from stable chest pain and choose testing according to structured risk." },
      { title: "Angina: symptoms, diagnosis, and treatment", publisher: "American Heart Association", href: "https://www.heart.org/en/health-topics/heart-attack/angina-chest-pain", type: "Patient guide", note: "A practical distinction between stable, unstable, microvascular, and refractory angina." },
    ],
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
      { heading: "The core that earns its place", body: "For many adults, the useful core is a risk-based review of blood pressure, weight trend, tobacco use, and whether glucose or cholesterol screening is due. The exact tests depend on age, symptoms, pregnancy history, medicines, family history, and prior results—not on a universal annual menu." },
      { heading: "Add-ons that depend on you", body: "Thyroid testing if there are symptoms or family history; vitamin D and B12 where diet or sunlight is limited; kidney and liver panels if you take long-term medicines; age-appropriate cancer screening as advised. A physician consultation turns this from a menu into a plan." },
      { heading: "The most important part is the conversation", body: "Reports without a review are just paper. The value of a check-up is the twenty minutes where a doctor connects your numbers to your life — sleep, stress, food, movement — and agrees one or two changes you will actually keep." },
    ],
    takeaways: ["BP, sugar, lipids, and weight trends are common decision points", "Routine ECG screening is not advised for asymptomatic low-risk adults", "Tests should follow age, risk, symptoms, and prior results—not a menu", "Always book the review conversation, not just the tests"],
    sources: [
      { title: "Screening for cardiovascular risk with electrocardiography", publisher: "US Preventive Services Task Force", href: "https://www.uspreventiveservicestaskforce.org/uspstf/document/RecommendationStatementFinal/cardiovascular-disease-risk-screening-with-electrocardiography", type: "Recommendation", note: "Explains why routine ECG screening can cause more harm than benefit in asymptomatic adults at low cardiovascular risk." },
      { title: "Hypertension in adults: screening", publisher: "US Preventive Services Task Force", href: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hypertension-in-adults-screening", type: "Recommendation", note: "Who should be screened and why a diagnosis should be confirmed with out-of-office readings." },
      { title: "Prediabetes and type 2 diabetes: screening", publisher: "US Preventive Services Task Force", href: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-for-prediabetes-and-type-2-diabetes", type: "Recommendation", note: "A risk- and age-based approach to glucose screening rather than automatic testing for everyone every year." },
    ],
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
    sources: [
      { title: "Guidelines on physical activity and sedentary behaviour", publisher: "World Health Organization", href: "https://www.who.int/publications/i/item/9789240015128", type: "Guideline", note: "Evidence-based activity targets for adults, older adults, pregnancy, chronic conditions, and disability." },
      { title: "American Heart Association recommendations for physical activity", publisher: "American Heart Association", href: "https://www.heart.org/en/healthy-living/exercise-and-physical-activity/fitness-basics/aha-recs-for-physical-activity-in-adults", type: "Patient guide", note: "Translates weekly aerobic and strengthening targets into practical choices." },
      { title: "Physical activity basics", publisher: "US Centers for Disease Control and Prevention", href: "https://www.cdc.gov/physical-activity/php/about/index.html", type: "Patient guide", note: "A plain-language guide to intensity, weekly totals, and the benefits of moving more and sitting less." },
    ],
  },
];
