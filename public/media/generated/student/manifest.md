# Student Journey Production Asset Manifest

Approved art-direction reference:
`/Users/naveengalla/Documents/Steps Dashboard/.impeccable/mocks/home-lab-bench.png`

Generation mode:

- Built-in `image_gen` generation with the approved mock supplied as an art-direction reference.
- Opaque RGB source plates converted locally with Pillow 12.2.0 to lossy WebP.
- Final output: 1600 × 1000 px (16:10), WebP quality 91, no alpha.
- HTML/CSS/JS and the approved mock were not edited.

## Produce

### `student-keyboard-macro`

- `source_crop`: Homepage hero/workstation material direction from the approved mock.
- `output_path`: `student-keyboard-macro.webp`
- `strategy`: Faithful art-direction regeneration as a clean photographic plate.
- `prompt_summary`: Macro, slightly elevated view of a learner's hand at an unbranded graphite and brushed-aluminum keyboard/trackpad; cool daylight, quiet negative space, realistic skin and metal texture, no readable key legends or UI.
- `dimensions`: 1600 × 1000 px.
- `format`: WebP.
- `transparency`: Opaque.
- `deviations`: None.
- `qa_status`: `accepted`
- `alt_text_recommendation`: “A learner rests a hand on a graphite computer at a brushed-aluminum lab bench.”

### `curriculum-map`

- `source_crop`: Overhead curriculum-bench material direction from the approved mock.
- `output_path`: `curriculum-map.webp`
- `strategy`: Faithful overhead regeneration with a physical route prop rather than baked UI.
- `prompt_summary`: Four paper-white curriculum sheets arranged in a clear sequence on a graphite technical bench, connected by one restrained physical cyan cord; abstract non-linguistic diagrams and sparse unbranded tools.
- `dimensions`: 1600 × 1000 px.
- `format`: WebP.
- `transparency`: Opaque.
- `deviations`: The cyan route is a real cord within the photographed scene; semantic labels and any animated route treatment remain code-owned.
- `qa_status`: `accepted`
- `alt_text_recommendation`: “Four curriculum sheets are arranged across a technical workbench and connected by a cyan cord.”

### `practice-lab`

- `source_crop`: Hands-on circuit-board practice direction from the approved mock.
- `output_path`: `practice-lab.webp`
- `strategy`: Faithful documentary/product-photography regeneration.
- `prompt_summary`: Two natural learner hands perform one clear task on an unbranded computer board using a precision probe and cable; graphite antistatic surface, subtle cyan hardware accent, no screen or UI.
- `dimensions`: 1600 × 1000 px.
- `format`: WebP.
- `transparency`: Opaque.
- `deviations`: None.
- `qa_status`: `accepted`
- `alt_text_recommendation`: “A learner tests a computer board with a precision probe while connecting a cable.”
- `implementation_status`: Legacy asset, superseded because the electronics-probing scene can be misread as device repair.

### `student-security-practice`

- `source_crop`: The original practice chapter supplied framing, hand scale, graphite materials, and lighting only.
- `output_path`: `student-security-practice.webp`
- `strategy`: Precise scene replacement that keeps the tactile chapter composition while changing the activity to defensive network configuration.
- `prompt_summary`: One learner hand uses a compact keyboard while the other connects a cyan Ethernet patch lead to a managed network appliance. An abstract network-activity view and attack-path worksheet support a clear configure, observe, test, and document workflow.
- `dimensions`: 1586 × 992 px.
- `format`: WebP.
- `transparency`: Opaque.
- `exclusions`: Motherboards, open devices, probes, screwdrivers, soldering, repair tools, hacker imagery, code rain, logos, and readable brand text.
- `qa_status`: `accepted`
- `alt_text_recommendation`: “A learner configuring a managed network and reviewing defensive security activity in a guided lab.”

### `feedback-sheet`

- `source_crop`: Mentor feedback/paper detail direction from the approved mock.
- `output_path`: `feedback-sheet.webp`
- `strategy`: Faithful editorial still-life regeneration.
- `prompt_summary`: Angled overhead view of a mentor's hand reviewing a paper-white technical sheet with abstract schematic linework, one restrained cyan check gesture, cyan pencil, and brushed-metal ruler; no readable language.
- `dimensions`: 1600 × 1000 px.
- `format`: WebP.
- `transparency`: Opaque.
- `deviations`: None.
- `qa_status`: `accepted`
- `alt_text_recommendation`: “A mentor reviews an abstract technical worksheet beside a cyan pencil and metal ruler.”

### `placement-desk`

- `source_crop`: Placement-support workstation direction from the approved mock.
- `output_path`: `placement-desk.webp`
- `strategy`: Faithful regeneration followed by one precise cleanup pass to suppress readable keyboard and circuit-board markings.
- `prompt_summary`: One continuous desk transitions from learning artifacts to a calm professional workstation with a dark monitor, keyboard, headset, blank portfolio, and blank preparation sheets; a learner's hand straightens the portfolio.
- `dimensions`: 1600 × 1000 px.
- `format`: WebP.
- `transparency`: Opaque.
- `deviations`: One cleanup pass removed legible hardware markings while preserving the approved composition.
- `qa_status`: `accepted`
- `alt_text_recommendation`: “A learner prepares a portfolio at a professional workstation with practice materials nearby.”

## Direct

No direct crops were shipped. The approved full-page mock is too small and contains semantic page content, so it remains reference-only.

## Semantic

### `journey-copy`

- `implementation`: Render stage numbers, headings, supporting copy, links, and calls to action as semantic HTML. Keep copy out of all raster layers and connect each section heading to its image with `aria-labelledby`.
- `notes`: Use responsive type and layout rather than baking text placement into images.
- `qa_status`: `accepted`

### `journey-route-and-callouts`

- `implementation`: Build scroll-progress routes, callout lines, nodes, and section annotations as responsive inline SVG or CSS layers. Align overlays with each image's focal points using normalized coordinates, and disable motion under `prefers-reduced-motion`.
- `notes`: The physical cord in `curriculum-map.webp` is a tactile scene prop; interactive route behavior and labels remain code-owned.
- `qa_status`: `accepted`

### `media-framing`

- `implementation`: Own responsive cropping, `object-position`, clipping, border radii, shadows, transitions, and sticky/scrollytelling behavior in CSS. Use the supplied files as full-bleed rectangular plates.
- `notes`: No presentation chrome is baked into the assets.
- `qa_status`: `accepted`

## Visual QA

- All five final WebP files were visually inspected after conversion.
- Palette, lighting, material texture, learner presence, and cyan restraint are consistent with the approved mock.
- No logos, watermarks, UI chrome, fake terminals, neon effects, floating objects, or generic cyber imagery were found.
- Hands and object interactions are credible at the final crop.
- Final dimensions and opacity were verified for every file.

## Execution Order

1. `student-keyboard-macro.webp`
2. `curriculum-map.webp`
3. `practice-lab.webp`
4. `feedback-sheet.webp`
5. `placement-desk.webp`

## Blockers

None.

## Assumptions

- 1600 × 1000 px is sufficient for the intended 16:10 desktop and responsive section displays.
- The build will supply all meaningful copy, labels, progress lines, and interaction state semantically.
