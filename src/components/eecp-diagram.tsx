import type { CSSProperties } from "react";

export function EecpNaturalBypass() {
  return (
    <figure className="eecp-bypass" aria-label="Animated diagram: over a course of EECP, small collateral blood vessels open around a narrowed artery, forming natural detours for blood flow.">
      <svg viewBox="0 0 440 260" role="img" focusable="false" aria-label="A narrowed artery with small collateral vessels opening around it as natural detours">
        {/* Main artery with a narrowed middle */}
        <path className="bypass-artery" d="M14 130 C 90 130 128 118 168 118 C 200 118 205 142 220 142 C 235 142 240 118 272 118 C 312 118 350 130 426 130" />
        <path className="bypass-artery bypass-artery-inner" d="M14 130 C 90 130 128 118 168 118 C 200 118 205 142 220 142 C 235 142 240 118 272 118 C 312 118 350 130 426 130" />
        {/* Collateral routes drawing themselves in */}
        <path className="bypass-collateral bypass-c1" d="M150 118 C 170 62 270 62 290 118" />
        <path className="bypass-collateral bypass-c2" d="M162 126 C 190 196 250 196 278 126" />
        {/* Flow dots along the main artery */}
        <circle className="bypass-dot bypass-d1" cx="0" cy="0" r="4.5" />
        <circle className="bypass-dot bypass-d2" cx="0" cy="0" r="4.5" />
        {/* Below the lower collateral (its arc bottoms out around y=178) so
            the vessel never strikes through the text */}
        <text className="mech-label" x="182" y="208">Narrowed</text>
        <text className="mech-label" x="152" y="40">New collateral routes</text>
      </svg>
      <figcaption>
        <span className="pulse-icon" aria-hidden="true" />
        <span>Repeated sessions encourage collateral vessels — your body&rsquo;s own detours.</span>
      </figcaption>
    </figure>
  );
}

export function EecpSessionScene() {
  return (
    <div className="eecp-scene" role="img" aria-label="Illustration of a monitored EECP session: a patient reclines while cuffs on the calves, thighs and hips inflate in a wave, linked by hoses to a console that tracks the heartbeat on an ECG.">
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

        {/* cuffs on calf, thigh, hip — inflate in a wave toward the heart */}
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
// weeks. It starts coral (symptoms at their heaviest), turns gold around week 4
// (when collateral vessels begin forming — the biological turning point), and
// settles into calm teal by week 7 (a steadier, safer state). Routing through
// gold keeps the ramp clean; a direct coral→teal RGB blend would muddy to grey.
const DANGER: [number, number, number] = [220, 95, 114]; // coral — week 1
const TURN: [number, number, number] = [217, 164, 65]; //   gold  — week 4
const SAFE: [number, number, number] = [90, 165, 150]; //   teal  — week 7
const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
const mix = (a: [number, number, number], b: [number, number, number], u: number) =>
  `rgb(${lerp(a[0], b[0], u)}, ${lerp(a[1], b[1], u)}, ${lerp(a[2], b[2], u)})`;
const weekColor = (week: number) => {
  const t = (week - 1) / 6; // 0 at week 1 → 1 at week 7, with the turn at t = 0.5
  return t <= 0.5 ? mix(DANGER, TURN, t / 0.5) : mix(TURN, SAFE, (t - 0.5) / 0.5);
};

export function EecpCourseGrid() {
  return (
    <div className="course-block" role="img" aria-label="Thirty-five sessions shown as seven weekly columns of five dots — one dot per daily one-hour session across seven weeks. Colour travels from coral to teal as the weeks pass: the warm coral start marks where symptoms are heaviest, the gold midpoint around week four is when collateral vessels begin forming, and the calm teal finish marks a steadier, safer state by session thirty-five.">
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
          <span className="course-beat-tick" /><b>Day 1</b><small>Where the course begins</small>
        </li>
        <li className="course-beat course-beat-mid">
          <span className="course-beat-tick" /><b>By week 4</b><small>Collateral vessels begin forming</small>
        </li>
        <li className="course-beat course-beat-end">
          <span className="course-beat-tick" /><b>Session 35</b><small>Steadier, calmer days</small>
        </li>
      </ol>
    </div>
  );
}
