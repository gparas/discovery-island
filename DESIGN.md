---
name: "Το Νησί των Ανακαλύψεων"
description: "Existing island identity, extracted from the responsive profile design preview."
colors:
  cream: "#fff9ee"
  paper: "#fffdf8"
  navy: "#16324f"
  muted: "#526676"
  teal: "#087f8c"
  teal-dark: "#056570"
  line: "#d9ded5"
  seafoam: "#e5f4f0"
  coral: "#ff7b6b"
  yellow: "#ffd166"
  white: "#ffffff"
  teal-pressed: "#044d56"
  seafoam-pressed: "#cde9e4"
  field-border: "#718884"
  secondary-border: "#7b9d9b"
  error: "#a1372b"
typography:
  display:
    fontFamily: "Noto, system-ui, sans-serif"
    fontSize: "42px"
    fontWeight: 850
    lineHeight: 1.16
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Noto, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Noto, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 800
    lineHeight: 1.4
  body:
    fontFamily: "Noto, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: "Noto, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 800
    lineHeight: 1.5
  support:
    fontFamily: "Noto, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  control: "12px"
  card: "16px"
  avatar: "50%"
spacing:
  step-8: "8px"
  step-12: "12px"
  step-16: "16px"
  step-18: "18px"
  step-20: "20px"
  step-22: "22px"
  step-24: "24px"
  step-28: "28px"
  step-30: "30px"
  step-32: "32px"
components:
  button-primary:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "13px 22px"
  button-primary-hover:
    backgroundColor: "{colors.teal-dark}"
  button-primary-active:
    backgroundColor: "{colors.teal-pressed}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.teal-dark}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "13px 22px"
  button-secondary-hover:
    backgroundColor: "{colors.seafoam}"
  button-back:
    backgroundColor: "transparent"
    textColor: "{colors.teal-dark}"
    padding: "8px 0"
  input-nickname:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.navy}"
    rounded: "{rounded.control}"
    padding: "14px 16px"
  profile-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.navy}"
    rounded: "{rounded.card}"
    padding: "18px 10px 20px"
  profile-card-hover:
    backgroundColor: "{colors.seafoam}"
  brand-navigation:
    textColor: "{colors.navy}"
---

# Design System: Το Νησί των Ανακαλύψεων

## Overview

**Creative North Star: "Το Νησί των Ανακαλύψεων"**

The existing island identity pairs warm cream surfaces and navy Greek text with teal controls, yellow accents and original illustrated artwork. Preserve the name, bundled Noto Sans, the original island and Σπίθα artwork, and the cream/teal/navy/coral/yellow palette established in PRODUCT.md.

This is a scan of the implemented profile design preview in src/layouts/WelcomeLayout.tsx, its profile components and src/global.css, not a specification for completed missions or production profile persistence. The welcome-and-choice composition belongs to this surface; future screens inherit the identity, not its grid.

**Key Characteristics:**
- Warm, light surfaces with readable Greek typography.
- Original Σπίθα and illustrated island objects give the interface its character.
- Clear teal actions, quiet borders and visible keyboard focus.

## Colors

Warm cream and paper support dark navy text, with teal signaling actions and soft seafoam signaling interaction.

### Primary

- **Island teal** (`teal`): primary buttons, brand-mark background and selected avatar borders.
- **Deep teal** (`teal-dark`): emphasized heading words, secondary actions, focus outlines and primary-button hover.

### Secondary

- **Sun yellow** (`yellow`): brand lightning mark and selected text background.
- **Coral** (`coral`): retained identity token and artwork accent; not currently assigned to a control surface.

### Tertiary

- **Seafoam** (`seafoam`): hovered cards and secondary buttons, selected avatar options.

### Neutral

- **Cream** (`cream`): page canvas. **Paper** (`paper`): cards and text fields.
- **Navy** (`navy`): main text. **Muted blue-gray** (`muted`): supporting text.
- **Quiet green-gray** (`line`): card edges and header/footer dividers. Stronger field and secondary-action border tokens distinguish controls from separators.
- White labels contrast with teal buttons. Error red is reserved for the nickname field's error text and border.

## Typography

The bundled Noto Sans variable font is registered as **Noto**, followed by system-ui and sans-serif. The same family covers headings, Greek labels and supporting text; there is no separate display or mono face.

The frontmatter records desktop roles: display for the welcome, headline for the form, title for profile nicknames, body for welcome copy, label for action buttons, and support for explanatory notes. These are extracted roles, not a newly imposed proportional scale. Strong weights distinguish hierarchy; welcome and form headings use slightly tightened tracking.

In this profile preview, the welcome heading becomes 36px below 1100px and 29px with 1.2 line height below 760px. Mobile welcome copy is 14px with 1.75 line height; form headings are 25px. Nicknames wrap anywhere rather than overflowing. Character counts use tabular numerals.

## Layout

Shared visual traits are generous whitespace, clear grouping, restrained separators and controls that work with touch and keyboard. Exact composition below describes the **current profile surface only**, as governed by `.impeccable/surfaces/src-app-tsx.md`.

The header is capped at 1280px. The profile region is capped at 1184px with 32px horizontal padding, a 390px welcome column, a flexible choice column and a 72px gap. At 1100px the welcome column becomes 310px and the gap 36px. Below 760px the surface stacks with 24px horizontal padding; welcome copy and a smaller Σπίθα share a row above the choices.

Profile choices use three columns with 16px gaps on desktop and two columns with 12px gaps on mobile. The form replaces the choice region. Its six avatar choices become three columns below 1100px. These counts and breakpoints are observed profile behavior, not requirements for future island or mission layouts.

The preview toolbar wraps on narrow screens while retaining both disclosure and controls. The footer becomes stacked. Primary and secondary actions have a 52px minimum height, the nickname field 56px, and the back action 44px.

## Elevation & Depth

The interface uses no CSS shadows. Paper surfaces, thin borders and seafoam interaction fills establish separation; rendered shading belongs to the illustration assets. Do not infer a raised-card system from the artwork's depth.

## Shapes

Controls use softly rounded corners; cards use the larger radius recorded in frontmatter. Avatar art sits within circular pastel grounds. The brand mark has an asymmetric lower-left corner (16px 16px 16px 6px), preserving a recognizable small silhouette. Input and card borders are 1px; selected avatar options use a 2px teal border plus a checkmark.

## Components

### Buttons

Solid teal primary actions use white, bold labels and optional inline arrow icons. Hover darkens to deep teal; pressing uses the darker pressed token. Outlined secondary actions have transparent backgrounds, deep-teal text and a seafoam hover fill. The back action is an unfilled text-and-arrow control.

Button background transitions last 160ms with the CSS default easing. Reduced-motion preferences disable button transitions. There is no entrance animation. Keyboard focus uses a 3px deep-teal outline offset by 4px.

### Cards / Containers

Profile cards are complete buttons with a circular illustrated avatar and bold nickname. Hover changes the background and border; an arrow appears on hover or keyboard focus. Pressed fill uses the seafoam-pressed token. Their padding and grid arrangement are specific to profile choice, not a global content-card prescription.

### Inputs / Fields

The nickname field has a paper fill, stronger green-gray border, navy 18px text and deep-teal caret. Helper text, character count and inline error text remain outside the field. Errors change the border and text to error red and are announced with an alert. No disabled-input treatment is implemented.

Avatar choices are native radio inputs wrapped by labeled visual options. Selection combines teal border, seafoam fill and checkmark; keyboard focus outlines the whole option (3px, offset 3px). The six illustrations—boat, lighthouse, shell, leaf, sun and fish—come from `public/assets/island-avatars.png`, a three-by-two raster sprite. Preserve its artwork rather than replacing these images with generic icons.

### Navigation

The brand links to the main region; the current surface has no tab bar or full application navigation. The back control returns from the creation form. A skip link remains focusable while clipped and positioned offscreen, then becomes visible on focus. After a view change, focus moves to the destination heading.

### Original artwork and preview context

Σπίθα uses `public/assets/spitha.webp`; the brand mark uses an inline lightning SVG. The raster mascot supplies the welcome's character while the six avatars aid profile recognition. The preview toolbar and completion message explicitly identify this as a temporary design demonstration without storage. Do not generalize the toolbar into production navigation.

## Do's and Don'ts

### Do:

- Do preserve the approved name, palette, original artwork and bundled Greek font.
- Do use visible focus and keyboard-operable controls alongside touch interaction.
- Do keep the preview disclosure visible on mobile and desktop while this remains a preview.
- Do scope the observed profile grid and welcome composition to the profile surface.

### Don't:

- Don't replace Σπίθα or the identity with an unrelated visual direction.
- Don't make successful interaction depend on animation or audio.
- Don't describe temporary preview profiles as persistent production data.
- Don't treat coral as an observed action or error color; it is a preserved identity accent.
