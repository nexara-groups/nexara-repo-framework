// Stylised anatomical heart — patient-education proportions (domed base, small atria,
// dominant ventricles, one apex offset left), NOT a valentine. Server component (pure SVG).
// GSAP animates it in the flow chapter; every id/class below is a stable hook the animation
// (heart-flow-scrolly) targets — do not rename.
//
// Construction: one silhouette divided by a septum (vertical, T→apex) and an AV groove
// (horizontal) into four chambers that TILE with shared borders — no gaps. Orientation is
// anatomical: viewer's LEFT holds the patient's RIGHT heart (venous, blue), viewer's RIGHT
// holds the patient's LEFT heart (arterial, coral). Great vessels are clean colored tubes
// rising from the base over their correct chambers.

type Lane = "in" | "lungs" | "return" | "out";
const laneStart: Record<Lane, { x: number; y: number }> = {
  in: { x: 108, y: -46 },
  lungs: { x: 132, y: 382 },
  return: { x: 340, y: 150 },
  out: { x: 210, y: 384 },
};
const particles = (["in", "lungs", "return", "out"] as Lane[]).flatMap((lane) =>
  [0, 1, 2].map((i) => ({ lane, i })),
);

const labels = [
  { id: "ra", text: "Right atrium", x: 16, y: 126, anchor: "end" as const },
  { id: "rv", text: "Right ventricle", x: 8, y: 336, anchor: "end" as const },
  { id: "la", text: "Left atrium", x: 384, y: 126, anchor: "start" as const },
  { id: "lv", text: "Left ventricle", x: 392, y: 336, anchor: "start" as const },
  { id: "aorta", text: "Aorta", x: 84, y: -60, anchor: "middle" as const },
  { id: "pa", text: "Pulmonary artery", x: 214, y: -64, anchor: "middle" as const },
  { id: "vc", text: "Vena cava", x: 46, y: 18, anchor: "end" as const },
  { id: "pv", text: "Pulmonary veins", x: 388, y: 180, anchor: "start" as const },
];

export function HeartFigure({ ids = true, lungs = true }: { ids?: boolean; lungs?: boolean } = {}) {
  const id = (name: string) => (ids ? name : undefined);
  return (
    <svg
      className="heart-fig"
      viewBox="-100 -85 620 560"
      role="img"
      aria-label="Stylised anatomical cross-section of the human heart showing four chambers, valves, and the great vessels"
    >
      {/* ——— Lungs: soft lobes behind the upper corners (context for the "to the lungs"
          beat; dropped on the hero via lungs={false}). ——— */}
      {lungs ? (
        <g className="hf-lungs" aria-hidden="true">
          <path
            className="hf-lung"
            d="M 44 150 C -4 150 -34 190 -34 246 C -34 300 -8 336 30 350 C 44 356 52 346 50 330
               C 44 288 46 220 60 172 C 64 156 58 150 44 150 Z"
          />
          <path
            className="hf-lung"
            d="M 328 150 C 376 150 406 190 406 246 C 406 300 380 336 342 350 C 328 356 320 346 322 330
               C 328 288 326 220 312 172 C 308 156 314 150 328 150 Z"
          />
        </g>
      ) : null}

      {/* ——— Great vessels — clean colored tubes rising over the correct chambers, drawn
          UNDER the body so the chamber walls sit on top. ——— */}

      {/* Pulmonary trunk — from the RV (viewer-left), forking toward the lungs. Venous. */}
      <g id={id("hf-pa")} className="hf-vessel hf-pa">
        <path d="M 178 60 C 176 20 174 -6 172 -22" strokeWidth={20} />
        <path d="M 172 -22 C 150 -38 118 -40 94 -24" strokeWidth={14} />
        <path d="M 172 -22 C 196 -40 226 -42 250 -28" strokeWidth={14} />
      </g>
      {/* Aorta — the signature arch from the LV (viewer-right), curving up and away. Arterial. */}
      <g id={id("hf-aorta")} className="hf-vessel hf-aorta">
        <path d="M 214 60 C 216 12 214 -24 202 -46 C 190 -68 158 -72 136 -58" strokeWidth={19} />
      </g>
      {/* Vena cava — descending into the RA (viewer-left). Venous. */}
      <g id={id("hf-vc")} className="hf-vessel hf-vc">
        <path d="M 122 66 C 102 30 90 0 90 -30" strokeWidth={15} />
      </g>
      {/* Pulmonary veins — short stubs joining the LA to the right lung. Arterial. */}
      <g id={id("hf-pv")} className="hf-vessel hf-pv">
        <path d="M 300 130 C 322 124 342 126 358 138" strokeWidth={12} />
        <path d="M 300 172 C 322 168 344 172 360 184" strokeWidth={12} />
      </g>

      {/* ——— The four chambers (tile via shared septum + AV-groove borders) ——— */}
      <g className="hf-chambers">
        {/* Right atrium — upper-left, venous. */}
        <path
          id={id("hf-ra")}
          className="hf-chamber hf-venous hf-ra"
          d="M200 40 Q165 42 130 72 C92 78 57 104 46 146 C42 166 40 178 40 188
             C100 202 150 200 189 192 C191 150 196 90 200 40 Z"
        />
        {/* Left atrium — upper-right, arterial. */}
        <path
          id={id("hf-la")}
          className="hf-chamber hf-arterial hf-la"
          d="M200 40 C196 90 191 150 189 192 C240 184 288 172 318 162
             C318 158 318 152 316 148 C305 105 270 78 232 70 Q235 42 200 40 Z"
        />
        {/* Right ventricle — lower-left, venous. */}
        <path
          id={id("hf-rv")}
          className="hf-chamber hf-venous hf-rv"
          d="M40 188 C100 202 150 200 189 192 C187 260 182 350 178 428
             C132 378 90 320 64 268 C46 244 40 214 40 188 Z"
        />
        {/* Left ventricle — lower-right, arterial. */}
        <path
          id={id("hf-lv")}
          className="hf-chamber hf-arterial hf-lv"
          d="M189 192 C240 184 288 172 318 162 C320 200 316 240 296 272
             C268 322 224 378 178 428 C182 350 187 260 189 192 Z"
        />
      </g>

      {/* ——— Whole-heart silhouette (heavy perimeter, matches the chamber union) ——— */}
      <path
        id={id("hf-outline")}
        className="hf-outline"
        d="M200 40 Q235 42 232 70 C270 78 305 105 316 148 C318 152 318 158 318 162
           C320 200 316 240 296 272 C268 322 224 378 178 428
           C132 378 90 320 64 268 C46 244 40 214 40 188
           C40 178 42 166 46 146 C57 104 92 78 130 72 Q165 42 200 40 Z"
      />

      {/* ——— Internal divides (light lines) ——— */}
      <path id={id("hf-septum")} className="hf-septum" d="M200 40 C196 90 191 150 189 192 C187 260 182 350 178 428" />
      <path className="hf-groove" d="M40 188 C100 202 150 200 189 192 C240 184 288 172 318 162" />

      {/* ——— Left-ventricle thick wall — inner arc that thickens on the "left side" beat ——— */}
      <path className="hf-lv-wall" d="M304 178 C306 214 298 248 274 282 C250 316 216 366 190 410" />

      {/* ——— Valves: two-cusp leaflet marks at each opening ——— */}
      {/* Tricuspid — RA → RV (viewer-left, on the AV groove) */}
      <g className="hf-valve" aria-hidden="true"><path d="M100 190 q10 10 20 0 q10 10 20 0" /></g>
      {/* Mitral — LA → LV (viewer-right, on the AV groove) */}
      <g className="hf-valve" aria-hidden="true"><path d="M232 186 q10 10 20 0 q10 10 20 0" /></g>
      {/* Pulmonary — RV outflow root (higher, smaller) */}
      <g className="hf-valve" aria-hidden="true"><path d="M162 60 q6 7 12 0 q6 7 12 0" /></g>
      {/* Aortic — LV outflow root (higher, smaller) */}
      <g className="hf-valve" aria-hidden="true"><path d="M204 60 q6 7 12 0 q6 7 12 0" /></g>

      {/* ——— Motion lanes (invisible rails for particle animation) ——— */}
      {/* in: vena cava → RA → down toward RV */}
      <path id={id("lane-in")} className="hf-lane lane-in" d="M108 -46 C100 6 96 66 100 126 C106 206 110 286 132 382" />
      {/* lungs: RV → pulmonary trunk → up to the lungs */}
      <path id={id("lane-lungs")} className="hf-lane lane-lungs" d="M132 382 C122 300 132 210 152 128 C166 46 170 4 172 -40" />
      {/* return: pulmonary veins → LA → down toward LV */}
      <path id={id("lane-return")} className="hf-lane lane-return" d="M340 150 C300 150 270 162 250 192 C235 244 235 304 210 384" />
      {/* out: LV → aortic root → up and off top */}
      <path id={id("lane-out")} className="hf-lane lane-out" d="M210 384 C220 282 215 180 210 100 C205 18 200 -22 150 -52" />

      {/* ——— Flow particles (3 per lane, hidden by default) ——— */}
      {particles.map(({ lane, i }) => (
        <circle
          key={`${lane}-${i}`}
          className={`hf-particle hf-particle-${lane}`}
          r="5"
          cx={laneStart[lane].x}
          cy={laneStart[lane].y}
        />
      ))}

      {/* ——— Structure labels (hidden until animation reveals them) ——— */}
      {labels.map((label) => (
        <text
          key={label.id}
          className={`hf-label hf-label-${label.id}`}
          x={label.x}
          y={label.y}
          textAnchor={label.anchor}
        >
          {label.text}
        </text>
      ))}
    </svg>
  );
}
