# Compliance notes — cookie consent (GDPR / India DPDP Act 2023)

The banner is the *mechanism*. Full compliance also needs policy pages and, for
India, a named grievance contact. None of this is legal advice — have the final
text reviewed for the target jurisdiction.

## The consent mechanism (what the banner gives you)
- **Prior consent** — analytics load only after an affirmative click (Consent Mode default = denied).
- **Granular** — Necessary (always on) vs Analytics (opt-in toggle).
- **Free / specific / informed / unambiguous** — clear Accept, Reject, and Preferences; policy links in the banner.
- **Easy withdrawal** — a "Cookie Preferences" control reopens the modal; reject deletes existing `_ga` cookies. Withdrawal must be as easy as giving consent.
- **Persistent record** — stored in `localStorage['cc-consent']` with a timestamp.

## Still required — Privacy Policy page
Must cover: who you are (Data Fiduciary/Controller); what data you collect and why;
lawful basis (consent); processors you share with (Google Analytics, form handler, host);
retention periods; user rights; security; children's data; international transfers;
how to contact you; and changes/effective date.

### DPDP Act 2023 specifics (India)
- **Data Principal rights:** access, correction, erasure, withdraw consent, grievance redressal, nominate.
- **Data Principal duties:** no false/frivolous complaints; provide authentic info.
- **Grievance Officer:** you must publish a named contact for data requests/complaints.
- **Breach notification:** notify affected people and the Data Protection Board of India.
- **Retention limitation:** delete/anonymise when purpose is served or consent withdrawn.
- **Children:** verifiable parental consent for under-18; no tracking/targeted ads at children.
- Cite the framework: DPDP Act 2023, read with the IT Act 2000 + SPDI Rules 2011.

### GDPR specifics (EU/UK)
- Rights: access, rectification, erasure, restriction, portability, objection, withdraw consent.
- Name a contact (DPO if required); lawful basis stated per purpose; SCCs for transfers.

## Still required — Cookie Policy page
List the actual cookies in a table: name, provider, purpose, duration. Typical:

| Name | Provider | Purpose | Duration |
|------|----------|---------|----------|
| `cc-consent` | This site (localStorage) | Stores the visitor's cookie choice | Until cleared |
| `_ga` | Google Analytics | Distinguishes unique visitors | up to 2 years |
| `_ga_<container-id>` | Google Analytics | Session state | up to 2 years |
| `_gid` | Google Analytics | Short-term visitor id | 24 hours |

Also confirm the GA4 **data retention** setting (GA Admin → Data Settings → Data Retention)
and state it consistently in the policy.

## Deployment checklist
- [ ] Head snippet on every GA page, consent default **before** `gtag('config')`
- [ ] Verify: no `_ga*` cookies before consent (DevTools → Application → Cookies)
- [ ] Verify: Accept sets cookies; Reject/withdraw removes them
- [ ] Privacy Policy + Cookie Policy pages published and linked (banner + footer)
- [ ] "Cookie Preferences" withdrawal control in the footer
- [ ] India: Grievance Officer named; retention period stated
- [ ] Legal text reviewed for the jurisdiction
