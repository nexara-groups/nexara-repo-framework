import type { CSSProperties } from "react";

export function EecpNaturalBypass() {
  return (
    <figure className="eecp-bypass">
      <svg viewBox="0 0 440 280" role="img" focusable="false" aria-label="A narrowed artery with possible collateral routes shown around it as a research-supported but non-guaranteed adaptation">
        <rect className="bypass-frame" x="1" y="1" width="438" height="278" rx="20" />
        <text className="mech-kicker" x="20" y="28">POSSIBLE VASCULAR ADAPTATION</text>
        {/* Main artery with a narrowed middle */}
        <path className="bypass-artery" d="M14 143 C 90 143 128 131 168 131 C 200 131 205 155 220 155 C 235 155 240 131 272 131 C 312 131 350 143 426 143" />
        <path className="bypass-artery bypass-artery-inner" d="M14 143 C 90 143 128 131 168 131 C 200 131 205 155 220 155 C 235 155 240 131 272 131 C 312 131 350 143 426 143" />
        {/* Collateral routes drawing themselves in */}
        <path className="bypass-collateral bypass-c1" d="M150 131 C 170 75 270 75 290 131" />
        <path className="bypass-collateral bypass-c2" d="M162 139 C 190 209 250 209 278 139" />
        {/* Flow dots along the main artery */}
        <circle className="bypass-dot bypass-d1" cx="0" cy="0" r="4.5" />
        <circle className="bypass-dot bypass-d2" cx="0" cy="0" r="4.5" />
        {/* Below the lower collateral (its arc bottoms out around y=178) so
            the vessel never strikes through the text */}
        <text className="mech-label" x="184" y="236">Narrowing remains</text>
        <text className="mech-label" x="145" y="62">Possible collateral support</text>
      </svg>
      <figcaption>
        <span className="pulse-icon" aria-hidden="true" />
        <span>Research suggests collateral function may improve in some patients. EECP does not create a surgical bypass or remove plaque.</span>
      </figcaption>
    </figure>
  );
}

export function EecpSessionScene() {
  return (
    <div className="eecp-scene" role="img" aria-label="Illustration of a monitored EECP session: a patient reclines while fixed cuffs on the calves, thighs, and upper thighs pressurise in sequence, linked by hoses to a console that tracks the heartbeat on an ECG.">
      <svg viewBox="0 0 420 470" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <defs>
          <linearGradient id="es-panel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#15284b" />
            <stop offset="1" stopColor="#0d1c36" />
          </linearGradient>
          <radialGradient id="es-glow" cx="0.42" cy="0.4" r="0.66">
            <stop offset="0" stopColor="#22396380" />
            <stop offset="1" stopColor="#0d1c3600" />
          </radialGradient>
        </defs>

        <rect width="420" height="470" fill="url(#es-panel)" />

        {/* arched alcove — a nod to the treatment room */}
        <path className="es-arch" d="M104 320 V150 Q104 78 196 78 Q288 78 288 150 V320 Z" />
        <rect width="420" height="470" fill="url(#es-glow)" />

        {/* framed wall art inside the alcove */}
        <rect className="es-art" x="158" y="118" width="56" height="68" rx="6" />
        <circle className="es-art-a" cx="176" cy="152" r="10" />
        <path className="es-art-b" d="M186 168 q13 -20 24 -5 v13 h-24 z" />

        {/* floor + soft shadow */}
        <line className="es-floor" x1="0" y1="374" x2="420" y2="374" />
        <ellipse className="es-shadow" cx="184" cy="380" rx="150" ry="9" />

        {/* console / monitor */}
        <g className="es-console">
          <rect className="es-cabinet" x="318" y="198" width="76" height="168" rx="12" />
          <circle className="es-knob" cx="336" cy="222" r="4" />
          <rect className="es-slot" x="350" y="218" width="30" height="7" rx="3.5" />
          <circle className="es-wheel" cx="334" cy="368" r="5" />
          <circle className="es-wheel" cx="380" cy="368" r="5" />
          <rect className="es-screen" x="310" y="132" width="88" height="62" rx="9" />
          <line className="es-grid" x1="310" y1="163" x2="398" y2="163" />
          <path className="es-ecg" d="M316 163 h20 l6 -20 6 34 5 -26 h11 l6 12 6 -12 h13 l6 -22 6 34 5 -22 h12" />
        </g>

        {/* recliner */}
        <path className="es-chaise" d="M58 374 L58 302 Q58 252 110 248 L154 245 Q160 298 186 298 L300 298 Q322 298 322 320 L322 374 Z" />
        <line className="es-seatline" x1="186" y1="298" x2="314" y2="298" />

        {/* hoses from cuffs into the console */}
        <path className="es-hose" d="M296 300 Q316 300 320 306" />
        <path className="es-hose" d="M258 306 Q304 326 320 322" />
        <path className="es-hose" d="M220 308 Q286 342 320 340" />

        {/* patient — reclined figure */}
        <rect className="es-pillow" x="70" y="234" width="84" height="46" rx="21" transform="rotate(-12 112 257)" />
        <path className="es-body" d="M142 266 Q148 246 178 248 Q212 252 240 262 L290 276 Q308 282 310 300 L310 308 Q301 314 285 312 L210 304 Q166 300 148 291 Q136 282 142 266 Z" />
        <path className="es-hair" d="M100 250 a24 24 0 0 1 26 -22 q-18 3 -26 22 z" />
        <circle className="es-head" cx="122" cy="252" r="24" />

        {/* fixed cuffs at calf, thigh, and upper thigh — pressure activates in sequence */}
        <rect className="es-cuff es-cuff-0" x="274" y="256" width="26" height="54" rx="12" />
        <rect className="es-cuff es-cuff-1" x="236" y="256" width="26" height="54" rx="12" />
        <rect className="es-cuff es-cuff-2" x="198" y="258" width="26" height="54" rx="12" />

        {/* heartbeat at the chest */}
        <circle className="es-ring" cx="172" cy="262" r="13" />
        <circle className="es-heart" cx="172" cy="262" r="6" />
      </svg>
    </div>
  );
}

// The course is a journey from danger to safety, told in colour across the seven
// weeks. The colour simply groups the schedule from start → midpoint → finish;
// it does not represent a biological milestone or promise an outcome. Routing through
// gold keeps the ramp clean; a direct coral→teal RGB blend would muddy to grey.
const START: [number, number, number] = [220, 95, 114];
const MIDPOINT: [number, number, number] = [217, 164, 65];
const FINISH: [number, number, number] = [90, 165, 150];
const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
const mix = (a: [number, number, number], b: [number, number, number], u: number) =>
  `rgb(${lerp(a[0], b[0], u)}, ${lerp(a[1], b[1], u)}, ${lerp(a[2], b[2], u)})`;
const weekColor = (week: number) => {
  const t = (week - 1) / 6; // 0 at week 1 → 1 at week 7, with the turn at t = 0.5
  return t <= 0.5 ? mix(START, MIDPOINT, t / 0.5) : mix(MIDPOINT, FINISH, (t - 0.5) / 0.5);
};

export function EecpCourseGrid() {
  return (
    <div className="course-block" role="img" aria-label="A usual thirty-five-session EECP course shown as seven weekly columns of five dots. The colour groups the schedule from start to finish and does not represent a promised medical outcome.">
      <div className="course-weeks" aria-hidden="true">
        {Array.from({ length: 7 }, (_, w) => (
          <small key={w}>{w + 1}</small>
        ))}
      </div>
      <div className="eecp-course-grid">
        {Array.from({ length: 35 }, (_, i) => {
          const week = Math.floor(i / 5) + 1;
          return (
            <span
              key={i}
              className={`course-dot${i === 34 ? " course-dot--last" : ""}`}
              style={{ animationDelay: `${i * 40}ms`, "--dot": weekColor(week) } as CSSProperties}
            />
          );
        })}
      </div>
      <ol className="course-beats" aria-hidden="true">
        <li className="course-beat">
          <span className="course-beat-tick" /><b>Session 1</b><small>Baseline symptoms and comfort</small>
        </li>
        <li className="course-beat course-beat-mid">
          <span className="course-beat-tick" /><b>Around week 4</b><small>Progress and tolerance review</small>
        </li>
        <li className="course-beat course-beat-end">
          <span className="course-beat-tick" /><b>Session 35</b><small>Full-course response review</small>
        </li>
      </ol>
    </div>
  );
}
