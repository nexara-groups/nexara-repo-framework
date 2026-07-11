"use client";

import { useState, type FormEvent } from "react";
import { contact } from "@/content/site-data";

export function AppointmentForm() {
  const [handedOff, setHandedOff] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = [
      "Appointment request — Rise Medical Hub",
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
      data.get("email") ? `Email: ${data.get("email")}` : null,
      data.get("department") ? `Pathway: ${data.get("department")}` : null,
      data.get("date") ? `Preferred date: ${data.get("date")}` : null,
      data.get("note") ? `Note: ${data.get("note")}` : null,
    ].filter(Boolean);
    window.open(`${contact.whatsappHref}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
    setHandedOff(true);
  }

  if (handedOff) {
    return <div className="form-success"><span className="success-mark">✓</span><span className="eyebrow">Almost there</span><h2>Send the WhatsApp message to finish.</h2><p>We opened WhatsApp with your request pre-filled — press send there and our care team will reply with available times. Nothing reaches us until that message is sent.</p><p>Prefer to talk? Call <a href={contact.phoneHref}>{contact.phone}</a> — the line is answered around the clock.</p><button className="text-link" type="button" onClick={() => setHandedOff(false)}>Edit the request <b aria-hidden="true">↗</b></button></div>;
  }

  return <form className="appointment-form" onSubmit={handleSubmit}>
    <div className="form-heading"><span className="eyebrow">A simple first step</span><h2>Tell us how we can help.</h2><p>Submitting opens WhatsApp with your request pre-filled — you review it and press send. For urgent concerns, call us instead.</p></div>
    <div className="form-grid"><label>Patient name<input name="name" placeholder="Your full name" required /></label><label>Phone number<input name="phone" type="tel" placeholder="+91" required /></label><label>Email address<input name="email" type="email" placeholder="you@example.com" /></label><label>Preferred department<select name="department" defaultValue=""><option value="" disabled>Select a care pathway</option><option>Heart care / EECP</option><option>Diagnostic Services</option><option>Pharmacy Services</option><option>OPD Services</option></select></label><label className="form-span">Preferred date<input name="date" type="date" /></label><label className="form-span">What would you like us to know?<textarea name="note" rows={4} placeholder="Share a little context..." /></label></div>
    <label className="consent"><input type="checkbox" required /> <span>I agree to be contacted by Rise Medical Hub about this request.</span></label><button className="button button-coral" type="submit">Continue on WhatsApp <b aria-hidden="true">↗</b></button>
  </form>;
}
