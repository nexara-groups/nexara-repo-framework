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
  in: { x: 168, y: 52 },
  lungs: { x: 214, y: 300 },
  return: { x: 462, y: 214 },
  out: { x: 300, y: 300 },
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
  { id: "aorta", text: "Aorta", x: 372, y: 108, anchor: "start" as const },
  { id: "pa", text: "Pulmonary artery", x: 226, y: 26, anchor: "middle" as const },
  { id: "vc", text: "Vena cava", x: 126, y: 108, anchor: "end" as const },
  { id: "pv", text: "Pulmonary veins", x: 470, y: 300, anchor: "end" as const },
];

export function HeartFigure({ ids = true, lungs = true }: { ids?: boolean; lungs?: boolean } = {}) {
  const id = (name: string) => (ids ? name : undefined);
  return (
    <svg
      className="heart-fig"
      viewBox="0 0 520 560"
      role="img"
      aria-label="Stylised cross-section of the human heart showing four chambers, valves, and the great vessels"
    >
      {/* ——— Lungs: soft lobes behind the upper corners (context for the flow chapter's
          "to the lungs" beat; dropped on the hero via lungs={false}). ——— */}
      {lungs ? (
        <g className="hf-lungs" aria-hidden="true">
          <path
            className="hf-lung"
            d="M132 158 C 84 158 50 198 50 256 C 50 306 72 344 110 360 C 124 366 134 356 132 340
               C 126 296 128 228 144 178 C 148 162 144 158 132 158 Z"
          />
          <path
            className="hf-lung"
            d="M388 158 C 436 158 470 198 470 256 C 470 306 448 344 410 360 C 396 366 386 356 388 340
               C 394 296 392 228 376 178 C 372 162 376 158 388 158 Z"
          />
        </g>
      ) : null}

      {/* ——— Great vessels — emerging from the base over the correct chambers (drawn under
          the chambers so the chamber walls sit on top). Venous vessels (PA, VC) rise over
          the RIGHT heart (viewer-left); the aorta rises over the LEFT ventricle (viewer-
          right) and arches away. ——— */}

      {/* Aorta — the signature arch: rises from the LV (viewer-right), arches over the top
          and exits. Arterial / coral. */}
      <path
        id={id("hf-aorta")}
        className="hf-vessel hf-arterial hf-aorta"
        d="M260 216 C 260 156 260 122 264 104 C 270 76 294 64 318 70 C 342 76 352 96 354 120
           L328 126 C 326 106 316 98 304 98 C 290 98 286 114 286 138 C 286 168 286 194 286 216 Z"
      />

      {/* Pulmonary trunk — a single tube rising from the RV (viewer-left). Venous / blue. */}
      <path
        id={id("hf-pa")}
        className="hf-vessel hf-venous hf-pa"
        d="M250 216 C 248 156 244 124 238 104 C 232 84 238 60 254 54 C 232 58 216 80 218 106
           C 220 140 224 180 222 216 Z"
      />

      {/* Superior vena cava — a clean tube descending from the top into the RA (viewer-left).
          Venous / blue. */}
      <path
        id={id("hf-vc")}
        className="hf-vessel hf-venous hf-vc"
        d="M184 48 C 154 50 138 74 138 106 C 138 138 144 174 152 198 L180 192
           C 172 168 168 138 170 112 C 172 84 180 66 194 62 Z"
      />

      {/* Pulmonary veins — two short blunt tubes joining the LA to the right lung. Arterial. */}
      <path
        id={id("hf-pv")}
        className="hf-vessel hf-arterial hf-pv"
        d="M356 236 C 378 234 398 238 414 246 C 419 248 419 256 414 258 C 398 250 378 248 356 250 C 351 249 351 237 356 236 Z
           M356 300 C 378 298 398 302 414 310 C 419 312 419 320 414 322 C 398 314 378 312 356 314 C 351 313 351 301 356 300 Z"
      />

      {/* ——— The whole-heart silhouette — traces the exact outer boundary of the four
          tiled chambers (left side via RA+RV, apex, right side via the LV wall then LA),
          so it can carry the heavy perimeter stroke while the chambers stay stroke-less. ——— */}
      <path
        id={id("hf-outline")}
        className="hf-outline"
        d="M250 206
           C 226 176 194 164 168 170 C 134 178 114 210 112 250
           C 112 268 116 286 122 302 C 128 356 158 416 206 462
           C 220 476 234 484 244 488 C 258 480 286 458 312 430
           C 372 364 410 306 410 246 C 404 244 396 249 388 250
           C 386 210 366 178 332 170 C 306 164 274 176 250 206 Z"
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

        {/* Interventricular + interatrial septum — the vertical divide (light internal line). */}
        <path
          id={id("hf-septum")}
          className="hf-septum"
          d="M250 206 C 246 262 248 316 250 360 C 251 410 248 452 246 488"
        />

        {/* AV groove — the horizontal divide between atria and ventricles (light line). */}
        <path
          className="hf-groove"
          d="M122 302 C 160 312 208 316 250 314 C 292 316 340 312 378 302"
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

      {/* ——— Valves: two-cusp leaflet marks (a small double scallop) at each opening ——— */}
      {/* Tricuspid — RA → RV (viewer-left, on the AV groove) */}
      <g className="hf-valve" aria-hidden="true">
        <path d="M152 302 q11 12 22 0 q11 12 22 0" />
      </g>
      {/* Mitral — LA → LV (viewer-right, on the AV groove) */}
      <g className="hf-valve" aria-hidden="true">
        <path d="M300 302 q11 12 22 0 q11 12 22 0" />
      </g>
      {/* Pulmonary — RV → pulmonary trunk (outflow root, sits higher, smaller) */}
      <g className="hf-valve" aria-hidden="true">
        <path d="M250 226 q6 8 12 0 q6 8 12 0" />
      </g>
      {/* Aortic — LV → aorta (outflow root, sits higher, smaller) */}
      <g className="hf-valve" aria-hidden="true">
        <path d="M212 226 q6 8 12 0 q6 8 12 0" />
      </g>

      {/* ——— Motion lanes (invisible rails for particle animation) ——— */}
      {/* in: vena cava (top-left) → RA → down toward RV */}
      <path
        id={id("lane-in")}
        className="hf-lane lane-in"
        d="M168 52 C 164 110 172 160 188 200 C 202 244 210 270 206 310 C 202 350 202 402 206 452"
      />
      {/* lungs: RV → pulmonary trunk → up to the lungs */}
      <path
        id={id("lane-lungs")}
        className="hf-lane lane-lungs"
        d="M206 452 C 200 380 205 320 218 270 C 226 220 232 160 236 108 C 210 92 150 96 110 120"
      />
      {/* return: lungs / pulmonary veins → LA → down toward LV */}
      <path
        id={id("lane-return")}
        className="hf-lane lane-return"
        d="M462 214 C 416 220 380 236 350 270 C 320 300 312 340 310 390 C 300 430 290 460 262 476"
      />
      {/* out: LV → aortic root (viewer-right) → up and off top-right */}
      <path
        id={id("lane-out")}
        className="hf-lane lane-out"
        d="M300 470 C 300 400 296 330 288 270 C 282 210 280 156 288 112 C 296 86 320 74 352 96"
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
