// Colour helpers: plain functions on hex strings ('#rrggbb' or '#rgb').

/** '#3b82f6' → [59, 130, 246] */
export function hexToRgb(hex) {
  const h = String(hex).replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** [59, 130, 246] → '#3b82f6' */
export const rgbToHex = (rgb) => `#${rgb.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('')}`

const channel = (c) => {
  const v = c / 255
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

/** Relative luminance (WCAG), 0 for black to 1 for white. */
export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/** WCAG contrast ratio between two colours, from 1 to 21. */
export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const NEAR_BLACK = '#0b0b0f'

/** Near-black or white, whichever reads better on `hex`. */
export const readableOn = (hex) => (contrast(hex, NEAR_BLACK) >= contrast(hex, '#ffffff') ? NEAR_BLACK : '#ffffff')

/** Mix two colours: weight 0 gives `a`, 1 gives `b`. */
export function mix(a, b, weight) {
  const ca = hexToRgb(a)
  const cb = hexToRgb(b)
  return rgbToHex(ca.map((v, i) => v + (cb[i] - v) * weight))
}

/** '#3b82f6' → '59, 130, 246', for rgba(var(--x-rgb), 0.5) */
export const rgbTriple = (hex) => hexToRgb(hex).join(', ')

export const isHex = (v) => typeof v === 'string' && /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)
