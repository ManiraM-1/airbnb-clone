---
name: pixel-match
description: Bring one section or overlay of the clone to pixel and behaviour parity with the reference screenshots in tests/reference/. Use after building any section, or when the user says "pixel-match <section>".
---
# Pixel-match a section

Input: the name of a section (e.g. "hero gallery", "booking sidebar", "photo viewer").

The reference site cannot be opened by any tool (Vercel Security Checkpoint, do not bypass). The visual source of truth is the manual screenshots in `tests/reference/` (see its README) plus SPEC.md.

1. **Read** the SPEC.md section for it and the component files that implement it. Work out which reference screenshot(s) show the section and the page-pixel box it occupies there (`ref-full.png` covers every in-page section; overlays have their own).
2. **Compare visually**: delegate to the `visual-qa` agent for this section only. It captures our build (`npm run visual`) and diffs the cropped region against the reference (`npm run compare -- <state> --region x,y,w,h`), default state plus any open/closed states that have a reference screenshot.
3. **Compare behaviour**: list every interaction SPEC.md gives for the section (click, hover, keyboard, URL change, toast, disabled state) and test each one on our build with Playwright. Behaviour comes from SPEC.md, since the reference can't be exercised.
4. **Fix**: for each difference, decide whether the code or the SPEC is wrong.
   - Code wrong → fix it (or delegate to `component-builder`).
   - SPEC missing/wrong → ask `ui-inspector` to measure it from the screenshots and update SPEC.md, then fix code.
   - Can't be determined from existing screenshots (e.g. hover state) → ask the user for the one specific screenshot needed (state, scroll, hovered element, file name `tests/reference/ref-<state>.png`). Don't guess.
5. **Repeat** steps 2–4 until the section is visually indistinguishable at 100% zoom and any remaining diff is explained by photo resampling or sub-pixel line rendering, and all behaviours match SPEC.md. **At most two fix-and-compare rounds per section**; then list what's left over and move on.
6. If the section is interactive or an overlay, run the `a11y-reviewer` agent on it.
7. **Report**: what was fixed, the final diff % for the region, screenshots still needed from the user, and anything intentionally different (e.g. our proper focus trap, SPEC §11).

Never copy code or SVG markup from the reference to close a gap. Measure and rebuild.
