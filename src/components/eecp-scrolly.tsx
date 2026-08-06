"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HashlessSectionLink } from "@/components/hashless-section-link";

const steps = [
  {
    phase: "Trigger",
    chip: "Standby · reading ECG",
    title: "Your ECG decides when everything happens.",
    copy: "Three cuff pairs are wrapped around both legs—calves, lower thighs, then upper thighs and buttocks. ECG electrodes on your chest feed the console, which finds the R wave of every beat and works out where systole ends and diastole begins. A finger sensor reads the pressure wave the treatment produces.",
    factLabel: "Timing source",
    factValue: "Chest ECG · R wave",
  },
  {
    phase: "Systole",
    chip: "Systole · cuffs open",
    title: "While the heart contracts, the cuffs stay open.",
    copy: "During systole the heart ejects into the aorta, and the squeezed heart muscle briefly closes off its own coronary vessels. Nothing is inflated at this moment—pressure now would only make the heart push harder.",
    factLabel: "Cuff state",
    factValue: "Fully deflated",
  },
  {
    phase: "Inflate",
    chip: "Diastole · cuffs inflate",
    title: "The heart relaxes, and pressure runs up the legs.",
    copy: "At aortic valve closure—the dicrotic notch—the calf pair pressurises first, then the lower thighs, then the upper thighs and buttocks, roughly fifty milliseconds apart. Squeezing bottom-upward drives blood in the legs back toward a heart that is now relaxed and filling.",
    factLabel: "Inflation order",
    factValue: "Calf → thigh → upper · ~50 ms apart",
  },
  {
    phase: "Augment",
    chip: "Diastole · augmented flow",
    title: "A second pressure peak appears during diastole.",
    copy: "That returning wave lifts aortic pressure at the exact moment the coronary arteries fill, and more blood arrives back at the heart for the next beat. On the pressure trace it shows as a diastolic peak that can rise above the systolic one—the team tunes timing by watching that D/S ratio.",
    factLabel: "Diastolic augmentation",
    factValue: "D/S ratio target ≥ 1.0",
  },
  {
    phase: "Release",
    chip: "Pre-systole · cuffs release",
    title: "All cuffs drop together, just before the next beat.",
    copy: "Deflation is simultaneous and fast, timed ahead of the next R wave. The leg vessels empty, resistance falls, and the next contraction meets less afterload. The ECG itself is unchanged—it is the input, not the result. What changes is the pressure the heart works against.",
    factLabel: "Deflation",
    factValue: "All cuffs · before the R wave",
  },
  {
    phase: "Repeat",
    chip: "Synced · next beat",
    title: "Every beat is re-timed, for about an hour.",
    copy: "The console re-reads the ECG beat after beat and shifts inflation and deflation as your rhythm changes. A commonly used course is 35 sessions of about an hour, with rhythm, blood pressure, symptoms, and cuff comfort checked throughout.",
    factLabel: "Cycle control",
    factValue: "Re-timed every beat",
  },
];

/* ── Monitor geometry (viewBox 0 0 900 280) ─────────────────────────────
   One beat = 390 units. Landmarks inside a beat, measured from its start:
   R wave +105 · end of T (aortic valve closure) +215.                  */
const BEAT = 390;
const B1 = 70;
const B2 = B1 + BEAT;
const R1 = B1 + 105;
const T1 = B1 + 215;
const R2 = B2 + 105;
const T2 = B2 + 215;
const DEFLATE_X = R2 - 10;
const TRACE_START = 60;
const TRACE_END = 884;

const ecgBeat = (x: number) =>
  `H${x + 42} Q${x + 56} 80 ${x + 70} 96 H${x + 92} L${x + 97} 106 L${x + 105} 28 L${x + 114} 118 L${x + 124} 96 H${x + 158} Q${x + 186} 68 ${x + 215} 96 H${x + BEAT}`;

const ECG_D = `M${B1} 96 ${ecgBeat(B1)} ${ecgBeat(B2)} H${TRACE_END - 6}`;

/* Untreated arterial pressure: one systolic peak per beat, dicrotic notch,
   then a slow runoff. Drawn dashed as the reference the treated wave beats. */
const PRESS_GHOST_D =
  "M70 248 C110 252 150 256 175 256 C182 226 192 182 206 172 C224 164 256 198 285 218 C340 232 410 246 480 252 C510 254 532 255 555 256 C568 226 582 182 596 172 C614 164 646 198 675 218 C730 232 800 246 870 252";

/* Counterpulsed wave: same systole, then the augmented diastolic peak from
   cuff inflation, a pre-systolic dip at deflation, and a lower next systole. */
const PRESS_LIVE_D =
  "M70 252 C110 255 150 256 175 256 C182 226 192 182 206 172 C224 164 256 196 285 218 C302 188 316 154 335 150 C378 148 430 200 480 234 C510 252 532 264 555 270 C568 252 582 198 596 190 C614 182 646 198 675 220 C692 190 706 154 725 150 C768 148 820 200 870 234";

const SWEEP = [TRACE_START, R1, T1, 340, 480, 600, TRACE_END];

const bands = [
  { key: "sys-0", kind: "sys", x: R1, width: T1 - R1, label: "Systole" },
  { key: "dia-0", kind: "dia", x: T1, width: R2 - T1, label: "Diastole · coronary filling" },
  { key: "sys-1", kind: "sys", x: R2, width: T2 - R2, label: "Systole" },
  { key: "dia-1", kind: "dia", x: T2, width: TRACE_END - T2, label: "Diastole" },
];

const markers = [
  { key: "inflate-0", x: T1, label: "Inflate" },
  { key: "release-0", x: DEFLATE_X, label: "Release" },
  { key: "inflate-1", x: T2, label: "Inflate" },
];

const vitals = [
  { key: "hr", label: "Heart rate", value: "72", unit: "bpm" },
  { key: "cuff", label: "Cuff pressure", value: "260", unit: "mmHg" },
  { key: "aug", label: "Diastolic peak", value: "158", unit: "mmHg" },
  { key: "ds", label: "D / S ratio", value: "1.22", unit: "" },
  { key: "sys", label: "Systolic peak", value: "122", unit: "mmHg" },
];

/* Scene geometry (viewBox 0 0 900 360). The torso runs at 33° from the head to
   the hip at (312,236); the leg continues at 7.8° out to the ankle at (662,287).
   Cuff sets sit on that leg axis, numbered in inflation order. */
const TORSO_ANGLE = 33;
const LEG_ANGLE = 7.8;

/* The heart is placed on the torso's own axis rather than by eye: roughly 28%
   of the way down from the shoulder end and a little toward the front of the
   chest, which lands it under the electrodes instead of over the abdomen. */
const HEART = { x: 198, y: 150 };

const cuffSets = [
  { badge: "1", name: "Calf", cx: 574, cy: 274, width: 62, height: 78, nub: { x: 588, y: 228 } },
  { badge: "2", name: "Lower thigh", cx: 476, cy: 261, width: 70, height: 82, nub: { x: 492, y: 213 } },
  { badge: "3", name: "Upper thigh", cx: 378, cy: 247, width: 76, height: 86, nub: { x: 396, y: 197 } },
];

/* Air lines leave one manifold on the console and lie along the leg, dipping
   behind the cuffs they do not serve, so nothing floats over open floor. */
const hosePaths = [
  "M694 226C668 240 634 248 608 244",
  "M694 216C656 228 610 246 566 246 530 246 510 234 498 222",
  "M694 206C652 218 600 238 540 234 480 230 430 212 402 204",
];

const cuffKey = [
  { badge: "1", name: "Calf", x: 40 },
  { badge: "2", name: "Lower thigh", x: 132 },
  { badge: "3", name: "Upper thigh & buttock", x: 268 },
];

/* The far leg sits slightly up-picture from the near one, so a side view still
   reads as a pair of cuffs on both legs rather than one. */
const FAR_LEG = { dx: 2, dy: -16 };

/* Electrodes ring the heart on the chest wall; every lead runs down the body
   to a clip at the waist, and one cable leaves from there. */
const electrodes = [
  { cx: 184, cy: 124, lead: "M184 124C208 140 234 176 258 206" },
  { cx: 165, cy: 157, lead: "M165 157C192 170 228 188 254 208" },
  { cx: 240, cy: 185, lead: "M240 185C248 192 253 199 257 206" },
];

/* Waist clip → down past the hip → along the floor → console inlet. */
const PATIENT_CABLE_D =
  "M262 214C272 240 276 268 288 296 298 320 314 336 342 342 420 354 540 352 640 344 668 342 682 334 688 316";

/* Mini trace on the console's own screen: two beats, drawn small. */
const SCREEN_TRACE_D =
  "M722 186H734Q738 179 742 186H747L750 191L754 170L758 197L762 186H774Q780 178 786 186H796Q800 179 804 186H809L812 191L816 170L820 197L824 186H854";
const SCREEN_START = 722;
const SCREEN_END = 854;

export function EecpScrolly() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const root = rootRef.current;
        if (!root) return;

        root.classList.add("is-scrolly");
        const isMobile = window.matchMedia("(max-width: 899px)").matches;
        const q = gsap.utils.selector(root);
        const flowLine = q<SVGPathElement>(".pulse-flow-line")[0];

        /* Counters are driven through fromTo with immediateRender off: GSAP
           otherwise caches a tween's start value on first render, so jumping the
           timeline (anchor link, resize refresh, reload mid-page) could strand a
           readout on a stale number while the artwork showed the right state. */
        const readout = (key: string, from: number, decimals = 0) => {
          /* A value can be mirrored in more than one place — D/S shows both in
             the vitals strip and on the console's own screen — so write every
             match, not just the first. */
          const els = q<HTMLElement | SVGTextElement>(`.pulse-v-${key}`);
          const state = { v: from };
          const render = () => {
            const text = state.v.toFixed(decimals);
            els.forEach((el) => { el.textContent = text; });
          };
          render();
          const to = (fromValue: number, toValue: number, at: string, duration: number) =>
            tl.fromTo(state, { v: fromValue }, {
              v: toValue,
              duration,
              ease: "none",
              immediateRender: false,
              onUpdate: render,
            }, at);
          return { state, render, to };
        };

        const vCuff = readout("cuff", 0);
        const vAug = readout("aug", 0);
        const vDs = readout("ds", 0, 2);
        const vSys = readout("sys", 130);

        gsap.set(q(".pulse-reveal-rect"), { attr: { width: 0 } });
        gsap.set(q(".pulse-cursor"), { x: TRACE_START, autoAlpha: 1 });
        /* The screen cursor is authored at the screen's left edge and translated
           from there, so it still reads correctly with motion turned off. */
        gsap.set(q(".pulse-screen-cursor"), { x: 0, autoAlpha: 1 });
        gsap.set(q(".pulse-screen-trace"), { opacity: 0.35 });
        gsap.set(q(".pulse-band"), { opacity: 0 });
        gsap.set(q(".pulse-band-label"), { opacity: 0 });
        gsap.set(q(".pulse-marker"), { opacity: 0 });
        gsap.set(q(".pulse-level, .pulse-ds-note, .pulse-peak-note, .pulse-ecg-note"), { opacity: 0 });
        gsap.set(q(".pulse-cuff-pressure, .pulse-cuff-ring"), { opacity: 0 });
        gsap.set(q(".pulse-cuff-ring"), { scale: 1 });
        gsap.set(q(".pulse-gauge-fill"), { scaleX: 0 });
        gsap.set(q(".pulse-machine-port"), { opacity: 0.28 });
        gsap.set(q(".pulse-machine-hose"), { opacity: 0.55, stroke: "#41638e" });
        gsap.set(q(".pulse-flow-line, .pulse-flow-particle, .pulse-eject-line, .pulse-release-wave"), { opacity: 0 });
        gsap.set(q(".pulse-coronary"), { opacity: 0.16 });
        gsap.set(q(".pulse-release-wave"), { attr: { r: 16 } });
        gsap.set(q(".pulse-beat-target"), { transformOrigin: "center center" });
        gsap.set(q(".pulse-step"), { autoAlpha: 0, y: 28 });
        gsap.set(q(".pulse-step-0"), { autoAlpha: 1, y: 0 });
        gsap.set(q(".pulse-phase"), { autoAlpha: 0, y: 8 });
        gsap.set(q(".pulse-phase-0"), { autoAlpha: 1, y: 0 });
        gsap.set(q(".pulse-progress"), { scaleX: 0, transformOrigin: "left center" });
        gsap.set(q(".pulse-index"), { opacity: 0.3 });
        gsap.set(q(".pulse-index-0"), { opacity: 1 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: q(".scrolly-stage")[0],
            start: isMobile ? "top 74px" : "top 86px",
            end: isMobile ? "+=560%" : "+=520%",
            pin: true,
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        /* Sweep the reveal clip and the cursor together so the traces, the
           cuff sequence and the numbers all read off one clock. */
        const sweepTo = (index: number, at: string, duration: number) => {
          const x = SWEEP[index] ?? TRACE_END;
          const progress = (x - TRACE_START) / (TRACE_END - TRACE_START);
          tl.to(q(".pulse-reveal-rect"), {
            attr: { width: x - TRACE_START },
            duration,
            ease: "none",
          }, at)
            .to(q(".pulse-cursor"), { x, duration, ease: "none" }, at)
            .to(q(".pulse-screen-cursor"), {
              x: progress * (SCREEN_END - SCREEN_START),
              duration,
              ease: "none",
            }, at);
        };

        const changeStep = (from: number, to: number, at: string) => {
          const copyEnter = `${at}+=0.18`;
          const phaseEnter = `${at}+=0.12`;
          tl.to(q(`.pulse-step-${from}`), { autoAlpha: 0, y: -14, duration: 0.18 }, at)
            .fromTo(q(`.pulse-step-${to}`), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.22 }, copyEnter)
            .to(q(`.pulse-phase-${from}`), { autoAlpha: 0, y: -5, duration: 0.12 }, at)
            .fromTo(q(`.pulse-phase-${to}`), { autoAlpha: 0, y: 5 }, { autoAlpha: 1, y: 0, duration: 0.16 }, phaseEnter)
            .to(q(`.pulse-index-${from}`), { opacity: 0.3, duration: 0.2 }, at)
            .to(q(`.pulse-index-${to}`), { opacity: 1, duration: 0.2 }, phaseEnter);
        };

        const progressTo = (value: number, at: string, duration = 1) =>
          tl.to(q(".pulse-progress"), { scaleX: value, duration }, at);

        /* 01 — Trigger: the ECG arrives before anything moves. */
        tl.addLabel("trigger");
        tl.to(q(".pulse-monitor-glow"), { opacity: 0.7, duration: 0.3 }, "trigger");
        tl.to(q(".pulse-screen-trace"), { opacity: 0.95, duration: 0.3 }, "trigger");
        sweepTo(1, "trigger", 1);
        progressTo(1 / 6, "trigger", 1);
        tl.to({}, { duration: 0.3 });

        /* 02 — Systole: heart ejects, coronaries squeezed, cuffs open. */
        tl.addLabel("systole");
        changeStep(0, 1, "systole");
        tl
          .to(q(".pulse-band-sys-0"), { opacity: 1, duration: 0.25 }, "systole")
          .to(q(".pulse-band-label-sys-0"), { opacity: 1, duration: 0.25 }, "systole+=0.05")
          .to(q(".pulse-beat-target"), { scale: 0.94, duration: 0.14, ease: "power3.out" }, "systole+=0.1")
          .to(q(".pulse-beat-target"), { scale: 1, duration: 0.3, ease: "power2.out" }, "systole+=0.24")
          .to(q(".pulse-eject-line"), { opacity: 1, duration: 0.2 }, "systole+=0.14")
          .to(q(".pulse-coronary"), { opacity: 0.16, duration: 0.2 }, "systole+=0.14")
          .to(q(".pulse-level-s, .pulse-peak-note-s"), { opacity: 1, duration: 0.25 }, "systole+=0.6");
        sweepTo(2, "systole", 1);
        progressTo(2 / 6, "systole", 1);
        tl.to({}, { duration: 0.3 });

        /* 03 — Inflation: distal to proximal, at aortic valve closure. */
        tl.addLabel("inflate");
        changeStep(1, 2, "inflate");
        tl
          .to(q(".pulse-band-sys-0"), { opacity: 0.35, duration: 0.2 }, "inflate")
          .to(q(".pulse-band-label-sys-0"), { opacity: 0.45, duration: 0.2 }, "inflate")
          .to(q(".pulse-band-dia-0"), { opacity: 1, duration: 0.25 }, "inflate")
          .to(q(".pulse-band-label-dia-0"), { opacity: 1, duration: 0.25 }, "inflate+=0.05")
          .to(q(".pulse-eject-line"), { opacity: 0, duration: 0.18 }, "inflate")
          .to(q(".pulse-marker-inflate-0"), { opacity: 1, duration: 0.2 }, "inflate+=0.1");

        [0, 1, 2].forEach((i) => {
          const at = `inflate+=${0.16 + i * 0.16}`;
          tl
            .to(q(`.pulse-cuff-${i} .pulse-cuff-pressure`), { opacity: 1, duration: 0.24 }, at)
            .fromTo(q(`.pulse-cuff-${i} .pulse-cuff-ring`), { opacity: 0.85, scale: 1 }, { opacity: 0, scale: 1.34, duration: 0.42, ease: "power2.out" }, at)
            .to(q(`.pulse-hose-${i}`), { opacity: 1, stroke: "#75c3b7", duration: 0.24 }, at)
            .to(q(`.pulse-port-${i}`), { opacity: 1, duration: 0.2 }, at)
            .to(q(`.pulse-gauge-${i}`), { scaleX: 1, duration: 0.3 }, at);
        });

        vCuff.to(0, 260, "inflate+=0.16", 0.6);
        tl
          .to(q(".pulse-flow-line"), { opacity: 0.92, duration: 0.3 }, "inflate+=0.3")
          .to(q(".pulse-flow-particle"), { opacity: 1, duration: 0.12, stagger: 0.07 }, "inflate+=0.34")
          .to(q(".pulse-flow-particle"), {
            motionPath: { path: flowLine, align: flowLine, alignOrigin: [0.5, 0.5] },
            duration: 1.05,
            stagger: 0.14,
            ease: "power1.in",
          }, "inflate+=0.36");
        sweepTo(3, "inflate", 1.1);
        progressTo(3 / 6, "inflate", 1.1);
        tl.to({}, { duration: 0.3 });

        /* 04 — Augmentation: the second pressure peak, coronaries perfusing. */
        tl.addLabel("augment");
        changeStep(2, 3, "augment");
        tl
          .to(q(".pulse-flow-particle"), { opacity: 0, duration: 0.18, stagger: 0.05 }, "augment")
          .to(q(".pulse-coronary"), { opacity: 1, duration: 0.5 }, "augment+=0.1")
          .to(q(".pulse-chest-halo"), { opacity: 1, duration: 0.4 }, "augment+=0.1")
          .to(q(".pulse-level-d, .pulse-peak-note-d"), { opacity: 1, duration: 0.28 }, "augment+=0.34")
          .to(q(".pulse-ds-note"), { opacity: 1, duration: 0.28 }, "augment+=0.5");
        vAug.to(0, 158, "augment+=0.2", 0.7);
        vDs.to(0, 1.22, "augment+=0.2", 0.7);
        sweepTo(4, "augment", 1.1);
        progressTo(4 / 6, "augment", 1.1);
        tl.to({}, { duration: 0.34 });

        /* 05 — Release: every cuff at once, before the next R wave. */
        tl.addLabel("release");
        changeStep(3, 4, "release");
        tl
          .to(q(".pulse-marker-release-0"), { opacity: 1, duration: 0.2 }, "release+=0.16")
          .to(q(".pulse-cuff-pressure"), { opacity: 0, duration: 0.16, ease: "power3.out" }, "release+=0.3")
          .to(q(".pulse-gauge-fill"), { scaleX: 0, duration: 0.16, ease: "power3.out" }, "release+=0.3")
          .to(q(".pulse-machine-port"), { opacity: 0.28, duration: 0.16 }, "release+=0.3")
          .to(q(".pulse-machine-hose"), { opacity: 0.55, stroke: "#41638e", duration: 0.2, ease: "power3.out" }, "release+=0.3")
          .to(q(".pulse-flow-line"), { opacity: 0, duration: 0.2, ease: "power3.out" }, "release+=0.3")
          .fromTo(q(".pulse-release-wave"), { opacity: 0.75, attr: { r: 16 } }, { opacity: 0, attr: { r: 40 }, duration: 0.55, ease: "power1.out" }, "release+=0.34")
          .to(q(".pulse-coronary"), { opacity: 0.16, duration: 0.3 }, "release+=0.34")
          .to(q(".pulse-beat-target"), { scale: 0.96, duration: 0.14, ease: "power3.out" }, "release+=0.72")
          .to(q(".pulse-beat-target"), { scale: 1, duration: 0.3, ease: "power2.out" }, "release+=0.86")
          .to(q(".pulse-peak-note-unload"), { opacity: 1, duration: 0.3 }, "release+=0.86")
          .to(q(".pulse-ecg-note"), { opacity: 1, duration: 0.3 }, "release+=0.5")
          /* Beat one has made its point; dim it so the release callout reads alone. */
          .to(q(".pulse-level, .pulse-peak-note-s, .pulse-peak-note-d, .pulse-ds-note"), { opacity: 0.3, duration: 0.3 }, "release+=0.6")
          .to(q(".pulse-marker-inflate-0"), { opacity: 0.35, duration: 0.3 }, "release+=0.6");
        vCuff.to(260, 0, "release+=0.3", 0.24);
        vSys.to(130, 122, "release+=0.72", 0.5);
        sweepTo(5, "release", 1.1);
        progressTo(5 / 6, "release", 1.1);
        tl.to({}, { duration: 0.34 });

        /* 06 — Repeat: the console re-times itself on the next beat. */
        tl.addLabel("repeat");
        changeStep(4, 5, "repeat");
        tl
          .to(q(".pulse-band-sys-0, .pulse-band-dia-0"), { opacity: 0.3, duration: 0.3 }, "repeat")
          .to(q(".pulse-band-label-sys-0, .pulse-band-label-dia-0"), { opacity: 0.4, duration: 0.3 }, "repeat")
          .to(q(".pulse-band-sys-1"), { opacity: 1, duration: 0.25 }, "repeat+=0.05")
          .to(q(".pulse-band-label-sys-1"), { opacity: 1, duration: 0.25 }, "repeat+=0.1")
          .to(q(".pulse-band-sys-1"), { opacity: 0.35, duration: 0.25 }, "repeat+=0.5")
          .to(q(".pulse-band-dia-1"), { opacity: 1, duration: 0.25 }, "repeat+=0.5")
          .to(q(".pulse-band-label-dia-1"), { opacity: 1, duration: 0.25 }, "repeat+=0.55")
          .to(q(".pulse-marker-inflate-1"), { opacity: 1, duration: 0.2 }, "repeat+=0.55")
          .to(q(".pulse-marker-release-0, .pulse-peak-note-unload, .pulse-ecg-note"), { opacity: 0.35, duration: 0.3 }, "repeat+=0.4");

        [0, 1, 2].forEach((i) => {
          const at = `repeat+=${0.6 + i * 0.12}`;
          tl
            .to(q(`.pulse-cuff-${i} .pulse-cuff-pressure`), { opacity: 1, duration: 0.2 }, at)
            .to(q(`.pulse-hose-${i}`), { opacity: 1, stroke: "#75c3b7", duration: 0.2 }, at)
            .to(q(`.pulse-port-${i}`), { opacity: 1, duration: 0.16 }, at)
            .to(q(`.pulse-gauge-${i}`), { scaleX: 1, duration: 0.24 }, at);
        });

        vCuff.to(0, 260, "repeat+=0.6", 0.4);
        tl.to(q(".pulse-coronary"), { opacity: 1, duration: 0.4 }, "repeat+=0.72");
        sweepTo(6, "repeat", 1.2);
        progressTo(1, "repeat", 1.2);
        tl.to({}, { duration: 0.5 });

        if (process.env.NODE_ENV !== "production") {
          (window as unknown as { __eecpTl?: gsap.core.Timeline }).__eecpTl = tl;
        }

        return () => root.classList.remove("is-scrolly");
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="eecp-scrolly" id="how-it-works" ref={rootRef}>
      <div className="container scrolly-heading">
        <span className="eyebrow eyebrow-light">Inside one EECP heartbeat</span>
        <h2>Your heartbeat leads.<br /><em>The cuffs follow.</em></h2>
        <p>Scroll through a single treated beat. The ECG sets the timing, the cuffs pressurise from the calves upward once the heart relaxes, and every cuff releases together just before the next contraction.</p>
        <div className="scrolly-intro-key" aria-label="The sequence repeats continuously during treatment">
          <span><b>01</b> Trigger</span><i aria-hidden="true" /><span><b>02</b> Systole</span><i aria-hidden="true" /><span><b>03</b> Inflate</span><i aria-hidden="true" /><span><b>04</b> Augment</span><i aria-hidden="true" /><span><b>05</b> Release</span><i aria-hidden="true" /><span><b>06</b> Repeat</span>
        </div>
        <HashlessSectionLink className="scrolly-skip" targetId="treatment">Skip the animation · treatment details <b aria-hidden="true">↓</b></HashlessSectionLink>
      </div>

      <div className="scrolly-stage">
        <div className="scrolly-grid">
          <figure className="scrolly-art pulse-visual">
            <header className="pulse-visual-head">
              <span><i aria-hidden="true" /> EECP console / one treatment beat</span>
              <span className="pulse-phase-stack" aria-hidden="true">
                {steps.map((step, index) => <b key={step.phase} className={`pulse-phase pulse-phase-${index}`}>{step.chip}</b>)}
              </span>
            </header>

            <div className="pulse-monitor">
              <svg className="pulse-trace" viewBox="0 0 900 280" preserveAspectRatio="xMidYMid meet" role="img" focusable="false" aria-label="Console traces for two heartbeats. The upper trace is the ECG used as the timing trigger, shaded to mark systole and diastole. The lower trace is arterial pressure: a dashed reference wave with a single systolic peak, and the counterpulsed wave that adds a taller diastolic peak during cuff inflation and shows a lower systolic peak after the cuffs release.">
                <defs>
                  <clipPath id="pulseReveal">
                    <rect className="pulse-reveal-rect" x={TRACE_START} y="0" width={TRACE_END - TRACE_START} height="280" />
                  </clipPath>
                  <clipPath id="pulseTraceClip">
                    <rect x={TRACE_START} y="0" width={TRACE_END - TRACE_START} height="280" />
                  </clipPath>
                </defs>

                <rect className="pulse-trace-bg" width="900" height="280" />
                <g className="pulse-trace-grid" aria-hidden="true">
                  <path d="M60 96H884M60 256H884" />
                </g>

                <g aria-hidden="true">
                  {bands.map((band) => (
                    <rect
                      key={band.key}
                      className={`pulse-band pulse-band-${band.kind} pulse-band-${band.key}`}
                      x={band.x}
                      y="26"
                      width={band.width}
                      height="250"
                    />
                  ))}
                  {bands.map((band) => (
                    <text
                      key={band.key}
                      className={`pulse-band-label pulse-band-label-${band.key}`}
                      x={band.x + band.width / 2}
                      y="18"
                      textAnchor="middle"
                    >
                      {band.label}
                    </text>
                  ))}
                </g>

                <text className="pulse-lane-label" x="70" y="52">ECG · trigger</text>
                <text className="pulse-lane-label" x="70" y="140">Arterial pressure</text>
                <text className="pulse-ecg-note" x="878" y="52" textAnchor="end">ECG unchanged · input only</text>

                <g clipPath="url(#pulseTraceClip)">
                  <path className="pulse-ecg-base" d={ECG_D} />
                  <path className="pulse-press-ghost" d={PRESS_GHOST_D} />

                  <g clipPath="url(#pulseReveal)">
                    <path className="pulse-ecg-line" d={ECG_D} />
                    <path className="pulse-press-line" d={PRESS_LIVE_D} />
                    <circle className="pulse-peak-dot" cx="206" cy="172" r="6" />
                    <circle className="pulse-peak-dot pulse-peak-dot-d" cx="335" cy="150" r="6" />
                  </g>
                </g>

                <g aria-hidden="true">
                  <path className="pulse-level pulse-level-s" d="M206 172H400" />
                  <path className="pulse-level pulse-level-d" d="M335 150H400" />
                  <text className="pulse-peak-note pulse-peak-note-s" x="206" y="160" textAnchor="middle">S</text>
                  <text className="pulse-peak-note pulse-peak-note-d" x="335" y="138" textAnchor="middle">D</text>
                  <text className="pulse-ds-note" x="408" y="166">D / S &gt; 1</text>
                  <path className="pulse-peak-note pulse-peak-note-unload" d="M598 154v14" />
                  <text className="pulse-peak-note pulse-peak-note-unload" x="606" y="150">Lower systolic · less afterload</text>
                </g>

                {markers.map((marker) => (
                  <g key={marker.key} className={`pulse-marker pulse-marker-${marker.key}`} aria-hidden="true">
                    <path className="pulse-marker-line" d={`M${marker.x} 128V276`} />
                    <text className="pulse-marker-label" x={marker.x} y="120" textAnchor="middle">{marker.label}</text>
                  </g>
                ))}

                <g className="pulse-cursor" aria-hidden="true">
                  <path d="M0 24V276" />
                </g>
              </svg>

              <div className="pulse-vitals" aria-hidden="true">
                {vitals.map((vital) => (
                  <div className="pulse-vital" key={vital.key}>
                    <span>{vital.label}</span>
                    <strong><b className={`pulse-v-${vital.key}`}>{vital.value}</b>{vital.unit ? <i>{vital.unit}</i> : null}</strong>
                  </div>
                ))}
              </div>
            </div>

            <svg className="pulse-scene" viewBox="0 0 900 360" preserveAspectRatio="xMidYMid meet" role="img" focusable="false" aria-label="Illustration of an EECP session. A patient reclines on a treatment chair with three cuff pairs wrapped around both legs — numbered one at the calves, two at the lower thighs, three at the upper thighs and buttocks. ECG electrodes sit on the chest over the heart and gather into one cable that runs down the body and along the floor into the console. A finger sensor joins the same cable. The console carries a small screen showing the ECG and the D over S ratio, one air manifold feeding a hose to each cuff set, and a pressure gauge per set. Arrows show blood driven from the legs back toward the heart.">
              <defs>
                <linearGradient id="pulseBody" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#4d719c" />
                  <stop offset="1" stopColor="#35577f" />
                </linearGradient>
                <linearGradient id="pulseCuff" x1="0" x2="1">
                  <stop offset="0" stopColor="#eef7f5" />
                  <stop offset="1" stopColor="#bde0da" />
                </linearGradient>
                <marker id="pulseArrow" markerUnits="userSpaceOnUse" markerHeight="15" markerWidth="15" orient="auto" refX="13" refY="7.5">
                  <path d="M0 0 15 7.5 0 15Z" fill="#a8d4ce" />
                </marker>
                <marker id="pulseArrowCoral" markerUnits="userSpaceOnUse" markerHeight="15" markerWidth="15" orient="auto" refX="13" refY="7.5">
                  <path d="M0 0 15 7.5 0 15Z" fill="#e8879a" />
                </marker>
              </defs>

              <rect className="pulse-room" width="900" height="360" />

              <g className="pulse-key" aria-hidden="true">
                {cuffKey.map((item) => (
                  <g key={item.badge}>
                    <circle className="pulse-key-badge" cx={item.x} cy="18" r="11" />
                    <text className="pulse-key-num" x={item.x} y="23" textAnchor="middle">{item.badge}</text>
                    <text className="pulse-key-name" x={item.x + 18} y="23">{item.name}</text>
                  </g>
                ))}
                <text className="pulse-key-note" x="872" y="23" textAnchor="end">Both legs · inflate 1 → 2 → 3 · release together</text>
              </g>

              <path className="pulse-floor" d="M40 356H872" />
              <ellipse className="pulse-floor-shadow" cx="390" cy="356" rx="290" ry="8" />

              <path className="pulse-lead pulse-lead-bundle" d={PATIENT_CABLE_D} aria-hidden="true" />

              <g className="pulse-chair" aria-hidden="true">
                <rect className="pulse-chair-band" x="36" y="93" width="120" height="58" rx="29" transform={`rotate(${TORSO_ANGLE} 96 122)`} />
                <rect className="pulse-chair-band" x="105" y="158" width="220" height="92" rx="46" transform={`rotate(${TORSO_ANGLE} 215 204)`} />
                <rect className="pulse-chair-band" x="304" y="249" width="342" height="68" rx="34" transform={`rotate(${LEG_ANGLE} 475 283)`} />
                <path className="pulse-chair-frame" d="M200 338H600" />
                <path className="pulse-chair-leg" d="M232 338v18M568 338v18" />
              </g>

              <rect
                className="pulse-patient-leg-far"
                x={311 + FAR_LEG.dx}
                y={231 + FAR_LEG.dy}
                width="331"
                height="60"
                rx="30"
                transform={`rotate(${LEG_ANGLE} ${476 + FAR_LEG.dx} ${261 + FAR_LEG.dy})`}
                aria-hidden="true"
              />

              {cuffSets.map((cuff, index) => {
                const cx = cuff.cx + FAR_LEG.dx;
                const cy = cuff.cy + FAR_LEG.dy;
                return (
                  <g key={`far-${cuff.badge}`} className={`pulse-cuff pulse-cuff-far pulse-cuff-${index}`} transform={`rotate(${LEG_ANGLE} ${cx} ${cy})`} aria-hidden="true">
                    <rect className="pulse-cuff-shell" x={cx - cuff.width / 2} y={cy - cuff.height / 2} width={cuff.width} height={cuff.height} rx="16" />
                    <rect className="pulse-cuff-pressure" x={cx - cuff.width / 2 + 6} y={cy - cuff.height / 2 + 6} width={cuff.width - 12} height={cuff.height - 12} rx="11" />
                  </g>
                );
              })}

              <g className="pulse-patient" aria-hidden="true">
                <path className="pulse-patient-neck" d="M133 119 151 131" />
                <circle className="pulse-patient-head" cx="108" cy="104" r="36" />
                <rect className="pulse-patient-torso" x="130" y="144" width="198" height="76" rx="38" transform={`rotate(${TORSO_ANGLE} 229 182)`} />
                <rect className="pulse-patient-leg" x="311" y="231" width="331" height="60" rx="30" transform={`rotate(${LEG_ANGLE} 476 261)`} />
                <ellipse className="pulse-patient-foot" cx="654" cy="286" rx="17" ry="15" transform={`rotate(${LEG_ANGLE} 654 286)`} />
                <path className="pulse-patient-arm" d="M172 136C202 158 244 184 286 206" />
                <circle className="pulse-patient-hand" cx="292" cy="212" r="10" />
              </g>

              <path className="pulse-flow-line" d="M566 272C490 262 400 250 320 236 290 230 250 206 220 168" markerEnd="url(#pulseArrow)" />
              <circle className="pulse-flow-particle" cx="0" cy="0" r="7" />
              <circle className="pulse-flow-particle" cx="0" cy="0" r="5" />
              <path className="pulse-eject-line" d="M206 172C226 198 244 216 266 234" markerEnd="url(#pulseArrowCoral)" />

              <g className="pulse-hoses" aria-hidden="true">
                {hosePaths.map((d, index) => (
                  <path key={d} className={`pulse-machine-hose pulse-hose-${index}`} d={d} />
                ))}
              </g>

              {cuffSets.map((cuff, index) => {
                const x = cuff.cx - cuff.width / 2;
                const y = cuff.cy - cuff.height / 2;
                return (
                  <g key={cuff.badge} className={`pulse-cuff pulse-cuff-${index}`} transform={`rotate(${LEG_ANGLE} ${cuff.cx} ${cuff.cy})`}>
                    <rect className="pulse-cuff-ring" x={x - 6} y={y - 6} width={cuff.width + 12} height={cuff.height + 12} rx="22" />
                    <rect className="pulse-hose-nub" x={cuff.nub.x} y={cuff.nub.y} width="16" height="12" rx="4" />
                    <rect className="pulse-cuff-shell" x={x} y={y} width={cuff.width} height={cuff.height} rx="16" />
                    <rect className="pulse-cuff-pressure" x={x + 6} y={y + 6} width={cuff.width - 12} height={cuff.height - 12} rx="11" />
                    <circle className="pulse-cuff-badge" cx={cuff.cx} cy={cuff.cy} r="15" />
                    <text className="pulse-cuff-badge-num" x={cuff.cx} y={cuff.cy + 6} textAnchor="middle">{cuff.badge}</text>
                  </g>
                );
              })}

              <g className="pulse-beat-target">
                <circle className="pulse-chest-halo" cx={HEART.x} cy={HEART.y} r="29" />
                <circle className="pulse-release-wave" cx={HEART.x} cy={HEART.y} r="18" />
                <circle className="pulse-heart-ring" cx={HEART.x} cy={HEART.y} r="21" />
                <path className="pulse-heart-core" d="M198 163c-9-5.4-16-11-16-19 0-5 4-9 9-9 2.7 0 4.8 1.4 7 3.8 2.2-2.4 4.3-3.8 7-3.8 5 0 9 4 9 9 0 8-7 13.6-16 19Z" />
                <path className="pulse-coronary" d="M198 136v7M198 143c-2.7 3.6-4.5 8-5.4 12.6M198 143c2.7 3.6 4.5 7.2 5.4 11.7" />
              </g>

              <g className="pulse-sensors" aria-hidden="true">
                {electrodes.map((electrode) => (
                  <path key={electrode.lead} className="pulse-lead" d={electrode.lead} />
                ))}
                {electrodes.map((electrode) => (
                  <g key={`${electrode.cx}-${electrode.cy}`}>
                    <circle className="pulse-electrode" cx={electrode.cx} cy={electrode.cy} r="8" />
                    <circle className="pulse-electrode-core" cx={electrode.cx} cy={electrode.cy} r="3.5" />
                  </g>
                ))}
                <rect className="pulse-lead-clip" x="248" y="198" width="24" height="18" rx="6" transform={`rotate(${TORSO_ANGLE} 260 207)`} />
                <g transform="rotate(30 306 220)">
                  <rect className="pulse-sensor" x="297" y="214" width="18" height="12" rx="5" />
                  <circle className="pulse-sensor-led" cx="303" cy="220" r="2.6" />
                </g>
                <path className="pulse-lead" d="M304 224C292 232 278 236 268 226" />
              </g>

              <g className="pulse-machine" aria-hidden="true">
                <rect className="pulse-monitor-glow" x="694" y="106" width="188" height="240" rx="24" />
                <rect className="pulse-machine-cabinet" x="700" y="112" width="176" height="228" rx="20" />
                <path className="pulse-machine-head" d="M700 132a20 20 0 0 1 20-20h136a20 20 0 0 1 20 20v14H700Z" />
                <circle className="pulse-machine-status" cx="714" cy="129" r="5" />
                <text className="pulse-machine-word" x="730" y="134">EECP console</text>

                <rect className="pulse-screen-bezel" x="712" y="156" width="152" height="62" rx="9" />
                <rect className="pulse-screen-face" x="718" y="162" width="140" height="50" rx="5" />
                <path className="pulse-screen-trace" d={SCREEN_TRACE_D} />
                <path className="pulse-screen-cursor" d={`M${SCREEN_START} 164V210`} />
                <text className="pulse-screen-label" x="722" y="207">D/S</text>
                <text className="pulse-screen-value pulse-v-ds" x="854" y="207" textAnchor="end">1.22</text>

                <rect className="pulse-manifold" x="688" y="196" width="16" height="36" rx="7" />
                {[2, 1, 0].map((index, row) => (
                  <circle key={index} className={`pulse-machine-port pulse-port-${index}`} cx="696" cy={206 + row * 10} r="4" />
                ))}
                <rect className="pulse-inlet" x="688" y="304" width="14" height="20" rx="5" />

                {cuffSets.map((cuff, index) => {
                  const top = 244 + index * 28;
                  return (
                    <g key={cuff.badge}>
                      <text className="pulse-machine-outlet" x="714" y={top + 13}>{cuff.badge}</text>
                      <rect className="pulse-gauge-track" x="732" y={top} width="126" height="15" rx="7.5" />
                      <rect className={`pulse-gauge-fill pulse-gauge-${index}`} x="732" y={top} width="126" height="15" rx="7.5" />
                    </g>
                  );
                })}
                <text className="pulse-machine-caption" x="732" y="331">Cuff pressure per set</text>
                <path className="pulse-machine-base" d="M694 344h188" />
                <circle className="pulse-machine-wheel" cx="718" cy="352" r="8" />
                <circle className="pulse-machine-wheel" cx="858" cy="352" r="8" />
              </g>
            </svg>

            <figcaption>
              <span>EECP · ECG-timed outpatient care</span>
              <span className="pulse-legend"><i className="pulse-legend-live" aria-hidden="true" />Counterpulsed<i className="pulse-legend-ghost" aria-hidden="true" />Untreated reference</span>
              <span>Illustration · not live patient data</span>
            </figcaption>
          </figure>

          <div className="scrolly-copy">
            <div className="pulse-copy-head">
              <span>Follow one heartbeat</span>
              <div className="pulse-indexes" aria-hidden="true">
                {steps.map((_, index) => <b key={index} className={`pulse-index pulse-index-${index}`}>{`0${index + 1}`}</b>)}
              </div>
            </div>
            <div className="pulse-progress-track"><span className="pulse-progress" /></div>
            <div className="pulse-steps">
              {steps.map((step, index) => (
                <article key={step.title} className={`pulse-step pulse-step-${index}`}>
                  <span className="chapter-number">{step.phase} · {`0${index + 1}`}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                  <div className="pulse-step-fact"><span>{step.factLabel}</span><strong>{step.factValue}</strong></div>
                </article>
              ))}
            </div>
            <div className="scrolly-hint" aria-hidden="true"><span>Scroll to advance one beat</span><i><b /></i></div>
          </div>
        </div>
      </div>
    </section>
  );
}
