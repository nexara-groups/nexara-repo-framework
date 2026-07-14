# Photography shot list

The live site intentionally uses original, code-native SVG/CSS artwork instead of generated photography. The service cards, page heroes, detail panels and gallery now share one navy, mint and coral motion language implemented by `src/components/site-art.tsx` and `src/app/globals.css`.

Real, consented Rise photography can replace selected art plates after the hub opens. Add those assets deliberately at that stage; do not reintroduce stock or generated placeholders. Keep the code art as the fallback until each approved photograph is available.

The 12 shots below are the future real-photo shoot list. Brief for the photographer: natural/window light over flash, calm and unhurried body language (no forced smiles at camera), and let the site's navy / mint / coral accents show up where they already exist in the space (signage, scrubs, upholstery, wayfinding) rather than adding props to match.

| # | Shot | Future use | Orientation | Min. long edge | Art direction |
|---|------|----------|-------------|-----------------|---------------|
| 1 | Exterior signage — hub entrance, street-facing sign, daytime | New | Landscape | 2400px | Shoot mid-morning for soft directional light; keep the frontage uncluttered so the sign and navy/mint fascia read clearly. |
| 2 | Reception wide — welcome desk and waiting area | Services hero, health-camps hero, gallery | Landscape | 2400px | Wide, airy composition with negative space at the top-left for hero text overlap; candid family/patient in frame, not posed. |
| 3 | EECP suite with machine — full room, machine + treatment couch | EECP service card, detail, sticky panel and gallery | Landscape, shoot loose | 2400px | Leave generous headroom and side margin so square, landscape and portrait crops keep the machine centred. Calm, clinical-but-warm light. |
| 4 | Cuffs detail — close-up of EECP leg/calf cuffs in use | New | Landscape | 2400px | Macro-leaning detail shot; focus on the cuff mechanism and monitored calm, not the patient's face. Mint or navy upholstery in frame if possible. |
| 5 | ECG monitor closeup — vitals/ECG display during a session | New | Landscape | 2400px | Screen content should be legible but generic (no real patient data); soft ambient room light reflected on the housing, not a flash hotspot. |
| 6 | Consultation two-shot — doctor and patient talking, seated | OPD hero, detail panel and gallery | Landscape | 2400px | Natural conversation framing, both faces visible, doctor slightly forward; window light from one side for depth. |
| 7 | Pharmacy counter — pharmacist and patient at the counter | Pharmacy card, detail panel and gallery | Landscape | 2400px | Include shelving/signage in soft focus behind the counter; coral or navy accent in staff uniform or signage if available. |
| 8 | Lab bench — technician at diagnostic/lab equipment | Diagnostics card, detail panel and gallery | Landscape | 2400px | Precise, focused framing on hands/equipment; avoid clutter in the background, mint accent wall or scrub color if present. |
| 9 | Corridor — a calm interior hallway, wayfinding signage visible | New | Landscape | 2400px | Shoot down the corridor's natural vanishing point; even, shadow-free lighting to reinforce "calm" as a brand attribute. |
| 10 | Physio space — physiotherapy/rehab area, equipment visible | New | Landscape | 2400px | Wide shot showing the room's scale and equipment; candid session in progress preferred over an empty room. |
| 11 | Team candid — 2–3 staff members in an unposed moment | New | Landscape | 2400px | Genuine interaction (handoff, chart review, walking together), not a lineup; natural light, no camera-aware smiles. |
| 12 | Madhurawada street context — the hub within its neighbourhood | New | Landscape | 2400px | Establishing shot situating the hub on its street in Madhurawada; late-afternoon light preferred for warmth without harshness. |

**Notes for the shoot**
- All frames on the live site crop to landscape or near-square aspect ratios except the EECP sticky panel (portrait, `.86 / 1`), which currently reuses shot 3. If a dedicated portrait EECP frame is wanted later, add a 13th shot; until then, shoot #3 loose enough to support a portrait crop.
- "Min. long edge 2400px" is a floor, not a target — shoot RAW at the camera's native resolution and downsample on export so future crops (hero, card, gallery) all still hit 2x-retina at their largest rendered size.
- Keep a consistent white balance/exposure approach across the whole shoot day so the set reads as one family before any subtle finishing grade is applied.
