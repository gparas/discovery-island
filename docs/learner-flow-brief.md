# Learner flow — design brief

Status: flow and accompanying electricity lesson confirmed by the project owner on 2026-10-19. No implementation or visual direction contract.

## Job and audience

Greek-speaking children aged 8–12, playing at home or on shared classroom devices, need to identify their own progress, choose a physics topic, and investigate a question with Σπίθα. All three surfaces use Operate mode: the child's current task takes priority over decoration.

## Confirmed decisions

- Choose a local profile each time the app opens; create one on first use. No online accounts.
- Design the chooser for a typical 2–6 saved profiles, with scrolling for more; this is not a hard profile limit.
- Use distinct island-themed illustrations as profile avatars. Σπίθα remains the shared guide.
- Present all five topics through labeled locations on the existing island illustration, with a topic list on phones.
- Teach complete circuits in the electricity mission: predict, connect a battery and bulb, then explain why the bulb lights.
- Use short guided stages with one main action at a time: story → prediction → circuit building → explanation → fresh challenge.
- Preserve the original island and Σπίθα artwork and bundled Greek-capable Noto Sans. Inherit the cream, teal, navy, coral, and yellow identity recorded in PRODUCT.md.

## Proposed screen flow

### 1. Profile selection

Selected screen composition: **Welcome + profile grid**, confirmed by the project owner. On desktop, place Σπίθα and the welcome beside a grid of large avatar-and-nickname buttons. On phones, condense the welcome above the grid. Selecting a profile enters directly, without a separate confirmation button. The approved composition is recorded above and implemented in `src/App.tsx` and `src/index.css`. Its local-only reference sketch is `.impeccable/mocks/decision/welcome-grid.html` (gitignored; not available in a fresh clone); its fictional names and schematic avatars are preview content, not seeded user data or final illustration assets.

Lead with «Ποιος εξερευνά σήμερα;», recognizable avatar-and-nickname choices, and «Νέο προφίλ». Keep Σπίθα as a welcoming supporting illustration.

On an empty device, explain briefly that progress stays in this browser and offer profile creation. Creation uses a nickname and an avatar, with a clear way back. Do not request a real name, email, or password. Show validation beside the field and preserve input after an error.

Confirmed creation layout: replace the chooser grid with a short form in the same screen, keeping Σπίθα alongside it. Use «Πίσω στα προφίλ» to return and «Πάμε στο νησί» to continue.

The current implementation is a responsive design preview: fictional profiles and newly entered profiles live only in memory, with explicit preview labeling. Selecting a profile reaches a preview acknowledgement, not a working island map. Empty/duplicate nickname validation and a 24-character limit are provisional UI behaviours to review before production storage. The chooser, first-visit state, and creation form are implemented; durable saving, deletion, and import are not.

Selecting a profile opens its island map. Keep the selected avatar and nickname visible on subsequent screens, with an explicit change-profile action. A refresh inside an active session resumes that profile's saved lesson; a newly opened session starts at the chooser. Switching profiles preserves the previous profile's work.

### 2. Island map

The original island illustration leads. Overlay five labeled topic controls: «Ηλεκτρισμός», «Φως», «Θερμότητα», «Ήχος», «Δυνάμεις». Avoid numbered gates or locks: the winding path must not imply a required topic order.

Selecting a topic reveals its short mission description and an action to start, resume, or replay. On desktop this detail sits beside the map; on phones it sits below the map and its topic list. Keep each topic's state consistent between the illustration and list, and identify the selected topic without relying on colour alone.

For a returning child, offer «Συνέχισε την αποστολή» for the last unfinished mission while leaving other topics accessible. Mark completed missions as completed, never as proof of mastery.

### 3. Electricity mission

Use «Άναψε τη λάμπα» as the working title. A persistent shell carries the profile, return-to-island action, and a short stage indicator. On desktop, place brief guidance beside the experiment; on phones, put the current instruction above the circuit and the main action below it. Keep the board visible during building and explanation.

1. **Story:** Help Σπίθα light a small battery-powered lamp in the lighthouse workshop. One action enters the investigation.
2. **Prediction:** Show one wire connecting the battery and bulb, and ask whether the bulb will light. Record the first answer before experimentation; do not reveal the explanation here.
3. **Build and observe:** Keep the first wire. Children complete or change the circuit using taps/clicks or keyboard controls. Show bulb state and understandable feedback, with undo and optional hints. A correct circuit connects opposite battery poles to separate bulb terminals; reject wire-only shorts. Keep unsuccessful attempts available for revision without punitive scoring.
4. **Explain:** Refer to the child's actual circuit and observation. Offer three short Greek answer choices and explanatory feedback, preserving the first answer separately from retries.
5. **Fresh challenge:** Reposition the battery and bulb and start with no wires. Ask the child to build a working circuit from scratch.
6. **Completion:** Summarize the investigated idea. Make return to the island the main action and replay secondary. Replays preserve first-attempt evidence and access to all topics.

Hints progress from a verbal cue to a highlighted connection to an optional demonstration. Count hints and demonstrations as assistance. Changing support must not reset the lesson.

## States, accessibility, and continuity

- Cover empty and populated profile lists, profile creation/validation, new/in-progress/completed missions, invalid connections, retry feedback, and interrupted lessons.
- Allow profile lists to wrap and scroll without reducing touch targets. Handle long Greek nicknames without hiding profile identity. Profile count limits remain undecided.
- Save lesson stage, connections, answers, and assistance per profile. Announce save failures clearly; never claim work was saved when storage failed.
- Preserve usable content during artwork/font loading and show recoverable feedback for failures.
- Provide visible keyboard focus, labeled terminal controls, an accessible description of circuit connections, and announced state changes. Dragging is never required.
- Keep Greek instructions short, controls comfortably tappable, and layouts usable at enlarged text sizes. Honour reduced motion; learning must not depend on animation or sound.

## Scope and evidence

This brief covers profile selection/creation, the five-topic map, and one complete electricity mission. The first implementation milestone is that end-to-end electricity journey. Development previews must identify the other four lessons as unfinished; they must not appear playable until implemented. The finished release provides all five without progress-based locks.

The existing visual system is evidenced by `../discovery-island-old/src/styles.css`, original artwork in `../discovery-island-old/public/assets/island.png` and `spitha.png`, and bundled Noto Sans assets in that directory. These paths are relative to the repository root and were verified during planning. Preserve the artwork rather than repainting it to fit the new map.

The current React/Vite/Tailwind/Motion foundation remains the implementation target. Reuse verified circuit logic from the old implementation and adapt progress rules for local profiles. Keep static hosting and the existing site identity.

## Open decisions and boundaries

- The lesson structure, Greek prompts, explanation choices, feedback, and detailed behaviour are confirmed in [electricity-lesson.md](electricity-lesson.md).
- Avatar choices, nickname validation, profile management/deletion, and the legacy-progress import mapping need specification before persistent profile data ships. Do not silently discard or overwrite old progress.
- Exact map-label placement must be checked against the original artwork at phone and desktop widths; use the phone list to avoid crowding or obscuring the illustration.
- Other topics' lessons, teacher dashboards, online accounts, cross-device sync, leaderboards, and the Discovery Passport are outside this planning task.
- This brief proposes interaction and layout intent; it does not approve final screen compositions or implement the app.
