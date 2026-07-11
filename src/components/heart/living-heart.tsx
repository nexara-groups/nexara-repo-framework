"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

// The Living Organ heart, shared by the hero (ambient) and the Chapter 01 flow
// section (scroll-driven). A luminous canvas organ that pulses and circulates
// blood — venous-blue in, arterial-coral out. Pass a `stageRef` (0..1) to drive
// the four-beat emphasis from scroll; omit it for ambient life.

// ——— geometry, authored in a 300 x 340 design box (apex down, asymmetric organ) ———
const BOX = { w: 300, h: 340 };
// A more anatomical silhouette than a valentine: broad domed base up top where the
// great vessels attach, the right heart bulging the viewer-left border, the left
// ventricle rounding the lower-right down to an apex offset left of centre.
const HEART_D =
  "M166 58 C 136 42 102 48 86 74 C 68 102 62 146 70 190 C 80 240 108 290 146 324 C 151 320 156 315 160 308 C 202 268 234 214 250 164 C 262 126 258 88 238 66 C 217 46 188 50 166 58 Z";

type Pt = [number, number];
type Cubic = [Pt, Pt, Pt, Pt];

const VESSELS: { c: "coral" | "venous"; w: number; d: string }[] = [
  // aorta (arterial) — over the left ventricle (viewer-right), arches away
  { c: "coral", w: 25, d: "M200 74 C 204 42 206 22 218 8 C 230 -6 252 -4 264 12" },
  // pulmonary trunk (venous) — over the right ventricle (viewer-left)
  { c: "venous", w: 23, d: "M154 72 C 150 40 144 18 132 6 C 122 -4 104 -2 96 12" },
  // vena cava (venous) — into the right atrium, viewer-left
  { c: "venous", w: 18, d: "M114 82 C 106 48 100 24 86 10 C 76 0 60 2 54 16" },
];
const FLOWS: { c: "venous" | "coral"; pts: Cubic }[] = [
  { c: "venous", pts: [[148, 300], [96, 246], [78, 156], [108, 60]] },
  { c: "coral", pts: [[154, 300], [212, 238], [226, 152], [200, 66]] },
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
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
};

type P = { f: number; t: number; sp: number; sz: number };

export function LivingHeart({
  stageRef,
  ecg = true,
  ambientStage = 0,
  ariaLabel = "A luminous, beating heart with venous blood flowing in and oxygen-rich blood flowing out.",
}: {
  stageRef?: MutableRefObject<number>;
  ecg?: boolean;
  ambientStage?: number;
  ariaLabel?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
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
    ro.observe(canvas.parentElement);

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
      const phase = stage * 4;
      const venEmph = Math.max(0.25, 1 - Math.max(0, phase - 1.4) * 0.6);
      const artEmph = Math.max(0.25, Math.min(1, (phase - 1.2) * 0.7));
      const lungGlow = Math.max(0, 1 - Math.abs(phase - 1.6));
      const surge = beat * (1 + (phase > 3 ? 1.1 : 0));

      ctx.save();
      ctx.translate(ox + BOX.w * scale * 0.52, oy + BOX.h * scale * 0.57);
      const s = scale * (1 + 0.04 * surge);
      ctx.scale(s, s);
      ctx.translate(-BOX.w * 0.52, -BOX.h * 0.57);

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

      ctx.save();
      ctx.shadowColor = rgba(COL.coralGlow, 0.5); ctx.shadowBlur = 24 + 54 * surge;
      const grad = ctx.createLinearGradient(64, 120, 250, 220);
      grad.addColorStop(0, rgba([70, 96, 150], 0.9));
      grad.addColorStop(0.42, rgba([120, 80, 110], 0.92));
      grad.addColorStop(0.6, rgba([180, 74, 96], 0.95));
      grad.addColorStop(1, rgba([210, 92, 112], 0.96));
      ctx.fillStyle = grad; ctx.fill(heartPath);
      ctx.restore();

      ctx.save();
      ctx.clip(heartPath);
      const rg = ctx.createRadialGradient(155, 170, 10, 155, 195, 195);
      rg.addColorStop(0, rgba(COL.coralGlow, 0.28 + 0.28 * surge));
      rg.addColorStop(0.5, rgba(COL.coral, 0.05));
      rg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rg; ctx.fillRect(0, 0, BOX.w, BOX.h);
      if (lungGlow > 0.02) {
        const lg = ctx.createRadialGradient(155, 96, 4, 155, 96, 130);
        lg.addColorStop(0, rgba(COL.mint, 0.22 * lungGlow));
        lg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = lg; ctx.fillRect(0, 0, BOX.w, BOX.h);
      }
      const cool = ctx.createLinearGradient(54, 0, 172, 0);
      cool.addColorStop(0, rgba(COL.venousGlow, 0.14 * venEmph));
      cool.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = cool; ctx.fillRect(0, 0, BOX.w, BOX.h);
      ctx.restore();

      ctx.save();
      ctx.lineWidth = 1.4; ctx.strokeStyle = rgba(COL.coralGlow, 0.45);
      ctx.shadowColor = rgba(COL.coralGlow, 0.5); ctx.shadowBlur = 8; ctx.stroke(heartPath);
      ctx.restore();

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

      ctx.restore();

      if (ecg) {
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
    }

    let startT: number | null = null;
    const loop = (ts: number) => {
      if (startT === null) startT = ts;
      const el = (ts - startT) / 1000;
      const ph = (el % PERIOD) / PERIOD;
      const beat = reduce ? 0.12 : beatEnv(ph);
      const stage = stageRef ? stageRef.current : ambientStage;
      if (!reduce) {
        const speed = 0.4 + 1.6 * beat + stage * 0.8;
        particles.forEach((p) => { p.t += p.sp * speed * 0.016; if (p.t > 1) p.t -= 1; });
        ecgScroll += 0.0018 + 0.02 * beat;
      }
      draw(beat, stage);
      raf = requestAnimationFrame(loop);
    };
    // Immediate synchronous paint so there's never a blank flash.
    draw(0.14, stageRef ? stageRef.current : ambientStage);
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [stageRef, ecg, ambientStage]);

  return <canvas ref={canvasRef} className="living-heart" aria-label={ariaLabel} />;
}
