# CLAUDE.md

Project rules for Claude Code. Read this first in every session.

@AGENTS.md

This project uses Next.js 16. Its APIs differ from older versions, so follow AGENTS.md above and check `node_modules/next/dist/docs/` before using a Next.js API you are unsure of.

## What we are building
A pixel-perfect, behaviour-perfect clone of one Airbnb listing page (desktop only), with two overlays: **Photo Tour** and **Photo Viewer (lightbox)**, plus the amenities modal, sticky section nav and toast that live on the same page.

- **Reference (single source of truth):** https://airbnb-clone-umber-two.vercel.app
- **Spec:** `SPEC.md`. Every measurement, colour, timing and behaviour is there. Read the relevant section before touching a component.
- **Content:** `data/listing.json`. All text, images, reviews and amenities come from here. Never hard-code content in components.

## Hard rules
1. **Never copy the reference's code.** Do not download, read, or paste its JS/CSS bundles, class names or SVG markup. We rebuild from measurements in `SPEC.md` and from screenshots. Images and the font are assets and are fine to download (`npm run fetch-assets`).
2. **Measure, don't guess.** If a value is missing from `SPEC.md`, ask the `ui-inspector` agent to check the reference with a screenshot, then add the value to `SPEC.md` before using it.
3. **Desktop only.** Target viewport 1440×900. No mobile breakpoints.
4. **Accessibility is part of "done"** (SPEC §11): focus moves into dialogs, Tab is trapped, Esc closes, focus returns to the trigger, visible `:focus-visible` ring, correct roles and labels.
5. Keep scope tight. No features the reference doesn't have.

## Stack
- Next.js (App Router) + TypeScript (strict) + **CSS Modules**. No Tailwind, no UI kits.
- Design tokens as CSS custom properties in `app/globals.css` (names from SPEC §0).
- Data: `data/listing.json`, typed in `lib/types.ts`, served by `app/api/listing/route.ts` and read server-side by the page.
- Font loaded with `@font-face` from `/public/assets/fonts/AirbnbCerealVF.woff2`.
- Icons: our own small SVG components in `components/icons/`, line style, `currentColor`.
- Testing: Playwright for visual comparison and keyboard tests (`tests/`).

## Folder structure
```
app/            layout.tsx, page.tsx, globals.css, api/listing/route.ts
components/
  layout/       Header, StickyNav, Toast
  listing/      TitleRow, HeroGallery, Overview, GuestFavourite, HostRow, Highlights,
                Description, Sleep, Amenities, Calendar, BookingSidebar,
                Reviews, Location, MeetHost, ThingsToKnow, MoreStays
  overlays/     PhotoTour, PhotoViewer, AmenitiesModal, Dialog (shared a11y logic)
  icons/
hooks/          useFocusTrap, useScrollSpy, useBodyScrollLock, useToast, useModalUrl
lib/            types.ts, data.ts, photos.ts (flattened 43-photo index)
data/           listing.json, assets.txt
tests/          visual.spec.ts, keyboard.spec.ts
scripts/        fetch-assets.mjs
```
One component per file, one CSS module per component, named the same.

## Coding conventions
- Function components, named exports, props typed with interfaces.
- No `any`. No inline styles except dynamic values (e.g. a bar width).
- Interactive things are real `<button>` or `<a>` elements, never clickable `<div>`s.
- Overlay state lives in one place (`PhotoTour` + `PhotoViewer` controlled by the page) and is mirrored to the URL as in SPEC §8.1 / §9.
- Transitions use the exact durations and easing from SPEC §0 "Motion".

## How to work
- Build one section at a time, in SPEC order. After each one: run the app, run the `pixel-match` skill on that section, fix differences, then move on.
- Use subagents:
  - `ui-inspector`: look at the reference and report exact values for something missing from SPEC.md.
  - `component-builder`: implement a section from SPEC.md.
  - `a11y-reviewer`: audit keyboard and screen-reader behaviour after each overlay.
  - `visual-qa`: screenshot the reference and our build at 1440×900 and list differences.
- Before calling anything finished: `npm run lint`, `npx tsc --noEmit`, `npm run build` all pass.

## Commands
- `npm run dev`: local dev server on http://localhost:3000
- `npm run fetch-assets`: download images and font listed in `data/assets.txt` into `public/`
- `npx playwright test`: visual and keyboard tests
