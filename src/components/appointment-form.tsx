"use client";

import { useState, type FormEvent } from "react";

export function AppointmentForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return <div className="form-success"><span className="success-mark">✓</span><span className="eyebrow">Request received</span><h2>We will be in touch shortly.</h2><p>Your appointment request has been prepared. Our care team will confirm the available time with you directly.</p><button className="text-link" type="button" onClick={() => setSubmitted(false)}>Send another request <b aria-hidden="true">↗</b></button></div>;
  }

  return <form className="appointment-form" onSubmit={handleSubmit}>
    <div className="form-heading"><span className="eyebrow">A simple first step</span><h2>Tell us how we can help.</h2><p>This is an appointment request, not instant scheduling. A member of our team will confirm the details with you.</p></div>
    <div className="form-grid"><label>Patient name<input name="name" placeholder="Your full name" required /></label><label>Phone number<input name="phone" type="tel" placeholder="+91" required /></label><label>Email address<input name="email" type="email" placeholder="you@example.com" /></label><label>Preferred department<select name="department" defaultValue=""><option value="" disabled>Select a care pathway</option><option>EECP Therapy</option><option>Diagnostic Services</option><option>Pharmacy Services</option><option>OPD Services</option></select></label><label className="form-span">Preferred date<input name="date" type="date" /></label><label className="form-span">What would you like us to know?<textarea name="note" rows={4} placeholder="Share a little context..." /></label></div>
    <label className="consent"><input type="checkbox" required /> <span>I agree to be contacted by Rise Medical Hub about this request.</span></label><button className="button button-coral" type="submit">Request an appointment <b aria-hidden="true">↗</b></button>
  </form>;
}
