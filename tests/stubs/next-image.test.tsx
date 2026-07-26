import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Image from "./next-image";

describe("next/image stub", () => {
  it("renders an <img> carrying through src and alt", () => {
    const markup = renderToStaticMarkup(<Image src="/foo.png" alt="A foo" />);
    expect(markup).toContain("<img");
    expect(markup).toContain('src="/foo.png"');
    expect(markup).toContain('alt="A foo"');
  });

  it("does not leak the Next-only priority or fill props into the DOM output", () => {
    const markup = renderToStaticMarkup(<Image src="/bar.png" alt="A bar" priority fill />);
    expect(markup).not.toContain("priority");
    expect(markup).not.toContain("fill");
  });
});
