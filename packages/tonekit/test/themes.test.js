import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { DEFAULT_DARK, DEFAULT_LIGHT, TAGS, TOKENS, checkTheme, isHex, themes, themesById } from '../src/index.js'

describe('themes', () => {
  it('have unique kebab-case ids', () => {
    const ids = themes.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  it.each(themes.map((t) => [t.id, t]))('%s has a name, a mode, known tags and 13 hex colours', (_, t) => {
    expect(t.name).toBeTruthy()
    expect(['dark', 'light']).toContain(t.mode)
    expect(t.tags.length).toBeGreaterThan(0)
    for (const tag of t.tags) expect(TAGS).toContain(tag)
    expect(Object.keys(t.colors).sort()).toEqual([...TOKENS].sort())
    for (const token of TOKENS) expect(isHex(t.colors[token]), `${t.id}.${token}`).toBe(true)
    if (t.credit) expect(t.credit.url).toMatch(/^https:\/\//)
  })

  it.each(themes.map((t) => [t.id]))('%s meets every contrast target', (id) => {
    const { pass, results } = checkTheme(id)
    expect(results.filter((r) => !r.pass).map((r) => `${r.fg} on ${r.bg}: ${r.ratio.toFixed(2)} < ${r.min}`)).toEqual([])
    expect(pass).toBe(true)
  })

  it('default dark and light themes exist with the right mode', () => {
    expect(themesById[DEFAULT_DARK].mode).toBe('dark')
    expect(themesById[DEFAULT_LIGHT].mode).toBe('light')
  })

  it('the ThemeId type lists exactly the built-in themes', () => {
    const dts = readFileSync(new URL('../src/index.d.ts', import.meta.url), 'utf8')
    const block = dts.match(/export type ThemeId =([\s\S]*?)\r?\n\r?\n/)[1] // any line endings
    const typed = [...block.matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]).sort()
    expect(typed).toEqual(themes.map((t) => t.id).sort())
  })
})
