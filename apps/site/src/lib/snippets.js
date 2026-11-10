// Ready-to-copy code for a theme, in each format the docs describe.
import { TOKENS, themeToCss } from 'tonekit-themes'

export const cssFor = (theme) => themeToCss(theme, { selector: ':root' })

export const jsonFor = (theme) => JSON.stringify({ id: theme.id, name: theme.name, mode: theme.mode, colors: theme.colors }, null, 2)

export const defineFor = (theme) => `import { defineTheme } from 'tonekit-themes'

export const ${camel(theme.id)} = defineTheme({
  id: '${theme.id}',
  name: '${theme.name.replace(/'/g, "\'")}',
  mode: '${theme.mode}',
  colors: {
${TOKENS.map((t) => `    ${t}: '${theme.colors[t]}',`).join('\n')}
  },
})`

export const htmlFor = (theme) => `<link rel="stylesheet" href="https://unpkg.com/tonekit-themes/dist/themes.css">
<html data-theme="${theme.id}">`

export const reactFor = (theme) => `import { ThemeProvider, ThemePicker } from 'tonekit-themes/react'

<ThemeProvider defaultTheme="${theme.id}">
  <ThemePicker />
  <App />
</ThemeProvider>`

function camel(id) {
  const s = id.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
  return /^[0-9]/.test(s) ? `theme${s}` : s
}
