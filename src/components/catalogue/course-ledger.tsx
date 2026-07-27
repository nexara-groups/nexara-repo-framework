"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { PublishedProgramme } from "../../modules/learning-catalog";
import { CATEGORY_LABELS, programmeImage } from "../../content/programme-media";

export function CourseLedger({ programmes }: { readonly programmes: readonly PublishedProgramme[] }) {
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(programmes.map((p) => CATEGORY_LABELS[p.category]))],
    [programmes],
  );

  const matches = useMemo(() => {
    const needle = term.trim().toLowerCase();
    return programmes.filter((p) => {
      const inCategory = category === "All" || CATEGORY_LABELS[p.category] === category;
      const inSearch = `${p.title} ${p.summary}`.toLowerCase().includes(needle);
      return inCategory && inSearch;
    });
  }, [category, programmes, term]);

  return (
    <>
      <div className="catalogue__controls">
        <label htmlFor="programme-search">
          Search programmes
          <input
            id="programme-search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Try cybersecurity"
          />
        </label>
        <label htmlFor="programme-category">
          Filter by focus
          <select
            id="programme-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <p className="mono" aria-live="polite">
          {matches.length} programme{matches.length === 1 ? "" : "s"} shown
        </p>
      </div>

      <ul className="programme-ledger">
        {matches.map((programme, index) => (
          <li key={programme.slug}>
            <Link href={`/courses/${programme.slug}`} className="programme-row reveal">
              <span className="mono">{String(index + 1).padStart(2, "0")}</span>
              <Image src={programmeImage(programme.slug)} alt="" width={280} height={180} />
              <strong>{programme.title}</strong>
              <p>{programme.summary}</p>
              <em className="mono">{CATEGORY_LABELS[programme.category]}</em>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
