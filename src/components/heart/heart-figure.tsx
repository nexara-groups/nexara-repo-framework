// Stylised cross-section of the human heart — brand-language SVG, not textbook realism.
// Server component (pure SVG). Later tasks animate it with GSAP; every id/class below is
// a stable hook those tasks target — do not rename.
//
// Construction: one silhouette, divided by a septum (vertical) and an AV groove
// (horizontal) into four chambers that TILE the body with shared borders — no floating
// gaps. Orientation is anatomical: viewer's LEFT holds the patient's RIGHT heart
// (venous, blue), viewer's RIGHT holds the patient's LEFT heart (arterial, coral).
// The apex points down. The left ventricle carries a visibly thick wall — the one
// anatomical fact the design commits to showing.

// 12 flow particles, 3 per lane (hidden until animation reveals them). Initial positions
// sit near each lane's entry point; the animation rides them along the lanes.
type Lane = "in" | "lungs" | "return" | "out";
const laneStart: Record<Lane, { x: number; y: number }> = {
  in: { x: 250, y: 40 },
  lungs: { x: 214, y: 250 },
  return: { x: 470, y: 214 },
  out: { x: 300, y: 250 },
};
const particles = (["in", "lungs", "return", "out"] as Lane[]).flatMap((lane) =>
  [0, 1, 2].map((i) => ({ lane, i })),
);

// 8 structure labels (hidden by default; animation fades them in).
const labels = [
  { id: "ra", text: "Right atrium", x: 96, y: 250, anchor: "start" as const },
  { id: "rv", text: "Right ventricle", x: 84, y: 396, anchor: "start" as const },
  { id: "la", text: "Left atrium", x: 430, y: 250, anchor: "end" as const },
  { id: "lv", text: "Left ventricle", x: 438, y: 396, anchor: "end" as const },
  { id: "aorta", text: "Aorta", x: 150, y: 46, anchor: "middle" as const },
  { id: "pa", text: "Pulmonary artery", x: 250, y: 22, anchor: "middle" as const },
  { id: "vc", text: "Vena cava", x: 356, y: 40, anchor: "end" as const },
  { id: "pv", text: "Pulmonary veins", x: 470, y: 300, anchor: "end" as const },
];

export function HeartFigure({ ids = true }: { ids?: boolean } = {}) {
  const id = (name: string) => (ids ? name : undefined);
  return (
    <svg
      className="heart-fig"
      viewBox="0 0 520 560"
      role="img"
      aria-label="Stylised cross-section of the human heart showing four chambers, valves, and the great vessels"
    >
      {/* ——— Lungs: soft rounded lobes behind the upper corners (context, low opacity) ——— */}
      <g className="hf-lungs" aria-hidden="true">
        <path
          className="hf-lung"
          d="M126 150 C 78 150 44 190 44 250 C 44 300 66 340 104 356 C 118 362 128 352 126 336
             C 120 292 122 224 138 172 C 142 156 138 150 126 150 Z"
        />
        <path
          className="hf-lung"
          d="M394 150 C 442 150 476 190 476 250 C 476 300 454 340 416 356 C 402 362 392 352 394 336
             C 400 292 398 224 382 172 C 378 156 382 150 394 150 Z"
        />
      </g>

      {/* ——— Great vessels (drawn under the chambers so chamber walls sit on top) ——— */}

      {/* Aorta — thick tube rising from the LV, arching over the top and exiting up-left.
          Arterial / coral. */}
      <path
        id={id("hf-aorta")}
        className="hf-vessel hf-arterial hf-aorta"
        d="M262 232 C 268 176 268 132 268 108 C 268 78 250 60 214 60 C 176 60 150 74 150 74
           L150 104 C 150 104 172 92 200 92 C 226 92 232 108 232 132 C 232 158 232 190 232 232 Z"
      />

      {/* Pulmonary artery / trunk — exits the RV, rises past the aorta, and branches toward
          both lungs. Venous / blue. */}
      <path
        id={id("hf-pa")}
        className="hf-vessel hf-venous hf-pa"
        d="M214 232 C 210 176 214 128 226 96 C 232 74 224 44 206 34 C 236 44 250 74 248 100
           C 246 140 244 188 248 232 Z
           M226 70 C 190 46 146 50 116 78 L126 108 C 154 84 190 84 216 104 Z
           M236 70 C 274 46 320 50 352 78 L342 108 C 312 84 272 86 244 106 Z"
      />

      {/* Superior + inferior vena cava — tube at top-right descending into the RA. Venous. */}
      <path
        id={id("hf-vc")}
        className="hf-vessel hf-venous hf-vc"
        d="M312 30 C 344 30 364 52 366 92 C 367 122 362 160 352 196 L318 190
           C 326 156 330 124 328 100 C 326 74 320 58 306 54 Z"
      />

      {/* Pulmonary veins — short tapered stubs joining the LA to the right lung. Arterial. */}
      <path
        id={id("hf-pv")}
        className="hf-vessel hf-arterial hf-pv"
        d="M360 236 C 380 232 400 232 416 240 C 404 244 396 250 392 258 C 382 248 372 242 360 242 Z
           M360 300 C 380 296 400 298 416 306 C 404 310 396 316 392 324 C 382 314 372 308 360 306 Z"
      />

      {/* ——— The whole-heart silhouette — the exact outer boundary of the four tiled
          chambers, used only as the idle-beat scale target (not painted; the chamber and
          LV-wall strokes already draw the perimeter). ——— */}
      <path
        id={id("hf-outline")}
        className="hf-outline"
        d="M250 206
           C 226 176 194 164 168 170 C 134 178 114 210 112 250
           C 112 316 138 388 206 462 C 220 476 234 484 244 490
           C 258 480 286 458 312 430 C 372 364 410 306 410 246
           C 410 232 406 216 398 206 C 380 176 300 168 250 206 Z"
      />

      {/* ——— The four chambers (tile the body via shared septum + AV-groove borders) ——— */}
      <g className="hf-chambers">
        {/* Right atrium — upper-left, venous. */}
        <path
          id={id("hf-ra")}
          className="hf-chamber hf-venous hf-ra"
          d="M250 206
             C 226 176 194 164 168 170 C 134 178 114 210 112 250
             C 112 268 116 286 122 302
             C 160 312 208 316 244 314
             C 240 274 242 238 250 206 Z"
        />

        {/* Left atrium — upper-right, arterial. */}
        <path
          id={id("hf-la")}
          className="hf-chamber hf-arterial hf-la"
          d="M250 206
             C 274 176 306 164 332 170 C 366 178 386 210 388 250
             C 388 268 384 286 378 302
             C 340 312 292 316 256 314
             C 254 274 252 238 250 206 Z"
        />

        {/* Right ventricle — lower-left, venous. Its wall hugs the silhouette (thin wall). */}
        <path
          id={id("hf-rv")}
          className="hf-chamber hf-venous hf-rv"
          d="M122 302
             C 128 356 158 416 206 462 C 220 476 234 484 244 488
             C 244 442 244 372 244 314
             C 208 316 160 312 122 302 Z"
        />

        {/* Left ventricle — lower-right, arterial. Cavity is inset from the silhouette on the
            free wall + apex; that gap is the thick myocardium. */}
        <path
          id={id("hf-lv")}
          className="hf-chamber hf-arterial hf-lv"
          d="M256 314
             C 256 372 256 434 250 470
             C 292 442 332 392 352 320 C 356 314 356 308 356 302
             C 320 312 292 314 256 314 Z"
        />

        {/* Interventricular septum — wall between the two ventricles. */}
        <path
          id={id("hf-septum")}
          className="hf-septum"
          d="M250 206 C 246 262 248 316 250 360 C 251 410 248 452 246 488"
        />
      </g>

      {/* Left-ventricle thick wall — coral crescent filling the gap between the LV cavity's
          free wall/apex and the silhouette on the lower-right. The one anatomical highlight. */}
      <path
        className="hf-lv-wall"
        d="M244 490
           C 258 480 286 458 312 430 C 372 364 410 306 410 246 C 408 278 388 306 356 322
           C 344 388 300 440 250 470 C 251 476 249 484 244 490 Z"
      />

      {/* ——— Valves: paired-leaflet marks along the AV groove + outflow roots ——— */}
      {/* Tricuspid — RA → RV (viewer-left, on the groove) */}
      <g className="hf-valve" aria-hidden="true">
        <path d="M156 300 q20 15 40 3" />
        <path d="M158 309 q19 -11 38 -1" />
      </g>
      {/* Pulmonary — RV → PA (outflow root, sits higher) */}
      <g className="hf-valve" aria-hidden="true">
        <path d="M210 240 q14 -13 28 0" />
        <path d="M212 233 q13 11 26 0" />
      </g>
      {/* Mitral — LA → LV (viewer-right, on the groove) */}
      <g className="hf-valve" aria-hidden="true">
        <path d="M300 300 q20 13 40 1" />
        <path d="M302 309 q19 -12 38 -3" />
      </g>
      {/* Aortic — LV → aorta (outflow root, sits higher) */}
      <g className="hf-valve" aria-hidden="true">
        <path d="M234 236 q14 -13 28 0" />
        <path d="M236 229 q13 11 26 0" />
      </g>

      {/* ——— Motion lanes (invisible rails for particle animation) ——— */}
      {/* in: vena cava (top-right) → RA → down toward RV */}
      <path
        id={id("lane-in")}
        className="hf-lane lane-in"
        d="M330 70 C 338 120 330 160 300 200 C 260 250 200 260 168 300 C 158 340 168 400 200 452"
      />
      {/* lungs: RV → pulmonary trunk → up to the lungs */}
      <path
        id={id("lane-lungs")}
        className="hf-lane lane-lungs"
        d="M200 452 C 190 380 196 320 210 270 C 218 220 224 160 228 108 C 200 92 150 96 110 120"
      />
      {/* return: lungs / pulmonary veins → LA → down toward LV */}
      <path
        id={id("lane-return")}
        className="hf-lane lane-return"
        d="M470 214 C 420 220 380 236 350 270 C 320 300 312 340 310 390 C 300 430 290 460 262 476"
      />
      {/* out: LV → aortic root → up and off top-left */}
      <path
        id={id("lane-out")}
        className="hf-lane lane-out"
        d="M262 470 C 268 400 264 320 258 260 C 254 200 256 150 250 108 C 240 84 200 74 150 74"
      />

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
