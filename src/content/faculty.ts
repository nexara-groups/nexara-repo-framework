/**
 * Faculty bios. Names, years, and certification IDs are INDICATIVE placeholders
 * and must be replaced with real trainer records and verifiable cert numbers
 * before launch. Do not publish a certification claim without a name attached —
 * that was a live-site credibility failure.
 */

export interface FacultyMember {
  readonly name: string;
  readonly teaches: string;
  readonly credential: string;
  readonly didBefore: string;
  readonly tools: string;
  readonly quote: string;
  readonly indicative: boolean;
}

export const FACULTY: readonly FacultyMember[] = [
  {
    name: "Placeholder trainer name",
    teaches: "Cybersecurity — SOC Analyst and VAPT tracks",
    credential: "CEH, CompTIA Security+ (verify cert IDs before publishing)",
    didBefore:
      "8 years in a security operations centre — handled live phishing and ransomware incidents for mid-size firms.",
    tools: "Wireshark, Splunk, Burp Suite, Kali, Nmap",
    quote: "I teach the alert you'll actually see at 2 a.m., not the textbook version.",
    indicative: true,
  },
  {
    name: "Placeholder trainer name",
    teaches: "Cloud — AWS and Azure, fundamentals to associate",
    credential: "AWS Solutions Architect – Associate, Azure Administrator (verify IDs)",
    didBefore: "Ran cloud migrations for production workloads.",
    tools: "AWS console, Terraform, Linux CLI, Docker",
    quote: "We build in a real account, break it, and fix it. Slides don't get you hired.",
    indicative: true,
  },
  {
    name: "Placeholder trainer name",
    teaches: "SAP — core module implementation and support",
    credential: "SAP certified consultant (module and year to confirm)",
    didBefore: "Years on live SAP implementations and support.",
    tools: "SAP S/4HANA, SAP GUI, Fiori",
    quote: "You'll work on the same screens the client's finance team uses.",
    indicative: true,
  },
];
