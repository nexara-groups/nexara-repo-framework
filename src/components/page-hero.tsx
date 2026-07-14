import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SiteArt, type SiteArtKind } from "@/components/site-art";

export function PageHero({
  eyebrow,
  title,
  description,
  art,
  accent = "mint",
}: {
  eyebrow: string;
  title: string;
  description: string;
  art?: SiteArtKind;
  accent?: "mint" | "coral" | "navy";
}) {
  return (
    <section className={`page-hero page-hero-${accent}`}>
      <div className="container page-hero-inner">
        <Reveal className="page-hero-copy">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>{title}</span></div>
        </Reveal>
        {art ? <Reveal className="page-hero-media" delay={120}><SiteArt kind={art} label={eyebrow} /></Reveal> : <span className="page-hero-orbit" aria-hidden="true" />}
      </div>
    </section>
  );
}
