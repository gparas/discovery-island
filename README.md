# Discovery Island

Fresh React + Vite + Tailwind CSS foundation. Motion is installed for future animation work (`motion/react`). Only a temporary Greek placeholder is implemented; artwork, fonts, screens and lesson logic will follow in separate steps.

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

Preserve `.openai/hosting.json` when migrating the existing site's identity; do not store credentials there. Publication is a later step.
