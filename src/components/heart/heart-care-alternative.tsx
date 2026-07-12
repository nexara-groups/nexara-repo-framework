"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { EecpPulseArt, HeroEcg } from "@/components/brand-art";
import { HeartFigure } from "@/components/heart/heart-figure";
import { conditions, emergencySigns, heartFaqs, heartTests, vitals } from "@/content/heart-guide";

const sections = [
  ["overview", "Overview"],
  ["flow", "The loop"],
  ["signals", "Signals"],
  ["conditions", "Conditions"],
  ["alert", "Warning signs"],
  ["eecp", "EECP"],
  ["tests", "Tests"],
] as const;

const signalWidths = ["72%", "62%", "48%", "35%"] as const;

export function HeartCareAlternative() {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const targets = sections
      .map(([id]) => document.getElementById(`alt-${id}`))
      .filter((element): element is HTMLElement => Boolean(element));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id.startsWith("alt-")) setActive(visible.target.id.replace("alt-", ""));
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="hc-alt">
      <nav className="hc-alt-index" aria-label="Heart atlas sections">
        <span className="hc-alt-index-label">Heart atlas</span>
        {sections.map(([id, label]) => (
          <a className={active === id ? "is-active" : undefined} href={`#alt-${id}`} key={id}>
            <i aria-hidden="true" />
            <span>{label}</span>
          </a>
        ))}
      </nav>

      <section className="hc-alt-hero" id="alt-overview">
        <HeroEcg />
        <div className="hc-alt-hero-grid">
          <div className="hc-alt-hero-copy">
            <p className="hc-alt-kicker"><span>RHM</span> / Heart atlas / 2026</p>
            <h1>Know what<br /><em>keeps you moving.</em></h1>
            <p className="hc-alt-dek">
              A visual field guide to your cardiovascular system — the loop, the signals, the warning signs,
              and the treatment choices that deserve a real conversation.
            </p>
            <div className="hc-alt-actions">
              <a className="hc-alt-button hc-alt-button-coral" href="#alt-flow">Enter the atlas <b aria-hidden="true">↓</b></a>
              <Link className="hc-alt-button hc-alt-button-line" href="/appointment">Book a heart check <b aria-hidden="true">↗</b></Link>
            </div>
            <div className="hc-alt-hero-stats" aria-label="Guide highlights">
              <div><strong>04</strong><span>chambers</span></div>
              <div><strong>08</strong><span>conditions</span></div>
              <div><strong>01</strong><span>next step</span></div>
            </div>
          </div>
          <div className="hc-alt-heart-stage">
            <div className="hc-alt-stage-top"><span className="hc-alt-live-dot" /> LIVE SYSTEM <b>72 BPM</b></div>
            <div className="hc-alt-orbit orbit-outer" aria-hidden="true" />
            <div className="hc-alt-orbit orbit-inner" aria-hidden="true" />
            <div className="hc-alt-stage-axis axis-x" aria-hidden="true" />
            <div className="hc-alt-stage-axis axis-y" aria-hidden="true" />
            <HeartFigure ids={false} lungs={false} />
            <span className="hc-alt-callout callout-in">deoxygenated in</span>
            <span className="hc-alt-callout callout-out">oxygenated out</span>
            <div className="hc-alt-stage-foot"><span>patient education / not a diagnosis</span><span>scroll to examine</span></div>
          </div>
        </div>
      </section>

      <section className="hc-alt-read" id="alt-read">
        <div className="hc-alt-wide-heading">
          <span className="hc-alt-section-num">00 / orientation</span>
          <h2>A heart is a system,<br /><em>not a sentence.</em></h2>
          <p>Start with the mechanics. Then read the signals. Only then choose the move.</p>
        </div>
        <div className="hc-alt-read-grid">
          <a href="#alt-flow"><span>01</span><strong>Trace the loop</strong><small>Follow blood from body to lungs and back again.</small><b>↗</b></a>
          <a href="#alt-signals"><span>02</span><strong>Read the dashboard</strong><small>Four numbers tell a story when you read them together.</small><b>↗</b></a>
          <a href="#alt-alert"><span>03</span><strong>Know the interrupt</strong><small>Some symptoms are a call, not a bookmark.</small><b>↗</b></a>
        </div>
      </section>

      <section className="hc-alt-flow" id="alt-flow">
        <div className="hc-alt-flow-art">
          <div className="hc-alt-flow-label"><span>Chapter 01</span><strong>The loop</strong></div>
          <div className="hc-alt-flow-ring" aria-hidden="true"><i /><i /><i /></div>
          <HeartFigure ids={false} />
          <span className="hc-alt-flow-tag flow-tag-blue">used blood</span>
          <span className="hc-alt-flow-tag flow-tag-coral">fresh oxygen</span>
        </div>
        <div className="hc-alt-flow-copy">
          <p className="hc-alt-kicker"><span>01</span> trace the loop</p>
          <h2>One beat.<br /><em>Four hand-offs.</em></h2>
          <p className="hc-alt-copy-intro">The heart is not a mystery box. It is a two-sided pump with one job: keep the exchange moving.</p>
          <ol className="hc-alt-flow-list">
            <li><span>01</span><div><strong>Return</strong><p>Used blood arrives through the vena cava.</p></div></li>
            <li><span>02</span><div><strong>Refresh</strong><p>The right side sends it to the lungs for oxygen.</p></div></li>
            <li><span>03</span><div><strong>Receive</strong><p>The left side takes the renewed blood in.</p></div></li>
            <li><span>04</span><div><strong>Deliver</strong><p>The left ventricle sends it everywhere.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="hc-alt-signals" id="alt-signals">
        <div className="hc-alt-signals-head">
          <div><span className="hc-alt-section-num">02 / signal map</span><h2>Your dashboard<br /><em>in four lines.</em></h2></div>
          <p>A single reading is a clue. Patterns across blood pressure, rhythm, cholesterol, and sugar are the useful story.</p>
        </div>
        <div className="hc-alt-signal-board">
          {vitals.map((vital, index) => (
            <div className="hc-alt-signal-row" key={vital.label}>
              <span className="hc-alt-signal-index">0{index + 1}</span>
              <div className="hc-alt-signal-name"><strong>{vital.label}</strong><span>{vital.unit}</span></div>
              <div className="hc-alt-signal-track"><i style={{ "--signal-width": signalWidths[index] } as CSSProperties} /></div>
              <strong className="hc-alt-signal-value">{vital.reading}</strong>
            </div>
          ))}
        </div>
        <p className="hc-alt-signal-note"><span /> Context changes the meaning of every number. Your doctor reads the pattern, not a single spike.</p>
      </section>

      <section className="hc-alt-conditions" id="alt-conditions">
        <div className="hc-alt-wide-heading">
          <span className="hc-alt-section-num">03 / constellation</span>
          <h2>Eight names.<br /><em>Plain language.</em></h2>
          <p>Conditions overlap, cluster, and change over time. Here is the quick read before the full conversation.</p>
        </div>
        <div className="hc-alt-condition-grid">
          {conditions.map((condition, index) => (
            <details key={condition.name} open={index === 0}>
              <summary><span>0{index + 1}</span><strong>{condition.name}</strong><b>+</b></summary>
              <p>{condition.what}</p>
              <small>Often feels like: {condition.feelsLike}</small>
            </details>
          ))}
        </div>
      </section>

      <section className="hc-alt-alert" id="alt-alert">
        <div className="hc-alt-alert-grid">
          <div>
            <span className="hc-alt-section-num">04 / interrupt</span>
            <h2>Some symptoms<br /><em>are a call.</em></h2>
            <p>Stop reading. Call 108 or get to the nearest emergency room. Do not drive yourself.</p>
            <a className="hc-alt-emergency-button" href="tel:108">Call 108 <b aria-hidden="true">↗</b></a>
          </div>
          <div className="hc-alt-alert-list">
            {emergencySigns.map((sign, index) => <div key={sign}><span>0{index + 1}</span><p>{sign}</p></div>)}
          </div>
        </div>
        <svg className="hc-alt-alert-wave" viewBox="0 0 1440 110" preserveAspectRatio="none" aria-hidden="true"><path d="M0 72 H380 l18 -8 16 8 h240 l15 -56 22 82 20 -34 h270 l18 -8 16 8 h435" /></svg>
      </section>

      <section className="hc-alt-eecp" id="alt-eecp">
        <div className="hc-alt-eecp-art"><EecpPulseArt /><span className="hc-alt-eecp-label">Treatment / 03</span></div>
        <div className="hc-alt-eecp-copy">
          <span className="hc-alt-section-num">05 / treatment option</span>
          <h2>Give the circulation<br /><em>another route.</em></h2>
          <p>EECP is a guided, non-surgical treatment that uses timed leg cuffs to help blood return to the heart — one quiet hour, one heartbeat at a time.</p>
          <div className="hc-alt-eecp-specs"><span><b>35</b> sessions</span><span><b>7</b> weeks</span><span><b>0</b> anaesthesia</span></div>
          <Link className="hc-alt-button hc-alt-button-coral" href="/eecp-therapy">See how EECP works <b aria-hidden="true">↗</b></Link>
        </div>
      </section>

      <section className="hc-alt-tests" id="alt-tests">
        <div className="hc-alt-signals-head">
          <div><span className="hc-alt-section-num">06 / evidence room</span><h2>Tests, without<br /><em>the fog.</em></h2></div>
          <p>Every test answers one specific question. The right test is the one that moves the next decision forward.</p>
        </div>
        <div className="hc-alt-test-list">
          {heartTests.map((test, index) => <div key={test.name}><span>0{index + 1}</span><strong>{test.name}</strong><p>{test.sees}</p><small>{test.time}</small></div>)}
        </div>
      </section>

      <section className="hc-alt-close">
        <div className="hc-alt-close-orbit" aria-hidden="true" />
        <span className="hc-alt-section-num">07 / next move</span>
        <h2>Clarity is useful.<br /><em>Conversation is care.</em></h2>
        <p>Bring your questions, your numbers, and your story. We will start there.</p>
        <div className="hc-alt-actions"><Link className="hc-alt-button hc-alt-button-coral" href="/appointment">Book a heart check <b aria-hidden="true">↗</b></Link><Link className="hc-alt-button hc-alt-button-line-dark" href="/heart-care">Return to the original guide <b aria-hidden="true">↗</b></Link></div>
        <div className="hc-alt-faqs">
          {heartFaqs.slice(0, 3).map((faq) => <details key={faq.q}><summary>{faq.q}<b>+</b></summary><p>{faq.a}</p></details>)}
        </div>
      </section>
    </main>
  );
}
