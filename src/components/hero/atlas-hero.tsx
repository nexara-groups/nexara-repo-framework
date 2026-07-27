import Link from "next/link";
import type { AtlasLayer } from "../../content/atlas-layers";
import { AtlasPlate } from "./atlas-plate";
import { HeroAssembly } from "./hero-assembly";

export function AtlasHero({ layers }: { readonly layers: readonly AtlasLayer[] }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <p className="hero__word" aria-hidden="true">Yojo</p>

      <picture className="hero__stage">
        <source media="(max-width: 620px)" srcSet="/media/atlas/atlas-case-empty-480.webp" />
        <source media="(max-width: 900px)" srcSet="/media/atlas/atlas-case-empty-960.webp" />
        <img
          className="hero__scene"
          src="/media/atlas/atlas-case-empty-1600.webp"
          alt=""
          width={1600}
          height={900}
          fetchPriority="high"
        />
      </picture>

      <ol className="atlas-plates" aria-label="The five Learning Atlas layers">
        {layers.map((layer, index) => (
          <AtlasPlate key={layer.id} layer={layer} index={index} />
        ))}
      </ol>
      <HeroAssembly />

      <div className="shell hero__layout">
        <div className="hero__copy">
          <p className="mono hero__kicker">Technology learning, assembled around you</p>
          <h1 id="hero-title">
            Build a path
            <br />
            you can prove.
          </h1>
          <span className="hero__rule" aria-hidden="true" />
          <Link className="button button--primary" href="/contact" data-hero-cta>
            Find your programme <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      <p className="mono hero__hud hero__hud--left">Visakhapatnam &middot; Live online</p>
      <p className="mono hero__hud hero__hud--right">Scroll &darr;</p>
    </section>
  );
}
