import { ImageResponse } from "next/og";

export const alt = "Rise Medical Hub — Care, considered.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#10203d",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            width: 96,
            height: 96,
            borderRadius: "50%",
            border: "5px solid #dc5f72",
            marginBottom: 36,
          }}
        >
          <div style={{ display: "flex", position: "absolute", top: 26, left: 41, width: 14, height: 44, backgroundColor: "#dc5f72", borderRadius: 3 }} />
          <div style={{ display: "flex", position: "absolute", top: 41, left: 26, width: 44, height: 14, backgroundColor: "#dc5f72", borderRadius: 3 }} />
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 108,
            fontWeight: 700,
            letterSpacing: 6,
            color: "#dcefeb",
            lineHeight: 1,
          }}
        >
          RISE
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 14,
            color: "#dcefeb",
            marginTop: 14,
          }}
        >
          MEDICAL HUB
        </div>

        <div
          style={{
            display: "flex",
            width: 420,
            height: 3,
            backgroundColor: "#dc5f72",
            marginTop: 44,
            marginBottom: 30,
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#f5f7f5",
            letterSpacing: 1,
            fontStyle: "italic",
          }}
        >
          Care, considered.
        </div>
      </div>
    ),
    { ...size }
  );
}
