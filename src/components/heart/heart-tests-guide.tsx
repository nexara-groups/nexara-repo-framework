"use client";

import { useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { heartTests } from "@/content/heart-guide";
import { Reveal } from "@/components/reveal";
import { ChapterSources } from "@/components/heart/chapter-sources";

function TestVisual({ index }: { index: number }) {
  const common = { fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg className={`ht-visual ht-visual-${index + 1}`} viewBox="0 0 280 170" aria-hidden="true">
      <rect className="ht-screen" x="1" y="1" width="278" height="168" rx="20" />
      <path className="ht-grid" d="M28 44 H252 M28 84 H252 M28 124 H252 M70 24 V146 M140 24 V146 M210 24 V146" />
      {index === 0 ? (
        <>
          <path className="ht-signal-line" d="M24 91 H68 l9 -12 10 12 h20 l10 -47 18 89 15 -42 h24 l10 -18 12 18 h60" {...common} />
          <circle className="ht-signal-dot" cx="117" cy="44" r="5" />
        </>
      ) : index === 1 ? (
        <>
          <path className="ht-heart-shape" d="M140 132 C116 112 79 88 86 55 C91 30 124 30 140 51 C156 30 189 30 194 55 C201 88 164 112 140 132 Z" />
          <path className="ht-echo-wave wave-one" d="M70 54 C48 72 48 101 70 119" {...common} />
          <path className="ht-echo-wave wave-two" d="M55 39 C20 68 20 108 55 135" {...common} />
          <path className="ht-scan-line" d="M102 54 L174 118" {...common} />
        </>
      ) : index === 2 ? (
        <>
          <path className="ht-tread-base" d="M43 128 L223 90 L235 106 L56 145 Z" />
          <circle className="ht-person" cx="132" cy="47" r="10" />
          <path className="ht-person-line" d="M132 58 L124 88 L151 103 M125 73 L102 91 M127 86 L104 118 M137 84 L160 109" {...common} />
          <path className="ht-speed-line" d="M42 72 H85 M32 91 H72" {...common} />
        </>
      ) : index === 3 ? (
        <>
          <rect className="ht-device" x="99" y="39" width="82" height="94" rx="15" />
          <path className="ht-device-line" d="M114 83 h12 l7 -20 11 42 9 -22 h14" {...common} />
          <path className="ht-lead" d="M113 40 C98 27 85 29 76 45 M167 40 C183 27 199 30 208 47" {...common} />
          <circle className="ht-electrode" cx="76" cy="45" r="7" /><circle className="ht-electrode" cx="208" cy="47" r="7" />
          <text className="ht-visual-text" x="140" y="152" textAnchor="middle">24 HOUR RHYTHM</text>
        </>
      ) : (
        <>
          <path className="ht-drop" d="M104 41 C104 41 72 80 72 104 C72 126 87 141 108 141 C129 141 144 126 144 104 C144 80 104 41 104 41 Z" />
          <path className="ht-vial" d="M178 49 H226 L219 137 H185 Z" />
          <path className="ht-vial-fill" d="M184 99 H220 L217 132 H187 Z" />
          <path className="ht-marker" d="M184 70 H220 M182 84 H222" {...common} />
        </>
      )}
    </svg>
  );
}

export function HeartTestsGuide() {
  const [active, setActive] = useState(0);
  const test = heartTests[active]!;

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
    const next = event.key === "Home" ? 0 : event.key === "End" ? heartTests.length - 1 : (active + direction + heartTests.length) % heartTests.length;
    setActive(next);
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <section className="section-pad hc-tests" id="tests">
      <div className="container">
        <div className="section-heading">
          <Reveal variant="mask">
            <span className="eyebrow">Chapter 07</span>
            <h2>Tests,<br /><em>decoded.</em></h2>
          </Reveal>
          <div className="heading-aside">
            <Reveal delay={80}>
              <p>Most are non-invasive. Blood testing uses a needle, and treadmill testing involves monitored exertion.</p>
            </Reveal>
          </div>
        </div>

        <div className="ht-guide">
          <div className="ht-selector" role="tablist" aria-label="Heart tests" onKeyDown={onKeyDown}>
            <span className="ht-selector-label">Choose a test</span>
            {heartTests.map((item, index) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                aria-selected={active === index}
                aria-controls="heart-test-panel"
                tabIndex={active === index ? 0 : -1}
                className={active === index ? "is-active" : undefined}
                onClick={() => setActive(index)}
              >
                <span>0{index + 1}</span><strong>{item.name}</strong><small>{item.time}</small>
              </button>
            ))}
          </div>

          <div className="ht-panel" id="heart-test-panel" role="tabpanel" key={test.name}>
            <div className="ht-panel-art"><TestVisual index={active} /></div>
            <div className="ht-panel-copy">
              <span className="chapter-number">Test 0{active + 1} · {test.time}</span>
              <h3>{test.name}</h3>
              <p className="ht-panel-intro">{test.sees}</p>
              <dl className="ht-facts">
                <div><dt>When it is used</dt><dd>{test.when}</dd></div>
                <div><dt>What it feels like</dt><dd>{test.feels}</dd></div>
              </dl>
            </div>
          </div>
        </div>

        <div className="cta-strip hc-tests-cta">
          <div>
            <span className="eyebrow">Diagnostic guidance</span>
            <h2>Start with the right test,<br /><em>not every test.</em></h2>
          </div>
          <Link className="button button-navy" href="/diagnostics">Explore diagnostics <b aria-hidden="true">↗</b></Link>
        </div>
        <ChapterSources chapter="tests" />
      </div>
    </section>
  );
}
