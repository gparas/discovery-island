---
version: 1
slug: "src-pages-map-page-tsx"
primary_target: "src/pages/MapPage.tsx"
related_targets: ["src/map/archipelago.css", "src/global.css", "src/map/topics.ts", "public/assets/map/archipelago.png", "public/assets/map/ocean.jpg"]
---

# Topic list + island map

Mode: Operate. Ordinary extension of the existing island identity. The user replaced the full-width Open Archipelago scene with a topic list beside an island scene, preferring performance over a separate phone illustration.

## Direction contract

THESIS: Choose freely among five illustrated topic islands in an open sea. Spatial exploration does not imply sequential map unlocking.

OWN-WORLD: Preserve the Greek name, bundled Noto Sans, cream/teal/navy/coral/yellow identity and original Σπίθα (`public/assets/spitha.webp`). New illustrated scenery belongs to this map surface; it does not replace the global design system.

STORY: “Πού θα εξερευνήσεις σήμερα;” leads to five semantic topic links with real Greek text and progress. Electricity retains its mission count; the four unimplemented topics show “Σύντομα” (Soon) while remaining accessible. Existing progress and interrupted-mission resume behavior remain intact. This extension introduces no persistent profiles.

FIRST VIEWPORT: No visible heading (a visually hidden h1 keeps focus and announcements); the explorer badge lives in the site header. Desktop (≥900px): a 360px topic list beside the island scene, both on the 1280px header measure. Below 900px the list comes first (two columns 560–899px) and the scene becomes a decorative 16:7 banner with no labels. The conditional resume link sits above both.

FORM: Topic cards use transparent WebP thumbnails cut from `archipelago.png` (`thumb-<topic>.webp`, ~15 KB each). The scene ships as `scene-1625.webp` (desktop) and `scene-900.webp` (phones). `scene-desktop.jpg`, `scene-mobile.jpg` and the full atlas are no longer referenced by the page. A purpose-made single-island illustration (from the user's mock) is still pending image generation.

INTERACTION: The list cards are the only accessible topic links; scene labels are aria-hidden, tabIndex -1 pointer shortcuts. Hovering or focusing a card highlights its scene label and vice versa. One tap opens a topic. Reduced motion removes lifts and transitions.

FINISH: Tests, typecheck and lint pass; checked at 1440, 820 and 375px in the browser. No finish review run for this revision.

## Preserved system and separate drift

`DESIGN.md` and `.impeccable/design.json` remain unchanged: the incumbent identity still applies, and the constellation is a surface-specific composition. `PRODUCT.md` also remains unchanged. Its implementation paragraph predates the current map and mission work; that preexisting product-scope drift is outside this documentation change and must not be read as a description of the completed map surface.
