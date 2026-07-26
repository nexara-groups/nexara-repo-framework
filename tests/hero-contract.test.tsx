import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AtlasHero } from "../src/components/hero/atlas-hero";
import { ATLAS_LAYERS } from "../src/content/atlas-layers";

const markup = () => renderToStaticMarkup(<AtlasHero layers={ATLAS_LAYERS} />);

/** Escape a literal string for safe use inside a `RegExp`. */
const escapeForRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Locate the `<ol>` that carries the plate list's `aria-label`, and split it into
 * its opening-tag attributes and its inner markup. The attribute-order-agnostic
 * `[^>]*` segments let this match regardless of where `aria-label` sits among the
 * other attributes on the tag.
 */
const findPlateList = (html: string) => {
  const match = html.match(
    /<ol\b([^>]*\baria-label="The five Learning Atlas layers"[^>]*)>([\s\S]*?)<\/ol>/,
  );
  if (!match) {
    throw new Error("Expected to find the <ol aria-label=\"The five Learning Atlas layers\"> plate list in the markup.");
  }
  const [, openingTagAttrs, innerMarkup] = match;
  return { openingTagAttrs, innerMarkup };
};

describe("homepage hero visual contract", () => {
  it("keeps the plate list itself visible to assistive technology", () => {
    const { openingTagAttrs } = findPlateList(markup());
    // The regression this guards against: the whole list wrapped in
    // aria-hidden="true", which silences every plate label for AT even though
    // the labels are still live DOM text.
    expect(openingTagAttrs).not.toMatch(/aria-hidden/);
  });

  it("renders all five plate labels as live text inside the plate list", () => {
    const { innerMarkup } = findPlateList(markup());
    for (const layer of ATLAS_LAYERS) {
      const escaped = escapeForRegExp(layer.label);
      // A label counts only if it sits between two tags as element text content
      // (">Label<"). A raw substring check would also pass if the label were
      // tucked inside an attribute value instead of rendered as text.
      expect(innerMarkup).toMatch(new RegExp(`>${escaped}<`));
    }
  });

  it("never satisfies a label via an alt attribute instead of live text", () => {
    const html = markup();
    for (const layer of ATLAS_LAYERS) {
      const escaped = escapeForRegExp(layer.label);
      // Closes the specific dishonest path: stuffing the label into alt="" would
      // make a plain substring check pass without the label ever being visible
      // as text to sighted users or exposed as text to screen readers.
      expect(html).not.toMatch(new RegExp(`alt="${escaped}"`));
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

  it("offers exactly one primary call to action, and it is an anchor", () => {
    const html = markup();
    const attrMatches = html.match(/data-hero-cta/g) ?? [];
    expect(attrMatches).toHaveLength(1);

    // A `<div data-hero-cta>` would satisfy the count above without being
    // reachable or operable as a link. Require the attribute to land on an
    // actual `<a ...>` opening tag.
    const anchorMatches = html.match(/<a\b[^>]*\bdata-hero-cta\b[^>]*>/g) ?? [];
    expect(anchorMatches).toHaveLength(1);
  });
});
