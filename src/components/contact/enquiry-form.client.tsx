"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { BUSINESS_CONTACT, whatsappHref } from "../../content/contact";

const INTERESTS = [
  "Cybersecurity training",
  "AI and machine learning",
  "Networking or cloud",
  "Software, data, or SAP",
  "Career support",
  "Organisation services",
] as const;

export function EnquiryForm() {
  const [prepared, setPrepared] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const phone = String(form.get("phone") ?? "");
    const email = String(form.get("email") ?? "");
    const interest = String(form.get("interest") ?? "");
    const message = String(form.get("message") ?? "");
    const subject = `Yojo enquiry: ${interest || "General"}`;
    const body = [
      `Name: ${name}`,
      `Phone or WhatsApp: ${phone}`,
      `Email: ${email}`,
      `Interest: ${interest}`,
      "",
      message,
    ].join("\n");

    setPrepared(true);
    window.location.href = `${BUSINESS_CONTACT.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className="enquiry-form" id="enquiry" onSubmit={handleSubmit}>
      <div className="enquiry-form__heading">
        <h2>Tell us what you want to do next.</h2>
        <p>Complete the details below. Your email app will open with the enquiry ready to send.</p>
      </div>

      <div className="enquiry-form__grid">
        <label>
          Full name
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          Phone or WhatsApp
          <input name="phone" autoComplete="tel" inputMode="tel" required />
        </label>
        <label>
          Email address
          <input name="email" autoComplete="email" type="email" required />
        </label>
        <label>
          I am interested in
          <select name="interest" defaultValue="" required>
            <option value="" disabled>
              Select an option
            </option>
            {INTERESTS.map((interest) => (
              <option key={interest}>{interest}</option>
            ))}
          </select>
        </label>
      </div>

      <label>
        What would you like help with?
        <textarea name="message" rows={5} required />
      </label>

      <div className="enquiry-form__actions">
        <button className="button button--primary" type="submit">
          Prepare email enquiry
        </button>
        <a
          className="text-link"
          href={whatsappHref("Hello Yojo Solutions, I would like to make an enquiry.")}
          target="_blank"
          rel="noreferrer"
        >
          Prefer WhatsApp?
        </a>
      </div>

      {prepared && (
        <p className="enquiry-form__status" role="status">
          Your email app should now be open with the enquiry prepared.
        </p>
      )}
    </form>
  );
}
