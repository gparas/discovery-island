# Το Νησί των Ανακαλύψεων

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Greek-speaking children aged 8–12, using the application both at home and in classrooms. Teachers facilitate classroom activities without accounts, class management, or remote student tracking.

## Product Purpose

Help children explore introductory physics through prediction, virtual experimentation, observation, and explanation. Success means supporting exploration and understanding; completing a mission is participation, not proof of mastery.

## Positioning

A Greek-language physics adventure on an illustrated island, guided by the robot Σπίθα. Concrete virtual experiments connect the island story to ideas children can investigate and revisit.

## Operating Context

- Children play independently at home or participate in teacher-led classroom activities.
- Support phones and desktops, with touch, pointer, and keyboard controls.
- Shared devices support separate local profiles identified by nicknames or avatars. These are local profiles, not online accounts.
- Save each profile's progress on its device and allow interrupted lessons to resume. Cross-device synchronization is outside the agreed release scope.
- Make every topic available from the start, with guided steps inside each mission. Teachers can select a topic to suit their lesson.

## Capabilities and Constraints

### Confirmed first-release scope

Five introductory missions, one for each topic:

1. Electricity
2. Light
3. Heat
4. Sound
5. Forces

This replaces the previous release plan of three sequential electricity missions. The previous implementation is reference material, not the rebuilt application's current feature set. Local profiles and unrestricted topic access are explicit changes to the previous behavior.

Teacher-led use does not introduce teacher accounts, student accounts, class management, or remote progress dashboards. The Discovery Passport remains outside the agreed scope.

### Implementation

- The user selected React, Vite, Tailwind CSS, and Motion. This supersedes the original native-JavaScript-only implementation constraint.
- The current repository contains the working toolchain and a responsive profile-screen design preview: chooser, first-visit state, in-place avatar/nickname form, and selection acknowledgement. Original Σπίθα artwork and bundled Noto Sans are included, with new island-themed avatar illustrations. Profiles are temporary sample/in-memory data; the island map, missions, persistent profiles, and legacy import are not implemented.
- Deliver a static `dist/` application with a hosting fallback to `index.html` for history routes.
- Preserve the original site's identity in `.openai/hosting.json` when migrating hosting, and preserve its existing audience. Do not invent an identity or publish as part of initialization.
- Work incrementally, with discrete reviewable milestones.

### Learning behavior and continuity

- Preserve existing circuit rules in `src/lib/circuit.js` when migrating them, and progress/evidence rules in `src/lib/progress.js`.
- A lit bulb needs opposite battery poles connected to separate terminals. Reject wire-only battery shorts, including paths through shared terminals; a bulb's own conducting path is not a short.
- Preserve lesson steps and connections across refresh and exit/resume. Support changes must not erase progress.
- Count hints and demonstrations as assistance. Preserve first answers separately from retries, replays, and current-run observations.
- Preserve existing saved evidence during migration. The precise mapping from legacy single-user progress and three electricity missions into local profiles and the new five-mission structure is an open decision.
- Replays must not remove access to other topics.
- Run meaningful circuit/progress tests after behavioral changes, and build checks for static packaging.

### Open decisions

- The electricity lesson and learner flow are approved in `docs/electricity-lesson.md` and `docs/learner-flow-brief.md`. The other four introductory missions still need learning objectives, experiments, stories, and challenges.
- Reading and support adaptations across ages 8–12.
- Profile chooser and in-place creation layout are approved in `docs/learner-flow-brief.md`. Final validation policy, persistent storage, deletion, and legacy-progress import details remain open.
- The exact teacher facilitation materials or controls, if any; teacher-led use alone does not imply additional tools.

## Brand Commitments

Preserve the name Το Νησί των Ανακαλύψεων, the original island and Σπίθα artwork, the approved cream/teal/navy/coral/yellow identity, and bundled Noto Sans for Greek rendering. Greek is the user-facing language. These are user-approved preservation commitments, not a new design specification.

## Evidence on Hand

- `package.json`, `vite.config.js`, and `src/` establish the React/Vite/Tailwind foundation and installed Motion package.
- The previous implementation contains reference artwork, fonts, Greek content, and circuit/progress logic with tests, as inspected earlier in this conversation. Its relocated filesystem path must be verified before migration.
- No completed five-topic curriculum or learner evaluation has been supplied for this rebuild. Do not invent educational outcomes, testimonials, certification, or official curriculum endorsement.

## Product Principles

1. Let children predict and investigate before explaining results.
2. Keep experiments scientifically coherent and appropriate for the intended age range.
3. Preserve individual continuity on shared devices without requiring online accounts.
4. Let children and teachers choose topics while guiding the steps within a mission.
5. Distinguish completion, first attempts, assistance, and later practice honestly.

## Accessibility & Inclusion

Preserve tap and keyboard connection controls, descriptive screen-reader experiment topology, visible and meaningful focus, and reduced-motion support. All important actions must work on phones and desktops. Success must not depend on animation or audio. Use readable Greek and preserve adjustable support without resetting progress.
