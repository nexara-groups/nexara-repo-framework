"use client";

import { useEffect, useRef, useState } from "react";

const layers = [
  ["Guidance", "Start with your actual position.", "Clarify your current skills, target role, available time and learning format before choosing a programme."],
  ["Curriculum", "Make the route visible.", "Foundations, tools and applied work are placed in a sequence you can understand before you commit."],
  ["Practice", "Turn recognition into capability.", "Labs, exercises and project work reveal what you can use independently and what needs another attempt."],
  ["Feedback", "Create the next useful attempt.", "Specific review identifies what broke, why it broke and what to improve when you return to the work."],
  ["Placement support", "Prepare the transition.", "Learning evidence becomes a clearer resume, interview preparation and relevant opportunity support where available."],
];

export function AtlasExperience() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const chapters = root.current?.querySelectorAll<HTMLElement>("[data-atlas-chapter]");
    if (!chapters) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(Number((visible.target as HTMLElement).dataset.atlasChapter));
    }, { threshold: [0.45, 0.65], rootMargin: "-12% 0px -24%" });
    chapters.forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="atlas-system" id="learning-system" ref={root} aria-labelledby="atlas-title">
      <div className="shell atlas-intro"><p className="kicker">Open the learning system</p><h2 id="atlas-title">Five layers.<br />One learning route.</h2><p>Each layer answers a different learner question. The value is in how they work together.</p></div>
      <div className="atlas-grid shell">
        <div className="atlas-chapters">
          {layers.map(([name, title, body], index) => <article className={active === index ? "atlas-chapter active" : "atlas-chapter"} data-atlas-chapter={index} key={name}>
            <p className="chapter-position">{String(index + 1).padStart(2, "0")} / 05</p><h3>{title}</h3><p>{body}</p><span>{name}</span>
          </article>)}
        </div>
        <div className="atlas-pin" aria-label={`Learning Atlas, ${layers[active]?.[0]}`}>
          <div className="atlas-chamber">
            <span className="atlas-word" aria-hidden="true">ATLAS</span>
            <img className="atlas-case" src="/media/atlas/atlas-case-empty-1600.webp" alt="" width="1672" height="941" />
            <div className="atlas-plates" aria-hidden="true">
              {layers.map(([name], index) => <div className={active === index ? "atlas-plate active" : "atlas-plate"} style={{ "--plate": index } as React.CSSProperties} key={name}><span>{name}</span></div>)}
            </div>
            <img className="atlas-guide" src="/media/atlas/guide-512.webp" alt="" width="512" height="512" />
            <p className="atlas-counter"><b>{String(active + 1).padStart(2, "0")}</b><i></i>05</p>
          </div>
        </div>
      </div>
    </section>
  );
}
