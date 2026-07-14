export const chapters = [
  { id: "how-it-works", num: "01", title: "How your heart works" },
  { id: "numbers", num: "02", title: "The numbers that matter" },
  { id: "narrowing", num: "03", title: "When arteries narrow" },
  { id: "conditions", num: "04", title: "Conditions, plainly" },
  { id: "warning-signs", num: "05", title: "Warning signs" },
  { id: "protect", num: "06", title: "How to protect it" },
  { id: "tests", num: "07", title: "Tests, decoded" },
  { id: "treatment", num: "08", title: "Treatment & the third option" },
] as const;

export const flowSteps = [
  { title: "Blood returns, low on oxygen", copy: "Oxygen-poor blood from your body enters the right atrium — the heart's receiving room — then passes into the right ventricle." },
  { title: "The right side sends it to the lungs", copy: "The right ventricle pushes that blood through the pulmonary artery to the lungs, where it releases carbon dioxide and takes up oxygen." },
  { title: "The left side receives it, renewed", copy: "Bright, oxygen-rich blood flows back into the left atrium and down into the left ventricle — the heart's strongest chamber." },
  { title: "One beat sends it everywhere", copy: "The left ventricle contracts and drives oxygen-rich blood through the aorta to every organ — brain, kidneys, muscles, and the heart itself. Four valves keep it all moving one way." },
];

export type Vital = { label: string; reading: string; unit: string; bands: { label: string; range: string; tone: "good" | "watch" | "act" }[]; note: string };
export const vitals: Vital[] = [
  { label: "Blood pressure", reading: "120/80", unit: "mmHg", bands: [ { label: "Healthy", range: "below 120/80", tone: "good" }, { label: "Elevated", range: "120–139 / 80–89", tone: "watch" }, { label: "High — consult", range: "140/90 and above", tone: "act" } ], note: "One high reading is not a diagnosis — patterns over a week are what your doctor reads." },
  { label: "Resting heart rate", reading: "60–100", unit: "beats/min", bands: [ { label: "Typical", range: "60–100", tone: "good" }, { label: "Discuss", range: "consistently outside that, or irregular", tone: "watch" }, { label: "Act", range: "racing or fluttering at rest with dizziness", tone: "act" } ], note: "Fit people often sit below 60 — context matters more than the number." },
  { label: "LDL cholesterol", reading: "<100", unit: "mg/dL", bands: [ { label: "Optimal", range: "below 100", tone: "good" }, { label: "Borderline", range: "100–159", tone: "watch" }, { label: "High — consult", range: "160 and above", tone: "act" } ], note: "Your personal target depends on your overall risk — set it with your doctor." },
  { label: "HbA1c", reading: "<5.7", unit: "%", bands: [ { label: "Typical", range: "below 5.7", tone: "good" }, { label: "Prediabetes", range: "5.7–6.4", tone: "watch" }, { label: "Diabetes range", range: "6.5 and above", tone: "act" } ], note: "Sugar and heart health are one story — high sugar quietly injures arteries." },
];

export type Condition = { name: string; what: string; feelsLike: string; redFlag: string; firstStep: string };
export const conditions: Condition[] = [
  { name: "Coronary artery disease", what: "Cholesterol deposits (plaque) slowly narrow the arteries that feed the heart muscle itself.", feelsLike: "Often nothing for years — then heaviness or breathlessness on exertion.", redFlag: "Chest discomfort appearing at rest, or with less and less effort.", firstStep: "A cardiology review with ECG and echo maps where you stand." },
  { name: "Angina", what: "The heart muscle briefly runs short of blood — a supply-demand gap, usually from narrowed arteries.", feelsLike: "Pressure, tightness, or burning in the chest on exertion or stress, easing with rest.", redFlag: "Episodes becoming more frequent, longer, or arriving at rest — unstable angina is an emergency.", firstStep: "Planned cardiology consultation; describe the pattern — what brings it on, what settles it." },
  { name: "Heart attack", what: "A plaque ruptures and a clot suddenly blocks a coronary artery. Muscle downstream begins to die within minutes.", feelsLike: "Crushing central chest pressure lasting more than a few minutes, sweating, nausea, pain into the arm, jaw, or back.", redFlag: "This IS the red flag. Minutes decide how much muscle survives.", firstStep: "Emergency — call 108 or get to the nearest emergency room. Do not drive yourself. Do not wait to see if it passes." },
  { name: "Heart failure", what: "The heart still beats but pumps less strongly than the body needs — often after years of high BP, diabetes, or a past heart attack.", feelsLike: "Breathlessness on stairs or lying flat, swollen ankles by evening, unusual tiredness.", redFlag: "Waking up gasping, breathless at rest, rapid weight gain over days.", firstStep: "An echo measures pumping strength; modern medicines — and therapies like EECP — genuinely help." },
  { name: "Arrhythmia", what: "The heart's electrical wiring misfires — beats come too fast, too slow, or irregularly. Atrial fibrillation is the most common kind.", feelsLike: "Fluttering, skipped beats, racing episodes, sometimes dizziness.", redFlag: "Palpitations with fainting, chest pain, or breathlessness.", firstStep: "An ECG during symptoms — or a 24-hour Holter — catches the rhythm in the act." },
  { name: "Valve disease", what: "One of the four one-way valves stiffens or leaks, making every beat less efficient.", feelsLike: "Breathlessness, fatigue, sometimes a murmur found on examination.", redFlag: "Fainting or chest tightness with exertion.", firstStep: "An echocardiogram shows each valve opening and closing in real time." },
  { name: "Hypertension", what: "Persistently high pressure in the arteries — the silent workload that thickens heart muscle and stiffens vessels for years before symptoms.", feelsLike: "Usually nothing. That is exactly the problem.", redFlag: "Readings above 180/120, or high readings with headache, vision change, or chest pain — act now.", firstStep: "A week of proper home readings, then a consultation. Treatment is unglamorous and extremely effective." },
  { name: "Cardiomyopathy", what: "Disease of the heart muscle itself — stretched, thickened, or stiffened — sometimes inherited.", feelsLike: "Breathlessness, swelling, palpitations; sometimes found only after a relative's diagnosis.", redFlag: "Fainting during exercise, or sudden cardiac events in young family members.", firstStep: "Echo plus family history; first-degree relatives of a diagnosed person should be screened." },
];

export const emergencySigns = [
  "Pressure, heaviness, or squeezing in the centre of the chest lasting more than a few minutes",
  "Pain spreading to the left arm, jaw, neck, or back",
  "Chest discomfort with cold sweat, nausea, or breathlessness",
  "Sudden breathlessness at rest, or waking up gasping",
  "Fainting, or near-fainting with palpitations",
];
export const plannedSigns = [
  "Discomfort that appears with exertion and eases with rest",
  "New breathlessness on stairs you managed last year",
  "Episodes of fluttering or racing heartbeat",
  "Ankles swelling by evening",
  "You're 35+ with diabetes, high BP, smoking, or family history — and have never had a heart check",
];

export type HeartTest = { name: string; sees: string; when: string; feels: string; time: string };
export const heartTests: HeartTest[] = [
  { name: "ECG", sees: "The heart's electrical rhythm — a 10-second snapshot.", when: "Every cardiac evaluation starts here; also during chest pain or palpitations.", feels: "Stickers on the chest, nothing more.", time: "5 min" },
  { name: "Echocardiogram", sees: "Live ultrasound of chambers, valves, and pumping strength.", when: "Breathlessness, murmurs, after a heart attack, heart-failure checks.", feels: "A probe glides over gel on your chest.", time: "20–30 min" },
  { name: "Treadmill test (TMT)", sees: "How the heart behaves under real exertion.", when: "Exertional chest discomfort with a normal resting ECG.", feels: "A brisk, monitored walk that gets steeper.", time: "30–40 min" },
  { name: "Holter monitor", sees: "Every single beat across 24 hours — a rhythm film, not a snapshot.", when: "Palpitations or dizziness that never seem to happen in the clinic.", feels: "A pocket-sized recorder worn for a day.", time: "24 h" },
  { name: "Blood panel", sees: "Cholesterol, sugar (HbA1c), kidney health — the slow risk factors.", when: "Annually from your mid-30s; sooner with family history.", feels: "One sample, most reports the same day.", time: "10 min" },
];

export const protectHabits = [
  { title: "Walk 30 minutes", copy: "Brisk — talk but can't sing. Beach road at dawn or after sunset both count; so do three 10-minute walks." },
  { title: "Eat for your arteries", copy: "More fish, dal, vegetables, and whole grains; less deep-fried, less salt, easy on sweets. Small swaps, kept forever, beat crash diets." },
  { title: "Leave tobacco behind", copy: "The single most powerful thing a smoker can do for their heart. Risk starts falling within weeks of stopping." },
  { title: "Sleep seven hours", copy: "Chronic short sleep pushes BP and sugar the wrong way. Treat snoring-plus-daytime-sleepiness as a medical question." },
  { title: "Mind the pressure", copy: "Stress hormones tighten arteries. Whatever genuinely unwinds you — prayer, music, a walk with a friend — is cardiology." },
  { title: "Know your numbers", copy: "BP, sugar, cholesterol — once a year. The heart's biggest threats are silent for a decade; testing is how you hear them early." },
];

export const heartFaqs = [
  { q: "Is a heart attack the same as cardiac arrest?", a: "No. A heart attack is a plumbing problem — a blocked artery starving heart muscle. Cardiac arrest is an electrical problem — the heart stops pumping entirely and collapse is immediate. A heart attack can trigger arrest, which is why chest pain needs urgent care." },
  { q: "Is chest pain always on the left side?", a: "No. Cardiac discomfort is most often central — a pressure or heaviness — and can appear in the jaw, back, or arms, or as breathlessness alone, especially in women and people with diabetes." },
  { q: "At what age should heart check-ups start?", a: "For most people, a baseline — BP, sugar, cholesterol, ECG — by 35, earlier with family history, diabetes, or smoking. After that, yearly numbers and a review." },
  { q: "My BP is high only at the clinic. Does it count?", a: "It might not — 'white-coat' readings are common. A week of proper home readings, morning and evening, tells your doctor what's real." },
  { q: "Can I exercise with a heart condition?", a: "Usually yes — movement is medicine — but the dose needs a doctor. After an event, or during therapies like EECP, activity is built up gradually under guidance." },
];

export const arterySteps = [
  { title: "Years of quiet build-up", copy: "Cholesterol deposits — plaque — settle into the artery wall over decades. Traffic slows, but there are no symptoms yet. This is the stage where testing, not luck, finds trouble." },
  { title: "Angina — demand outruns supply", copy: "At rest, the narrowed artery still copes. On stairs or under stress, the heart asks for more blood than can squeeze through — a pressure or heaviness in the chest that eases when you stop." },
  { title: "The emergency", copy: "A plaque ruptures and a clot completes the block within minutes. Muscle downstream begins to die — this is a heart attack. Call 108 or reach the nearest emergency room. Do not drive yourself." },
];
