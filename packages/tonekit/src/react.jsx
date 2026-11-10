// React bindings: <ThemeProvider>, useTheme(), <ThemePicker> and <ThemeScope>.

import {
  createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState,
} from 'react'
import { DEFAULT_DARK, DEFAULT_LIGHT, themes as ALL_THEMES } from './themes.js'
import { getTheme, themeToVars } from './tokens.js'
import { DEFAULT_STORAGE_KEY, applyTheme, loadTheme, saveTheme, systemMode } from './dom.js'

const ThemeContext = createContext(null)

/**
 * Applies the chosen theme to the page and shares it with useTheme().
 * The choice is saved (localStorage) and restored on the next visit;
 * 'system' follows the OS light/dark setting, live.
 */
export function ThemeProvider({
  children,
  themes = ALL_THEMES,
  defaultTheme = 'system',
  dark = DEFAULT_DARK,
  light = DEFAULT_LIGHT,
  storageKey = DEFAULT_STORAGE_KEY,
  persist = true,
  prefix,
}) {
  const find = useCallback((id) => themes.find((t) => t.id === id), [themes])
  const [choice, setChoice] = useState(() => {
    const saved = persist ? loadTheme({ storageKey }) : null
    return saved === 'system' || (saved && find(saved)) ? saved : defaultTheme
  })
  const [mode, setMode] = useState(systemMode)
  const [previewId, setPreviewId] = useState(null)

  // follow OS changes while the choice is 'system'
  useEffect(() => {
    if (choice !== 'system' || typeof window === 'undefined' || !window.matchMedia) return undefined
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = () => setMode(mq.matches ? 'light' : 'dark')
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [choice])

  const theme = useMemo(() => {
    const id = choice === 'system' ? (mode === 'light' ? light : dark) : choice
    return find(id) || getTheme(id)
  }, [choice, mode, dark, light, find])
  const shown = (previewId && find(previewId)) || theme

  useEffect(() => { applyTheme(shown, { prefix }) }, [shown, prefix])

  const setTheme = useCallback((id) => {
    setPreviewId(null)
    setChoice(id)
    if (persist) saveTheme(id === 'system' ? 'system' : find(id) || id, { storageKey, prefix })
  }, [persist, storageKey, prefix, find])

  const value = useMemo(() => ({
    theme,
    shownTheme: shown,
    themeId: theme.id,
    choice,
    followSystem: choice === 'system',
    themes,
    setTheme,
    preview: setPreviewId,
    endPreview: () => setPreviewId(null),
  }), [theme, shown, choice, themes, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/** The current theme and how to change it. Must be inside <ThemeProvider>. */
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('tonekit: useTheme() needs a <ThemeProvider> above it')
  return ctx
}

/**
 * Renders its children in another theme, whatever the page uses: the
 * theme's variables are set on this element only.
 */
export function ThemeScope({ theme, as: Tag = 'div', prefix, bare = false, style, children, ...rest }) {
  const t = getTheme(theme)
  const vars = themeToVars(t, { prefix })
  const p = prefix || 'theme'
  return (
    <Tag
      data-theme={t.id}
      style={{
        ...vars,
        colorScheme: t.mode,
        ...(!bare && { background: `var(--${p}-bg)`, color: `var(--${p}-text)` }),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** A tiny picture of a theme: its background, a card and the two brand colours. */
export function ThemeSwatch({ theme, size = 28, style, ...rest }) {
  const { colors: c } = getTheme(theme)
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        width: size * 1.25, height: size, borderRadius: size / 4, background: c.bg,
        border: `1px solid ${c.border}`, ...style,
      }}
      {...rest}
    >
      <span style={{ display: 'flex', gap: size / 10, padding: size / 8, borderRadius: size / 6, background: c.surface }}>
        <span style={{ width: size / 4, height: size / 4, borderRadius: '50%', background: c.primary }} />
        <span style={{ width: size / 4, height: size / 4, borderRadius: '50%', background: c.accent }} />
      </span>
    </span>
  )
}

const CSS = `
.tk-picker{position:relative;display:inline-block;font:inherit}
.tk-picker-button{display:inline-flex;align-items:center;gap:.5em;padding:.45em .8em;border-radius:999px;cursor:pointer;
  border:1px solid var(--tk-border);background:var(--tk-surface);color:var(--tk-text);font:inherit;font-size:.9em}
.tk-picker-button:hover{background:var(--tk-surface-alt)}
.tk-picker-button:focus-visible,.tk-picker-option:focus-visible,.tk-picker-system:focus-visible{outline:2px solid var(--tk-primary);outline-offset:2px}
.tk-picker-panel{position:absolute;z-index:1000;top:calc(100% + .5em);width:min(18rem,calc(100vw - 2rem));max-height:min(26rem,70vh);
  display:flex;flex-direction:column;border-radius:.9em;border:1px solid var(--tk-border);background:var(--tk-surface);color:var(--tk-text);
  box-shadow:0 18px 50px rgba(0,0,0,.35);overflow:hidden}
.tk-picker-panel[data-align=end]{right:0}.tk-picker-panel[data-align=start]{left:0}
.tk-picker-list{overflow-y:auto;padding:.35em;outline:none}
.tk-picker-group-label{padding:.6em .7em .3em;font-size:.7em;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--tk-text-subtle)}
.tk-picker-option{display:flex;align-items:center;gap:.65em;padding:.45em .6em;border-radius:.6em;cursor:pointer;font-size:.9em}
.tk-picker-option.is-active{background:var(--tk-surface-alt)}
.tk-picker-option .tk-picker-check{margin-left:auto;color:var(--tk-primary);font-weight:700}
.tk-picker-system{display:flex;align-items:center;gap:.5em;width:100%;padding:.7em .9em;border:0;border-top:1px solid var(--tk-border);
  background:transparent;color:var(--tk-text-muted);font:inherit;font-size:.85em;cursor:pointer;text-align:left}
.tk-picker-system.is-on{color:var(--tk-primary);font-weight:600}
`

/**
 * A theme menu (listbox). Arrow keys, Home and End move through the themes
 * and preview them live; Enter or Space picks, Escape or clicking outside
 * restores the saved one. Needs a <ThemeProvider>.
 */
export function ThemePicker({ label = 'Theme', systemLabel = 'Match system', showSystem = true, align = 'end', className = '' }) {
  const { themes, themeId, theme, followSystem, setTheme, preview, endPreview } = useTheme()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(themeId)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const optionRefs = useRef({})
  const listId = useId()

  const groups = [['dark', 'Dark'], ['light', 'Light']]
    .map(([mode, name]) => [name, themes.filter((t) => t.mode === mode)])
    .filter(([, list]) => list.length)
  const ordered = groups.flatMap(([, list]) => list)

  const close = (restoreFocus = true) => {
    setOpen(false)
    endPreview()
    if (restoreFocus) buttonRef.current?.focus()
  }
  const choose = (id) => {
    setTheme(id)
    setOpen(false)
    buttonRef.current?.focus()
  }
  const move = (id) => {
    setActive(id)
    preview(id)
    optionRefs.current[id]?.focus()
  }

  useEffect(() => {
    if (!open) return undefined
    setActive(themeId)
    const raf = requestAnimationFrame(() => optionRefs.current[themeId]?.focus())
    const onDown = (e) => { if (!rootRef.current?.contains(e.target)) close(false) }
    document.addEventListener('pointerdown', onDown)
    return () => { cancelAnimationFrame(raf); document.removeEventListener('pointerdown', onDown) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const onListKeyDown = (e) => {
    const i = ordered.findIndex((t) => t.id === active)
    const go = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: ordered.length - 1 }[e.key]
    if (go !== undefined) {
      e.preventDefault()
      move(ordered[(go + ordered.length) % ordered.length].id)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      choose(active)
    }
  }

  // picker colours come from the page theme, under their own prefix so they
  // never depend on how the app names its variables
  const vars = Object.fromEntries(Object.entries(themeToVars(theme, { prefix: 'tk' })))

  return (
    <div className={`tk-picker ${className}`} ref={rootRef} style={vars}>
      <style>{CSS}</style>
      <button
        ref={buttonRef}
        type="button"
        className="tk-picker-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`${label}: ${theme.name}`}
        onClick={() => (open ? close() : setOpen(true))}
        onKeyDown={(e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setOpen(true) } }}
      >
        <ThemeSwatch theme={theme} size={18} />
        <span>{theme.name}</span>
      </button>
      {open && (
        <div
          className="tk-picker-panel"
          data-align={align}
          onBlur={(e) => { if (!rootRef.current?.contains(e.relatedTarget)) close(false) }}
          onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); close() } }}
        >
          <div id={listId} role="listbox" aria-label={label} className="tk-picker-list" onKeyDown={onListKeyDown}>
            {groups.map(([name, list]) => (
              <div key={name} role="group" aria-label={name}>
                <div className="tk-picker-group-label" aria-hidden="true">{name}</div>
                {list.map((t) => (
                  <div
                    key={t.id}
                    ref={(el) => { optionRefs.current[t.id] = el }}
                    role="option"
                    aria-selected={!followSystem && t.id === themeId}
                    tabIndex={t.id === active ? 0 : -1}
                    className={`tk-picker-option${t.id === active ? ' is-active' : ''}`}
                    onClick={() => choose(t.id)}
                    onMouseEnter={() => { setActive(t.id); preview(t.id) }}
                  >
                    <ThemeSwatch theme={t} size={20} />
                    <span>{t.name}</span>
                    {!followSystem && t.id === themeId && <span className="tk-picker-check" aria-hidden="true">✓</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
          {showSystem && (
            <button type="button" className={`tk-picker-system${followSystem ? ' is-on' : ''}`} onClick={() => choose('system')}>
              <span aria-hidden="true">◐</span> {systemLabel}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
