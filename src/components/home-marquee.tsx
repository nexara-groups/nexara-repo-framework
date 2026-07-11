import { services } from "@/content/site-data";

export function HomeMarquee() {
  const half = (key: string) => (
    <div className="hm-marquee-half" key={key}>
      {services.map((service) => (
        <span className="hm-marquee-item" key={service.slug}>
          {service.name}
          <i className="hm-marquee-dot" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="hm-marquee" aria-hidden="true">
      <div className="hm-marquee-track">{[half("a"), half("b")]}</div>
    </div>
  );
}
