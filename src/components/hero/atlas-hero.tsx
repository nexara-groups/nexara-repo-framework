import Image from "next/image";
import Link from "next/link";
import type { AtlasLayer } from "../../content/atlas-layers";
import { AtlasPlate } from "./atlas-plate";

export function AtlasHero({ layers }: { readonly layers: readonly AtlasLayer[] }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <p className="hero__word" aria-hidden="true">Yojo</p>

      <div className="hero__stage">
        <Image
          className="hero__scene"
          src="/media/atlas/atlas-case-empty-1600.webp"
          alt=""
          width={1600}
          height={900}
          sizes="100vw"
          priority
          fetchPriority="high"
        />
      </div>

      <ol className="atlas-plates" aria-label="The five Learning Atlas layers">
        {layers.map((layer, index) => (
          <AtlasPlate key={layer.id} layer={layer} index={index} />
        ))}
      </ol>

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
