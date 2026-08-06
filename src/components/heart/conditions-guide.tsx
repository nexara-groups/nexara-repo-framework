"use client";

import { useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { conditions } from "@/content/heart-guide";
import { ChapterSources } from "@/components/heart/chapter-sources";

// Chapter 04 — the eight conditions mapped onto the heart. Selecting a condition
// lights the part of the heart it affects (arteries, muscle, valves, electrical
// system, or the great vessels) and shows its plain-language card. Every
// condition is a real button, and all copy stays in the DOM, so the section is
// fully readable with keyboard and without JS lighting.

type RegionKey = "arteries" | "muscle" | "electrical" | "valves" | "vessels";

const REGION: Record<string, RegionKey> = {
  "Coronary artery disease": "arteries",
  Angina: "arteries",
  "Heart attack": "arteries",
  "Heart failure": "muscle",
  Cardiomyopathy: "muscle",
  Arrhythmia: "electrical",
  "Valve disease": "valves",
  Hypertension: "vessels",
};

const REGION_LABEL: Record<RegionKey, string> = {
  arteries: "Coronary arteries",
  muscle: "Heart muscle",
  electrical: "Electrical system",
  valves: "Heart valves",
  vessels: "Great vessels",
};

function firstStepLink(name: string): { href: string; label: string } | null {
  if (name === "Heart attack") return null;
  if (["Coronary artery disease", "Arrhythmia", "Valve disease", "Cardiomyopathy"].includes(name)) {
    return { href: "/diagnostics", label: "See the tests" };
  }
  return { href: "/appointment", label: "Book a consultation" };
}

type ConditionVisual = {
  key: "plaque" | "shortfall" | "blockage" | "weak-pump" | "irregular" | "backflow" | "pressure" | "muscle-change";
  label: string;
  point: { x: number; y: number };
};

const CONDITION_VISUAL: Record<string, ConditionVisual> = {
  "Coronary artery disease": { key: "plaque", label: "Plaque narrows a coronary", point: { x: 218, y: 292 } },
  Angina: { key: "shortfall", label: "Demand exceeds blood supply", point: { x: 326, y: 313 } },
  "Heart attack": { key: "blockage", label: "A clot stops coronary flow", point: { x: 311, y: 244 } },
  "Heart failure": { key: "weak-pump", label: "The squeeze is weakened", point: { x: 352, y: 342 } },
  Arrhythmia: { key: "irregular", label: "The impulse becomes irregular", point: { x: 232, y: 188 } },
  "Valve disease": { key: "backflow", label: "Flow leaks or meets resistance", point: { x: 291, y: 226 } },
  Hypertension: { key: "pressure", label: "High pressure strains vessels", point: { x: 309, y: 74 } },
  Cardiomyopathy: { key: "muscle-change", label: "The muscle changes shape", point: { x: 348, y: 337 } },
};

function ConditionIssue({ visual }: { visual: ConditionVisual }) {
  let art;

  switch (visual.key) {
    case "plaque":
      art = (
        <>
          <path className="issue-flow-line" d="M268 207 C238 230 219 260 216 304" />
          <ellipse className="issue-plaque" cx="220" cy="282" rx="8" ry="4.5" transform="rotate(-70 220 282)" />
          <ellipse className="issue-plaque" cx="214" cy="299" rx="7" ry="4" transform="rotate(-76 214 299)" />
        </>
      );
      break;
    case "shortfall":
      art = (
        <>
          <path className="issue-oxygen-zone" d="M292 271 C329 263 361 282 369 315 C376 346 355 376 323 398 C301 360 291 316 292 271 Z" />
          <path className="issue-supply-line" d="M273 207 C314 223 343 255 352 299" />
          <circle className="issue-oxygen-dot dot-one" cx="305" cy="231" r="4" />
          <circle className="issue-oxygen-dot dot-two" cx="327" cy="251" r="3.5" />
        </>
      );
      break;
    case "blockage":
      art = (
        <>
          <path className="issue-injury-zone" d="M312 253 C348 261 373 287 377 318 C376 353 349 388 318 416 C300 358 300 300 312 253 Z" />
          <circle className="issue-clot" cx="311" cy="244" r="10" />
          <path className="issue-block-mark" d="M304 237 L318 251 M318 237 L304 251" />
        </>
      );
      break;
    case "weak-pump":
      art = (
        <>
          <path className="issue-weak-contour contour-one" d="M146 183 C129 258 163 349 247 449" />
          <path className="issue-weak-contour contour-two" d="M379 176 C417 258 388 355 304 439" />
          <path className="issue-squeeze-arrow arrow-left" d="M132 292 L164 292" />
          <path className="issue-squeeze-arrow arrow-right" d="M409 292 L377 292" />
        </>
      );
      break;
    case "irregular":
      art = (
        <>
          <circle className="issue-electric-pulse pulse-one" cx="207" cy="161" r="17" />
          <circle className="issue-electric-pulse pulse-two" cx="258" cy="203" r="14" />
          <path className="issue-rhythm-line" d="M151 198 L180 198 L190 180 L202 221 L215 168 L229 207 L244 190 L260 190" />
        </>
      );
      break;
    case "backflow":
      art = (
        <>
          <path className="issue-backflow" d="M299 277 C321 258 321 232 303 215" markerEnd="url(#cm-arrow-coral)" />
          <circle className="issue-flow-particle particle-one" cx="313" cy="257" r="4" />
          <circle className="issue-flow-particle particle-two" cx="316" cy="236" r="3" />
        </>
      );
      break;
    case "pressure":
      art = (
        <>
          <circle className="issue-pressure-ring ring-one" cx="310" cy="73" r="30" />
          <circle className="issue-pressure-ring ring-two" cx="310" cy="73" r="42" />
          <path className="issue-pressure-arrow" d="M310 42 L310 18" markerEnd="url(#cm-arrow-blue)" />
          <path className="issue-pressure-arrow" d="M337 58 L358 45" markerEnd="url(#cm-arrow-blue)" />
        </>
      );
      break;
    case "muscle-change":
      art = (
        <>
          <path className="issue-muscle-contour outer" d="M350 128 C399 170 416 253 387 327 C368 376 331 418 285 463" />
          <path className="issue-muscle-contour inner" d="M325 150 C359 184 373 246 354 302 C340 342 315 376 287 407" />
          <path className="issue-muscle-measure" d="M351 338 L378 350" />
        </>
      );
      break;
  }

  return (
    <g className={`cond-issue cond-issue-${visual.key}`}>
      {art}
      <g className="cond-issue-caption">
        <rect x="18" y="18" width="190" height="44" rx="11" />
        <text className="cond-issue-kicker" x="31" y="35">What changes</text>
        <text className="cond-issue-name" x="31" y="53">{visual.label}</text>
      </g>
    </g>
  );
}

function HeartMap({ region, conditionName }: { region: RegionKey; conditionName: string }) {
  const visual = CONDITION_VISUAL[conditionName] ?? CONDITION_VISUAL.Cardiomyopathy!;
  const target = visual.point;

  return (
    <svg
      className="cond-map-svg"
      viewBox="0 0 520 520"
      role="img"
      aria-label={`${conditionName} mapped to the ${REGION_LABEL[region].toLowerCase()} on an anatomical heart diagram`}
      data-region={region}
      data-condition={visual.key}
    >
      <defs>
        <linearGradient id="cm-muscle" x1="12%" y1="10%" x2="88%" y2="90%">
          <stop offset="0%" stopColor="#f3d6d8" />
          <stop offset="52%" stopColor="#dfaeb3" />
          <stop offset="100%" stopColor="#bd7e87" />
        </linearGradient>
        <linearGradient id="cm-oxygen-poor" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b8c8e5" />
          <stop offset="100%" stopColor="#7f9bd6" />
        </linearGradient>
        <linearGradient id="cm-oxygen-rich" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f2b7bd" />
          <stop offset="100%" stopColor="#d85d70" />
        </linearGradient>
        <filter id="cm-shadow" x="-30%" y="-30%" width="160%" height="175%">
          <feDropShadow dx="0" dy="15" stdDeviation="14" floodColor="#10203d" floodOpacity=".14" />
        </filter>
        <filter id="cm-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <pattern id="cm-injury-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
          <rect width="8" height="8" fill="rgba(220,95,114,.14)" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="#b73950" strokeWidth="2" opacity=".48" />
        </pattern>
        <marker id="cm-arrow-coral" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill="#d85d70" />
        </marker>
        <marker id="cm-arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill="#5e7fbd" />
        </marker>
      </defs>

      <ellipse className="cm-backdrop" cx="267" cy="273" rx="166" ry="205" />

      {/* Great vessels: aorta and pulmonary circulation above the chambers. */}
      <g className="r-region r-vessels" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path className="cm-vessel cm-aorta" d="M286 151 C318 119 322 82 302 55 C286 34 287 18 309 10" strokeWidth="23" />
        <path className="cm-vessel cm-aorta-branch" d="M302 57 C327 38 351 38 370 52" strokeWidth="16" />
        <path className="cm-vessel cm-pulmonary" d="M252 160 C239 124 213 102 177 96 C153 92 137 78 128 58" strokeWidth="19" />
        <path className="cm-vessel cm-vena" d="M202 152 C190 121 189 81 195 43" strokeWidth="17" />
        <path className="cm-vessel cm-vena" d="M195 354 C178 376 171 398 174 427" strokeWidth="14" />
      </g>

      {/* Muscular heart body. The chamber tint is contextual; the active map
          regions remain the surface muscle, coronaries, valves and conduction. */}
      <g className="r-region r-muscle" filter="url(#cm-shadow)">
        <path className="cm-heart-shell" d="M265 126 C226 88 170 108 153 161 C135 218 155 282 183 334 C207 379 241 426 276 474 C312 435 363 390 388 322 C416 245 397 164 352 126 C327 105 294 105 265 126 Z" />
      </g>

      <g className="cm-chambers" stroke="#ffffff" strokeOpacity=".38" strokeWidth="2">
        <path className="cm-chamber-poor" d="M244 143 C214 119 176 132 169 171 C164 203 181 224 221 229 C243 211 250 177 244 143 Z" />
        <path className="cm-chamber-poor" d="M220 235 C176 236 163 273 184 323 C200 360 224 393 260 442 C264 375 262 302 248 251 C240 241 232 237 220 235 Z" />
        <path className="cm-chamber-rich" d="M279 143 C304 118 342 128 360 160 C372 185 362 214 326 224 C296 218 281 188 279 143 Z" />
        <path className="cm-chamber-rich" d="M286 234 C323 225 365 241 378 283 C390 329 344 396 279 459 C278 368 272 296 286 234 Z" />
        <path className="cm-septum" d="M264 220 C270 288 270 360 276 450" fill="none" />
      </g>

      {/* One-way valves between the chambers. */}
      <g className="r-region r-valves" fill="none" strokeLinecap="round">
        <path d="M225 226 Q238 211 251 226 Q238 241 225 226 Z" />
        <path d="M274 226 Q291 210 308 226 Q291 243 274 226 Z" />
        <path d="M249 174 Q262 161 275 174 Q262 187 249 174 Z" />
      </g>

      {/* Electrical conduction: SA node, AV node and bundle branches. */}
      <g className="r-region r-electrical" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M207 161 C223 172 244 184 258 203 C263 242 266 286 269 340" strokeWidth="3" />
        <path d="M269 278 C245 310 232 347 230 388" strokeWidth="2.6" />
        <path d="M269 278 C300 311 316 347 320 386" strokeWidth="2.6" />
        <circle className="r-node" cx="207" cy="161" r="7" />
        <circle className="r-node" cx="258" cy="203" r="5" />
      </g>

      {/* Coronary arteries branching across the myocardial surface. */}
      <g className="r-region r-arteries" strokeLinecap="round" fill="none">
        <path d="M270 154 C271 226 268 314 274 429" strokeWidth="6" />
        <path d="M268 204 C232 225 211 263 207 310 C204 354 219 395 253 438" strokeWidth="5" />
        <path d="M273 202 C313 215 344 250 354 302" strokeWidth="4" />
        <path d="M272 278 C311 298 329 331 337 365" strokeWidth="3.4" />
        <path d="M227 256 C246 278 252 304 251 336" strokeWidth="3" />
      </g>

      <ConditionIssue key={visual.key} visual={visual} />

      {/* Permanent labels make the anatomy legible before and after selection. */}
      <g className={`cond-map-callout callout-vessels${region === "vessels" ? " is-on" : ""}`}>
        <path d="M301 80 L374 80" /><circle cx="301" cy="80" r="3.5" /><text x="386" y="84">Great vessels</text>
      </g>
      <g className={`cond-map-callout callout-electrical${region === "electrical" ? " is-on" : ""}`}>
        <path d="M207 161 L143 161 L124 180" /><circle cx="207" cy="161" r="3.5" /><text x="18" y="184">Electrical system</text>
      </g>
      <g className={`cond-map-callout callout-valves${region === "valves" ? " is-on" : ""}`}>
        <path d="M292 226 L385 226" /><circle cx="292" cy="226" r="3.5" /><text x="397" y="230">Heart valves</text>
      </g>
      <g className={`cond-map-callout callout-arteries${region === "arteries" ? " is-on" : ""}`}>
        <path d="M229 316 L137 316 L118 338" /><circle cx="229" cy="316" r="3.5" /><text x="18" y="343">Coronary arteries</text>
      </g>
      <g className={`cond-map-callout callout-muscle${region === "muscle" ? " is-on" : ""}`}>
        <path d="M344 357 L390 380" /><circle cx="344" cy="357" r="3.5" /><text x="399" y="393">Heart muscle</text>
      </g>

      <g className="cond-map-target" key={`${target.x}-${target.y}`}>
        <circle className="cond-map-target-ring" cx={target.x} cy={target.y} r="18" />
        <circle className="cond-map-target-core" cx={target.x} cy={target.y} r="5" />
      </g>
    </svg>
  );
}

export function ConditionsGuide() {
  const [active, setActive] = useState(0);
  const condition = conditions[active]!;
  const region = REGION[condition.name] ?? "muscle";
  const link = firstStepLink(condition.name);
  const onPickerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
    const next = event.key === "Home"
      ? 0
      : event.key === "End"
        ? tabs.length - 1
        : (current + (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1) + tabs.length) % tabs.length;
    tabs[next]?.focus();
  };

  return (
    <section className="hc-conditions section-pad" id="conditions">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Chapter 04</span>
            <h2>Eight conditions,<br /><em>on the map.</em></h2>
          </div>
          <div className="heading-aside">
            <p>Pick a condition to see the part of the heart it affects — what it is, what it feels like, and the sign that says stop reading and act.</p>
          </div>
        </div>

        <div className="cond-map-layout">
          <div className="cond-map-figure">
            <HeartMap region={region} conditionName={condition.name} />
            <div className={`cond-map-status region-${region}`} aria-live="polite">
              <span><small>Selected condition</small><strong>{condition.name}</strong></span>
              <b aria-hidden="true">→</b>
              <span><small>Affected structure</small><strong>{REGION_LABEL[region]}</strong></span>
            </div>
            <div className={`cond-map-issue-note issue-${CONDITION_VISUAL[condition.name]?.key ?? "muscle-change"}`} aria-live="polite">
              <i aria-hidden="true" />
              <span><small>Shown on the heart</small><strong>{CONDITION_VISUAL[condition.name]?.label}</strong></span>
            </div>
          </div>

          <div className="cond-map-side">
            <div className="cond-picker" role="tablist" aria-label="Heart conditions" onKeyDown={onPickerKeyDown}>
              {conditions.map((c, index) => (
                <button
                  key={c.name}
                  type="button"
                  role="tab"
                  id={`cond-tab-${index}`}
                  aria-selected={index === active}
                  aria-controls="cond-detail"
                  tabIndex={index === active ? 0 : -1}
                  className={`cond-pick${index === active ? " is-active" : ""}`}
                  onClick={() => setActive(index)}
                  onFocus={() => setActive(index)}
                >
                  <span className="cond-pick-num">{`0${index + 1}`}</span>
                  <span className="cond-pick-name">{c.name}</span>
                  <span className={`cond-pick-region region-${REGION[c.name]}`}>{REGION_LABEL[REGION[c.name] ?? "muscle"]}</span>
                </button>
              ))}
            </div>

            <div className="cond-detail" key={condition.name} id="cond-detail" role="tabpanel" aria-labelledby={`cond-tab-${active}`}>
              <span className={`cond-detail-region region-${region}`}>{REGION_LABEL[region]}</span>
              <h3>{condition.name}</h3>
              <p className="cond-detail-what">{condition.what}</p>
              <div className="cond-detail-cols">
                <div className="cond-col">
                  <small>Feels like</small>
                  <p>{condition.feelsLike}</p>
                </div>
                <div className="cond-col cond-redflag">
                  <small>Red flag</small>
                  <p>{condition.redFlag}</p>
                </div>
              </div>
              <div className={`cond-first${link ? "" : " cond-first-emergency"}`}>
                <small>First step at Rise</small>
                <p>{condition.firstStep}</p>
                {link ? (
                  <Link className="text-link" href={link.href}>
                    {link.label} <b aria-hidden="true">↗</b>
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <p className="note-strip">
          General information, not diagnosis. Symptoms overlap — a doctor puts them in your context.
        </p>
        <ChapterSources chapter="conditions" />
      </div>
    </section>
  );
}
