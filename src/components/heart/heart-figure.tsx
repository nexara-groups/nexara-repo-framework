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

      {/* ——— Great vessels — a clean bundle emerging from the base (drawn under the chambers
          so the chamber walls sit on top). ——— */}

      {/* Aorta — the signature arch: rises from the LV, hooks over to viewer-left, exits.
          Arterial / coral. */}
      <path
        id={id("hf-aorta")}
        className="hf-vessel hf-arterial hf-aorta"
        d="M240 216 C 240 156 240 122 236 104 C 230 76 206 64 182 70 C 158 76 148 96 146 120
           L172 126 C 174 106 184 98 196 98 C 210 98 214 114 214 138 C 214 168 214 194 214 216 Z"
      />

      {/* Pulmonary trunk — a single tube rising from the RV, leaning slightly right. Venous. */}
      <path
        id={id("hf-pa")}
        className="hf-vessel hf-venous hf-pa"
        d="M250 216 C 252 156 256 124 262 104 C 268 84 262 60 246 54 C 268 58 284 80 282 106
           C 280 140 276 180 278 216 Z"
      />

      {/* Superior vena cava — a clean tube descending from top-right into the RA. Venous. */}
      <path
        id={id("hf-vc")}
        className="hf-vessel hf-venous hf-vc"
        d="M316 48 C 346 50 362 74 362 106 C 362 138 356 174 348 198 L320 192
           C 328 168 332 138 330 112 C 328 84 320 66 306 62 Z"
      />

      {/* Pulmonary veins — two short blunt tubes joining the LA to the right lung. Arterial. */}
      <path
        id={id("hf-pv")}
        className="hf-vessel hf-arterial hf-pv"
        d="M356 236 C 378 234 398 238 414 246 C 419 248 419 256 414 258 C 398 250 378 248 356 250 C 351 249 351 237 356 236 Z
           M356 300 C 378 298 398 302 414 310 C 419 312 419 320 414 322 C 398 314 378 312 356 314 C 351 313 351 301 356 300 Z"
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
