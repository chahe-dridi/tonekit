// Browser side: apply a theme to the page, remember the choice, follow the
// system light/dark setting, and avoid a flash of the wrong theme on load.
// Every function is safe to import during server rendering (they only touch
// window/document when called).

import { DEFAULT_DARK, DEFAULT_LIGHT } from './themes.js'
import { getTheme, themeToVars } from './tokens.js'

export const DEFAULT_STORAGE_KEY = 'tonekit-theme'
const hasDom = () => typeof document !== 'undefined'

/** 'dark' or 'light' from the visitor's OS setting ('dark' without a browser). */
export const systemMode = () =>
  (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark')

/**
 * Apply a theme to an element (the whole page by default): its CSS
 * variables, data-theme="<id>", a `dark` class for dark themes, color-scheme
 * and, for the page, <meta name="theme-color">. Returns the theme.
 */
export function applyTheme(themeOrId, { root, prefix } = {}) {
  const theme = getTheme(themeOrId)
  if (!hasDom()) return theme
  const el = root || document.documentElement
  for (const [k, v] of Object.entries(themeToVars(theme, { prefix }))) el.style.setProperty(k, v)
  el.dataset.theme = theme.id
  el.style.colorScheme = theme.mode
  el.classList.toggle('dark', theme.mode === 'dark')
  el.classList.toggle('light', theme.mode === 'light')
  if (el === document.documentElement) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.colors.bg)
  return theme
}

const read = (key) => {
  try { return JSON.parse(localStorage.getItem(key)) } catch { return null }
}

/**
 * Remember a choice: a theme, or 'system' to follow the OS light/dark
 * setting. The theme's variables are cached too, so noFlashScript() can
 * restore them before the page paints.
 */
export function saveTheme(themeOrSystem, { storageKey = DEFAULT_STORAGE_KEY, prefix } = {}) {
  try {
    if (themeOrSystem === 'system') localStorage.setItem(storageKey, JSON.stringify({ system: true }))
    else {
      const theme = getTheme(themeOrSystem)
      localStorage.setItem(storageKey, JSON.stringify({ id: theme.id, mode: theme.mode, vars: themeToVars(theme, { prefix }) }))
    }
  } catch { /* storage blocked: the choice just lasts for this visit */ }
}

/** The saved theme id, 'system', or null when nothing was saved. */
export function loadTheme({ storageKey = DEFAULT_STORAGE_KEY } = {}) {
  const saved = read(storageKey)
  if (!saved) return null
  return saved.system ? 'system' : saved.id || null
}

/** The theme to show now: the saved one, else the default for the OS mode. */
export function resolveTheme({ storageKey, dark = DEFAULT_DARK, light = DEFAULT_LIGHT, themes } = {}) {
  const saved = loadTheme({ storageKey })
  const known = (id) => (themes ? themes.some((t) => t.id === id) : true)
  if (saved && saved !== 'system' && known(saved)) {
    try { return getTheme(themes?.find((t) => t.id === saved) || saved) } catch { /* removed theme */ }
  }
  return getTheme(systemMode() === 'light' ? light : dark)
}

/**
 * A small inline script for <head> that applies the saved theme (or the
 * default for the OS mode) before the first paint, so the page never flashes
 * the wrong colours. Paste its output into a <script> tag.
 */
export function noFlashScript({ storageKey = DEFAULT_STORAGE_KEY, dark = DEFAULT_DARK, light = DEFAULT_LIGHT, prefix } = {}) {
  const defaults = {
    dark: { id: getTheme(dark).id, mode: getTheme(dark).mode, vars: themeToVars(dark, { prefix }) },
    light: { id: getTheme(light).id, mode: getTheme(light).mode, vars: themeToVars(light, { prefix }) },
  }
  return `(function(){try{var d=${JSON.stringify(defaults)},s=null;try{s=JSON.parse(localStorage.getItem(${JSON.stringify(storageKey)}))}catch(e){}`
    + 'var t=s&&s.vars?s:d[matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"],r=document.documentElement;'
    + 'for(var k in t.vars)r.style.setProperty(k,t.vars[k]);r.setAttribute("data-theme",t.id);r.style.colorScheme=t.mode;'
    + 'r.classList.add(t.mode)}catch(e){}})()'
}
