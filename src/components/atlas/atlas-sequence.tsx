import type { AtlasLayer } from "../../content/atlas-layers";
import { AtlasScrubLoader } from "./atlas-scrub-loader.client";

/**
 * Server Component. Every chapter, the pin's resting label and the counter's
 * initial text are all rendered here as plain markup, so the section is
 * fully readable with no script, before hydration, and under
 * `prefers-reduced-motion`. `AtlasScrubLoader` (a Client Component) is the
 * only piece that lazily pulls in GSAP to drive the pin/scrub once the
 * browser is ready for it.
 */
export function AtlasSequence({ layers }: { readonly layers: readonly AtlasLayer[] }) {
  return (
    <section className="atlas section" id="learning-system" aria-labelledby="atlas-title">
      <div className="shell atlas__intro">
        <p className="mono">Open the learning system</p>
        <h2 id="atlas-title">
          Five layers.
          <br />
          One learning route.
        </h2>
        <p>Each layer answers a different learner question. The value is in how they work together.</p>
      </div>

      <div className="shell atlas__grid">
        <ol className="atlas__chapters">
          {layers.map((layer, index) => (
            <li className="atlas__chapter" data-atlas-chapter={index} key={layer.id}>
              <p className="mono atlas__position">
                {String(index + 1).padStart(2, "0")} / 05
              </p>
              <h3>{layer.headline}</h3>
              <p>{layer.body}</p>
              <p className="atlas__name">{layer.label}</p>
            </li>
          ))}
        </ol>

        <div className="atlas__pin">
          <div className="atlas__chamber">
            <span className="atlas__word" aria-hidden="true">Atlas</span>
            <p className="mono atlas__counter" data-atlas-counter aria-hidden="true">
              01 / 05
            </p>
          </div>
        </div>
      </div>

      <AtlasScrubLoader />
    </section>
  );
}
