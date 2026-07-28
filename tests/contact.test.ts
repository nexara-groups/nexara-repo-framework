import { describe, expect, it } from "vitest";
import { BUSINESS_CONTACT, whatsappHref } from "../src/content/contact";

describe("Yojo contact paths", () => {
  it("uses the published primary contact details", () => {
    expect(BUSINESS_CONTACT.phoneDisplay).toBe("+91 98000 49797");
    expect(BUSINESS_CONTACT.email).toBe("info@yojosolutions.com");
  });

  it("creates an encoded WhatsApp conversation link", () => {
    const href = whatsappHref("Hello Yojo, cybersecurity please.");

    expect(href).toContain("https://wa.me/919800049797");
    expect(href).toContain("Hello%20Yojo%2C%20cybersecurity%20please.");
  });
});
