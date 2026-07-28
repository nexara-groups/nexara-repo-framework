import type { ProgrammeDetail, PublishedProgramme } from "../domain/programme";
import type { PublishedProgrammeRepository } from "../domain/published-programme-repository";

/**
 * Initial adapter for verified public catalogue labels. It is intentionally
 * isolated here so replacing it with a CMS or database repository is wiring,
 * not a rewrite of presentation or use-case code.
 *
 * All figures in the `detail` blocks are INDICATIVE benchmark placeholders
 * (comparable Vizag/Hyderabad institutes, 2026) and must be replaced with
 * confirmed numbers before public launch. The programme page labels them.
 */
export class StaticPublishedProgrammeRepository implements PublishedProgrammeRepository {
  async listPublished(): Promise<readonly PublishedProgramme[]> {
    return PROGRAMMES;
  }

  async findPublishedBySlug(slug: string): Promise<PublishedProgramme | null> {
    return PROGRAMMES.find((programme) => programme.slug === slug) ?? null;
  }
}

const ASSISTANCE_TERMS =
  "Placement assistance — resume clinics, mock interviews, and referrals to our hiring " +
  "network. This is active support, not a job guarantee; the terms are shared in writing " +
  "before you enrol.";

const PROGRAMMES: readonly PublishedProgramme[] = [
  {
    slug: "cybersecurity",
    title: "Cybersecurity",
    category: "security",
    summary: "Security foundations and practical learning.",
    detail: {
      durationWeeks: 16,
      mode: "Classroom (Vizag) or live online",
      level: "Beginner to job-ready",
      feeFromInr: 45000,
      emiFromInr: 7500,
      nextBatch: "New batch forming — dates confirmed with an advisor",
      outcomeRoles: ["SOC Analyst", "Security Analyst", "VAPT Associate"],
      tools: ["Kali Linux", "Wireshark", "Splunk", "Burp Suite", "Nessus"],
      curriculum: [
        { title: "Security & network foundations", detail: "TCP/IP, OS hardening, and the threat landscape." },
        { title: "Offensive basics", detail: "Reconnaissance, scanning, and hands-on VAPT labs." },
        { title: "Blue team & SOC", detail: "SIEM, log analysis, and incident response with Splunk." },
        { title: "Applied project + interview prep", detail: "A real-scenario project, resume clinic, and mock interviews." },
      ],
      trainer: {
        name: "Lead security trainer (placeholder)",
        credential: "CEH / OSCP-track practitioner",
        experience: "Industry SOC & VAPT background",
      },
      placementTerms: ASSISTANCE_TERMS,
    },
  },
  {
    slug: "ai-machine-learning",
    title: "AI and Machine Learning",
    category: "software-data",
    summary: "Applied data and machine learning foundations.",
    detail: {
      durationWeeks: 20,
      mode: "Classroom (Vizag) or live online",
      level: "Foundations to applied",
      feeFromInr: 55000,
      emiFromInr: 9000,
      nextBatch: "New batch forming — dates confirmed with an advisor",
      outcomeRoles: ["Data Analyst", "ML Engineer (associate)", "AI Developer"],
      tools: ["Python", "pandas", "scikit-learn", "TensorFlow", "SQL"],
      curriculum: [
        { title: "Python & data handling", detail: "Programming, pandas, and data wrangling." },
        { title: "Statistics & ML foundations", detail: "Regression, classification, and model evaluation." },
        { title: "Deep learning basics", detail: "Neural networks and applied TensorFlow labs." },
        { title: "Capstone + interview prep", detail: "An end-to-end model project, resume clinic, and mock interviews." },
      ],
      trainer: {
        name: "Lead data/ML trainer (placeholder)",
        credential: "Applied ML practitioner",
        experience: "Production data-science background",
      },
      placementTerms: ASSISTANCE_TERMS,
    },
  },
  {
    slug: "networking",
    title: "Networking",
    category: "infrastructure",
    summary: "Network concepts, systems and operations.",
    detail: {
      durationWeeks: 12,
      mode: "Classroom (Vizag) or live online",
      level: "Beginner to job-ready",
      feeFromInr: 35000,
      emiFromInr: 6000,
      nextBatch: "New batch forming — dates confirmed with an advisor",
      outcomeRoles: ["Network Engineer", "NOC Engineer", "Network Support"],
      tools: ["Cisco IOS", "Packet Tracer", "Wireshark", "GNS3"],
      curriculum: [
        { title: "Networking fundamentals", detail: "OSI, TCP/IP, subnetting, and switching." },
        { title: "Routing & switching", detail: "CCNA-aligned routing, VLANs, and configuration labs." },
        { title: "Network operations", detail: "Monitoring, troubleshooting, and NOC workflows." },
        { title: "Lab project + interview prep", detail: "A build-and-troubleshoot lab, resume clinic, and mock interviews." },
      ],
      trainer: {
        name: "Lead networking trainer (placeholder)",
        credential: "CCNA-track practitioner",
        experience: "Enterprise network operations background",
      },
      placementTerms: ASSISTANCE_TERMS,
    },
  },
  {
    slug: "cloud",
    title: "Cloud",
    category: "infrastructure",
    summary: "Cloud and infrastructure learning paths.",
    detail: {
      durationWeeks: 14,
      mode: "Classroom (Vizag) or live online",
      level: "Beginner to job-ready",
      feeFromInr: 48000,
      emiFromInr: 8000,
      nextBatch: "New batch forming — dates confirmed with an advisor",
      outcomeRoles: ["Cloud Engineer (associate)", "DevOps Associate", "Cloud Support"],
      tools: ["AWS", "Azure", "Linux", "Docker", "Terraform"],
      curriculum: [
        { title: "Cloud foundations", detail: "Compute, storage, networking, and IAM on AWS/Azure." },
        { title: "Deployment & automation", detail: "Docker, CI/CD basics, and infrastructure as code." },
        { title: "Operations & security", detail: "Monitoring, cost, and cloud security basics." },
        { title: "Applied project + interview prep", detail: "A deploy-a-workload project, resume clinic, and mock interviews." },
      ],
      trainer: {
        name: "Lead cloud trainer (placeholder)",
        credential: "AWS/Azure-track practitioner",
        experience: "Cloud infrastructure background",
      },
      placementTerms: ASSISTANCE_TERMS,
    },
  },
  {
    slug: "software-development",
    title: "Software Development",
    category: "software-data",
    summary: "Software development foundations and practice.",
    detail: {
      durationWeeks: 20,
      mode: "Classroom (Vizag) or live online",
      level: "Beginner to job-ready",
      feeFromInr: 50000,
      emiFromInr: 8500,
      nextBatch: "New batch forming — dates confirmed with an advisor",
      outcomeRoles: ["Software Engineer (junior)", "Full-stack Developer", "QA Engineer"],
      tools: ["JavaScript", "React", "Node.js", "SQL", "Git"],
      curriculum: [
        { title: "Programming foundations", detail: "Logic, JavaScript, and version control with Git." },
        { title: "Frontend", detail: "React, components, and responsive interfaces." },
        { title: "Backend & databases", detail: "Node.js APIs and SQL data modelling." },
        { title: "Full-stack project + interview prep", detail: "A shipped app, resume clinic, and mock interviews." },
      ],
      trainer: {
        name: "Lead software trainer (placeholder)",
        credential: "Full-stack practitioner",
        experience: "Product engineering background",
      },
      placementTerms: ASSISTANCE_TERMS,
    },
  },
  {
    slug: "sap",
    title: "SAP",
    category: "enterprise",
    summary: "Enterprise systems learning paths.",
    detail: {
      durationWeeks: 16,
      mode: "Classroom (Vizag) or live online",
      level: "Foundations to applied",
      feeFromInr: 65000,
      emiFromInr: 11000,
      nextBatch: "New batch forming — dates confirmed with an advisor",
      outcomeRoles: ["SAP Associate Consultant", "SAP End User", "Functional Support"],
      tools: ["SAP S/4HANA", "SAP GUI", "Fiori"],
      curriculum: [
        { title: "Enterprise & SAP foundations", detail: "ERP concepts and navigation in S/4HANA." },
        { title: "Core module", detail: "Hands-on configuration and transactions in a chosen module." },
        { title: "Business process labs", detail: "End-to-end process scenarios and reporting." },
        { title: "Applied project + interview prep", detail: "A process case study, resume clinic, and mock interviews." },
      ],
      trainer: {
        name: "Lead SAP trainer (placeholder)",
        credential: "Certified SAP consultant-track",
        experience: "Enterprise implementation background",
      },
      placementTerms: ASSISTANCE_TERMS,
    },
  },
  {
    slug: "databases",
    title: "Databases",
    category: "software-data",
    summary: "Database concepts and practical skills.",
    detail: {
      durationWeeks: 12,
      mode: "Classroom (Vizag) or live online",
      level: "Beginner to job-ready",
      feeFromInr: 38000,
      emiFromInr: 6500,
      nextBatch: "New batch forming — dates confirmed with an advisor",
      outcomeRoles: ["Database Administrator (junior)", "Data Engineer (associate)", "SQL Developer"],
      tools: ["SQL", "Oracle", "PostgreSQL", "MongoDB"],
      curriculum: [
        { title: "SQL foundations", detail: "Queries, joins, and data modelling." },
        { title: "Administration", detail: "Backup, recovery, tuning, and security." },
        { title: "Modern data stores", detail: "NoSQL basics and when to use them." },
        { title: "Applied project + interview prep", detail: "A schema-and-query project, resume clinic, and mock interviews." },
      ],
      trainer: {
        name: "Lead database trainer (placeholder)",
        credential: "DBA practitioner",
        experience: "Production database operations background",
      },
      placementTerms: ASSISTANCE_TERMS,
    },
  },
  {
    slug: "storage",
    title: "Storage",
    category: "infrastructure",
    summary: "Storage systems and infrastructure learning.",
    detail: {
      durationWeeks: 12,
      mode: "Classroom (Vizag) or live online",
      level: "Beginner to job-ready",
      feeFromInr: 40000,
      emiFromInr: 7000,
      nextBatch: "New batch forming — dates confirmed with an advisor",
      outcomeRoles: ["Storage Engineer (junior)", "Backup Administrator", "Infrastructure Support"],
      tools: ["SAN", "NAS", "Backup tools", "Linux"],
      curriculum: [
        { title: "Storage foundations", detail: "Block, file, and object storage concepts." },
        { title: "SAN & NAS", detail: "Provisioning, zoning, and configuration labs." },
        { title: "Backup & recovery", detail: "Data protection, replication, and DR basics." },
        { title: "Applied project + interview prep", detail: "A storage-build lab, resume clinic, and mock interviews." },
      ],
      trainer: {
        name: "Lead storage trainer (placeholder)",
        credential: "Storage infrastructure practitioner",
        experience: "Data-centre operations background",
      },
      placementTerms: ASSISTANCE_TERMS,
    },
  },
];
