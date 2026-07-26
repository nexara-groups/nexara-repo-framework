# Yojo homepage production asset manifest

Approved art-direction reference: `.impeccable/mocks/home-crossing-seam.png`

Generation mode: built-in `image_gen`, using the approved composition as an art-direction reference rather than a crop or edit target.

Delivery format: opaque lossy WebP, quality 90. Generated PNG plates were center-fitted to the requested production dimensions with Lanczos resampling. UI text, navigation, labels, rails, controls, annotations, the threshold seam, borders, clipping, and layout shadows remain semantic implementation concerns.

## Produce

### `workstation-threshold`

- **Source crop:** Full approved homepage composition; hero workstation region used only as visual-role reference.
- **Output:** `assets/generated/home/workstation-threshold.webp`
- **Dimensions:** 1920 × 1200 px
- **Format:** WebP, opaque, 130,974 bytes
- **Strategy:** Faithful clean-plate regeneration at a 16:10 component ratio.
- **Prompt summary:** One continuous real learning workstation in premium paper-white, silver, and graphite materials. The left side contains scattered learner notes and loosely routed study artifacts; the right side is the same calm, organized workstation. The monitor is dark and neutral so the vertical threshold seam and learning-system UI can be drawn in code.
- **Alt-text recommendation:** “Computer learning workstation with scattered study materials on the left and a calm, organized work surface on the right.”
- **Deviations:** A few small cyan-blue paper notes remain as incidental physical stationery on the scattered side. No seam or structural accent is baked into the image.
- **QA status:** `accepted`

### `learning-system-cutaway`

- **Source crop:** Full approved homepage composition; five-layer cutaway region used only as visual-role reference.
- **Output:** `assets/generated/home/learning-system-cutaway.webp`
- **Dimensions:** 1600 × 1600 px
- **Format:** WebP, opaque, 194,766 bytes
- **Strategy:** Faithful clean-plate regeneration as one mechanically coherent product object.
- **Prompt summary:** A premium brushed-aluminum workstation opened into five physically supported trays. The layers contain unlabeled mentor, curriculum, lab-practice, review, and career-support artifacts with dark inactive screens and no embedded UI.
- **Alt-text recommendation:** “Five-layer precision workstation opened to reveal mentoring, curriculum planning, hands-on practice, feedback, and career-support tools.”
- **Deviations:** The curriculum and feedback papers contain faint abstract linework to read as physical learning artifacts; there is no legible text. CSS/SVG must supply every stage name, rail, marker, and active state.
- **QA status:** `accepted`

### `quality-desk`

- **Source crop:** Full approved homepage composition; quiet proof passage used only as palette, material, and mood reference.
- **Output:** `assets/generated/home/quality-desk.webp`
- **Dimensions:** 1600 × 1000 px
- **Format:** WebP, opaque, 98,860 bytes
- **Strategy:** New editorial clean plate at a 16:10 component ratio.
- **Prompt summary:** A restrained paper-white learning studio with generous negative space and practical hands-on artifacts: blank-grid notebook, graphite pencil, network switch, short Ethernet cables, electronics practice board, folio, and closed aluminum laptop.
- **Alt-text recommendation:** “Bright learning desk with an open notebook, network switch, Ethernet cables, electronics practice board, and closed laptop.”
- **Deviations:** None.
- **QA status:** `accepted`

## Direct

None. The approved full-page mock is too small and contains semantic interface chrome, so no section was shipped as a literal crop.

## Security-led replacements

These versioned assets supersede the three original homepage plates in the live implementation. They retain the approved material language while removing device-repair and electronics-prototyping cues.

### `workstation-threshold-security`

- **Output:** `assets/generated/home/workstation-threshold-security.webp`
- **Dimensions:** 1586 × 992 px
- **Format:** WebP, opaque
- **Prompt summary:** A calm cybersecurity learning workstation crosses from scattered inputs into an organised security-operations workflow with an abstract network topology, event timeline, managed switch, firewall appliance, mentor review card, and one cyan threshold.
- **Exclusions:** Open devices, motherboards, repair tools, breadboards, hacker imagery, code rain, neon cyberpunk, floating objects, logos, and readable interface text.
- **Alt text:** “A cybersecurity learning workstation changing from scattered inputs into an organised defensive lab workflow.”
- **QA status:** `accepted`
- **Implementation status:** Superseded by the cleaned version below because the first security plate contained a baked cyan seam.

### `workstation-threshold-security-clean`

- **Output:** `assets/generated/home/workstation-threshold-security-clean.webp`
- **Dimensions:** 1586 × 992 px
- **Format:** WebP, opaque
- **Prompt summary:** The same cybersecurity learning workstation, cleaned so network activity remains abstract and non-linguistic while the code owns the single cyan threshold and all semantic labels.
- **Exclusions:** Baked vertical seams, readable interface text, logos, repair cues, hacker imagery, and code rain.
- **Alt text:** “A cybersecurity learning workstation changing from scattered inputs into an organised defensive lab workflow.”
- **QA status:** `accepted`

### `learning-system-security-console`

- **Output:** `assets/generated/home/learning-system-security-console.webp`
- **Dimensions:** 1254 × 1254 px
- **Format:** WebP, opaque
- **Prompt summary:** A freestanding five-level cybersecurity learning console supported by an engineered graphite spine and plinth. Its physical layers contain mentor guidance, curriculum mapping, managed network lab equipment, feedback review, and career preparation artifacts.
- **Exclusions:** Suitcases, tool cases, repair benches, motherboards, loose tools, cyberpunk, capsules, floating shelves, logos, and watermarks.
- **Alt text:** “A five-layer cybersecurity learning console connecting guidance, curriculum, lab practice, feedback and career preparation.”
- **QA status:** `accepted`

### `quality-security-desk`

- **Output:** `assets/generated/home/quality-security-desk.webp`
- **Dimensions:** 1586 × 992 px
- **Format:** WebP, opaque
- **Prompt summary:** A quiet corporate security-learning desk with managed network equipment, tidy Ethernet paths, a defensive network map, mentor notebook, and access-control reader.
- **Exclusions:** Breadboards, exposed circuit boards, repair tools, laptop servicing, generic hacker imagery, logos, and floating objects.
- **Alt text:** “A cybersecurity learning desk with network equipment, a defensive lab map and review notes.”
- **QA status:** `accepted`

## Semantic implementation handoff

### `threshold-seam`

- **Implementation:** Add one absolutely positioned CSS pseudo-element or dedicated `div` over the hero plate at the chosen threshold coordinate. Use a one-pixel electric-cyan rule with a restrained active marker driven by scroll progress. Keep the line out of the raster so its location can adapt across breakpoints.
- **Notes:** Do not add a blurred glow. On small screens, preserve the before/after reading by shifting the seam with `object-position` rather than stretching the image.
- **QA status:** `accepted`

### `hero-learning-system`

- **Implementation:** Place a semantic ordered list over the right side of the dark monitor. Each list item should contain the stage name and accessible current-state text. Use CSS borders or a small inline SVG for the vertical rail and stage connectors; use transform/opacity transitions for scroll states.
- **Notes:** Guidance, curriculum, practice, feedback, and placement support remain selectable/readable HTML. Avoid rasterizing stage labels or simulating a full dashboard.
- **QA status:** `accepted`

### `cutaway-annotations`

- **Implementation:** Compose the cutaway image with a sibling ordered list in a two-column CSS grid. Align each label to a tray using CSS custom properties or measured anchor positions. Draw the thin connector rules in inline SVG or pseudo-elements and drive the active layer with an intersection/scroll progress value.
- **Notes:** At narrow breakpoints, stack each semantic stage label below the image instead of shrinking labels into unreadable callouts.
- **QA status:** `accepted`

### `image-presentation`

- **Implementation:** Use semantic `picture`/`img` elements with explicit width and height attributes. Let CSS own `aspect-ratio`, responsive cropping, clipping, border treatment, and any section-level shadow. Respect `prefers-reduced-motion` when applying scale or parallax.
- **Notes:** Hero and proof imagery use `object-fit: cover`; the cutaway should normally use `object-fit: contain` so all five physical layers remain visible.
- **QA status:** `accepted`

## Execution order

1. Place `workstation-threshold-security-clean.webp`, then establish the responsive crop and code-owned threshold coordinate.
2. Add the semantic hero learning-system rail over the monitor.
3. Place `learning-system-security-console.webp` and align the five code-owned annotations to its levels.
4. Place `quality-security-desk.webp` beneath the quiet proof copy.
5. Validate crops and annotation alignment at desktop, tablet, mobile, and reduced-motion settings.

## Blockers

None.

## Assumptions

- The requested wide assets use a 16:10 delivery ratio.
- The cutaway uses a square delivery ratio to preserve all five layers and leave room for code-owned annotations.
- No separate retina variants are needed because the supplied dimensions are already suitable for high-density display at the intended component sizes.
- The small incidental cyan-blue paper notes in the hero are acceptable within the stated “tiny incidental cyan” allowance.
