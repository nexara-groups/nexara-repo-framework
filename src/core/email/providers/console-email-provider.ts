import type { EmailMessage, EmailProvider } from "../email-provider.interface";

/** Development fallback that deliberately omits sensitive message content. */
export class ConsoleEmailProvider implements EmailProvider {
  readonly name = "console";

  async send(message: EmailMessage): Promise<void> {
    console.log(`[email:console] to=${maskAddress(message.to)} subject=${JSON.stringify(message.subject)} body=[omitted]`);
  }
}

function maskAddress(value: string): string {
  const [local, domain] = value.split("@");
  return local && domain ? `${local.slice(0, 1)}***@${domain}` : "[invalid-address]";
}
