// After the JS build: write dist/themes.css (every theme as plain CSS),
// copy dist/tailwind.css and the hand-written type definitions.
import { copyFileSync, writeFileSync } from 'node:fs'
import { DEFAULT_DARK, DEFAULT_LIGHT, themes } from '../src/themes.js'
import { themeToCss, themesToCss } from '../src/tokens.js'

const header = `/* tonekit: ${themes.length} themes as CSS variables (--theme-*).
 * <html data-theme="nord"> picks one; without data-theme the page follows the
 * OS setting (${DEFAULT_DARK} / ${DEFAULT_LIGHT}). */\n`
const css = header
  + themeToCss(DEFAULT_DARK, { selector: ':root' })
  + `@media (prefers-color-scheme: light) {\n${themeToCss(DEFAULT_LIGHT, { selector: ':root:not([data-theme])' }).replace(/^/gm, '  ').trimEnd()}\n}\n\n`
  + themesToCss(themes)
writeFileSync('dist/themes.css', css)
copyFileSync('src/tailwind.css', 'dist/tailwind.css')
for (const f of ['index.d.ts', 'react.d.ts']) copyFileSync(`src/${f}`, `dist/${f}`)
console.log(`themes.css: ${themes.length} themes, ${(css.length / 1024).toFixed(1)} kB`)
