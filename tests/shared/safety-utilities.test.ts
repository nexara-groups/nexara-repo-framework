import { describe, expect, it } from "vitest";
import { safeCsv } from "../../src/shared/csv";
import { clampPage, paginationRange } from "../../src/shared/pagination";
import { isCrossSiteRequest } from "../../src/shared/request-origin";
import { httpsUrlOrNull } from "../../src/shared/url";

describe("shared safety utilities", () => {
  it("creates Excel-safe CSV with portable UTF-8 line endings", () => {
    expect(safeCsv([
      ["Name", "Formula", "Note"],
      ["Ravi", "=SUM(1,2)", 'a "quoted" value'],
    ])).toBe("\uFEFFName,Formula,Note\r\nRavi,\"'=SUM(1,2)\",\"a \"\"quoted\"\" value\"\r\n");
  });

  it("normalizes requested pages and reports the visible range", () => {
    expect(clampPage("999", 76, 25)).toBe(4);
    expect(paginationRange(76, 4, 25, 1)).toEqual({
      from: 76,
      to: 76,
      totalPages: 4,
      hasPrevious: true,
      hasNext: false,
    });
  });

  it("rejects browser requests whose Origin is cross-site", () => {
    const request = new Request("https://app.example.test/api/mutate", {
      method: "POST",
      headers: { origin: "https://attacker.example.test" },
    });

    expect(isCrossSiteRequest(request)).toBe(true);
  });

  it("accepts only well-formed HTTPS URLs", () => {
    expect(httpsUrlOrNull("https://app.example.test/path")).toBe("https://app.example.test/path");
    expect(httpsUrlOrNull("http://app.example.test/path")).toBeNull();
    expect(httpsUrlOrNull("not a URL")).toBeNull();
  });
});
