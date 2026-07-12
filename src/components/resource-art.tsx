const topicShapes: Record<string, { path: string; label: string }> = {
  "Heart health": { path: "M280 205c-36-64-124-39-124 36 0 58 63 96 124 145 61-49 124-87 124-145 0-75-88-100-124-36Z", label: "Heart signal" },
  Prevention: { path: "M280 142 402 190v92c0 82-50 139-122 172-72-33-122-90-122-172v-92Z", label: "Prevention shield" },
  Diabetes: { path: "M280 130c-42 73-105 142-105 211 0 58 47 105 105 105s105-47 105-105c0-69-63-138-105-211Z", label: "Blood sugar marker" },
  Lifestyle: { path: "M160 378c52-6 75-47 102-98 27-52 64-96 138-98M178 416c75-3 119-35 151-92 22-39 48-68 88-78", label: "Movement paths" },
};

export function ResourceSignalArt({ tag = "Heart health", compact = false }: { tag?: string; compact?: boolean }) {
  const topic = topicShapes[tag] ?? topicShapes["Heart health"]!;
  return (
    <svg className={`resource-signal-art${compact ? " resource-signal-art-compact" : ""}`} viewBox="0 0 560 560" role="img" aria-label={`Animated medical illustration: ${topic.label}`}>
      <circle className="rsa-orbit rsa-orbit-a" cx="280" cy="280" r="205" />
      <circle className="rsa-orbit rsa-orbit-b" cx="280" cy="280" r="154" />
      <path className="rsa-axis" d="M75 280h410M280 75v410" />
      <path className={`rsa-topic${tag === "Lifestyle" ? " rsa-topic-line" : ""}`} d={topic.path} />
      <path className="rsa-signal" pathLength="1" d="M58 282h122l13-17 15 17h30l16-48 21 82 17-34h210" />
      {[0, 1, 2, 3].map((index) => <circle className={`rsa-node rsa-node-${index + 1}`} cx={[280, 432, 280, 128][index]} cy={[75, 280, 485, 280][index]} r="6" key={index} />)}
      <g className="rsa-centre"><circle cx="280" cy="280" r="34" /><path d="M280 262v36M262 280h36" /></g>
    </svg>
  );
}
