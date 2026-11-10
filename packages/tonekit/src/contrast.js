// Accessibility checks: every theme is held to these WCAG contrast targets.

import { contrast, readableOn } from './color.js'
import { getTheme } from './tokens.js'

/** [foreground token, background token, minimum ratio, what it is for] */
export const CONTRAST_CHECKS = [
  ['text', 'bg', 7, 'Body text'],
  ['text', 'surface', 4.5, 'Text on cards'],
  ['textMuted', 'bg', 4.5, 'Secondary text'],
  ['textMuted', 'surface', 4.5, 'Secondary text on cards'],
  ['textSubtle', 'bg', 3, 'Captions and placeholders'],
  ['primary', 'bg', 4.5, 'Links and primary actions'],
  ['primary', 'surface', 3, 'Primary on cards'],
  ['accent', 'bg', 3, 'Accent highlights'],
]

/**
 * Check a theme against the contrast targets. Returns every pair with its
 * ratio, plus the button text on `primary`, and `pass` when all meet them.
 */
export function checkTheme(themeOrId) {
  const { colors: c } = getTheme(themeOrId)
  const results = CONTRAST_CHECKS.map(([fg, bg, min, label]) => {
    const ratio = contrast(c[fg], c[bg])
    return { fg, bg, min, label, ratio, pass: ratio >= min }
  })
  const onPrimary = readableOn(c.primary)
  const ratio = contrast(onPrimary, c.primary)
  results.push({ fg: 'onPrimary', bg: 'primary', min: 4.5, label: 'Button text on primary', ratio, pass: ratio >= 4.5 })
  return { pass: results.every((r) => r.pass), results }
}
