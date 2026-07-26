"use client";

import { useEffect, useRef, useState } from "react";

const phases = [
  ["Find the direction", "A guided conversation helps identify the role, domain and learning format that fit your current position."],
  ["Build the route", "A visible curriculum turns a broad ambition into a sequence of foundations, tools and applied work."],
  ["Practice the work", "Labs and project activity make the learning concrete and expose the next skills to strengthen."],
  ["Review the evidence", "Feedback helps sharpen your work, explain your decisions and prepare a stronger next attempt."],
  ["Prepare the transition", "Resume preparation, mock interviews and relevant opportunity support help you communicate what you can do. This is support, not an employment guarantee."],
];

export function StudentTrail() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => { const nodes = root.current?.querySelectorAll<HTMLElement>("[data-trail]"); if (!nodes) return; const observer = new IntersectionObserver((entries) => { const visible = entries.find((entry) => entry.isIntersecting); if (visible) setActive(Number((visible.target as HTMLElement).dataset.trail)); }, { threshold: 0.6 }); nodes.forEach((node) => observer.observe(node)); return () => observer.disconnect(); }, []);
  return <section className="student-trail" ref={root} aria-labelledby="trail-title"><div className="shell trail-head"><p className="kicker">Student transformation</p><h1 id="trail-title">A path becomes real<br />when the work changes.</h1><p>Yojo’s learner route is designed to make progress visible, useful and easier to explain.</p></div><div className="shell trail-layout"><aside className="trail-meter" aria-label={`Step ${active + 1} of 5`}><img src="/media/atlas/guide-512.webp" alt="" width="512" height="512" /><div><b>{String(active + 1).padStart(2, "0")}</b><span>05</span></div></aside><ol>{phases.map(([title, body], index) => <li data-trail={index} aria-current={active === index ? "step" : undefined} key={title}><span>{String(index + 1).padStart(2, "0")}</span><h2>{title}</h2><p>{body}</p></li>)}</ol></div></section>;
}
