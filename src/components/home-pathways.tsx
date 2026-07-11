"use client";

import Link from "next/link";
import { useState, type ComponentType } from "react";
import { services } from "@/content/site-data";
import { Reveal } from "@/components/reveal";
import { EecpPulseArt, DiagnosticsArt, PharmacyArt, OpdArt } from "@/components/brand-art";

const artBySlug: Record<string, ComponentType> = {
  "eecp-therapy": EecpPulseArt,
  diagnostics: DiagnosticsArt,
  pharmacy: PharmacyArt,
  opd: OpdArt,
};

export function HomePathways() {
  const [active, setActive] = useState(0);
  const current = services[active] ?? services[0];
  if (!current) return null;

  return (
    <section className="section-pad hm-paths">
      <div className="container section-heading">
        <Reveal variant="mask"><span className="eyebrow">Our care pathways</span><h2>Four doors.<br /><em>One standard of care.</em></h2></Reveal>
        <Reveal className="heading-aside" delay={100}>
          <p>From outpatient consultations to specialist EECP therapy, each pathway is shaped around clarity, comfort, and continuity.</p>
          <Link className="text-link" href="/services">View all services <b aria-hidden="true">↗</b></Link>
        </Reveal>
      </div>

      <div className="container hm-paths-grid">
        <Reveal className="hm-paths-list-wrap">
          <div className="hm-paths-list">
            {services.map((service, i) => (
              <Link
                key={service.slug}
                href={`/${service.slug}`}
                className={`hm-path-row${i === active ? " hm-path-row-active" : ""}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className="hm-path-num">{service.number}</span>
                <span>
                  <strong>{service.name}</strong>
                  <p>{service.short}</p>
                </span>
                <span className="hm-path-arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </Reveal>

        <Reveal className="hm-paths-media-wrap" delay={140}>
          <Link href={`/${current.slug}`} className="hm-paths-media" aria-label={`Explore ${current.name}`}>
            {services.map((service, i) => {
              const Art = artBySlug[service.slug] ?? EecpPulseArt;
              return (
                <span key={service.slug} className={`hm-paths-shot${i === active ? " hm-on" : ""}`} aria-hidden={i !== active}>
                  <Art />
                </span>
              );
            })}
            <span className="hm-paths-wm" aria-hidden="true">{current.number}</span>
            <span className="hm-paths-cap"><i className="pulse-icon" aria-hidden="true" /><span><strong>{current.name}</strong><small>Explore this pathway ↗</small></span></span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
