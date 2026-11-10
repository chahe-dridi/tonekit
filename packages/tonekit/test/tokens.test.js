import { describe, expect, it } from 'vitest'
import {
  contrast, defineTheme, getTheme, mix, readableOn, themeToCss, themeToVars, themesToCss, themes,
} from '../src/index.js'

describe('themeToVars', () => {
  it('gives every token, on-primary and rgb triples', () => {
    const vars = themeToVars('nord')
    expect(vars['--theme-bg']).toBe('#2e3440')
    expect(vars['--theme-text-muted']).toBe(getTheme('nord').colors.textMuted)
    expect(vars['--theme-on-primary']).toMatch(/^#/)
    expect(vars['--theme-primary-rgb']).toMatch(/^\d+, \d+, \d+$/)
    expect(Object.keys(vars)).toHaveLength(13 + 1 + 8)
  })
  it('takes a prefix', () => {
    expect(Object.keys(themeToVars('nord', { prefix: 'tk' })).every((k) => k.startsWith('--tk-'))).toBe(true)
  })
})

describe('CSS output', () => {
  it('scopes a theme to its data-theme attribute', () => {
    const css = themeToCss('gruvbox')
    expect(css.startsWith('[data-theme="gruvbox"] {')).toBe(true)
    expect(css).toContain('color-scheme: dark;')
  })
  it('writes one rule per theme', () => {
    expect(themesToCss().match(/\[data-theme=/g)).toHaveLength(themes.length)
  })
})

describe('defineTheme', () => {
  it('fills missing colours from a base theme', () => {
    const t = defineTheme({ id: 'brand', base: 'nord', colors: { primary: '#ff0066' } })
    expect(t.colors.primary).toBe('#ff0066')
    expect(t.colors.bg).toBe(getTheme('nord').colors.bg)
    expect(t.mode).toBe('dark')
  })
  it('rejects missing or non-hex colours', () => {
    expect(() => defineTheme({ id: 'x', colors: { bg: '#000' } })).toThrow(/missing/)
    expect(() => defineTheme({ id: 'x', base: 'nord', colors: { bg: 'red' } })).toThrow(/non-hex/)
  })
})

describe('colour helpers', () => {
  it('computes WCAG contrast', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 5)
    expect(contrast('#777777', '#777777')).toBeCloseTo(1, 5)
  })
  it('picks readable text and mixes', () => {
    expect(readableOn('#ffffff')).toBe('#0b0b0f')
    expect(readableOn('#000000')).toBe('#ffffff')
    expect(mix('#000000', '#ffffff', 0.5)).toBe('#808080')
  })
  it('throws on unknown theme ids', () => {
    expect(() => getTheme('nope')).toThrow(/unknown theme/)
  })
})
