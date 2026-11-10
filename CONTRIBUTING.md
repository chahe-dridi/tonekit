# Contributing to tonekit

Thanks for helping. New themes, fixes and docs improvements are all welcome.

## Setup

```bash
npm install
npm run dev     # showcase site at http://localhost:5173, reloading the library from source
npm test
```

CI runs the tests and both builds on every pull request.

## Branching model

- **`main`**: the released branch. npm releases are tagged from it, and the README images load from it. Nothing is pushed here directly; it only receives tested merges from `dev`.
- **`dev`**: the integration branch. Every change lands here first.
- **`feat/*`, `fix/*`, `theme/*`, `docs/*`**: short-lived working branches, one per change.

**Pull requests always target `dev`.** When `dev` is stable, a maintainer merges it into `main` and cuts a release.

```
theme/my-theme  ──PR──▶  dev  ──(tested)──▶  main  ──▶  npm release
```

```bash
git checkout dev && git pull
git checkout -b theme/my-theme
# …commit…
git push -u origin theme/my-theme   # then open the PR with base: dev
```

## Adding a theme

1. Add it to `packages/tonekit/src/themes.js`: an `id` (kebab-case), `name`, `mode`, one or more `tags` from the list at the bottom of the file, a `credit` with a link if it follows a published palette, and all 13 `colors` as hex.
2. Add the id to the `ThemeId` type in `packages/tonekit/src/index.d.ts`.
3. Run `npm test`. It checks the shape, the tags, the type list and every contrast target. If a contrast check fails, the [theme builder](https://tonekit-gamma.vercel.app/create) can suggest fixed colours.
4. Look at it on the site: `npm run dev`, then `/themes/<id>`.

## Commits

Keep commits small and focused, one change each, with a message that says what changed and why. A prefix helps the changelog: `feat:`, `fix:`, `docs:`, `site:`, `chore:`, `build:`.

Add a line under `## [Unreleased]` in [CHANGELOG.md](https://github.com/chahe-dridi/tonekit/blob/main/CHANGELOG.md) for anything a user of the package would notice.
