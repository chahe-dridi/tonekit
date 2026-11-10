# Changelog

All notable changes to the `tonekit` package are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed

- Published through npm Trusted Publishing from GitHub Actions (no stored token). No change to the package code.

## [0.1.1] - 2026-11-10

### Changed

- Published on npm as `tonekit-themes` (npm does not allow `tonekit`, too close to an existing name). Install with `npm install tonekit-themes`; the brand and site stay tonekit. 0.1.0 was never published.

## [0.1.0] - 2026-11-10

### Added

- 23 colour themes (Midnight, Daylight, Catppuccin Mocha and Latte, Nord, Tokyo Night, Gruvbox, Rosé Pine, Everforest, Kanagawa, Flexoki Light, Ristretto, Miasma, Retro 82, Lumon, Osaka Jade, Hackerman, and more), each with tags and credits, all sharing 13 colour tokens.
- Every theme meets 9 WCAG contrast targets, checked by `checkTheme()` and the test suite.
- `themeToVars`, `themeToCss`, `themesToCss`: themes as CSS custom properties, with `on-` text colours and `-rgb` triples.
- `applyTheme`, `saveTheme`, `loadTheme`, `resolveTheme` and `noFlashScript` for the browser.
- `defineTheme` for your own themes, and colour helpers (`contrast`, `readableOn`, `mix`).
- `tonekit-themes/react`: `ThemeProvider`, `useTheme`, an accessible `ThemePicker`, `ThemeScope` and `ThemeSwatch`.
- `tonekit-themes/themes.css` (every theme, plus OS light/dark defaults) and `tonekit-themes/tailwind.css` (a Tailwind CSS v4 preset).
- TypeScript definitions.
