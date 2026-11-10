// The token list, theme lookup and theme → CSS variables.

import { themes, themesById } from './themes.js'
import { isHex, readableOn, rgbTriple } from './color.js'

/** The 13 colour tokens every theme defines, in display order. */
export const TOKENS = [
  'bg', 'bgAlt', 'surface', 'surfaceAlt', 'border',
  'text', 'textMuted', 'textSubtle',
  'primary', 'accent',
  'success', 'warning', 'danger',
]

// tokens that also get an "-rgb" triple, for translucent tints
const RGB_TOKENS = ['bg', 'surface', 'text', 'primary', 'accent', 'success', 'warning', 'danger']

/** camelCase token → kebab-case variable name: textMuted → text-muted */
export const tokenToVar = (token) => token.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

/** A theme by id, or the theme object itself. Throws on an unknown id. */
export function getTheme(themeOrId) {
  if (themeOrId && typeof themeOrId === 'object') return themeOrId
  const theme = themesById[themeOrId]
  if (!theme) throw new Error(`tonekit: unknown theme "${themeOrId}". Known: ${themes.map((t) => t.id).join(', ')}`)
  return theme
}

/**
 * Build a theme from your own colours. Missing tokens are derived from the
 * ones you give (and from `base`, a theme or theme id), and every value is
 * checked to be a hex colour.
 */
export function defineTheme({ id, name, mode, colors = {}, base, tags = [], credit } = {}) {
  if (!id) throw new Error('tonekit: defineTheme needs an id')
  const from = base ? getTheme(base) : null
  const merged = { ...(from?.colors || {}), ...colors }
  const missing = TOKENS.filter((t) => !merged[t])
  if (missing.length) throw new Error(`tonekit: theme "${id}" is missing ${missing.join(', ')} (pass them, or a base theme)`)
  const bad = TOKENS.filter((t) => !isHex(merged[t]))
  if (bad.length) throw new Error(`tonekit: theme "${id}" has non-hex colours for ${bad.join(', ')}`)
  return {
    id,
    name: name || id,
    mode: mode || from?.mode || 'dark',
    tags,
    ...(credit && { credit }),
    colors: Object.fromEntries(TOKENS.map((t) => [t, merged[t]])),
  }
}

// colours that get an "on-" partner: black or white text that reads on them
const ON_TOKENS = ['primary', 'accent', 'success', 'warning', 'danger']

/**
 * The CSS custom properties for a theme:
 * --theme-bg … --theme-danger; --theme-on-primary, -on-accent, -on-success,
 * -on-warning and -on-danger (black or white text for solid buttons and
 * badges); and --theme-*-rgb triples for rgba(var(--theme-primary-rgb), .2).
 * `prefix` renames them: { prefix: 'tk' } gives --tk-bg.
 */
export function themeToVars(themeOrId, { prefix = 'theme' } = {}) {
  const { colors } = getTheme(themeOrId)
  const v = (name) => `--${prefix}-${name}`
  const vars = {}
  for (const t of TOKENS) vars[v(tokenToVar(t))] = colors[t]
  for (const t of ON_TOKENS) vars[v(`on-${t}`)] = readableOn(colors[t])
  for (const t of RGB_TOKENS) vars[v(`${tokenToVar(t)}-rgb`)] = rgbTriple(colors[t])
  return vars
}

/** One theme as a CSS rule, by default `[data-theme="<id>"] { … }`. */
export function themeToCss(themeOrId, { selector, prefix } = {}) {
  const theme = getTheme(themeOrId)
  const body = Object.entries(themeToVars(theme, { prefix })).map(([k, val]) => `  ${k}: ${val};`).join('\n')
  return `${selector || `[data-theme="${theme.id}"]`} {\n  color-scheme: ${theme.mode};\n${body}\n}\n`
}

/** A stylesheet for many themes (all by default), one rule each. */
export const themesToCss = (list = themes, options) => list.map((t) => themeToCss(t, options)).join('\n')
