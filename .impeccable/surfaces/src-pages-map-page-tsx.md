---
version: 1
slug: "src-pages-map-page-tsx"
primary_target: "src/pages/MapPage.tsx"
related_targets: ["src/map/archipelago.css", "src/global.css", "src/map/topics.ts", "public/assets/map/archipelago.png", "public/assets/map/ocean.jpg"]
---

# Explorer's Basecamp map

Mode: Operate. Ordinary extension of the existing island identity. The user replaced the full-width Open Archipelago scene with a topic list beside an island scene, preferring performance over a separate phone illustration.

## Direction contract

THESIS: Choose freely among five illustrated topic islands in an open sea. Spatial exploration does not imply sequential map unlocking.

OWN-WORLD: Preserve the Greek name, bundled Noto Sans, cream/teal/navy/coral/yellow identity and original Σπίθα (`public/assets/spitha.webp`). New illustrated scenery belongs to this map surface; it does not replace the global design system.

STORY: “Πού θα εξερευνήσεις σήμερα;” leads to five semantic topic links with real Greek text and progress. Electricity retains its mission count; the four unimplemented topics show “Σύντομα” (Soon) while remaining accessible. Existing progress and interrupted-mission resume behavior remain intact. This extension introduces no persistent profiles.

FIRST VIEWPORT: Approved comp `.impeccable/mocks/map/explorers-basecamp.webp`. Visually hidden h1; explorer badge in the site header. Desktop (≥900px): topic list (up to 400px) on the left; the island illustration on the right, with Σπίθα's panel below it showing the selected topic's goal and «Εξερεύνησε», or «Συνέχισε» for a mission under way. Below 900px: Σπίθα's prompt (or the resume panel), then the list, then the whole island as decoration (no labels).

FORM: The comp's single-island illustration ships as `island-1536.webp` (desktop) and `island-800.webp` (phones), a 3:2 transparent plate with its own cloud edge, from source `art/map/island.png`. Thumbnails `thumb-<topic>.webp` (272×230) are cut from `art/map/thumbs-sheet.png`. Topic labels are HTML pills positioned by percentage boxes over each landmark.

INTERACTION: Cards open their topic in one tap. Pointing at or focusing a card or map label selects that topic (sticky): the card highlights, a pin drops on its map label, and the panel updates. Scene labels are aria-hidden, tabIndex -1 pointer shortcuts. Reduced motion removes the lift, transitions and pin drop.

FINISH: Typecheck, 67 tests and lint pass; label positions checked against the artwork offline, layout checked at 1440 and 375px. No finish review run for this revision.

## Preserved system and separate drift

`DESIGN.md` and `.impeccable/design.json` remain unchanged: the incumbent identity still applies, and the constellation is a surface-specific composition. `PRODUCT.md` also remains unchanged. Its implementation paragraph predates the current map and mission work; that preexisting product-scope drift is outside this documentation change and must not be read as a description of the completed map surface.
