# SPEC.md: Airbnb Listing Clone

Source of truth: https://airbnb-clone-umber-two.vercel.app
Measured at a 1440×900 desktop viewport (inner width 1425px after the 15px scrollbar).
All values below are **measured from the rendered reference**, not copied from its source code.

> Conventions in this file
> - Colours are given as hex. `#222222` = rgb(34,34,34).
> - "1px" borders were reported as 0.8px because the measuring screen had a device-pixel-ratio of 1.25. Use **1px** (and **2px** where 1.6px was reported).
> - `f: 16/500/22.88` means font-size 16px, weight 500, line-height 22.88px.
> - `@x,y w×h` means a page-absolute box at that position (y includes scroll).
> - Content data (all text, image paths, reviews, amenities) lives in `data/listing.json`. Never hard-code content in components.
> - **Reference screenshots** (`tests/reference/`) are 1440px-wide layouts with no scrollbar, so page content sits **8px further right** than the x values in this file (container x=160, not 152). Values marked *Measured* below come from those screenshots and are in their coordinates.

---

## 0. Global tokens

### Colours
| Token | Value | Used for |
|---|---|---|
| `--text` | `#222222` | Primary text, dark borders, selected calendar day |
| `--text-muted` | `#717171` | Secondary text, struck-out amenities |
| `--rausch` | `#FF385C` | Logo, search button, saved heart, host badge |
| `--border` | `#DDDDDD` | Card borders, search bar border, review-score dividers |
| `--divider` | `#EBEBEB` | Section dividers (border-top), header bottom border |
| `--input-border` | `#B0B0B0` | Booking-card date/guest box, calendar keyboard icon, carousel arrows |
| `--bg-subtle` | `#F7F7F7` | Hover bg (most buttons), translated-info box, cancellation box, Claim button |
| `--bg-hover` | `#F2F2F2` | Icon-button hover, Share/Save hover, header globe/menu bg, calendar range fill, Message host bg |
| `--bg-pressed` | `#EBEBEB` | Message host hover |
| `--placeholder` | `#EEEEEE` | Image placeholder bg (before load) |
| `--hairline` | `rgba(0,0,0,0.08)` | Booking card border, sleep-image border, host card border |
| `--reserve-gradient` | `linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%)` | Reserve buttons |
| `--reserve-gradient-hover` | `linear-gradient(to right, #D81B5F 0%, #C31A5B 50%, #BD0463 100%)` | Reserve hover |
| `--map-water` | `#ACD3E6` | Fake map |
| `--map-land` | `#E9F0E4` | Fake map |
| `--map-park` | `#CFE3C8` | Fake map blobs |
| `--map-bg` | `#E8EEF0` | Map container |

### Typography
- Font family: `"Airbnb Cereal VF", Circular, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", sans-serif`
- Variable font, weights 200–900, file `AirbnbCerealVF.woff2` (see §11 Assets).
- `body`: 14px, color `#222`, bg `#fff`, `-webkit-font-smoothing: antialiased`.
- Weights used: 400 (body), 500 (headings, labels, buttons), 700 (rating numbers, booking-card labels).
- Letter-spacing: normal everywhere **except** the big "4.95" in Reviews: `-3px`.

### Shadows
| Name | Value |
|---|---|
| search bar | `0 1px 4px rgba(0,0,0,0.08)` |
| Show all photos button | `0 2px 8px rgba(0,0,0,0.15)` |
| booking card / host card | `0 6px 16px rgba(0,0,0,0.12)` |
| map buttons | `0 2px 6px rgba(0,0,0,0.2)` |
| map pin | `0 4px 12px rgba(0,0,0,0.3)` |

### Motion
| Name | Value |
|---|---|
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` |
| Button hover | `background 0.15s` (+ `transform 0.05s` for press) |
| Icon-button hover (circle 40px) | `background 0.16s, transform 0.08s` |
| Header link hover | `background 0.18s` |
| Image hover overlay | `background 0.2s` on `::after` |
| Reserve | `filter 0.15s, transform 0.05s` |
| Photo tour open/close | `opacity 0.3s, transform 0.3s` `--ease-standard` |
| Photo viewer open/close | `opacity 0.25s` (visibility delayed 0.25s on close) |
| Amenities modal | panel `transform 0.25s --ease-standard`, overlay `opacity 0.2s` |
| Sticky nav show/hide | `transform 0.25s, opacity 0.25s` |
| Toast | `opacity 0.2s, transform 0.2s` |
| `html` | `scroll-behavior: smooth` |

Respect `prefers-reduced-motion: reduce` by setting all durations to ~0 (improvement over reference; document it).

### Focus (keyboard)
`:focus-visible` on all interactive elements: `outline: 2px solid #222; outline-offset: 2px`. Hero image buttons use `outline-offset: 3px`. No outline on mouse click (`:focus:not(:focus-visible)`).

---

## 1. Page skeleton

```
<header> (top bar, NOT sticky)
<main>
  div.container  max-width 1280px, margin 0 auto, padding 0 80px  → content 1120px wide, x=152
    section#photos   title row
    section          hero gallery
    div.grid         two columns: left 652px | gap 96px | right 372px
    div.bottom       full-width sections (reviews, location, host, things to know, more stays)
<StickySectionNav> (fixed, hidden until scroll)
<PhotoTour> <PhotoViewer> <AmenitiesModal>  (overlays)
<Toast>
```
Page total height ≈ 6256px. No footer.

*Measured (ref-top):* text inside `main` renders with **greyscale** antialiasing while header text is subpixel, i.e. the content container is on its own compositing layer. Reproduced with `will-change: opacity` on the container (h1 diff 1.49% → 0.00%). Not `transform`: in GPU Chrome that hint rasterises the photos softer than the reference.

---

## 2. Header (top bar)

- `header`: position relative, z-index 50, bg #fff, padding `0 80px`, height 88px, `border-bottom: 1px solid #EBEBEB`.
- Inner: CSS grid, 3 columns (≈431 / 403 / 431 — i.e. `1fr auto 1fr`), max-width 1760px, height 88px, items vertically centred.

**Left: logo** `<a aria-label="Airbnb homepage">` 103×32, Rausch `#FF385C` wordmark SVG.

**Centre: search pill** `div role="search"`, 403×48, bg #fff, `border: 1px solid #DDDDDD`, radius 40px, padding `0 8px`, shadow `0 1px 4px rgba(0,0,0,0.08)`. Children in a row:
1. Button "Anywhere": 149×48, padding `0 16px`, gap 8px, radius 40px, contains a 48×48 house image (`/assets/images/ui/searchbar-house.png`) then text `14/500 #222`.
2. Vertical divider: 1×24px, bg `#DDDDDD`.
3. Button "Anytime": 88×48, `14/500 #222`.
4. Divider 1×24.
5. Button "Add guests": 106×48, `14/400 #717171`.
   - *Measured (ref-top):* all three labels' ink sits 1px below the button's vertical centre (ink y39–52 in a y20–67 pill); the house image is centred (ink y31–55). Label x: Anywhere 594, Anytime 694, Add guests 783.
6. Search button `aria-label="Search"`: 32×32 circle, bg `#FF385C`, margin-left 8px, white magnifier icon.

**Right: `<nav>`** flex, gap 8px, 221×44:
- Link "Become a host": padding `12px 14px`, radius 22px, `14/500 #222`. Hover bg `#F7F7F7` (transition `background 0.18s`).
- Button `aria-label="Choose a language and currency"`: 40×40 circle, bg `#F2F2F2`, globe icon.
- Button `aria-label="Main navigation menu"`: 40×40 circle, bg `#F2F2F2`, hamburger icon.

Clicking these does nothing (no toast).

---

## 3. Title row (`section#photos`)

- padding `32px 0 18px`, flex, space-between, gap 16px. Height 84.
- `h1`: "Romantic Jacuzzi 1BHK Candolim | Mirashya UG10", `26/500/30 #222`.
- Right: two buttons, gap 2px, each 34px tall, padding `8px 10px`, radius 8px, gap 8px, `14/500 #222`:
  - **Share**: 16px share icon + underlined label "Share". Click → toast "Share options" (§10).
  - *Measured (ref-top):* icon strokes are **1px** at 16px (1.5 units in a 24-unit icon). Share = arrow (shaft centre x1140, tip y≈131.5, 45° head ending x1135/1145) out of an open tray with **square corners** (walls x1134/1145 from y≈139.5, bottom on y144–145). Heart fills the full 16px width (ink 16×14, x1215–1230, y131–144). Underline ≈1px, about 1.5px below the font default (rows 145–146; `text-underline-offset: 2px` is the closest whole-pixel match).
  - **Save**: 16px heart outline + underlined "Save". Click toggles to **"Saved"** with the heart **filled `#FF385C`**; click again reverts. No toast.
  - Hover bg `#F2F2F2`. Transition `background 0.15s, transform 0.05s`.

---

## 4. Hero gallery

- `section aria-label="Photos of this place"`, position relative, 1120×494.
- Grid: columns `560px 272px 272px`, rows `243px 243px`, gap 8px, **radius 12px with overflow hidden** on the grid (only outer corners rounded).
- Image 1 spans both rows in column 1. Images 2–5 fill the 2×2 on the right (2 top-mid, 3 top-right, 4 bottom-mid, 5 bottom-right).
- Each cell is a `<button aria-label="{title} image N">` with bg `#EEEEEE`, position relative, cursor pointer, containing `<img object-fit: cover>` filling it.
- **Hover**: a `::after` overlay on the hovered button goes from transparent to `rgba(0,0,0,0.1)`, `transition: background 0.2s`. Only the hovered image darkens.
- **Click any hero image** → opens Photo Tour scrolled so that image's **room section** sits at the top of the tour scroller (§8.3).
- Image order (from `data/listing.json → hero`): 1 `2367476f…`, 2 `090d8b0b…`, 3 `9be71047…`, 4 `67c61c6f…`, 5 `c904e1ab…`.

**"Show all photos" button**: position absolute, **bottom 24px / right 24px** of the gallery (*measured in ref-top:* box x1113–1255, y612–642 = **143×31**; the earlier "23px / @1106,612 / 143×32" was wrong). Text ink y622–632; icon ink 12×11 (dots on a 7.5-unit pitch in a 24-unit box). bg #fff, `border: 1px solid #222`, radius 8px, padding `7px 15px`, shadow `0 2px 8px rgba(0,0,0,0.15)`, gap 8px, 15px **3×3 dot-grid** icon (filled dots, not squares; verified in ref-top) + text `12/500/16 #222`. Hover bg `#F7F7F7`. Transition `transform 0.1s, background 0.15s`. Click → opens Photo Tour at top.

---

## 5. Left column (652px)

Starts 48px below gallery (y=715). Section blocks stack; from block 4 on, each has `border-top: 1px solid #EBEBEB`.

### 5.1 Overview
- padding-bottom 24px.
- `h2` "Entire serviced apartment in Candolim, India" `22/500/26`.
- Line "3 guests · 1 bedroom · 1 bed · 1 bathroom" `16/400/22.88`.

### 5.2 Guest favourite card
- margin-top 8px. 652×81, `border: 1px solid #DDDDDD`, radius 16px, padding `16px 28px`, flex, align centre, gap 22px.
- Left group (flex gap 4px): laurel-left SVG 23×36, label "Guest<br>favourite" `15/500/17.25`, centred, laurel-right SVG 23×36.
  - **Decision:** use `laurel-left.png` / `laurel-right.png` scaled to 23×36 for now; revisit if pixel-match shows a difference.
- Middle: "One of the most loved homes on Airbnb, according to guests" `14/400/18.2`, width ≈281.
- Right group (flex gap 22px):
  - "4.95" `20/700/28.6` over 5 stars (10×10 each, gap 2px).
  - Divider 1×34 `#DDDDDD`.
  - "19" `20/700/28.6` over "Reviews" `13/500/18.59`.

### 5.3 Host row
- padding `26px 0`, flex gap 16px, align centre.
- Avatar 46×46 circle (`/assets/images/avatars/host.jpeg`).
- "Hosted by Mirashya Homes" `16/500/22.88`; "2 years hosting" `14/400/20.02 #717171`.

### 5.4 Highlights
- padding `32px 0`, flex column, gap 24px.
- 3 rows; each: icon 24×24, gap 24px, text block: title `14/500/20`, subtitle `14/400/20.02 #717171`.
  1. Outdoor entertainment / The pool and alfresco dining are great for summer trips.
  2. Designed for staying cool / Beat the heat with the A/C and ceiling fan.
  3. Self check-in / You can check in with the building staff.

### 5.5 Description
- padding `26px 0 32px`.
- Translation notice box: bg `#F7F7F7`, radius 12px, padding `16px 18px`, height 52: "Some info has been automatically translated. " + link "Show original" (`14/500`, underline). Text `14/400/20.02`.
- `<p>` description: margin-top 8px, `16/400/24`, **collapsed `max-height: 99.2px; overflow: hidden`** (≈4 lines).
- "Show more" button: margin-top 14px, `16/500`, underline, with 14px chevron-right icon. Click → paragraph expands inline (max-height none), label becomes **"Show less"**. Click again collapses.

### 5.6 Where you'll sleep
- padding `32px 0`. `h2` "Where you'll sleep" `22/500/26`.
- Grid 2 × 318px, gap 16px, margin-top 24px.
- Card: image 318×212, radius 8px, `border: 1px solid rgba(0,0,0,0.08)`, object-fit cover; title `15/500/21.45` margin-top 14px; subtitle `14/400/20.02 #717171`.
  - Bedroom / 1 double bed. Living room / 1 sofa.

### 5.7 Amenities (`id="amenities"`)
- padding `32px 0`. `h2` "What this place offers".
- Grid 2 × 322px, **row gap 16px, column gap 8px**, margin-top 24px. 10 items.
- Item: height 32, padding `4px 0`, flex gap 16px, icon 24×24, text `16/400/22.88`.
- Last two items ("Carbon monoxide alarm", "Smoke alarm") are **unavailable**: text `#717171` with `text-decoration: line-through`, and their icons are the struck-out variants.
- Button "Show all 50 amenities": margin-top 24px, 208×48, `16/500`, padding `13px 23px`, radius 12px, `border: 1px solid #222`, bg #fff. Hover bg `#F7F7F7`. Click → Amenities modal (§9).

### 5.8 Calendar
- padding `32px 0`.
- "5 nights in Candolim" `22/500/31.46`; "18 Oct 2026 - 23 Oct 2026" `14/400/20.02 #717171`, margin-top 6px.
- Months area: margin-top 22px, grid 2 × 298px, column gap 56px, position relative.
  - Nav row absolutely positioned at top (y −4px): `button aria-label="Previous month"` at left, `"Next month"` at right, 32×32 circles, 12px chevrons. **They are visual only, clicking does not change months** (reference behaviour).
  - Month title "October 2026" / "November 2026" `16/500/22.88`, centred.
  - Weekday row (S M T W T F S): 7 equal columns, `12/500/17.16`, centred, margin-top 18px.
  - Day grid: 7 columns × ~42.6px square cells, day number `14/400/20.02` centred (flex).
  - **Selected range** 18 → 23 Oct: endpoints (18, 23) are 42.6px circles bg `#222` text #fff; days 19–22 have bg `#F2F2F2`, square (no radius). All other days plain.
  - Days are not interactive.
- Footer (margin-top 18px, space-between): keyboard icon box 30×22 (`border: 1px solid #B0B0B0`, radius 4px) left; "Clear dates" button right, `14/500` underline (no-op).

> **Dates:** Reference shows check-in 18 Oct 2026, check-out 23 Oct 2026, "Free cancellation before 17 October" while viewed on 17 Oct 2026. Put all dates in ONE place (`data/listing.json → booking`). Re-check the reference on a later day: if its dates shift, derive them from today (check-in = tomorrow, 5 nights, cancellation = check-in − 1 day).

---

## 6. Right column (372px): booking sidebar

`aside` (relative, full height of the grid) → inner wrapper **`position: sticky; top: 100px`**.

### 6.1 Discount card
- 372×70, bg #fff, `border: 1px solid #DDDDDD`, radius 12px, padding 16px, flex gap 12px, align centre.
- 32×32 discount icon (`/assets/images/ui/discount.svg`), text "Get 10% off your next stay." + `<br>` + link "Terms apply" (`14/500` underline). Text `14/400/18.2`.
- Button "Claim": bg `#F7F7F7`, radius 8px, padding `8px 14px`, `14/500`. Hover bg `#F2F2F2`. No-op.

### 6.2 Booking card
- margin-top 24px. 372 wide, radius 12px, padding `22px 24px 24px`, `border: 1px solid rgba(0,0,0,0.08)`, shadow `0 6px 16px rgba(0,0,0,0.12)`.
- Price row (flex gap 6px, baseline): "₹28,499" `22/500/31.46` **underlined**; "for 5 nights" `15/400/21.45`.
- Inputs box: margin-top 18px, `border: 1px solid #B0B0B0`, radius 8px.
  - Row 1: 2 equal columns (58px tall), padding `10px 12px`; second column has `border-left: 1px solid #B0B0B0`. Label `10/700/14.3` uppercase ("CHECK-IN" / "CHECKOUT"), value `14/400/20.02` ("10/18/2026" / "10/23/2026").
  - Row 2 (57px): `border-top: 1px solid #B0B0B0`, padding `10px 12px`, label "GUESTS", value "2 guests", 16px chevron-down at right.
- Cancellation box: margin-top 16px, bg `#F7F7F7`, radius 8px, padding 8px, `13/400/18.59 #717171`: "Free cancellation before " + `<b>`"17 October" (`13/500 #222`).
- **Reserve** button: margin-top 18px, full width, 48px tall, radius 999px, `--reserve-gradient`, text `16/500 #fff`. Hover → `--reserve-gradient-hover`. Transition `filter 0.15s, transform 0.05s`. Click → toast "You won't be charged yet".
- "You won't be charged yet" `14/400/20.02 #717171`, centred, margin-top 16px.

### 6.3 Report link
- margin-top 26px, centred, flex gap 8px: 16px flag icon + link "Report this listing" `14/400 #717171` underline.

---

## 7. Bottom full-width sections

Each `section` has padding `48px 0` and (except the first) `border-top: 1px solid #EBEBEB`. The block starts with its own top border at y=2729.

### 7.1 Reviews (`id="reviews"`)
**Header block** (padding `8px 0 40px`, centred):
- Row (flex gap 8px, centred): laurel-left PNG 72×110, "4.95" **`100/500/143`, letter-spacing −3px**, laurel-right PNG 72×110.
- "Guest favourite" `22/500/31.46`.
- "This home is a guest favourite based on ratings, reviews and reliability" `15/400/20.25`, max-width 420px, centred.
- Button "How reviews work" `14/500` underline (no-op).

**Category scores** (padding `8px 0 40px`): grid 7 columns (first ≈211px, rest ≈151px).
- Column 1 "Overall rating" `14/500`: 5 rows (5→1), each grid `8px 1fr`, gap 10px: number `12/400`, bar 4px tall bg `#EBEBEB` radius 2px with fill `#222` (5★ ≈95%, 4★ ≈5%, others 0). Rows gap 3px.
- Columns 2–7 (each padding `0 24px`, `border-left: 1px solid #DDDDDD`): label `14/500/20.02`, value `18/500/25.74` (margin-top 12px), 32×32 icon below (margin-top 8px).
  - Cleanliness 5.0, Accuracy 5.0, Check-in 5.0, Communication 5.0, Location 4.8, Value 4.8.

**Topic chips** (padding `4px 0 30px`): flex row, gap 12px, **`overflow-x: auto`, no wrap, hidden scrollbar** (10 chips overflow the 1120px width; scrollWidth 1522).
- Chip button: 48px tall, radius 16px, padding `13px 18px 13px 14px`, `border: 1px solid #DDDDDD`, bg #fff, gap 8px: 20×20 PNG icon, label `14/500`, count `14/400 #717171`.
- Chips: Comfort 6, Accuracy 5, Hot tub 5, Condition 4, Hospitality 8, Cleanliness 4, Amenities 2, Decor 2, Indoor spaces 2, Location 2.

**Review cards**: grid 2 × 520px, column gap 80px, row gap 48px, padding-bottom 40px. 6 cards.
- Header: avatar 42×42 circle (image, or a letter avatar: `17/500` letter on a coloured bg, see data), gap 12px; name `15/500/21.45`; tenure `13/400/18.59 #717171`.
- Meta row (margin-top 10px, flex gap 6px): 5 stars 10px (gap 1px), "·", date `13/400`.
- Text: margin-top 6px, `15/400/21`, **clamped to 4 lines** (`-webkit-line-clamp: 4`).
- If text exceeds 4 lines → "Show more" button `15/500` underline below; click expands inline, label → "Show less".
- Button "Show all 19 reviews": 190×48, same style as "Show all 50 amenities" (no-op).

### 7.2 Location (`id="location"`)
- `h2` "Where you'll be"; "Candolim, Goa, India" `16/400/22.88` margin-top 24px.
- **Fake map** (no map library): 1120×480, margin-top 24px, radius 12px, bg `#E8EEF0`, position relative, overflow hidden. Inner absolute layer with:
  `background: radial-gradient(circle at 30% 40%, #CFE3C8 0, #CFE3C8 6%, transparent 6%), radial-gradient(circle at 70% 60%, #CFE3C8 0, #CFE3C8 8%, transparent 8%), linear-gradient(115deg, #ACD3E6 0, #ACD3E6 34%, #E9F0E4 34%, #E9F0E4 100%);`
  - Top-left: `button aria-label="Search"` 40×40 circle, bg #fff, shadow `0 2px 6px rgba(0,0,0,0.2)`, offset 12px.
  - Top-right: column gap 8px: "Zoom in" / "Zoom out" 40×40, radius 8px, same shadow, offset 12px.
  - Centre: pin 56×56 circle bg `#222`, shadow `0 4px 12px rgba(0,0,0,0.3)`, white house icon.
- "Exact location will be provided after booking." `14/400` margin-top 18px.
- "Neighbourhood highlights" `18/500/25.74` margin-top 40px; text `15/400/22.5` margin-top 12px; "Show more" button (same as §5.5).

### 7.3 Meet your host
- `h2` "Meet your host". Grid `340px 732px`, gap 48px, margin-top 24px.
- **Host card** 340×260: radius 20px, padding `30px 24px`, `border: 1px solid rgba(0,0,0,0.08)`, shadow `0 6px 16px rgba(0,0,0,0.12)`, grid `1fr 100px`.
  - Left (centred): avatar 88×88 circle + verified badge (28×28 circle bg `#FF385C`, `border: 2px solid #fff`, bottom-right); "Mirashya Homes" `26/500/37.18` (wraps to 2 lines); "Host" `13/400`.
  - Right: `border-left: 1px solid #EBEBEB`, padding-left 20px, 3 stats stacked (each padding `10px 0`, 2nd/3rd have `border-top: 1px solid #EBEBEB`): value `20/500/28.6` ("1,463", "4.68★", "2"), label `12/400/17.16` ("Reviews", "Rating", "Years hosting").
- Below card (margin-top 23px, gap 14px): "Born in the 80s", "Where I went to school: NICMAR GOA", each with 24px icon, `15/400/21.45`.
- **Right column** 732px:
  - "Co-Hosts" `18/500/25.74`; grid 3 columns, row gap 16px, col gap 8px, margin-top 16px; each: 34×34 avatar (image or letter avatar `13/500`) + name `14/400`, gap 10px. 8 co-hosts.
  - "Host details" `18/500` margin-top 30px; "Response rate: 100%<br>Responds within an hour" `15/400/24` margin-top 16px.
  - Button "Message host": margin-top 18px, 145×48, bg `#F2F2F2`, radius 8px, padding `14px 24px`, `15/500`. Hover bg `#EBEBEB`. No-op.
  - Notice row (margin-top 30px, gap 10px): 24px shield icon + "To help protect your payment, always use Airbnb to send money and communicate with hosts." `12/400/17.16 #717171`.

### 7.4 Things to know
- `h2` "Things to know"; grid 3 × 352px, gap 32px, margin-top 24px.
- Each column: 24px icon; title `16/500/22.88` margin-top 18px; lines `14/400/21` (margin-top 14px, then 8px between); "Learn more" link `14/500` underline margin-top 8px.
  - Cancellation policy / "Free cancellation before 17 October. Cancel before check-in on 18 October for a partial refund." / "Review this host's full policy for details."
  - House rules / Check-in after 2:00 pm / Checkout before 11:00 am / 3 guests maximum
  - Safety & property / Carbon monoxide alarm not reported / Smoke alarm not reported / Exterior security cameras on property

### 7.5 More stays nearby
- Header row (32px tall, space-between): `h2` "More stays nearby"; right group (gap 8px): counter "1 / 2" `14/400 #717171`, two 32×32 circle buttons (`border: 1px solid #B0B0B0`, bg #fff, 12px chevrons).
- Track: margin-top 20px, flex gap 20px, `overflow-x: auto`, `scroll-behavior: smooth`, hidden scrollbar, padding-bottom 4px. 8 cards.
- Card 208px wide: image 208×208, radius 12px, cover; title `14/500/20.02` margin-top 8px (wraps to 2 lines max); meta `13/400/18.59`: "₹23,600 " + 10px star + " 4.91".
- Arrows: prev disabled at start (opacity 0.3); click next → scrolls track to the end (scrollLeft 684), counter "2 / 2", next becomes disabled (opacity 0.3), prev enabled. Two pages total.

---

## 8. Overlay: Photo Tour

### 8.1 Container
- `div role="dialog" aria-modal="true" aria-label="Photo tour"`, `position: fixed; inset: 0`, bg #fff, z-index above everything.
- **Closed**: `opacity: 0; transform: translateY(28px); visibility: hidden`.
- **Open**: `opacity: 1; transform: none; visibility: visible`.
- Transition `opacity 0.3s, transform 0.3s` with `cubic-bezier(0.2,0,0,1)` (visibility delayed on close so the fade is seen).
- While open: `body { overflow: hidden }`.
- URL: opening sets `?modal=PHOTO_TOUR_SCROLLABLE` (use `history.pushState`/`replaceState`), closing removes it. Loading the page with that query opens the tour.

### 8.2 Header
- 88px tall, padding `0 32px`, bg #fff, flex space-between, align centre.
- Left: `button aria-label="Back"` 40×40 circle, 18px chevron-left. Hover bg `#F2F2F2`. Click → close tour.
  - *Measured (ref-tour-top / ref-tour-bedroom):* thin chevron-left glyph 8×15, centre (42.5, 44), stroke visibly lighter than the viewer's arrow chevrons (≈1.25px; darkest px `#2B2B2B`). No visible bg at rest.
  - *Measured (confirmed by the user's direct measurement of the reference):* the Back button box starts at **x=24**, i.e. 8px left of the 32px header padding → **`margin-left: -8px`** (box x24–64). The viewer's left button has the same −8px offset (§9).
- Centre (absolute, horizontally centred): `h2` "Photo tour" `16/500/22.88`. *Measured:* text centred at x=720, y≈44.
- Right (gap 2px): `button aria-label="Share"` and `aria-label="Save"`, 40×40 circles, 18px icons.
  - *Measured:* **Share** = open-top tray with an upward arrow out of it (glyph 14×16, centre 1345.5, 43.5). **Save** = outline heart (glyph 18×16, centre 1387.5, 43.5). Centres 42px apart (40 + 2 gap); Save's button right edge ≈1407.5, matching the 32px right padding. Both `#222`, line weight ≈1.5px, no bg at rest.

### 8.3 Scroll body
- Below header: a `div` with `overflow-y: auto`, height `calc(100vh - 88px)`. Inner content max-width 1024px, centred, padding `0 24px 96px`.
- **Category thumbnails** `nav aria-label="Photo categories"`: grid 8 columns × 111.5px, gap 12px (9 items, so "Additional photos" wraps to row 2). *Measured (ref-tour-top):* first thumbnail image at x232–342, y88–192 (111×105): the nav starts flush under the header (no top padding).
  - Each `button aria-label="{room}"`, flex column gap 8px: image 112×105 radius 8px cover; label `14/400 #717171` (wraps).
  - Hover: image `transform: scale(1.04); filter: brightness(0.94)`, transition `transform 0.25s cubic-bezier(0.2,0,0,1), filter 0.2s`. (Image needs an overflow-hidden radius-8 wrapper.)
  - Click → smooth-scroll the tour scroller so that room's section top sits 24px below the header. *Verified (ref-tour-bedroom):* Bedroom's first photo top at y≈127.5 → section top 112 = 88 + 24.
- *Screenshot note:* the tour captures show the browser's own overlay scrollbar thumb (4px wide, `#8B8B8B`, x1436–1439) on the scroller. It is the browser's, not part of the design. Don't style a custom scrollbar, and ignore x≥1432 when diffing tour states.
- **Room sections** `section id="tour-room-{i}"`, margin-top 40px for the first, padding `16px 0 4px`, grid `458px 458px`, column gap 60px, row gap 20px.
  - Left column: **sticky** (`top: 20px`): room title `32/500/35.2`; features line `16/400/22.4 #717171`, joined with "  ·  " (omit line if no features).
  - Right column: flex column gap 12px of photo rows. Pattern given by `layout` in data, e.g. "12121": `1` = one full-width photo 458×305; `2` = two photos 223×149 side by side (gap 12px).
  - Photo `button aria-label="{title} image N"` (N = global index 1–43), radius 8px, overflow hidden, bg `#EEEEEE`; `img` cover, `loading="lazy"`, alt = room name.
  - Photo hover: `img transform: scale(1.04)` (transition `transform 0.4s cubic-bezier(0.2,0,0,1)`) **and** `::after` overlay `rgba(0,0,0,0.08)` (transition `background 0.2s`).
  - Click → open Photo Viewer at that photo.
- Rooms (9) and photo counts: Living room 1 (3), Living room 2 (7), Full kitchen (2), Bedroom (6), Full bathroom (1), Gym (5), Exterior (6), Pool (3), Additional photos (10) = **43 photos**.

### 8.4 Opening behaviour
- From "Show all photos" → scroller at top.
- From hero image N → scroller positioned (instantly, not smooth) so the room containing that photo is at the top (section top 24px below header).
- Closing: Esc key, Back button. Scroll position of the page underneath is preserved.

---

## 9. Overlay: Photo Viewer (Lightbox)

- `div role="dialog" aria-modal="true" aria-label="Photo viewer"`, fixed full-screen, **bg #fff**, above Photo Tour.
- Closed: `opacity 0; visibility hidden`. Open: `opacity 1`. Transition `opacity 0.25s` (visibility `0s linear 0.25s` on close).
- URL: adds `&modalItem={1000 + index}` (index 0-based across all 43 photos), e.g. 4th photo → `modalItem=1003`. Updates on every navigation.

**Header** (absolute top, 72px, padding `0 24px`):
- Left: `button aria-label="Show all photos"` 40×40 circle, 18px **3×3 dot-grid icon** (same icon as the page's "Show all photos" button, §4), **not a chevron** → returns to Photo Tour.
  - *Measured (ref-viewer-4):* glyph 15×15, nine filled dots ≈3px on a ≈6px pitch, `#222`, centre (36, 36). No visible bg at rest.
  - *Measured (confirmed by the user's direct measurement of the reference):* the button box starts at **x=16**, i.e. 8px left of the 24px header padding → **`margin-left: -8px`** (box x16–56). Same offset as the tour's Back button (§8.2).
- Centre (absolute): current room name `16/500/22.88`. *Measured:* centred at x=720, y≈36.
- Right (gap 12px): counter "4 of 43" `14/400/20.02`; `button aria-label="Close"` 40×40 circle, 18px X → returns to Photo Tour.
  - *Measured:* counter ink x1320–1362, y30–40. **Close** = thin X glyph 12×13, centre (1395.5, 36), light stroke (≈1.25px; darkest px `#2A2A2A`), so button box ≈ x1376–1416, consistent with the 24px right padding.

**Image area**: full-screen box with padding `88px 96px`; `img` centred, `object-fit: contain`, fills available space. *Measured (ref-viewer-4, landscape photo):* image box x236–1203, y88–813 = **968×726**, centred at (719.5, 450.5).
- Image changes instantly on navigation (no slide/fade on the img in the reference).

**Arrows**: `button aria-label="Previous"` (left: 20px) and `"Next"` (right: 20px), vertically centred (`top: 50%; transform: translateY(-50%)`), 40×40 circle, bg #fff, `border: 1px solid #222`, 18px chevrons. Hover bg `#F7F7F7`. Transition `background 0.16s, transform 0.08s`.
- *Measured (ref-viewer-4):* circles at x20–59 and x1380–1419, y431–470 (centre y 450.5). Border 1px (antialiased ring, darkest `#222`). Chevron glyphs 8×15 (prev centre 38.5, next 1401), **heavier stroke (≈2px, solid `#222`) than the header icons**.
- **No wrap-around**: at photo 1 "Previous" is `disabled` with opacity 0.28; at photo 43 "Next" is disabled likewise.

**Keyboard**: `ArrowLeft` / `ArrowRight` = previous / next (respect the ends). `Escape` → closes viewer back to Photo Tour (tour stays open, its scroll position unchanged).

---

## 10. Other overlays and feedback

### 10.1 Amenities modal ("Show all 50 amenities")
- Overlay: fixed inset 0, bg `rgba(0,0,0,0.5)`, `opacity` transition 0.2s. Click on overlay closes.
- Panel `role="dialog" aria-modal="true" aria-label="What this place offers"`: 780×804, centred (top 48px), bg #fff, radius 12px, overflow hidden. Closed: `transform: translateY(20px)`, hidden. Open: `transform: none`. Transition `transform 0.25s cubic-bezier(0.2,0,0,1)`.
- Top bar 64px, padding `0 24px`: `button aria-label="Close"` 40×40 circle.
- Body: padding `0 48px 48px`, scrolls internally. `h2` "What this place offers" `22/500/31.46`; then categories: `h3` `18/500/25.74` (margin-top 24px), rows padding `16px 0`, `border-bottom: 1px solid #EBEBEB`, flex gap 16px, 24px icon + `16/400/22.88` text.
- Categories and items: see `data/listing.json → amenitiesAll`.
- Esc closes. URL does not change.

### 10.2 Sticky section nav (appears on scroll)
- `position: fixed; top: 0; left: 0; right: 0`, height 67px (66 + 1px border-bottom `#EBEBEB`), bg #fff, z-index below overlays.
- Hidden: `transform: translateY(-100%); opacity: 0`. Visible: `transform: none; opacity: 1`. Transition `transform 0.25s, opacity 0.25s`.
- **Shows once the hero gallery's bottom edge has scrolled above the top of the viewport** (≈ scrollY ≥ 667); hides again above that.
- Inner: same container as main (max-width 1280, padding `0 80px`), flex space-between.
- Left `nav aria-label="Listing sections"` (gap 4px): links Photos `#photos`, Amenities `#amenities`, Reviews `#reviews`, Location `#location`. Each `14/500/20.02`, padding `22px 8px`, position relative.
  - **Scroll-spy**: the link of the section currently in view gets an `::after` underline: 2px tall, bg `#222`, width = text width (left/right 8px), at the bottom of the link.
  - Clicking smooth-scrolls (via `html { scroll-behavior: smooth }`).
- Right group (gap 20px): price block ("₹28,499" `15/500/18` + "for 5 nights" `13/400/15.6`; second line: 11px star + "4.95 · " + "19 reviews" `13/400`); Reserve button 40px tall, padding `0 20px`, radius 999px, gradient, `14/500 #fff`. Reserve click → same toast.

### 10.3 Toast
- `div role="status" aria-live="polite"`, fixed, bottom-centred (top 840px at 900px viewport, i.e. `bottom: ~32px`; `left: 50%`).
- bg `#222`, text `14/500/20.02 #fff`, radius 8px, padding `14px 22px`.
- Hidden: `opacity 0; transform: translate(-50%, 20px)`. Visible: `opacity 1; transform: translate(-50%, 0)`. Transition `opacity 0.2s, transform 0.2s`.
- Stays ~2 seconds, then hides. A new trigger replaces the text and restarts the timer.
- Triggers: **Share** (title row) → "Share options"; **Reserve** (card or sticky nav) → "You won't be charged yet". Nothing else shows a toast.

### 10.4 No-op controls (reference does nothing)
Claim, Become a host, globe, menu, search pill buttons, Terms apply, Show original, How reviews work, topic chips, Show all 19 reviews, Clear dates, calendar month arrows, map buttons, Message host, Learn more, Report this listing. Keep them as real focusable `button`/`a` elements with correct labels; links use `href="#"` with `preventDefault`.

---

## 11. Accessibility & focus management

What the reference does: dialogs use `role="dialog"`, `aria-modal="true"` and `aria-label`; Esc closes; the toast is `role="status"`; icon buttons have `aria-label`s; images have alt text.

**Known gap in the reference:** it does **not** move focus into an opened dialog, does not trap Tab inside it (Tab reaches the page behind), and so focus "returns" only by accident. We implement the correct WAI-ARIA dialog pattern and document it in the README as a deliberate improvement:
1. On open, move focus to the dialog's first control (Back / Close).
2. Trap Tab / Shift+Tab inside the top-most open dialog.
3. Make the page behind `inert` while any dialog is open.
4. On close, return focus to the element that opened it (hero image, "Show all photos", tour photo, "Show all 50 amenities").
5. Viewer: `aria-live="polite"` on the counter so "5 of 43" is announced.
6. All toggles expose state: Save → `aria-pressed`; Show more → `aria-expanded`.
7. `prefers-reduced-motion` honoured.

Every interactive element must be reachable by Tab, in visual order, with the focus ring in §0.

---

## 12. Assets (download, do not hand-draw)

> **Access note:** the reference sits behind Vercel's Security Checkpoint, which blocks scripted access (`npm run fetch-assets`, and Playwright headless *and* headed both get `429`, "Failed to verify your browser"). Do not try to bypass it. Assets were downloaded manually in a browser and placed with `npm run place-assets -- "<folder>"`; reference screenshots are captured manually.

All under `https://airbnb-clone-umber-two.vercel.app` → save to `public/assets/...` with the **same paths**:
- Font: `/assets/fonts/AirbnbCerealVF.woff2`
- Listing photos: `/assets/images/{uuid}.jpeg`. All 43 tour photos are listed in `data/listing.json → tour`; the 5 hero photos and 2 sleep photos are among them.
- UI: `/assets/images/ui/searchbar-house.png`, `discount.svg`, `laurel-left.png`, `laurel-right.png`
- Review chips: `/assets/images/chips/{comfort,accuracy,hot-tub,condition,hospitality,cleanliness,amenities,decor,indoor-spaces,location}.png`
- Avatars: `/assets/images/avatars/{host,rev1,rev2,rev3,rev4,rev5}.jpeg`, `co1.jpg`, `co2.jpg`, `co3.jpg`
- More stays: `/assets/images/similar/s1.jpeg` … `s6.jpeg`

Icons (share, heart, chevrons, amenity icons, etc.) are inline SVGs in the reference. Recreate them as our own small icon components (24px viewBox, 2px stroke style matching Airbnb's line icons). Do **not** paste SVG markup copied from the reference's DOM.

---

## 13. Out of scope
- Mobile layouts (desktop only, min-width ~1280px).
- Real search, booking, map tiles, auth.
- Backend: data is served from `data/listing.json` through a Next.js route handler `GET /api/listing`.
