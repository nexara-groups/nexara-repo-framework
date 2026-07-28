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
            <Link
              href={`/courses/${programme.slug}`}
              className="programme-row reveal"
              data-featured={index < 2 || undefined}
            >
              <Image
                src={programmeImage(programme.slug)}
                alt=""
                width={1200}
                height={800}
                sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
              />
              <div>
                <em>{CATEGORY_LABELS[programme.category]}</em>
                <strong>{programme.title}</strong>
                <p>{programme.summary}</p>
                <span>
                  View programme <b aria-hidden="true">&rarr;</b>
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {matches.length === 0 && (
        <div className="catalogue__empty" role="status">
          <h2>No programmes match those filters.</h2>
          <p>Try a broader search term or choose a different focus.</p>
        </div>
      )}
    </>
  );
}
