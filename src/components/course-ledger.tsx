"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Programme } from "../content/site";

export function CourseLedger({ programmes }: { programmes: Programme[] }) {
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(programmes.map((programme) => programme.category))];
  const matches = useMemo(() => programmes.filter((programme) => (category === "All" || programme.category === category) && `${programme.title} ${programme.summary}`.toLowerCase().includes(term.toLowerCase())), [category, programmes, term]);
  return <section className="catalogue shell" aria-labelledby="catalogue-title">
    <div className="catalogue-heading"><p className="kicker">Published programmes</p><h1 id="catalogue-title">Choose by the work<br />you want to do.</h1><p>Current level, curriculum, schedule and fee are confirmed with a learning advisor.</p></div>
    <div className="catalogue-controls"><label htmlFor="programme-search">Search programmes<input id="programme-search" value={term} onChange={(event) => setTerm(event.target.value)} placeholder="Try cybersecurity" /></label><label htmlFor="programme-category">Filter by focus<select id="programme-category" value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><p aria-live="polite">{matches.length} programme{matches.length === 1 ? "" : "s"} shown</p></div>
    <div className="programme-ledger">{matches.map((programme, index) => <Link href={`/courses/${programme.slug}`} className="programme-row" key={programme.slug}><span>{String(index + 1).padStart(2, "0")}</span><img src={programme.image} alt="" width="280" height="180" /><strong>{programme.title}</strong><p>{programme.summary}</p><em>{programme.category}</em><b aria-hidden="true">→</b></Link>)}</div>
  </section>;
}
