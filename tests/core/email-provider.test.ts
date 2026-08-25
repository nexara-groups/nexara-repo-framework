import { describe, expect, it, vi } from "vitest";
import { ConsoleEmailProvider } from "../../src/core/email/providers/console-email-provider";
import { parseRecipientAllowlist, RecipientAllowlistEmailProvider } from "../../src/core/email/providers/recipient-allowlist-email-provider";
import { SesEmailProvider } from "../../src/core/email/providers/ses-email-provider";
import type { EmailMessage, EmailProvider } from "../../src/core/email/email-provider.interface";

class RecordingEmailProvider implements EmailProvider {
  readonly name = "recording";
  readonly messages: EmailMessage[] = [];
  async send(message: EmailMessage): Promise<void> { this.messages.push(message); }
}

describe("email providers", () => {
  it("redacts recipient and body content from the console fallback", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    await new ConsoleEmailProvider().send({
      to: "member@example.test",
      subject: "Reset token: private-subject-capability",
      text: "https://app.example.test/ticket?token=private-capability",
    });

    const output = log.mock.calls.flat().join(" ");
    expect(output).toContain("m***@example.test");
    expect(output).not.toContain("member@example.test");
    expect(output).not.toContain("private-subject-capability");
    expect(output).not.toContain("private-capability");
    log.mockRestore();
  });

  it("blocks a staging recipient before invoking the inner provider", async () => {
    const inner = new RecordingEmailProvider();
    const provider = new RecipientAllowlistEmailProvider(inner, parseRecipientAllowlist("allowed@example.test"));

    await expect(provider.send({ to: "blocked@example.test", subject: "Private", text: "Private" }))
      .rejects.toMatchObject({ code: "PROVIDER" });

    expect(inner.messages).toEqual([]);
  });

  it("does not expose SES credentials or message content on a failed request", async () => {
    const secret = "super-secret-credential";
    const provider = new SesEmailProvider({
      region: "ap-south-1",
      accessKeyId: "access-key",
      secretAccessKey: secret,
      from: "Nexara <no-reply@example.test>",
      client: { fetch: async () => new Response(`rejected ${secret}`, { status: 429 }) },
    });

    let caught: unknown;
    try {
      await provider.send({ to: "member@example.test", subject: "Private", text: "Private" });
    } catch (error) {
      caught = error;
    }

    expect(caught).toMatchObject({ code: "PROVIDER", message: "SES email send failed (429)" });
    expect(caught).toBeInstanceOf(Error);
    const message = (caught as Error).message;
    expect(message).not.toContain(secret);
    expect(message).not.toContain("member@example.test");
  });
});
