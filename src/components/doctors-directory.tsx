"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { doctors, type Doctor } from "@/content/site-data";
import { Reveal } from "@/components/reveal";

// Fisher–Yates. The roster shuffles on every visit so no doctor is ever
// structurally "first" — order must never read as rank.
function shuffled(list: Doctor[]): Doctor[] {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = next[i] as Doctor, b = next[j] as Doctor;
    next[i] = b;
    next[j] = a;
  }
  return next;
}

// Everyday concerns → the department that usually answers them.
const concerns = [
  { label: "Chest concerns or a surgical heart opinion", dept: "Heart & Chest" },
  { label: "Back pain, disc, or nerve trouble", dept: "Brain & Spine" },
  { label: "Knee or hip pain, joint replacement", dept: "Bone & Joint" },
  { label: "Gallbladder, hernia, or weight-loss surgery", dept: "Laparoscopic & Bariatric" },
  { label: "Kidney stones or urinary trouble", dept: "Kidney & Urology" },
  { label: "Cough, asthma, breathlessness", dept: "Lungs & Breathing" },
  { label: "Fever, sugar, BP — everyday illness", dept: "General Medicine" },
  { label: "Child health & vaccinations", dept: "Child Care" },
  { label: "Ear, nose, throat, or allergy", dept: "ENT, Head & Neck" },
  { label: "Women's health & pregnancy", dept: "Women's Health" },
  { label: "Teeth, jaw, or facial surgery", dept: "Dental & Facial" },
  { label: "Not sure — start with a physician", dept: "General Medicine" },
];

export function DoctorsDirectory() {
  const [filter, setFilter] = useState<string>("All");
  // Server render keeps source order; the deal happens after hydration.
  const [deck, setDeck] = useState<Doctor[]>(doctors);
  const rosterRef = useRef<HTMLDivElement>(null);
  const departments = ["All", ...Array.from(new Set(doctors.map((doc) => doc.department)))];

  useEffect(() => { setDeck(shuffled(doctors)); }, []);

  const visible = filter === "All" ? deck : deck.filter((doc) => doc.department === filter);

  const routeTo = (dept: string) => {
    setFilter(dept);
    rosterRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  return (
    <>
      {/* The care standard — one promise, no single face above the rest */}
      <section className="section-pad dr-spotlight-wrap">
        <div className="container dr-spotlight">
          <Reveal className="dr-spotlight-copy">
            <span className="eyebrow eyebrow-light">One standard, sixteen specialists</span>
            <blockquote>&ldquo;Our rule for every consultation: no test without a reason, no report without an explanation, no visit without a written next step.&rdquo;</blockquote>
            <div className="dr-spotlight-who"><strong>The Rise care team</strong><span>Every department, the same promise</span></div>
            <div className="dr-spotlight-actions">
              <Link className="button button-coral" href="/appointment">Book a consultation <b aria-hidden="true">↗</b></Link>
              <Link className="button button-ghost-light" href="/eecp-therapy">About EECP therapy <b aria-hidden="true">↗</b></Link>
            </div>
          </Reveal>
          <Reveal className="dr-spotlight-card" delay={140}>
            <div className="dr-spotlight-meta">
              <span><small>Departments</small>{new Set(doctors.map((doc) => doc.department)).size} doors, one roof</span>
              <span><small>Speaks</small>Telugu · English · Hindi</span>
              <span><small>Consultations</small>By appointment — time protected for questions</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The roster */}
      <section className="section-pad" ref={rosterRef}>
        <div className="container section-heading">
          <Reveal variant="mask"><span className="eyebrow">The roster</span><h2>Find your<br /><em>specialist.</em></h2></Reveal>
          <Reveal className="heading-aside" delay={100}><p>Filter by department and book a slot. Every consultation protects time for your questions.</p></Reveal>
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
          <div className="dr-grid">
            {visible.map((doc, index) => (
              <Reveal key={doc.slug} className="dr-card" delay={(index % 3) * 70}>
                <div className="dr-card-top">
                  <span className="dr-avatar" aria-hidden="true">{doc.initials}</span>
                  <span className="dr-card-dept">{doc.department}</span>
                </div>
                <h3>{doc.name}</h3>
                <span className="dr-role">{doc.role}</span>
                <span className="dr-quals">{doc.qualifications}</span>
                <p className="dr-usp">{doc.usp}</p>
                <p className="dr-card-bio">{doc.bio}</p>
                <div className="dr-tags">
                  {doc.expertise.map((tag) => <span key={tag} className="dr-tag">{tag}</span>)}
                </div>
                <div className="dr-card-foot">
                  <span className="dr-card-lang"><small>Speaks</small>{doc.languages}</span>
                  <Link className="dr-book" href="/appointment" aria-label={`Book a consultation with ${doc.name}`}><b aria-hidden="true">↗</b><span>Book</span></Link>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="note-strip">Profiles are compiled from each doctor&rsquo;s published qualifications and public records — availability and timings are confirmed when you book.</p>
        </div>
      </section>

      {/* Symptom router */}
      <section className="section-pad section-mint">
        <div className="container section-heading">
          <Reveal variant="mask"><span className="eyebrow">Not sure who to see?</span><h2>Start from what<br /><em>you feel.</em></h2></Reveal>
          <Reveal className="heading-aside" delay={100}><p>Pick the concern that sounds closest — we&rsquo;ll show you the right specialist. Still unsure? Our OPD physician is the right first door.</p></Reveal>
        </div>
        <div className="container dr-concerns">
          {concerns.map((concern, index) => (
            <Reveal key={concern.label} delay={index * 50}>
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
