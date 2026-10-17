---
name: pixel-match
description: Bring one section or overlay of the clone to pixel and behaviour parity with the reference. Use after building any section, or when the user says "pixel-match <section>".
---
# Pixel-match a section

Input: the name of a section (e.g. "hero gallery", "booking sidebar", "photo viewer").

1. **Read** the SPEC.md section for it and the component files that implement it.
2. **Compare visually**: delegate to the `visual-qa` agent for this section only (reference vs localhost at 1440×900, default state + hover states + any open/closed states).
3. **Compare behaviour**: list every interaction SPEC.md gives for the section (click, hover, keyboard, URL change, toast, disabled state) and test each one on our build with Playwright.
4. **Fix**: for each difference, decide whether the code or the SPEC is wrong.
   - Code wrong → fix it (or delegate to `component-builder`).
   - SPEC missing/wrong → ask `ui-inspector` to measure, update SPEC.md, then fix code.
5. **Repeat** steps 2–4 until the diff for the section is visually clean (only anti-aliasing noise) and all behaviours match.
6. If the section is interactive or an overlay, run the `a11y-reviewer` agent on it.
7. **Report**: what was fixed, the final diff %, and anything intentionally different (e.g. our proper focus trap, SPEC §11).

Never copy code or SVG markup from the reference to close a gap. Measure and rebuild.
