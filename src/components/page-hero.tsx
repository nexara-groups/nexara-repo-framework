import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  accent = "mint",
}: {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
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
        {image ? <Reveal className="page-hero-media" delay={120}><Image src={image} alt={imageAlt ?? ""} fill sizes="(max-width: 800px) 100vw, 48vw" priority /></Reveal> : <span className="page-hero-orbit" aria-hidden="true" />}
      </div>
    </section>
  );
}
