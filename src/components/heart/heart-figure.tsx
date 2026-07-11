// Stylised cross-section of the human heart — brand-language SVG, not textbook realism.
// Server component (pure SVG). Later tasks animate it with GSAP; every id/class below is
// a stable hook those tasks target — do not rename.
//
// Orientation is anatomical: viewer's LEFT holds the patient's RIGHT heart (venous, blue),
// viewer's RIGHT holds the patient's LEFT heart (arterial, coral). The apex tilts to the
// lower-left. The left ventricle is drawn with a visibly thicker wall — the gap between its
// cavity and the outer silhouette — the one anatomical fact the design commits to showing.

// 12 flow particles, 3 per lane (hidden until animation reveals them). Initial positions
// sit near each lane's entry point; the animation rides them along the lanes.
type Lane = "in" | "lungs" | "return" | "out";
const laneStart: Record<Lane, { x: number; y: number }> = {
  in: { x: 150, y: 72 },
  lungs: { x: 188, y: 352 },
  return: { x: 404, y: 240 },
  out: { x: 300, y: 392 },
};
const particles = (["in", "lungs", "return", "out"] as Lane[]).flatMap((lane) =>
  [0, 1, 2].map((i) => ({ lane, i })),
);

// 8 structure labels (hidden by default; animation fades them in).
const labels = [
  { id: "ra", text: "Right atrium", x: 104, y: 150, anchor: "start" as const },
  { id: "rv", text: "Right ventricle", x: 96, y: 418, anchor: "start" as const },
  { id: "la", text: "Left atrium", x: 414, y: 150, anchor: "end" as const },
  { id: "lv", text: "Left ventricle", x: 422, y: 418, anchor: "end" as const },
  { id: "aorta", text: "Aorta", x: 258, y: 40, anchor: "middle" as const },
  { id: "pa", text: "Pulmonary artery", x: 138, y: 118, anchor: "start" as const },
  { id: "vc", text: "Vena cava", x: 90, y: 300, anchor: "start" as const },
  { id: "pv", text: "Pulmonary veins", x: 470, y: 250, anchor: "end" as const },
];

export function HeartFigure() {
  return (
    <svg
      className="heart-fig"
      viewBox="0 0 520 560"
      role="img"
      aria-label="Stylised cross-section of the human heart showing four chambers, valves, and major vessels"
    >
      {/* ——— Lungs: two scalloped lobes at the top corners (mint) ——— */}
      <g className="hf-lungs" aria-hidden="true">
        <path
          className="hf-lung"
          d="M100 128 C 74 126 56 146 54 170 C 36 176 34 198 46 208 C 34 216 34 236 48 244 C 44 260 62 270 80 260 C 92 264 102 256 102 242 Z"
        />
        <path
          className="hf-lung"
          d="M412 128 C 438 126 456 146 458 170 C 476 176 478 198 466 208 C 478 216 478 236 464 244 C 468 260 450 270 432 260 C 420 264 410 256 410 242 Z"
        />
      </g>

      {/* ——— Vessels (drawn under the chambers so chamber walls sit on top) ——— */}

      {/* Vena cava — superior (curves in from top-left) + inferior (curves up from bottom-left)
          into the RA. Venous / blue. */}
      <path
        id="hf-vc"
        className="hf-vessel hf-venous"
        d="M144 60 C 156 104 172 142 186 178 L210 168 C 198 130 182 94 168 58 Z
           M130 432 C 136 388 150 340 172 300 L196 310 C 178 346 164 390 158 436 Z"
      />

      {/* Pulmonary artery — exits RV upward and branches toward both lungs. Venous / blue. */}
      <path
        id="hf-pa"
        className="hf-vessel hf-venous"
        d="M200 286 C 198 250 204 218 214 194 L238 202 C 230 226 226 254 226 286 Z
           M216 198 C 192 180 150 178 106 194 L112 216 C 150 204 188 206 212 222 Z
           M232 200 C 270 178 330 176 402 194 L398 216 C 332 202 278 204 242 224 Z"
      />

      {/* Pulmonary veins — return from the right lung into the LA. Arterial / coral. */}
      <path
        id="hf-pv"
        className="hf-vessel hf-arterial"
        d="M404 230 C 386 226 370 212 360 194 L342 206 C 354 226 374 240 396 246 Z
           M410 262 C 388 258 372 246 360 232 L346 246 C 360 260 382 272 404 278 Z"
      />

      {/* Aorta — candy-cane arch rising from the LV, cresting over the top and exiting
          up-left. Arterial / coral. */}
      <path
        id="hf-aorta"
        className="hf-vessel hf-arterial"
        d="M296 292 C 288 240 288 192 298 160 C 308 126 296 96 246 78 L232 102
           C 276 118 288 138 280 166 C 272 200 272 244 320 292 Z"
      />

      {/* ——— The whole-heart silhouette (idle-beat target) ——— */}
      <path
        id="hf-outline"
        d="M256 156 C 305 139 352 151 376 188 C 393 216 388 264 373 303
           C 351 379 312 434 232 465 C 224 468 214 470 208 470
           C 190 432 160 400 146 348 C 130 292 126 250 133 210
           C 152 165 210 148 256 156 Z"
      />

      {/* ——— The four chambers (tiled by the septum + AV plane) ——— */}
      <g className="hf-chambers">
        {/* Right atrium — upper-left, venous. */}
        <path
          id="hf-ra"
          className="hf-chamber hf-venous"
          d="M256 170 C 214 154 172 160 146 194 C 132 218 132 254 135 282
             C 172 290 208 290 238 286 C 245 242 250 206 256 170 Z"
        />

        {/* Left atrium — upper-right, arterial. */}
        <path
          id="hf-la"
          className="hf-chamber hf-arterial"
          d="M256 170 C 300 154 344 160 370 196 C 386 224 384 264 372 300
             C 328 292 282 290 238 286 C 245 242 250 206 256 170 Z"
        />

        {/* Right ventricle — below the RA, tapering toward the apex (lower-left), venous.
            Its outer wall hugs the silhouette (thin wall). */}
        <path
          id="hf-rv"
          className="hf-chamber hf-venous"
          d="M238 286 C 208 290 168 290 138 284 C 142 346 164 412 208 466
             C 224 404 236 344 238 286 Z"
        />

        {/* Left ventricle — below-right, arterial. Cavity is inset from the silhouette on the
            free wall; that gap reads as the thick myocardium. */}
        <path
          id="hf-lv"
          className="hf-chamber hf-arterial"
          d="M238 286 C 282 290 322 292 356 304 C 348 372 314 424 256 452
             C 236 406 228 346 238 286 Z"
        />

        {/* Interventricular septum — wall between the two ventricles. */}
        <path
          id="hf-septum"
          d="M256 170 C 248 232 242 300 238 340 C 233 390 220 432 208 468"
        />
      </g>

      {/* Left-ventricle thick wall — coral crescent filling the gap between cavity and
          silhouette on the LV free wall. The one anatomical highlight. */}
      <path
        className="hf-lv-wall"
        d="M373 303 C 351 379 312 434 232 465 C 224 468 214 470 208 470
           C 226 452 240 448 250 452 C 314 424 348 372 356 304 C 364 300 370 300 373 303 Z"
      />

      {/* ——— Valves: paired-leaflet marks at the four openings ——— */}
      {/* Tricuspid — RA → RV */}
      <g className="hf-valve" aria-hidden="true">
        <path d="M168 284 q17 14 34 0" />
        <path d="M170 292 q16 -12 32 0" />
      </g>
      {/* Pulmonary — RV → PA (semilunar, sits higher) */}
      <g className="hf-valve" aria-hidden="true">
        <path d="M202 264 q13 -13 26 0" />
        <path d="M204 258 q13 11 26 0" />
      </g>
      {/* Mitral — LA → LV */}
      <g className="hf-valve" aria-hidden="true">
        <path d="M288 284 q17 14 34 0" />
        <path d="M290 292 q16 -12 32 0" />
      </g>
      {/* Aortic — LV → aorta (semilunar, sits higher) */}
      <g className="hf-valve" aria-hidden="true">
        <path d="M294 264 q13 -13 26 0" />
        <path d="M296 258 q13 11 26 0" />
      </g>

      {/* ——— Motion lanes (invisible rails for particle animation) ——— */}
      {/* in: vena cava → RA → RV */}
      <path
        id="lane-in"
        className="hf-lane"
        d="M150 72 C 158 140 178 180 185 220 C 190 250 188 268 186 288 C 184 330 186 356 190 392"
      />
      {/* lungs: RV → pulmonary artery → lungs */}
      <path
        id="lane-lungs"
        className="hf-lane"
        d="M188 352 C 196 300 206 276 214 250 C 220 224 224 208 220 196 C 200 182 150 182 104 198"
      />
      {/* return: lungs → pulmonary veins → LA → LV */}
      <path
        id="lane-return"
        className="hf-lane"
        d="M404 240 C 372 244 344 236 330 226 C 316 216 318 250 312 286 C 306 330 302 356 300 392"
      />
      {/* out: LV → aorta → off top-centre */}
      <path
        id="lane-out"
        className="hf-lane"
        d="M300 392 C 302 330 300 296 300 268 C 300 224 302 190 292 162 C 282 122 266 96 240 78"
      />

      {/* ——— Flow particles (3 per lane, hidden by default) ——— */}
      {particles.map(({ lane, i }) => (
        <circle
          key={`${lane}-${i}`}
          className={`hf-particle hf-particle-${lane}`}
          r="4"
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
