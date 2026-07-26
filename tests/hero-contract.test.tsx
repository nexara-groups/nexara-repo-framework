import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AtlasHero } from "../src/components/hero/atlas-hero";
import { ATLAS_LAYERS } from "../src/content/atlas-layers";

const markup = () => renderToStaticMarkup(<AtlasHero layers={ATLAS_LAYERS} />);

describe("homepage hero visual contract", () => {
  it("renders all five plate labels as live text in the first viewport", () => {
    const html = markup();
    for (const layer of ATLAS_LAYERS) {
      expect(html).toContain(layer.label);
    }
  });

  it("uses the empty-case stage, never the pre-composed hero render", () => {
    const html = markup();
    expect(html).toContain("atlas-case-empty");
    // `atlas-hero.*` bakes blank plates AND the mascot into the raster.
    expect(html).not.toContain("atlas-hero");
  });

  it("keeps the guide mascot out of the hero", () => {
    expect(markup()).not.toContain("/media/atlas/guide");
  });

  it("offers exactly one primary call to action", () => {
    const matches = markup().match(/data-hero-cta/g) ?? [];
    expect(matches).toHaveLength(1);
  });
});
