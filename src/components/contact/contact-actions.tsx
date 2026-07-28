import Link from "next/link";
import { whatsappHref } from "../../content/contact";

interface ContactActionsProps {
  readonly message?: string;
  readonly enquiryHref?: string;
  readonly compact?: boolean;
}

export function ContactActions({
  message,
  enquiryHref = "/contact#enquiry",
  compact = false,
}: ContactActionsProps) {
  return (
    <div className={`contact-actions${compact ? " contact-actions--compact" : ""}`}>
      <a
        className="button button--primary"
        href={whatsappHref(message)}
        target="_blank"
        rel="noreferrer"
      >
        Chat on WhatsApp
      </a>
      <Link className="button button--secondary" href={enquiryHref}>
        Send an enquiry
      </Link>
    </div>
  );
}
