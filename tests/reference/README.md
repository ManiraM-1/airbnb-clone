# Reference screenshots

The reference site sits behind Vercel's Security Checkpoint, which blocks scripted and Playwright
access. Do not request it or try to get around it. These screenshots are the visual source of truth.

They were captured manually in Chrome at a **1440×900 viewport, DPR 1, no scrollbar** (layout width
1440px, so the content column starts at x=160). Coordinates in the images are CSS pixels.

**Text antialiasing differs by capture:** `ref-top.png` shows page content with greyscale text (the
real on-screen rendering, which we reproduce), while the full-page capture `ref-full.png` has
colour-subpixel text everywhere. Against `ref-full.png`, text regions therefore keep ~2–3% diff even when
every glyph is in the right place: compare text **positions** (ink boxes), not text pixels.

| File | State | Our capture (`tests/visual-states.ts`) |
|---|---|---|
| `ref-full.png` | Full page, 1440×6256, scrollY 0, no overlay | `full` |
| `ref-top.png` | First viewport, scrollY 0 | `top` |
| `ref-sticky-nav.png` | scrollY 1500, sticky section nav visible | `sticky-nav` |
| `ref-tour-top.png` | Photo tour opened from "Show all photos", scroller at top | `tour-top` |
| `ref-tour-bedroom.png` | Photo tour after clicking the Bedroom thumbnail | `tour-bedroom` |
| `ref-viewer-4.png` | Photo viewer on photo 4 of 43 | `viewer-4` |
| `ref-amenities.png` | Amenities modal open, page at scrollY 0 | `amenities` |

Workflow:
1. `npm run visual` captures our build into `tests/__output__/{state}.png` (git-ignored). It runs
   **headed** Chromium (a window opens briefly): the headless shell renders photos visibly softer than
   the reference's Chrome, which inflated photo diffs ~2×.
2. `npm run compare -- <state|all> [--region x,y,w,h]` writes pixelmatch diffs (and crops when a
   region is given) to `tests/__output__/`.
3. `node scripts/inspect-png.mjs bbox|pixel|crop ...` measures sizes, positions and colours in any
   screenshot.

Need a state that isn't here (hover, focus, another photo)? Ask the user for one specific
screenshot, add it here with the same naming (`ref-<state>.png`) and capture conditions.
