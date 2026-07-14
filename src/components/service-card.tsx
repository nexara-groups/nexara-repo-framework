import Link from "next/link";
import type { Service } from "@/content/site-data";
import { Reveal } from "@/components/reveal";
import { SiteArt } from "@/components/site-art";

export function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  return (
    <Reveal className="service-card" delay={index * 90}>
      <Link href={`/${service.slug}`} className="service-card-link">
        <div className="service-card-image"><SiteArt kind={service.art} label={service.name} compact /></div>
        <div className="service-card-body"><span className="service-number">{service.number}</span><h3>{service.name}</h3><p>{service.short}</p><span className="text-link">Explore care <b aria-hidden="true">↗</b></span></div>
      </Link>
    </Reveal>
  );
}
