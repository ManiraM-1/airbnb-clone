# Airbnb listing page clone

A pixel- and behaviour-faithful rebuild of a single Airbnb listing page (desktop, 1440×900), including
the **Photo Tour**, the **Photo Viewer** (lightbox), the amenities modal, the sticky section nav and the
toast. It was built with Claude Code from a measured spec and manually captured reference screenshots.

## Running it

Requires Node.js 22 or later.

```bash
npm install
npm run dev          # http://localhost:3000
```

All assets (photos, avatars, UI images, font) are already in `public/assets/`; nothing needs downloading.

Other commands:

| Command | What it does |
|---|---|
| `npm run build` / `npm start` | Production build and server |
| `npm run lint`, `npx tsc --noEmit` | ESLint and strict type check |
| `npx playwright install chromium` | One-time browser download for the tests |
| `npx playwright test` | All Playwright tests (starts the dev server if one isn't running) |
| `npm run visual` | Capture our build in the 7 reference states into `tests/__output__/` (opens a headed Chromium briefly) |
| `npm run compare -- <state\|all> [--region x,y,w,h]` | Pixel-diff our captures against `tests/reference/` |
| `node scripts/inspect-png.mjs bbox\|pixel\|crop ...` | Measure ink boxes, colours and enlarged crops in any screenshot |
| `npm run zip` | Build `submission.zip` (sources, assets, tests, docs and AI-workflow files; no `node_modules`, `.next` or test output) |

## Tech choices

| Choice | Why |
|---|---|
| **Next.js (App Router) + TypeScript (strict)** | Server-renders the page from data so first paint is complete, and gives a real route handler for the data (`GET /api/listing`) without a separate backend. |
| **CSS Modules + CSS custom properties** | Each measured value lives next to the one component it belongs to; shared tokens (colours, type, shadows, motion durations) are custom properties in `app/globals.css`. No Tailwind or UI kit: a pixel-match needs exact values, not a framework's scale. |
| **Data in `data/listing.json`** | All text, photos, reviews and amenities come from one typed file (`lib/types.ts`; `lib/data.ts` makes `tsc` check the JSON against the types). Components hold no content. |
| **Own SVG icon components** | Small line icons using `currentColor`, drawn from the screenshots rather than copied from the reference's markup. |
| **Playwright + pixelmatch + pngjs** | Playwright captures our build in the same states as the reference screenshots and runs the keyboard/behaviour tests; pixelmatch gives a number per state or region so "done" is measurable. |
| **No state library** | Overlay state lives in one place (`ListingPage`) and is mirrored to the URL (`?modal=PHOTO_TOUR_SCROLLABLE&modalItem=…`, SPEC §8.1 / §9) through a small `useSyncExternalStore` hook, so a reload or shared link reopens the same overlay and photo. |

## Folder structure

```
app/              layout.tsx, page.tsx, globals.css (tokens), api/listing/route.ts
components/
  layout/         Header, StickyNav, Toast
  listing/        ListingPage + one component per page section (TitleRow, HeroGallery, Overview,
                  GuestFavourite, HostRow, Highlights, Description, Sleep, Amenities, Calendar,
                  BookingSidebar, Reviews, Location, MeetHost, ThingsToKnow, MoreStays)
  overlays/       Dialog (shared a11y logic), PhotoTour, PhotoViewer, AmenitiesModal
  icons/          SVG icon components and the data-key → icon registry
hooks/            useModalUrl, useScrollSpy, useToast
lib/              types.ts, data.ts, photos.ts (43-photo index), dates.ts, dialogStack.ts
data/             listing.json (content), assets.txt (asset paths)
public/assets/    font, photos, avatars, UI images
tests/            Playwright specs per section/overlay, visual capture states
  reference/      the 7 manual reference screenshots + README (capture conditions)
scripts/          compare-screenshots, compare-bands, inspect-png, place-assets, fetch-assets, zip
.claude/          subagents, pixel-match skill, prompt-logging hook, settings
docs/             architecture diagram
CLAUDE.md         project rules for Claude Code
SPEC.md           measured specification (source of truth)
PROMPTS.md        every prompt sent during the build, logged automatically
```

One component per file, one CSS module per component, named the same.

## AI workflow

The whole build was done with Claude Code. The setup is in the repository so it can be inspected and rerun.

- **`CLAUDE.md`**: the rules every session starts with: stack, folder layout, coding conventions,
  hard rules (never copy the reference's code, measure don't guess, desktop only, accessibility is part
  of done) and process rules (one comparison pass per batch, at most two fix rounds, a defined done bar).
- **`SPEC.md`: measured source of truth.** Every size, colour, font metric, timing and behaviour, by
  section, measured from the reference screenshots. When a value was missing, it was measured and added
  to the spec *before* being used in code, so the code never carries guessed numbers.
- **Reference screenshots captured manually.** The reference site sits behind Vercel's Security
  Checkpoint, which blocked scripted and Playwright access (HTTP 429). We did not try to get around it.
  The 7 reference states were captured by hand in Chrome at 1440×900, DPR 1
  (`tests/reference/README.md`), and assets were downloaded in a browser and placed with
  `npm run place-assets`.
- **Four subagents** (`.claude/agents/`):
  - `ui-inspector`: measures a missing or disputed value from the screenshots and records it in `SPEC.md`.
  - `component-builder`: implements one section or overlay from `SPEC.md`, following `CLAUDE.md`.
  - `visual-qa`: captures our build in the reference states and pixel-diffs whole views or regions.
  - `a11y-reviewer`: audits keyboard, focus, ARIA and reduced motion against SPEC §11.
- **`pixel-match` skill** (`.claude/skills/pixel-match/`): the loop for one section: compare visually,
  test behaviour, decide whether code or spec is wrong, fix, re-compare (two rounds max), then run the
  a11y review for interactive parts.
- **Prompt-logging hook** (`.claude/hooks/log-prompt.mjs`, registered as a `UserPromptSubmit` hook in
  `.claude/settings.json`): appends every prompt, word for word with a timestamp, to `PROMPTS.md`.

## Deliberate improvements over the reference

These are behaviour-only; none of them changes how the page looks with a mouse.

- **Focus moves into dialogs.** Opening the Photo Tour, Photo Viewer or amenities modal moves focus to
  its first control (Back or Close). The reference leaves focus on the page behind.
- **Focus trap.** Tab and Shift+Tab cycle inside the top-most open dialog, and the page behind is made
  `inert`. In the reference Tab escapes to the page underneath.
- **Focus return.** Closing a dialog returns focus to what opened it (hero photo, "Show all photos",
  tour photo, "Show all 50 amenities"), including through the stacked tour → viewer case.
- **State exposed to assistive tech.** Save buttons use `aria-pressed`; "Show more" toggles use
  `aria-expanded`; the viewer counter ("5 of 43") is a polite live region; the toast is `role="status"`.
- **Screen-reader structure.** Visually hidden headings for Highlights and Description; "19 Reviews"
  read as one phrase; struck-through amenities announced as "Unavailable"; rating bars, weekday headers
  and the host rating read as words, not symbols; "Show original" is a link-styled button; no-op
  controls are real buttons or links with labels.
- **Keyboard reach.** The amenities modal's list and the "More stays" carousel are focusable, named
  regions, so they scroll with arrow keys and PageDown. The sticky section nav comes first in Tab order
  because it sits at the top of the screen.
- **Reduced motion.** With `prefers-reduced-motion: reduce`, every transition and smooth scroll is
  switched off (0s, not a tiny duration, so `visibility` changes can't delay focus moving into a dialog).

## Results

Diff against the reference screenshots (`npm run visual && npm run compare -- all`):

| State | Pixels differing |
|---|---|
| `full` (1440×6256) | 0.77% |
| `top` | 2.03% |
| `sticky-nav` | 0.70% |
| `tour-top` | 1.81% |
| `tour-bedroom` | 1.00% |
| `viewer-4` | 0.07% |
| `amenities` | 1.05% |

All 66 Playwright tests pass (layout, behaviour, URL sync, keyboard and focus handling for each
section and overlay), as do `npm run lint`, `npx tsc --noEmit` and `npm run build`.

What remains is photo resampling (Chrome scales the JPEGs slightly differently between captures) and
sub-pixel text rendering; element positions match to within a pixel.

## Known limitations

- **Desktop only**, designed and verified at 1440×900. No mobile layouts, by scope.
- **Behaviour is from the spec, not from the live reference.** The reference can't be driven by tools,
  so interactions (hover states, timings, URL format) follow what `SPEC.md` records rather than an
  automated side-by-side check. Hover and pressed states have no reference screenshot.
- **Text antialiasing in `ref-full.png`.** That capture uses colour-subpixel text while ours is
  greyscale, so text regions keep about 2–3% diff even where glyph positions are identical.
- **The full page is 1px taller** (6257 vs 6256px) because of sub-pixel line-height rounding that
  accumulates down the page; it is invisible at 100% zoom.
- **No-op controls.** Search, booking, map, messaging, review topics and similar controls do nothing,
  as in the reference (SPEC §10.4). Reserve and Share only show a toast.
- **Static data.** Content comes from `data/listing.json`; there is no real backend, auth or booking.
- **Visual captures need a headed browser.** `npm run visual` opens Chromium briefly; the headless
  shell renders photos softer and roughly doubles photo diffs.

## Assets and credits

The Airbnb Cereal font and the listing photos, avatars and UI images in `public/assets/` are the
reference site's assets. They are used only so the clone can be compared with it pixel for pixel, and
are not covered by any licence of this project. All code, styles and icons were written for this
project from measurements; none was copied from the reference.
