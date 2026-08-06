const beat = "h120 l10 -14 12 14 h30 l12 -50 16 92 12 -42 h138";

export function HeroEcg() {
  return (
    <svg className="eecp-hero-ecg" viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="hero-ecg-line" d={`M0 84 ${beat} ${beat} ${beat} ${beat}`} />
      <circle className="hero-ecg-dot" cx="0" cy="0" r="5" />
    </svg>
  );
}

const cuffs = [
  // Pressure activates first at the calf, then thigh, then upper thigh. The cuff shells stay fixed.
  { x: 414, y: 362, w: 26, h: 46, num: "1", nx: 427, ny: 330 },
  { x: 350, y: 354, w: 30, h: 54, num: "2", nx: 365, ny: 322 },
  { x: 290, y: 356, w: 34, h: 54, num: "3", nx: 307, ny: 324 },
];

export function EecpPulseArt() {
  return (
    <svg viewBox="0 0 560 560" role="img" focusable="false" aria-label="Animated artwork: a patient reclines on a treatment bed while three fixed leg cuffs pressurise in sequence at the calf, thigh, and upper thigh, supporting blood flow toward the heart in time with an ECG trace.">
      <defs>
        <radialGradient id="paHeartGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#dc5f72" stopOpacity=".38" />
          <stop offset="55%" stopColor="#dc5f72" stopOpacity=".14" />
          <stop offset="100%" stopColor="#dc5f72" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="art-float">
        {/* ——— The heart, magnified out of the chest ——— */}
        <circle className="hero-ring-dash" cx="190" cy="196" r="118" />
        <circle className="pa-glow" cx="190" cy="196" r="98" fill="url(#paHeartGlow)" />
        <circle className="hero-ring" cx="190" cy="196" r="76" />
        <circle className="pa-ripple" cx="190" cy="196" r="42" />
        <path
          className="pa-heart"
          d="M190 174 C 177 150, 144 155, 142 184 C 140 206, 165 224, 190 244 C 215 224, 240 206, 238 184 C 236 155, 203 150, 190 174 Z"
        />
        {/* Callout lead: magnified heart belongs to the chest below */}
        <line className="pa-lead" x1="191" y1="252" x2="202" y2="350" />

        {/* ——— ECG: the clock that times everything ——— */}
        <path className="pa-ecg" d="M258 196 h10 l7 -12 7 12 h14 l9 -42 14 72 9 -30 h24 q 12 -16 24 0 h130" />
        <circle className="pa-ecg-dot" r="4.5" />

        {/* ——— Treatment bed ——— */}
        <ellipse className="pa-shadow" cx="288" cy="466" rx="200" ry="9" />
        <rect className="pa-bed" x="70" y="398" width="436" height="11" rx="5.5" />
        <rect className="pa-bed-leg" x="118" y="409" width="8" height="52" />
        <rect className="pa-bed-leg" x="436" y="409" width="8" height="52" />
        <line className="pa-floor" x1="84" y1="464" x2="502" y2="464" />

        {/* ——— The patient, reclined ——— */}
        <rect className="pa-pillow" x="90" y="382" width="70" height="15" rx="7.5" />
        <circle className="pa-body" cx="126" cy="362" r="23" />
        <path
          className="pa-body"
          d="M152 398 C 154 382, 160 368, 176 361 C 194 353, 214 353, 230 361 C 248 369, 262 373, 284 373 C 300 373, 308 367, 322 366 C 352 364, 384 366, 410 371 C 424 374, 434 377, 446 379 L 468 382 C 476 382, 481 375, 483 365 L 491 365 C 495 365, 497 371, 496 379 L 494 398 Z"
        />

        {/* ——— Blood driven back to the heart ——— */}
        {[0, 1, 2].map((i) => (
          <circle key={i} className={`pa-blood pa-blood-${i}`} r="5" />
        ))}

        {/* ——— Three fixed cuff shells, with pressure indicated by colour ——— */}
        {cuffs.map((cuff, i) => (
          <g key={cuff.num}>
            <rect className={`pa-cuff pa-cuff-${i}`} x={cuff.x} y={cuff.y} width={cuff.w} height={cuff.h} rx="12" />
            <g className={`pa-num pa-num-${i}`}>
              <circle cx={cuff.nx} cy={cuff.ny} r="10.5" />
              <text x={cuff.nx} y={cuff.ny + 4}>{cuff.num}</text>
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}

export function DiagnosticsArt() {
  // Sweep rotates clockwise from 12 o'clock; each finding lights up as the beam passes it.
  const findings = [
    { x: 280, y: 160, delay: 0, hot: true },
    { x: 350, y: 190, delay: 0.37 },
    { x: 330, y: 330, delay: 1.25 },
    { x: 215, y: 320, delay: 2.05, hot: true },
    { x: 200, y: 210, delay: 2.72 },
  ];
  const bars = [42, 68, 34, 76, 52];
  return (
    <svg viewBox="0 0 560 560" role="img" focusable="false" aria-label="Animated artwork: a diagnostic scanner sweeps in a circle, lighting up findings as it passes, while result bars settle below.">
      <circle className="hero-ring-dash" cx="280" cy="268" r="188" />
      {[64, 112, 160].map((r) => <circle key={r} className="dg-ring" cx="280" cy="268" r={r} />)}
      <line className="dg-cross" x1="120" y1="268" x2="440" y2="268" />
      <line className="dg-cross" x1="280" y1="108" x2="280" y2="428" />
      <g className="dg-sweep">
        <line x1="280" y1="268" x2="280" y2="112" />
        <circle cx="280" cy="112" r="5" />
      </g>
      {findings.map((f, i) => (
        <circle
          key={i}
          className={`dg-dot${f.hot ? " dg-dot-hot" : ""}`}
          cx={f.x}
          cy={f.y}
          r="5.5"
          style={{ animationDelay: `${f.delay}s` }}
        />
      ))}
      {bars.map((h, i) => (
        <rect
          key={i}
          className={`dg-bar${i === 3 ? " dg-bar-hot" : ""}`}
          x={192 + i * 40}
          y={496 - h}
          width="15"
          height={h}
          rx="3"
          style={{ animationDelay: `${i * 0.14}s` }}
        />
      ))}
    </svg>
  );
}

export function PharmacyArt() {
  return (
    <svg viewBox="0 0 560 560" role="img" focusable="false" aria-label="Animated artwork: capsules drop one by one into an open prescription bottle marked with a medical cross, while a large capsule floats alongside.">
      <circle className="hero-ring-dash" cx="280" cy="300" r="182" />
      {/* Open bottle */}
      <path
        className="ph-bottle"
        d="M240 252 L240 268 C240 282, 210 284, 210 302 L210 444 Q210 460 226 460 L334 460 Q350 460 350 444 L350 302 C350 284, 320 282, 320 268 L320 252"
      />
      <rect className="ph-label" x="238" y="350" width="84" height="64" rx="6" />
      <rect className="ph-cross" x="272" y="366" width="16" height="34" rx="3" />
      <rect className="ph-cross" x="263" y="375" width="34" height="16" rx="3" />
      {/* Capsules dropping into the mouth */}
      {[{ x: 262, d: 0 }, { x: 286, d: 1.05 }, { x: 272, d: 2.1 }].map((pill, i) => (
        <rect key={i} className="ph-pill" x={pill.x} y="150" width="24" height="11" rx="5.5" style={{ animationDelay: `${pill.d}s` }} />
      ))}
      {/* The signature capsule, floating */}
      <g className="ph-cap">
        <path className="ph-cap-solid" d="M382 176 L424 134 A 21 21 0 0 1 454 164 L433 185 Z" transform="rotate(-4 418 160)" />
        <path className="ph-cap-line" d="M433 185 L412 206 A 21 21 0 0 1 382 176 L403 155 Z" transform="rotate(-4 418 160)" />
        <circle className="ph-spark" cx="472" cy="120" r="4" />
        <circle className="ph-spark ph-spark-2" cx="360" cy="112" r="3" />
      </g>
      {/* Shelf hint */}
      <line className="ph-shelf" x1="150" y1="460" x2="410" y2="460" />
    </svg>
  );
}

export function OpdArt() {
  return (
    <svg viewBox="0 0 560 560" role="img" focusable="false" aria-label="Animated artwork: a doctor and a patient in conversation — the patient speaks, the doctor responds with care — while a consultation checklist ticks itself off.">
      <circle className="hero-ring-dash" cx="280" cy="280" r="188" />
      {/* Doctor */}
      <circle className="od-figure" cx="185" cy="218" r="30" />
      <path className="od-figure" d="M126 312 Q185 254 244 312 L244 322 L126 322 Z" />
      <path className="od-steth" d="M172 250 C 168 278, 190 290, 202 274" />
      <circle className="od-steth-dot" cx="204" cy="271" r="6" />
      {/* Patient */}
      <circle className="od-figure" cx="375" cy="218" r="30" />
      <path className="od-figure" d="M316 312 Q375 254 434 312 L434 322 L316 322 Z" />
      {/* Patient speaks first */}
      <g className="od-bubble-a">
        <path className="od-bubble" d="M330 118 h104 a12 12 0 0 1 12 12 v34 a12 12 0 0 1 -12 12 h-58 l-14 16 v-16 h-32 a12 12 0 0 1 -12 -12 v-34 a12 12 0 0 1 12 -12 Z" />
        {[358, 382, 406].map((x, i) => (
          <circle key={x} className="od-tdot" cx={x} cy="147" r="4.5" style={{ animationDelay: `${i * 0.18}s` }} />
        ))}
      </g>
      {/* The doctor answers with care */}
      <g className="od-bubble-b">
        <path className="od-bubble" d="M126 118 h104 a12 12 0 0 1 12 12 v34 a12 12 0 0 1 -12 12 h-32 l-14 16 v-16 h-58 a12 12 0 0 1 -12 -12 v-34 a12 12 0 0 1 12 -12 Z" />
        <path
          className="od-heart"
          d="M178 136 c -5 -8, -18 -5, -18 5 c 0 8 9 13 18 20 c 9 -7 18 -12 18 -20 c 0 -10 -13 -13 -18 -5 Z"
        />
      </g>
      {/* Consultation checklist */}
      <rect className="od-clip" x="218" y="352" width="124" height="132" rx="10" />
      <rect className="od-clip-tab" x="258" y="342" width="44" height="18" rx="6" />
      {[392, 424, 456].map((y, i) => (
        <g key={y}>
          <line className="od-row" x1="264" y1={y} x2="322" y2={y} />
          <path className="od-check" d={`M238 ${y - 2} l6 7 l11 -13`} style={{ animationDelay: `${0.6 + i * 0.7}s` }} />
        </g>
      ))}
    </svg>
  );
}

export function AboutArt() {
  // Ticks start tall and wild on the left, decaying toward the core — noise calming.
  const ticks = Array.from({ length: 13 }, (_, i) => ({
    x: 90 + i * 11,
    h: 66 - i * 4,
    dur: [3.1, 2.4, 3.6, 2.8, 3.9, 2.6, 3.3, 2.9, 3.7, 2.5, 3.4, 2.7, 3.2][i],
    delay: (i % 5) * 0.14,
  }));
  return (
    <svg viewBox="0 0 560 560" role="img" focusable="false" aria-label="Animated artwork: restless noise on the left calms as it nears the Rise pulse at the centre, then resolves into one clear, steady heartbeat on the right — trust, not noise.">
      <circle className="hero-ring-dash" cx="280" cy="280" r="236" />

      {/* Noise — restless, decaying toward the core */}
      {ticks.map((t, i) => (
        <rect
          key={i}
          className="ab-noise"
          x={t.x}
          y={280 - t.h / 2}
          width="3.4"
          height={t.h}
          rx="1.7"
          style={{ animationDuration: `${t.dur}s`, animationDelay: `${t.delay}s` }}
        />
      ))}
      <line className="ab-wire" x1="236" y1="280" x2="300" y2="280" />

      {/* The Rise pulse — noise in, signal out */}
      <g className="ab-core">
        <circle className="ab-flarecore" cx="280" cy="280" r="30" />
        <circle className="ab-core-ring" cx="280" cy="280" r="41" />
        <circle className="ab-core-dot" cx="280" cy="280" r="20" />
      </g>

      {/* One clear heartbeat */}
      <path className="ab-beat" d="M300 280 h40 l11 -18 13 18 h20 l15 -66 19 104 13 -50 h56" />
      <circle className="ab-flare" cx="404" cy="248" r="15" />
      <circle className="ab-beat-dot" cx="0" cy="0" r="5.5" />

      {/* Labels */}
      <text className="ab-tag ab-tag-mute" x="158" y="392" textAnchor="middle">Noise</text>
      <text className="ab-tag ab-tag-hot" x="420" y="392" textAnchor="middle">One clear signal</text>
    </svg>
  );
}

const quadrants = [
  { x: 368, y: 176, label: "EECP therapy" },
  { x: 192, y: 176, label: "Diagnostics" },
  { x: 192, y: 372, label: "Pharmacy" },
  { x: 368, y: 372, label: "OPD" },
];

export function HomeCrossArt() {
  return (
    <svg viewBox="0 0 560 560" role="img" focusable="false" aria-label="Animated artwork: the Rise medical cross with a beating pulse at its centre and the four care pathways — EECP therapy, diagnostics, pharmacy, and OPD — in its quadrants.">
      {/* The Rise mark, monumental: ring, cross, pulse */}
      <circle className="cross-ring" cx="280" cy="280" r="212" />
      <circle className="cross-ring-dash" cx="280" cy="280" r="236" />
      <rect className="cross-bar" x="269" y="100" width="22" height="360" rx="11" />
      <rect className="cross-bar" x="100" y="269" width="360" height="22" rx="11" />
      <g className="hero-heart">
        <circle className="hero-ripple" cx="280" cy="280" r="24" />
        <circle className="cross-core-ring" cx="280" cy="280" r="34" />
        <circle className="hero-core" cx="280" cy="280" r="20" />
      </g>
      {/* Four arms, four pathways */}
      {quadrants.map((quad, index) => (
        <g key={quad.label}>
          <circle className={`hub-node-ring hub-n${index}`} cx={quad.x} cy={quad.y} r="11" />
          <circle className="hub-node-dot" cx={quad.x} cy={quad.y} r="4.5" />
          <text className="hub-label" x={quad.x} y={quad.y + 32} textAnchor="middle">{quad.label}</text>
        </g>
      ))}
    </svg>
  );
}
