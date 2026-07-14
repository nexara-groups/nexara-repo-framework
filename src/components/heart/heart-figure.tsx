// Original, code-native patient-education illustration. The muscle is shown as muscle;
// blue and coral are reserved for blood spaces and vessels. In an anterior view the
// patient's right heart appears on the viewer's left.

type Lane = "in" | "lungs" | "return" | "out";

const laneStart: Record<Lane, { x: number; y: number }> = {
  in: { x: 154, y: -45 },
  lungs: { x: 218, y: 318 },
  return: { x: 402, y: 168 },
  out: { x: 278, y: 366 },
};

const particles = (["in", "lungs", "return", "out"] as Lane[]).flatMap((lane) =>
  [0, 1, 2, 3].map((i) => ({ lane, i })),
);

const labels = [
  { id: "ra", text: "Right atrium", x: -55, y: 160, anchor: "start" as const, lead: "M35 156 L119 164" },
  { id: "rv", text: "Right ventricle", x: -55, y: 294, anchor: "start" as const, lead: "M43 290 L151 284" },
  { id: "la", text: "Left atrium", x: 382, y: 158, anchor: "start" as const, lead: "M374 154 L337 164" },
  { id: "lv", text: "Left ventricle", x: 382, y: 310, anchor: "start" as const, lead: "M374 306 L323 300" },
  { id: "aorta", text: "Aorta · to body", x: 316, y: -38, anchor: "middle" as const, lead: "M291 -29 L281 18" },
  { id: "pa", text: "Pulmonary arteries", x: 27, y: 66, anchor: "start" as const, lead: "M114 62 L174 82" },
  { id: "vc", text: "Vena cava · from body", x: 70, y: -36, anchor: "middle" as const, lead: "M109 -31 L150 8" },
  { id: "pv", text: "Pulmonary veins", x: 390, y: 218, anchor: "start" as const, lead: "M382 214 L342 190" },
];

export function HeartFigure({
  ids = true,
  lungs = true,
  uid = "hf",
}: { ids?: boolean; lungs?: boolean; uid?: string } = {}) {
  const id = (name: string) => (ids ? name : undefined);
  const g = (name: string) => `${uid}-${name}`;

  return (
    <svg
      className="heart-fig"
      viewBox="-80 -70 600 570"
      role="img"
      aria-label="Anterior teaching view of the heart and lungs, showing oxygen-poor blood entering the right heart, travelling to the lungs, returning to the left heart, and leaving through the aorta"
    >
      <defs>
        <radialGradient id={g("muscle")} cx="34%" cy="20%" r="90%">
          <stop offset="0%" stopColor="#d98b82" />
          <stop offset="42%" stopColor="#b9575d" />
          <stop offset="78%" stopColor="#873641" />
          <stop offset="100%" stopColor="#632738" />
        </radialGradient>
        <linearGradient id={g("venRa")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a9c2e9" />
          <stop offset="100%" stopColor="#5476b6" />
        </linearGradient>
        <linearGradient id={g("venRv")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7798d0" />
          <stop offset="100%" stopColor="#385a9a" />
        </linearGradient>
        <linearGradient id={g("artLa")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffb2b7" />
          <stop offset="100%" stopColor="#df6674" />
        </linearGradient>
        <linearGradient id={g("artLv")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f28a93" />
          <stop offset="100%" stopColor="#c74359" />
        </linearGradient>
        <linearGradient id={g("lung")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef5f3" />
          <stop offset="100%" stopColor="#bfd7d5" />
        </linearGradient>
        <radialGradient id={g("bloom")} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#dbe9e8" stopOpacity=".62" />
          <stop offset="100%" stopColor="#dbe9e8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={g("shadow")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10203d" stopOpacity=".19" />
          <stop offset="100%" stopColor="#10203d" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse className="hf-bloom" cx="220" cy="224" rx="247" ry="245" fill={`url(#${g("bloom")})`} aria-hidden="true" />
      <ellipse className="hf-shadow" cx="246" cy="449" rx="142" ry="18" fill={`url(#${g("shadow")})`} aria-hidden="true" />

      {lungs ? (
        <g className="hf-lungs" aria-hidden="true">
          {/* Patient's right lung: larger and divided into three lobes. */}
          <path
            className="hf-lung hf-lung-right"
            style={{ fill: `url(#${g("lung")})` }}
            d="M151 76 C112 63 65 79 35 113 C4 149 -7 203 2 258 C11 315 38 365 78 384 C107 397 134 382 145 354 C157 324 160 278 159 226 C158 177 164 111 151 76 Z"
          />
          {/* Patient's left lung: smaller, two lobes, and a medial cardiac notch. */}
          <path
            className="hf-lung hf-lung-left"
            style={{ fill: `url(#${g("lung")})` }}
            d="M297 80 C335 64 382 78 415 111 C450 147 461 202 452 257 C443 312 417 354 383 374 C354 391 325 380 312 354 C303 336 301 315 306 294 C310 276 300 263 291 250 C281 235 286 218 299 205 C310 194 307 166 304 137 C302 112 303 91 297 80 Z"
          />

          <g className="hf-airway" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M226 -22 C226 15 226 45 224 73" />
            <path d="M224 70 C190 84 151 104 113 130" />
            <path d="M224 70 C267 83 318 102 359 129" />
            <path d="M113 130 C85 157 66 196 55 241 M113 130 C118 180 114 230 100 285" />
            <path d="M359 129 C384 157 399 194 406 232 M359 129 C354 171 358 219 376 269" />
          </g>

          <g className="hf-lung-fissure" fill="none" strokeLinecap="round">
            <path d="M20 224 C60 231 104 221 145 195" />
            <path d="M17 278 C61 286 105 274 151 242" />
            <path d="M307 239 C351 251 402 242 445 216" />
          </g>

          <g className="hf-lung-exchange" fill="none" strokeLinecap="round">
            <path d="M73 144 C51 168 42 196 45 220 M88 148 C67 178 62 211 65 241 M104 153 C86 190 83 225 84 260" />
            <path d="M382 145 C405 171 413 199 409 225 M365 149 C387 182 391 213 388 242 M349 154 C367 191 370 225 369 259" />
          </g>
        </g>
      ) : null}

      {/* Posterior great vessels. */}
      <g className="hf-vessels-posterior">
        <g id={id("hf-aorta")} className="hf-vessel hf-aorta">
          <path d="M286 243 C291 194 301 150 303 107 C305 62 289 29 254 17 C222 6 192 22 177 54 C164 81 165 110 170 137" strokeWidth="20" />
          <path d="M250 18 C249 -6 246 -25 240 -42 M278 29 C286 7 296 -10 309 -24" strokeWidth="10" />
        </g>
        <g id={id("hf-vc")} className="hf-vessel hf-vc">
          <path d="M154 -43 C155 13 157 73 163 137" strokeWidth="17" />
          <path d="M154 432 C154 372 158 291 164 218" strokeWidth="17" />
        </g>
        <g id={id("hf-pv")} className="hf-vessel hf-pv">
          <path d="M77 157 C129 150 211 154 270 165 M76 190 C137 183 218 184 271 188" strokeWidth="9" />
          <path d="M405 157 C368 156 339 160 318 169 M407 191 C371 188 343 190 319 195" strokeWidth="9" />
        </g>
      </g>

      <g className="hf-heart-body">
        <path
          className="hf-myocardium"
          style={{ fill: `url(#${g("muscle")})` }}
          d="M224 90 C184 76 143 90 119 126 C96 161 99 208 112 250 C131 311 177 369 267 431 C309 400 351 346 367 289 C384 229 377 169 341 126 C319 100 291 91 266 94 C248 96 239 96 224 90 Z"
        />

        <g className="hf-chambers">
          <path
            id={id("hf-ra")}
            className="hf-chamber hf-venous hf-ra"
            style={{ fill: `url(#${g("venRa")})` }}
            d="M181 118 C154 111 130 125 120 151 C110 180 119 214 141 235 C159 228 180 222 202 220 C207 187 204 151 194 125 C191 121 186 119 181 118 Z"
          />
          <path
            id={id("hf-rv")}
            className="hf-chamber hf-venous hf-rv"
            style={{ fill: `url(#${g("venRv")})` }}
            d="M141 235 C126 262 140 307 174 346 C197 371 224 390 252 405 C252 354 253 306 251 266 C222 243 181 228 141 235 Z"
          />
          <path
            id={id("hf-la")}
            className="hf-chamber hf-arterial hf-la"
            style={{ fill: `url(#${g("artLa")})` }}
            d="M273 121 C301 112 330 126 341 151 C350 172 347 198 332 217 C311 211 289 212 264 223 C254 191 252 156 260 132 C263 127 268 123 273 121 Z"
          />
          <path
            id={id("hf-lv")}
            className="hf-chamber hf-arterial hf-lv"
            style={{ fill: `url(#${g("artLv")})` }}
            d="M264 223 C289 212 311 211 332 217 C349 246 344 295 323 336 C308 367 287 397 267 423 C251 371 239 316 251 266 C255 248 259 233 264 223 Z"
          />
        </g>

        <path className="hf-muscle-highlight" d="M139 132 C113 181 119 231 137 273 C160 328 202 371 254 414" />
        <path id={id("hf-outline")} className="hf-outline" d="M224 90 C184 76 143 90 119 126 C96 161 99 208 112 250 C131 311 177 369 267 431 C309 400 351 346 367 289 C384 229 377 169 341 126 C319 100 291 91 266 94 C248 96 239 96 224 90 Z" />
        <path id={id("hf-septum")} className="hf-septum" d="M247 196 C245 247 250 321 267 423" />
        <path className="hf-groove" d="M139 235 C181 228 222 243 251 266 C262 239 286 218 332 217" />
        <path className="hf-lv-wall" d="M338 225 C349 260 340 301 320 339 C303 371 285 400 267 423" />

        <g className="hf-valve hf-valve-tricuspid" aria-hidden="true"><path d="M166 232 C174 243 184 247 194 249 M218 246 C207 244 200 239 195 230" /></g>
        <g className="hf-valve hf-valve-mitral" aria-hidden="true"><path d="M276 223 C283 233 292 238 302 240 M324 224 C313 226 307 231 302 240" /></g>
        <g className="hf-valve hf-valve-pulmonary" aria-hidden="true"><path d="M211 203 C217 210 223 212 229 211 M240 201 C234 204 230 207 229 211" /></g>
        <g className="hf-valve hf-valve-aortic" aria-hidden="true"><path d="M276 200 C282 207 288 209 294 208 M306 198 C300 201 296 204 294 208" /></g>

        <g className="hf-coronaries" fill="none" strokeLinecap="round" aria-hidden="true">
          <path className="hf-coronary hf-coronary-art" d="M261 151 C258 202 257 265 267 423" />
          <path className="hf-coronary hf-coronary-art" d="M259 242 C284 258 300 283 305 314" />
          <path className="hf-coronary hf-coronary-ven" d="M194 151 C178 202 179 271 202 331" />
        </g>
      </g>

      {/* The pulmonary trunk lies in front of the aortic root. */}
      <g id={id("hf-pa")} className="hf-vessel hf-pa">
        <path d="M220 263 C216 220 214 178 224 137 C230 113 231 94 222 82" strokeWidth="18" />
        <path d="M222 82 C183 74 130 91 84 126 M224 82 C274 70 337 91 389 128" strokeWidth="11" />
      </g>

      <g className="hf-vessel-lumen" fill="none" stroke="#fff" strokeOpacity=".28" strokeLinecap="round" aria-hidden="true">
        <path d="M158 -38 C158 17 159 75 164 131" strokeWidth="4" />
        <path d="M290 236 C295 188 304 149 306 108 C308 67 293 35 259 22" strokeWidth="5" />
        <path d="M222 253 C219 211 219 174 228 139 C233 116 234 99 227 87" strokeWidth="4" />
      </g>

      {/* Invisible rails: body → right heart → lungs → left heart → aorta/body. */}
      <path id={id("lane-in")} className="hf-lane lane-in" d="M154 -45 C155 22 157 85 166 145 C170 174 165 207 166 218 C178 249 199 281 218 318" />
      <path id={id("lane-lungs")} className="hf-lane lane-lungs" d="M218 318 C220 270 215 221 222 181 C229 139 232 105 222 83 C186 77 128 94 86 125" />
      <path id={id("lane-return")} className="hf-lane lane-return" d="M402 168 C367 167 336 171 314 181 C292 191 282 211 284 237 C287 277 286 322 278 365" />
      <path id={id("lane-out")} className="hf-lane lane-out" d="M278 366 C288 319 288 270 286 231 C284 184 299 140 302 102 C306 61 290 30 255 18 C223 8 193 23 177 54" />

      {particles.map(({ lane, i }) => (
        <circle
          key={`${lane}-${i}`}
          className={`hf-particle hf-particle-${lane}`}
          r="6.5"
          cx={laneStart[lane].x}
          cy={laneStart[lane].y}
        />
      ))}

      {labels.map((label) => (
        <g key={label.id} className={`hf-label hf-label-${label.id}`}>
          <path className="hf-label-line" d={label.lead} />
          <text x={label.x} y={label.y} textAnchor={label.anchor}>{label.text}</text>
        </g>
      ))}

      {lungs ? (
        <g className="hf-key" aria-hidden="true">
          <circle cx="99" cy="466" r="5" className="hf-key-ven" />
          <text x="111" y="470">Oxygen-poor</text>
          <circle cx="236" cy="466" r="5" className="hf-key-art" />
          <text x="248" y="470">Oxygen-rich</text>
          <path d="M363 466 H401" />
          <path d="M394 460 L401 466 L394 472" />
          <text x="411" y="470">Flow</text>
        </g>
      ) : null}
    </svg>
  );
}
