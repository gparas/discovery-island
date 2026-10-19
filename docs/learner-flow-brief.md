# Learner flow — design brief

Status: flow and accompanying electricity lesson confirmed by the project owner on 2026-10-19. Map, topic and mission navigation revised and confirmed the same day (sections 2–4): a map of topic islets replaces the single island illustration, topics hold several missions, and missions inside a topic may require earlier ones. No implementation or visual direction contract.

## Job and audience

Greek-speaking children aged 8–12, playing at home or on shared classroom devices, need to identify their own progress, choose a physics topic, and investigate a question with Σπίθα. All three surfaces use Operate mode: the child's current task takes priority over decoration.

## Confirmed decisions

- Choose a local profile each time the app opens; create one on first use. No online accounts.
- Design the chooser for a typical 2–6 saved profiles, with scrolling for more; this is not a hard profile limit.
- Use distinct island-themed illustrations as profile avatars. Σπίθα remains the shared guide.
- Name the four levels **map → topic → mission → stage**. The map shows five topics; each topic holds several missions; each mission runs through guided stages.
- Present all five topics as isometric islets on one scrolling map, all open from the start. Selecting a topic enters its own topic map, where missions are stations on a path.
- Topics never lock. Inside a topic, a mission may require earlier missions of that topic; the first mission of every topic is always open. Difficulty rises along the topic's path.
- Use URLs `/map`, `/map/:topicId` and `/map/:topicId/:missionId` (for example `/map/electricity/light-the-bulb`). Stages are not in the URL; the lesson resumes at the saved stage.
- Teach complete circuits in the electricity mission: predict, connect a battery and bulb, then explain why the bulb lights.
- Use short guided stages with one main action at a time: story → prediction → circuit building → explanation → fresh challenge.
- Preserve the original Σπίθα artwork and bundled Greek-capable Noto Sans. Inherit the cream, teal, navy, coral, and yellow identity recorded in PRODUCT.md. The map's art direction is reopened: build with flat placeholder islets and stations first, and decide between new isometric artwork and reuse of the original island illustration when the pages are designed.

## Proposed screen flow

### 1. Profile selection

Selected screen composition: **Welcome + profile grid**, confirmed by the project owner. On desktop, place Σπίθα and the welcome beside a grid of large avatar-and-nickname buttons. On phones, condense the welcome above the grid. Selecting a profile enters directly, without a separate confirmation button. The approved composition is recorded above and implemented in `src/layouts/WelcomeLayout.tsx`, `src/components/` and `src/global.css`. Its local-only reference sketch is `.impeccable/mocks/decision/welcome-grid.html` (gitignored; not available in a fresh clone); its fictional names and schematic avatars are preview content, not seeded user data or final illustration assets.

Lead with «Ποιος εξερευνά σήμερα;», recognizable avatar-and-nickname choices, and «Νέο προφίλ». Keep Σπίθα as a welcoming supporting illustration.

On an empty device, explain briefly that progress stays in this browser and offer profile creation. Creation uses a nickname and an avatar, with a clear way back. Do not request a real name, email, or password. Show validation beside the field and preserve input after an error.

Confirmed creation layout: replace the chooser grid with a short form in the same screen, keeping Σπίθα alongside it. Use «Πίσω στα προφίλ» to return and «Πάμε στο νησί» to continue.

The current implementation is a responsive design preview: fictional profiles and newly entered profiles live only in memory, with explicit preview labeling. Selecting a profile reaches a preview acknowledgement, not a working island map. Empty/duplicate nickname validation and a 24-character limit are provisional UI behaviours to review before production storage. The chooser, first-visit state, and creation form are implemented; durable saving, deletion, and import are not.

Selecting a profile opens the map. Keep the selected avatar and nickname visible on subsequent screens, with an explicit change-profile action. A refresh inside an active session resumes that profile's saved lesson; a newly opened session starts at the chooser. Switching profiles preserves the previous profile's work.

### 2. Map (`/map`)

A vertical sea with five floating topic islets joined by stepping stones, in the spirit of a game level map. Each islet carries a landmark that identifies its topic without reading: the lighthouse workshop for «Ηλεκτρισμός», and distinct landmarks for «Φως», «Θερμότητα», «Ήχος» and «Δυνάμεις». The stones are decorative only: every islet can be selected from the start, and nothing implies a required topic order.

On phones the map scrolls top to bottom; on desktop the islets zigzag so the layout does not read as a stretched phone screen. Topic names are real text, not painted into the artwork, so they stay legible, translatable and announced. Each islet is one control whose accessible name includes its progress (for example «Ηλεκτρισμός, 1 από 3 αποστολές»).

For a returning child, offer «Συνέχισε την αποστολή» for the last unfinished mission. Mark completed missions as completed, never as proof of mastery.

Topics without missions yet stay visible and selectable; they open their topic page with a clear «Σύντομα» state rather than appearing playable.

### 3. Topic map (`/map/:topicId`)

The selected islet, shown large, with its missions as numbered stations along a path. Σπίθα stands at the child's current station and moves on after a mission is completed; the path fills in as missions are completed. Selecting a station reveals a detail card with the mission's short description and an action to start, continue, or replay. On desktop the card sits beside the topic map; on phones the stations become a vertical path list with the card below the selection.

A locked station is visible but subdued, and always says what it needs first, for example «Πρώτα: Άναψε τη λάμπα», with a direct way to that mission. Never show a bare padlock. Identify locked, available, in-progress and completed states without relying on colour alone.

Electricity, the first test topic, holds three missions:

| # | Mission | Requires | Spec |
| --- | --- | --- | --- |
| 1 | «Άναψε τη λάμπα» — complete circuits | — | [electricity-lesson.md](electricity-lesson.md), implemented |
| 2 | «Ποιο υλικό βοηθά;» — conductors and insulators | 1 | not yet written |
| 3 | «Έλεγξε το φως» — switches open and close the path | 1 | not yet written |

Missions 2 and 3 may be played in either order once mission 1 is completed. Their titles and subjects come from the original game and need lesson specs before implementation.

### 4. Mission (`/map/:topicId/:missionId`): «Άναψε τη λάμπα»

Use «Άναψε τη λάμπα» as the working title. A persistent shell carries the profile, a return-to-topic-map action, and a short stage indicator. Back actions name the topic they return to, «Πίσω στον Ηλεκτρισμό»; each topic stores its own Greek form (στο Φως, στη Θερμότητα, στον Ήχο, στις Δυνάμεις). On desktop, place brief guidance beside the experiment; on phones, put the current instruction above the circuit and the main action below it. Keep the board visible during building and explanation.

1. **Story:** Help Σπίθα light a small battery-powered lamp in the lighthouse workshop. One action enters the investigation.
2. **Prediction:** Show one wire connecting the battery and bulb, and ask whether the bulb will light. Record the first answer before experimentation; do not reveal the explanation here.
3. **Build and observe:** Keep the first wire. Children complete or change the circuit using taps/clicks or keyboard controls. Show bulb state and understandable feedback, with undo and optional hints. A correct circuit connects opposite battery poles to separate bulb terminals; reject wire-only shorts. Keep unsuccessful attempts available for revision without punitive scoring.
4. **Explain:** Refer to the child's actual circuit and observation. Offer three short Greek answer choices and explanatory feedback, preserving the first answer separately from retries.
5. **Fresh challenge:** Reposition the battery and bulb and start with no wires. Ask the child to build a working circuit from scratch.
6. **Completion:** Summarize the investigated idea. Make return to the topic map the main action, where Σπίθα moves on and any newly available missions appear; replay is secondary. Replays preserve first-attempt evidence and access to all topics.

Hints progress from a verbal cue to a highlighted connection to an optional demonstration. Count hints and demonstrations as assistance. Changing support must not reset the lesson.

## States, accessibility, and continuity

- Cover empty and populated profile lists, profile creation/validation, locked/available/in-progress/completed missions, topics with no missions yet, invalid connections, retry feedback, and interrupted lessons.
- Allow profile lists to wrap and scroll without reducing touch targets. Handle long Greek nicknames without hiding profile identity. Profile count limits remain undecided.
- Save lesson stage, connections, answers, and assistance per profile. Announce save failures clearly; never claim work was saved when storage failed.
- Preserve usable content during artwork/font loading and show recoverable feedback for failures.
- Provide visible keyboard focus, labeled terminal controls, an accessible description of circuit connections, and announced state changes. Dragging is never required.
- Keep Greek instructions short, controls comfortably tappable, and layouts usable at enlarged text sizes. Honour reduced motion; learning must not depend on animation or sound.

## Scope and evidence

This brief covers profile selection/creation, the five-topic map, the electricity topic map, and one complete electricity mission. The first implementation milestone is that end-to-end journey with placeholder artwork: profile → map → electricity topic map → «Άναψε τη λάμπα». Development previews must identify unfinished topics and missions as unfinished; they must not appear playable until implemented. Topics never lock each other; only missions inside a topic may require earlier ones.

The existing visual system is evidenced by `../discovery-island-old/src/styles.css`, original artwork in `../discovery-island-old/public/assets/island.png` and `spitha.png`, and bundled Noto Sans assets in that directory. These paths are relative to the repository root and were verified during planning. Preserve the Σπίθα artwork; the map's own artwork direction is decided when its pages are designed.

The current React/Vite/Tailwind/Motion foundation remains the implementation target. Reuse verified circuit logic from the old implementation and adapt progress rules for local profiles. Keep static hosting and the existing site identity.

## Open decisions and boundaries

- The lesson structure, Greek prompts, explanation choices, feedback, and detailed behaviour are confirmed in [electricity-lesson.md](electricity-lesson.md).
- Avatar choices, nickname validation, profile management/deletion, and the legacy-progress import mapping need specification before persistent profile data ships. Do not silently discard or overwrite old progress.
- Map artwork: new isometric islets versus reuse of the original island illustration, and the landmarks for the four other topics.
- Lesson specs for «Ποιο υλικό βοηθά;» and «Έλεγξε το φως», and the missions of the other four topics.
- The map and topic pages are flat placeholders (`src/pages/MapPage.tsx`, `src/pages/TopicPage.tsx`); old `/island` URLs redirect to `/map`. Their interface copy («Πού θα εξερευνήσεις σήμερα;», «Άλλαξε προφίλ», «Ξεκίνα την αποστολή», «Σε εξέλιξη», «Οι αποστολές για αυτό το θέμα ετοιμάζονται.») awaits the owner's approval.
- Other topics' lessons, teacher dashboards, online accounts, cross-device sync, leaderboards, and the Discovery Passport are outside this planning task.
- This brief proposes interaction and layout intent; it does not approve final screen compositions or implement the app.
