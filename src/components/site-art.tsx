import { DiagnosticsArt, OpdArt, PharmacyArt } from "@/components/brand-art";
import { EecpSessionScene } from "@/components/eecp-diagram";

export type SiteArtKind = "eecp" | "diagnostics" | "pharmacy" | "opd" | "community" | "environment";

function CommunityCareArt() {
  const nodes = [
    { x: 116, y: 142, delay: "0s" },
    { x: 442, y: 142, delay: ".7s" },
    { x: 94, y: 382, delay: "1.4s" },
    { x: 466, y: 382, delay: "2.1s" },
  ];

  return (
    <svg viewBox="0 0 560 560" role="img" aria-label="Animated illustration of Rise Medical Hub connected to four community screening groups">
      <circle className="sa-orbit sa-orbit-dash" cx="280" cy="280" r="218" />
      <circle className="sa-orbit" cx="280" cy="280" r="142" />
      <path className="sa-network" d="M116 142 L280 280 L442 142 M94 382 L280 280 L466 382" />
      <path className="sa-pulse" pathLength="1" d="M70 280 H192 l14 -15 16 15 h26 l17 -58 22 99 17 -41 H490" />
      <g className="sa-hub">
        <circle cx="280" cy="280" r="62" />
        <path d="M280 248v64M248 280h64" />
        <text x="280" y="366" textAnchor="middle">CARE, CLOSER</text>
      </g>
      {nodes.map((node, index) => (
        <g className="sa-person-node" key={`${node.x}-${node.y}`} style={{ animationDelay: node.delay }}>
          <circle className="sa-node-ring" cx={node.x} cy={node.y} r="31" />
          <circle className="sa-person" cx={node.x} cy={node.y - 7} r="8" />
          <path className="sa-person" d={`M${node.x - 15} ${node.y + 17} Q${node.x} ${node.y + 1} ${node.x + 15} ${node.y + 17} Z`} />
          <text x={node.x} y={node.y + 54} textAnchor="middle">GROUP {String(index + 1).padStart(2, "0")}</text>
        </g>
      ))}
    </svg>
  );
}

function CareEnvironmentArt() {
  return (
    <svg viewBox="0 0 560 560" role="img" aria-label="Animated architectural line-art of connected consultation, diagnostics, therapy, and pharmacy spaces at Rise Medical Hub">
      <circle className="sa-orbit sa-orbit-dash" cx="280" cy="280" r="224" />
      <g className="ce-plan">
        <rect x="88" y="108" width="384" height="344" rx="28" />
        <path d="M280 108V220 M280 340V452 M88 280H204 M356 280H472" />
        <rect x="128" y="146" width="114" height="92" rx="15" />
        <rect x="318" y="146" width="114" height="92" rx="15" />
        <rect x="128" y="322" width="114" height="92" rx="15" />
        <rect x="318" y="322" width="114" height="92" rx="15" />
      </g>
      <path className="ce-route" pathLength="1" d="M185 192 C250 192 226 280 280 280 C334 280 310 192 375 192 M280 280 C226 280 250 368 185 368 M280 280 C334 280 310 368 375 368" />
      <g className="ce-centre">
        <circle cx="280" cy="280" r="58" />
        <path d="M280 254v52M254 280h52" />
      </g>
      {[
        { x: 185, y: 192, label: "CONSULT" },
        { x: 375, y: 192, label: "DIAGNOSE" },
        { x: 185, y: 368, label: "TREAT" },
        { x: 375, y: 368, label: "SUPPORT" },
      ].map((room, index) => (
        <g className={`ce-room ce-room-${index + 1}`} key={room.label}>
          <circle cx={room.x} cy={room.y} r="9" />
          <text x={room.x} y={room.y + 35} textAnchor="middle">{room.label}</text>
        </g>
      ))}
    </svg>
  );
}

const artLabels: Record<SiteArtKind, string> = {
  eecp: "Monitored therapy",
  diagnostics: "Clear findings",
  pharmacy: "Medicine guidance",
  opd: "Time to talk",
  community: "Care, closer",
  environment: "Connected spaces",
};

export function SiteArt({ kind, label, compact = false }: { kind: SiteArtKind; label?: string; compact?: boolean }) {
  return (
    <div className={`site-art site-art-${kind}${compact ? " site-art-compact" : ""}`}>
      <span className="site-art-kicker" aria-hidden="true">RISE / {artLabels[kind]}</span>
      <div className="site-art-visual">
        {kind === "eecp" ? <EecpSessionScene /> : null}
        {kind === "diagnostics" ? <DiagnosticsArt /> : null}
        {kind === "pharmacy" ? <PharmacyArt /> : null}
        {kind === "opd" ? <OpdArt /> : null}
        {kind === "community" ? <CommunityCareArt /> : null}
        {kind === "environment" ? <CareEnvironmentArt /> : null}
      </div>
      <span className="site-art-caption" aria-hidden="true">{label ?? artLabels[kind]}</span>
    </div>
  );
}
