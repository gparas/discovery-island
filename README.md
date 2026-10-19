# Discovery Island

React + Vite + Tailwind CSS foundation with a responsive Greek profile-screen design preview. It includes the profile chooser, first-visit state, illustrated avatar selection, nickname validation, and a temporary selection acknowledgement. Motion is installed for future animation work (`motion/react`).

The preview toolbar switches between sample profiles and first visit. All profiles are temporary and reset on refresh; no local storage or legacy progress is read or changed. The island map, lessons, persistent profiles, and migration are not implemented. Approved planning lives in `docs/learner-flow-brief.md` and `docs/electricity-lesson.md`.

## Development

Use Node.js 24 LTS and npm.

```sh
npm ci
npm run dev
```

```sh
npm run lint
npm run build
npm run preview
```

The production output is `dist/`. Configure the eventual static host to fall back to `index.html` for application routes.

## Git and local tooling

Commit source, `package.json`, `package-lock.json`, and shared project guidance. Do not commit dependencies, build output, environment secrets, local editor settings, generated reports, or local skill installations.

Impeccable is installed locally (v4.6.0). Installation documentation: https://impeccable.style/docs/
Keep `PRODUCT.md`, `DESIGN.md`, design briefs, and `.impeccable/config.json` under version control. `.impeccable/config.local.json` and local runtime caches are ignored. Impeccable is local development tooling, not an application dependency. Its installed skills and helper agents are ignored; the portable `.codex/hooks.json` configuration is trackable.

Commit `.impeccable/design.json`, `.impeccable/surfaces/`, and `.impeccable/live/config.json` as shared design guidance. Generated comparison sketches (`.impeccable/mocks/`), review screenshots (`.impeccable/review/`), decision sessions (`.impeccable/questions/`), the comparison payload, and live-mode runtime files stay local. Approved choices and verification summaries are retained in `docs/`; application artwork, fonts, licenses, and asset provenance belong in the repository.

Preserve `.openai/hosting.json` when migrating the existing site's identity; do not store credentials there. Publication is a later step.
