import { HeartFigure } from "@/components/heart/heart-figure";

// Temporary scratch stub — replaced by the real /heart-care page in the next task.
export default function HeartCareScratch() {
  return (
    <main>
      <div
        style={{
          background: "var(--navy)",
          display: "grid",
          placeItems: "center",
          padding: 40,
        }}
      >
        <div style={{ width: "min(620px, 92%)" }}>
          <HeartFigure />
        </div>
      </div>
      <div
        style={{
          background: "var(--paper)",
          display: "grid",
          placeItems: "center",
          padding: 40,
        }}
      >
        <div style={{ width: "min(620px, 92%)" }}>
          <HeartFigure />
        </div>
      </div>
    </main>
  );
}
