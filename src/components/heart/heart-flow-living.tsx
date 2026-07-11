"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { flowSteps } from "@/content/heart-guide";

// Chapter 01 — "How your heart works" in the Living Organ language: a luminous
// canvas heart that pulses and flows continuously (ambient life), while scrolling
// the four beats lights the journey — venous blood in, out to the lungs, back
// through the left heart, one beat out the aorta. Reduced-motion / narrow screens
// fall back to a calm static organ + a plain stepped read.

// ——— geometry, authored in a 300 x 340 design box (apex down) ———
const BOX = { w: 300, h: 340 };
const HEART_D =
  "M154 46 C 176 30 210 34 234 58 C 258 82 262 122 256 162 C 250 214 226 264 184 306 C 174 316 165 322 158 328 C 148 314 132 298 116 276 C 84 232 66 184 66 138 C 66 92 88 56 122 48 C 136 44 146 44 154 46 Z";
const VESSELS = [
  { c: "coral", w: 26, d: "M196 78 C 200 44 202 22 214 8 C 226 -6 250 -4 262 12" },
  { c: "venous", w: 24, d: "M150 76 C 146 42 140 20 128 8 C 118 -2 100 0 92 14" },
  { c: "venous", w: 19, d: "M112 84 C 104 50 98 26 84 12 C 74 2 58 4 52 18" },
] as const;
type Pt = [number, number];
type Cubic = [Pt, Pt, Pt, Pt];
type Flow = { c: "venous" | "coral"; pts: Cubic };
const FLOWS: Flow[] = [
  { c: "venous", pts: [[150, 300], [96, 244], [78, 150], [104, 58]] },
  { c: "coral", pts: [[152, 300], [210, 238], [224, 150], [196, 64]] },
];

const COL = {
  coral: [226, 106, 124], coralGlow: [255, 138, 156],
  venous: [111, 143, 201], venousGlow: [147, 180, 239],
  mint: [168, 212, 206],
};
const rgba = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const cubic = (p: Cubic, t: number): [number, number] => {
  const u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  const [p0, p1, p2, p3] = p;
  return [
    a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
    a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
  ];
};

type P = { f: number; t: number; sp: number; sz: number };

export function HeartFlowLiving() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef(0); // scroll progress 0..1

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const heartPath = new Path2D(HEART_D);
    const vessels = VESSELS.map((v) => ({ ...v, path: new Path2D(v.d) }));
    const particles: P[] = [];
    FLOWS.forEach((_, fi) => { for (let i = 0; i < 15; i++) particles.push({ f: fi, t: Math.random(), sp: 0.05 + Math.random() * 0.03, sz: 1.5 + Math.random() * 2.2 }); });

    let W = 0, H = 0, dpr = 1, scale = 1, ox = 0, oy = 0, raf = 0;
    const resize = () => {
      const r = canvas.parentElement!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(280, r.width); H = Math.max(280, r.height);
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scale = Math.min(W / BOX.w, H / BOX.h) * 0.82;
      ox = (W - BOX.w * scale) / 2; oy = (H - BOX.h * scale) / 2;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    const PERIOD = 0.9;
    const beatEnv = (ph: number) => {
      const s = (c: number, w: number) => Math.exp(-((ph - c) * (ph - c)) / (2 * w * w));
      return Math.min(1, s(0.04, 0.028) + s(0.2, 0.05) * 0.55);
    };
    const ecgY = (x: number) => {
      const g = (c: number, w: number, h: number) => h * Math.exp(-((x - c) * (x - c)) / (2 * w * w));
      return -(g(0.16, 0.03, 6) - g(0.3, 0.012, 7) + g(0.34, 0.014, 42) - g(0.38, 0.014, 12) + g(0.62, 0.05, 10));
    };
    let ecgScroll = 0;

    function draw(beat: number, stage: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      // which flow the current beat favours: 0-1 venous, 2-3 arterial
      const phase = stage * 4; // 0..4
      const venEmph = Math.max(0.25, 1 - Math.max(0, phase - 1.4) * 0.6);
      const artEmph = Math.max(0.25, Math.min(1, (phase - 1.2) * 0.7));
      const lungGlow = Math.max(0, 1 - Math.abs(phase - 1.6)) ; // brightest ~beat 2
      const surge = beat * (1 + (phase > 3 ? 1.1 : 0)); // extra kick on the "one beat out"

      ctx.save();
      ctx.translate(ox + BOX.w * scale * 0.52, oy + BOX.h * scale * 0.56);
      const s = scale * (1 + 0.04 * surge);
      ctx.scale(s, s);
      ctx.translate(-BOX.w * 0.52, -BOX.h * 0.56);

      // vessels
      vessels.forEach((v) => {
        const base = v.c === "coral" ? COL.coral : COL.venous;
        const glow = v.c === "coral" ? COL.coralGlow : COL.venousGlow;
        const emph = v.c === "coral" ? artEmph : venEmph;
        ctx.save();
        ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.strokeStyle = rgba(base, 0.45 + 0.2 * emph); ctx.lineWidth = v.w;
        ctx.shadowColor = rgba(glow, 0.5 * emph); ctx.shadowBlur = 14;
        ctx.stroke(v.path);
        ctx.shadowBlur = 0;
        ctx.strokeStyle = rgba(glow, 0.3 + 0.25 * emph); ctx.lineWidth = v.w * 0.42;
        ctx.stroke(v.path);
        ctx.restore();
      });

      // organ body: gradient + pulsing glow
      ctx.save();
      ctx.shadowColor = rgba(COL.coralGlow, 0.5); ctx.shadowBlur = 24 + 54 * surge;
      const grad = ctx.createLinearGradient(60, 120, 250, 220);
      grad.addColorStop(0, rgba([70, 96, 150], 0.9));
      grad.addColorStop(0.42, rgba([120, 80, 110], 0.92));
      grad.addColorStop(0.6, rgba([180, 74, 96], 0.95));
      grad.addColorStop(1, rgba([210, 92, 112], 0.96));
      ctx.fillStyle = grad; ctx.fill(heartPath);
      ctx.restore();

      // inner light + a "lungs" bloom at the top that brightens on beat 2
      ctx.save();
      ctx.clip(heartPath);
      const rg = ctx.createRadialGradient(150, 150, 10, 150, 180, 190);
      rg.addColorStop(0, rgba(COL.coralGlow, 0.28 + 0.28 * surge));
      rg.addColorStop(0.5, rgba(COL.coral, 0.05));
      rg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rg; ctx.fillRect(0, 0, BOX.w, BOX.h);
      if (lungGlow > 0.02) {
        const lg = ctx.createRadialGradient(150, 90, 4, 150, 90, 130);
        lg.addColorStop(0, rgba(COL.mint, 0.22 * lungGlow));
        lg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = lg; ctx.fillRect(0, 0, BOX.w, BOX.h);
      }
      const cool = ctx.createLinearGradient(50, 0, 170, 0);
      cool.addColorStop(0, rgba(COL.venousGlow, 0.14 * venEmph));
      cool.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = cool; ctx.fillRect(0, 0, BOX.w, BOX.h);
      ctx.restore();

      // rim light
      ctx.save();
      ctx.lineWidth = 1.4; ctx.strokeStyle = rgba(COL.coralGlow, 0.45);
      ctx.shadowColor = rgba(COL.coralGlow, 0.5); ctx.shadowBlur = 8; ctx.stroke(heartPath);
      ctx.restore();

      // flowing blood, clipped inside the organ
      ctx.save();
      ctx.clip(heartPath);
      ctx.globalCompositeOperation = "lighter";
      particles.forEach((p) => {
        const f = FLOWS[p.f];
        if (!f) return;
        const [x, y] = cubic(f.pts, p.t);
        const emph = f.c === "coral" ? artEmph : venEmph;
        const glow = f.c === "coral" ? COL.coralGlow : COL.venousGlow;
        const r = p.sz * (1 + 0.5 * surge) * (0.7 + 0.6 * emph) * 4;
        const pg = ctx.createRadialGradient(x, y, 0, x, y, r);
        pg.addColorStop(0, rgba(glow, 0.35 + 0.55 * emph));
        pg.addColorStop(1, rgba(glow, 0));
        ctx.fillStyle = pg;
        ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
      });
      ctx.restore();

      ctx.restore(); // heart transform

      // ECG along the base
      const baseY = H - Math.max(40, H * 0.08), amp = Math.min(1, scale / 1.1), win = Math.max(150, W * 0.34);
      ctx.save();
      ctx.translate(0, baseY);
      ctx.strokeStyle = rgba(COL.mint, 0.13); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.stroke();
      ctx.strokeStyle = rgba(COL.mint, 0.45); ctx.lineWidth = 2; ctx.lineJoin = "round"; ctx.lineCap = "round";
      ctx.shadowColor = rgba(COL.mint, 0.45); ctx.shadowBlur = 6;
      ctx.beginPath();
      for (let sx = 0; sx <= W; sx += 2) {
        const f = sx / win + ecgScroll, ff = f - Math.floor(f), y = ecgY(ff) * amp;
        if (sx === 0) ctx.moveTo(sx, y); else ctx.lineTo(sx, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    let startT: number | null = null;
    const loop = (ts: number) => {
      if (startT === null) startT = ts;
      const el = (ts - startT) / 1000;
      const ph = (el % PERIOD) / PERIOD;
      const beat = reduce ? 0.12 : beatEnv(ph);
      if (!reduce) {
        const stage = stageRef.current;
        const speed = 0.4 + 1.6 * beat + stage * 0.8;
        particles.forEach((p) => { p.t += p.sp * speed * 0.016; if (p.t > 1) p.t -= 1; });
        ecgScroll += 0.0018 + 0.02 * beat;
      }
      draw(beat, stageRef.current);
      raf = requestAnimationFrame(loop);
    };
    // Paint one frame synchronously so there's never a blank flash before rAF starts
    // (and so the figure is present even where rAF is throttled).
    draw(0.14, 0);
    if (!reduce) raf = requestAnimationFrame(loop);

    // ——— scroll: pin + scrub drives stageRef and the active step ———
    let st: ScrollTrigger | undefined;
    const steps = Array.from(root.querySelectorAll<HTMLElement>(".s-step"));
    const bar = root.querySelector<HTMLElement>(".s-bar");
    const setActive = (progress: number) => {
      const idx = Math.min(flowSteps.length - 1, Math.floor(progress * flowSteps.length + 0.001));
      steps.forEach((el, i) => el.classList.toggle("s-on", i === idx));
      if (bar) bar.style.transform = `scaleX(${Math.max(0.04, progress)})`;
    };

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      root.classList.add("is-live");
      setActive(0);
      st = ScrollTrigger.create({
        trigger: root.querySelector(".hc-live-stage") as HTMLElement,
        start: "top top", end: "+=360%", pin: true, scrub: 0.5, anticipatePin: 1,
        onUpdate: (self) => { stageRef.current = self.progress; setActive(self.progress); },
      });
      if (process.env.NODE_ENV !== "production") {
        (window as unknown as { __flowLive?: unknown }).__flowLive = {
          setStage: (p: number) => { stageRef.current = p; setActive(p); draw(0.14, p); },
          st,
        };
      }
      return () => { root.classList.remove("is-live"); st?.kill(); };
    });

    return () => { cancelAnimationFrame(raf); ro.disconnect(); mm.revert(); };
  }, []);

  return (
    <section className="hc-flow-live section-ink" id="how-it-works" ref={rootRef}>
      <div className="container scrolly-heading">
        <span className="eyebrow eyebrow-light">Chapter 01</span>
        <h2>How your heart works,<br /><em>one beat at a time.</em></h2>
        <p>Two pumps, four valves, one loop. Scroll slowly — you&rsquo;re watching a drop of blood make the round trip.</p>
      </div>
      <div className="hc-live-stage">
        <div className="hc-live-grid container">
          <div className="hc-live-art">
            <canvas ref={canvasRef} aria-label="A luminous, beating heart with venous blood flowing in and oxygen-rich blood flowing out." />
          </div>
          <div className="hc-live-copy">
            <div className="s-bar-track"><span className="s-bar" /></div>
            <div className="s-steps">
              {flowSteps.map((step, i) => (
                <div key={step.title} className={`s-step${i === 0 ? " s-on" : ""}`}>
                  <span className="chapter-number">{`0${i + 1} / 04`}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              ))}
            </div>
            <div className="scrolly-hint" aria-hidden="true">Keep scrolling <i /></div>
          </div>
        </div>
      </div>

      {/* Reduced-motion / narrow-screen fallback: plain stepped read */}
      <div className="hc-live-fallback container">
        {flowSteps.map((step, i) => (
          <div key={step.title} className="hc-live-fb-step">
            <span className="chapter-number">{`0${i + 1} / 04`}</span>
            <h3>{step.title}</h3>
            <p>{step.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
