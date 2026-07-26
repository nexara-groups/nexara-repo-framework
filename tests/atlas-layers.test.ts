import { describe, expect, it } from "vitest";
import { ATLAS_LAYERS } from "../src/content/atlas-layers";

describe("ATLAS_LAYERS", () => {
  it("has exactly five layers, matching the approved artifact", () => {
    expect(ATLAS_LAYERS).toHaveLength(5);
  });

  it("preserves the approved label order", () => {
    expect(ATLAS_LAYERS.map((layer) => layer.label)).toEqual([
      "Guidance",
      "Curriculum",
      "Practice",
      "Feedback",
      "Placement Support",
    ]);
  });

  it("gives every layer a unique id and non-empty prose", () => {
    const ids = ATLAS_LAYERS.map((layer) => layer.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const layer of ATLAS_LAYERS) {
      expect(layer.headline.length).toBeGreaterThan(0);
      expect(layer.body.length).toBeGreaterThan(0);
    }
  });
});
