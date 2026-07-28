import { describe, expect, it } from "vitest";
import { JOURNEY_STAGES } from "../src/content/journey";

describe("JOURNEY_STAGES", () => {
  it("defines the five ordered learner decisions", () => {
    expect(JOURNEY_STAGES).toHaveLength(5);
    expect(JOURNEY_STAGES.map((stage) => stage.id)).toEqual([
      "assess",
      "choose",
      "route",
      "practice",
      "transition",
    ]);
  });

  it("keeps every stage usable without motion", () => {
    for (const stage of JOURNEY_STAGES) {
      expect(stage.title.length).toBeGreaterThan(0);
      expect(stage.body.length).toBeGreaterThan(0);
      expect(stage.outcome.length).toBeGreaterThan(0);
      expect(stage.artDescription.length).toBeGreaterThan(0);
    }
  });
});
