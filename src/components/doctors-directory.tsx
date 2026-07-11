"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { doctors } from "@/content/site-data";
import { Reveal } from "@/components/reveal";

// Everyday concerns → the department that usually answers them.
const concerns = [
  { label: "Chest discomfort or breathlessness", dept: "Cardiology & EECP" },
  { label: "Sugar control & diabetes", dept: "Diabetology" },
  { label: "Fever, fatigue, everyday illness", dept: "General & Internal Medicine" },
  { label: "Cough, asthma, COPD", dept: "Pulmonology" },
  { label: "Women's health & screening", dept: "Women's Health" },
  { label: "Recovery, mobility, rehab", dept: "Physiotherapy & Rehab" },
];

export function DoctorsDirectory() {
  const [filter, setFilter] = useState<string>("All");
  const rosterRef = useRef<HTMLDivElement>(null);
  const departments = ["All", ...Array.from(new Set(doctors.map((doc) => doc.department)))];
  const visible = filter === "All" ? doctors : doctors.filter((doc) => doc.department === filter);
  const featured = doctors[0];

  const routeTo = (dept: string) => {
    setFilter(dept);
    rosterRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  return (
    <>
      {/* Featured specialist */}
      {featured ? (
        <section className="section-pad dr-spotlight-wrap">
          <div className="container dr-spotlight">
            <Reveal className="dr-spotlight-copy">
              <span className="eyebrow eyebrow-light">Leading the signature pathway</span>
              <blockquote>&ldquo;Most patients don&rsquo;t need another test. They need someone to sit down, connect the ones they have, and explain the road ahead.&rdquo;</blockquote>
              <div className="dr-spotlight-who"><strong>{featured.name}</strong><span>{featured.role} · {featured.qualifications}</span></div>
              <div className="dr-spotlight-actions">
                <Link className="button button-coral" href="/appointment">Consult {featured.name.split(" ").slice(0, 2).join(" ")} <b aria-hidden="true">↗</b></Link>
                <Link className="button button-ghost-light" href="/eecp-therapy">About EECP therapy <b aria-hidden="true">↗</b></Link>
              </div>
            </Reveal>
            <Reveal className="dr-spotlight-card" delay={140}>
              <span className="dr-avatar dr-avatar-xl" aria-hidden="true">{featured.initials}</span>
              <div className="dr-spotlight-meta">
                <span><small>Focus</small>{featured.focus}</span>
                <span><small>Speaks</small>{featured.languages}</span>
                <span><small>OPD timings</small>{featured.timings}</span>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* The roster */}
      <section className="section-pad" ref={rosterRef}>
        <div className="container section-heading">
          <Reveal><span className="eyebrow">The roster</span><h2>Find your<br /><em>specialist.</em></h2></Reveal>
          <Reveal className="heading-aside" delay={100}><p>Filter by department, check the days, and book a slot. Every consultation protects time for your questions.</p></Reveal>
        </div>
        <div className="container">
          <Reveal className="dr-filters" delay={60}>
            {departments.map((dept) => (
              <button key={dept} type="button" className={`dr-filter${filter === dept ? " dr-filter-on" : ""}`} onClick={() => setFilter(dept)}>
                {dept}
                <i>{dept === "All" ? doctors.length : doctors.filter((d) => d.department === dept).length}</i>
              </button>
            ))}
          </Reveal>
          <div className="dr-roster">
            {visible.map((doc) => (
              <div key={doc.name} className="dr-row">
                <span className="dr-avatar" aria-hidden="true">{doc.initials}</span>
                <div className="dr-id">
                  <h3>{doc.name}</h3>
                  <span className="dr-role">{doc.role}</span>
                  <span className="dr-quals">{doc.qualifications}</span>
                </div>
                <p className="dr-focus">{doc.focus}</p>
                <div className="dr-meta">
                  <span><small>Speaks</small>{doc.languages}</span>
                  <span><small>OPD timings</small>{doc.timings}</span>
                </div>
                <Link className="dr-book" href="/appointment" aria-label={`Book a consultation with ${doc.name}`}><b aria-hidden="true">↗</b><span>Book</span></Link>
              </div>
            ))}
          </div>
          <p className="note-strip">Doctor profiles, qualifications, and timings are representative and being verified with the clinical team — please confirm availability when booking.</p>
        </div>
      </section>

      {/* Symptom router */}
      <section className="section-pad section-mint">
        <div className="container section-heading">
          <Reveal><span className="eyebrow">Not sure who to see?</span><h2>Start from what<br /><em>you feel.</em></h2></Reveal>
          <Reveal className="heading-aside" delay={100}><p>Pick the concern that sounds closest — we&rsquo;ll show you the right specialist. Still unsure? Our OPD physician is the right first door.</p></Reveal>
        </div>
        <div className="container dr-concerns">
          {concerns.map((concern, index) => (
            <Reveal key={concern.label} delay={index * 60}>
              <button type="button" className="dr-concern" onClick={() => routeTo(concern.dept)}>
                <span>{concern.label}</span>
                <small>{concern.dept} <b aria-hidden="true">→</b></small>
              </button>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
