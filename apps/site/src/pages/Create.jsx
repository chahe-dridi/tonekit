import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CONTRAST_CHECKS, TOKENS, checkTheme, contrast, defineTheme, isHex, mix, readableOn, themes, themesById } from 'tonekit-themes'
import { ThemeScope } from 'tonekit-themes/react'
import { CodeTabs, CopyButton } from '../components/Code'
import { SparkIcon } from '../components/Icons'
import Showcase from '../components/Showcase'
import { ContrastTable } from '../components/Tables'
import { ROUTES } from '../lib/meta'
import { cssFor, defineFor, jsonFor } from '../lib/snippets'
import { useSEO } from '../lib/useSEO'

const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'my-theme'

// the whole theme lives in the URL: ?n=name&m=dark&c=13 hex values
function fromParams(params) {
  const base = themesById[params.get('from')] || themesById.midnight
  const list = (params.get('c') || '').split('-').map((h) => `#${h}`)
  const colors = list.length === TOKENS.length && list.every(isHex)
    ? Object.fromEntries(TOKENS.map((t, i) => [t, list[i].toLowerCase()]))
    : { ...base.colors }
  const name = params.get('n') || (params.get('c') ? 'My theme' : `${base.name} remix`)
  const mode = params.get('m') === 'light' || params.get('m') === 'dark' ? params.get('m') : base.mode
  return { name, mode, colors }
}

// move a colour towards black or white until it meets the ratio
function nudge(fg, bg, min) {
  const target = readableOn(bg)
  for (let w = 0; w <= 1.0001; w += 0.02) {
    const c = mix(fg, target, w)
    if (contrast(c, bg) >= min) return c
  }
  return target
}

export default function Create() {
  useSEO({ ...ROUTES['/create'], path: '/create' })
  const [params, setParams] = useSearchParams()
  const [draft, setDraft] = useState(() => fromParams(params))

  // keep the URL in step (shareable), without adding history entries
  useEffect(() => {
    const next = new URLSearchParams({ n: draft.name, m: draft.mode, c: TOKENS.map((t) => draft.colors[t].slice(1)).join('-') })
    setParams(next, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  const theme = useMemo(() => defineTheme({ id: slug(draft.name), name: draft.name, mode: draft.mode, colors: draft.colors }), [draft])
  const report = checkTheme(theme)
  const failing = report.results.filter((r) => !r.pass)

  const setColor = (token, value) => setDraft((d) => ({ ...d, colors: { ...d.colors, [token]: value.toLowerCase() } }))
  const loadBase = (id) => {
    const t = themesById[id]
    setDraft({ name: `${t.name} remix`, mode: t.mode, colors: { ...t.colors } })
  }
  const fixContrast = () => {
    const c = { ...draft.colors }
    for (const [fg, bg, min] of CONTRAST_CHECKS) if (contrast(c[fg], c[bg]) < min) c[fg] = nudge(c[fg], c[bg], min)
    // button text on primary is black or white; if neither works, move primary
    if (contrast(readableOn(c.primary), c.primary) < 4.5) c.primary = nudge(c.primary, readableOn(c.primary) === '#ffffff' ? '#ffffff' : '#0b0b0f', 4.5)
    setDraft((d) => ({ ...d, colors: c }))
  }

  return (
    <div className="mx-auto max-w-[min(100%,110rem)] px-4 pt-10 sm:px-6 lg:px-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Theme builder</h1>
      <p className="mt-2 max-w-2xl text-muted">Start from any theme, change its colours and watch real components update. The link in your address bar always holds the current theme, so you can share it.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[22rem_1fr]">
        {/* controls */}
        <aside className="self-start rounded-2xl border border-border bg-surface p-4 lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Start from</span>
            <select onChange={(e) => e.target.value && loadBase(e.target.value)} defaultValue=""
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text outline-none focus:border-primary">
              <option value="" disabled>Choose a theme…</option>
              {themes.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.mode})</option>)}
            </select>
          </label>
          <label className="mt-3 block text-sm">
            <span className="mb-1 block font-medium">Name</span>
            <input value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value.slice(0, 40) }))}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text outline-none focus:border-primary" />
            <span className="mt-1 block font-mono text-xs text-subtle">id: {theme.id}</span>
          </label>
          <div role="radiogroup" aria-label="Mode" className="mt-3 flex rounded-lg border border-border bg-bg p-0.5 text-sm">
            {['dark', 'light'].map((m) => (
              <button key={m} type="button" role="radio" aria-checked={draft.mode === m} onClick={() => setDraft((d) => ({ ...d, mode: m }))}
                className={`flex-1 rounded-md py-1.5 capitalize transition ${draft.mode === m ? 'bg-surface-alt font-medium text-text' : 'text-muted'}`}>{m}</button>
            ))}
          </div>

          <h2 className="mt-5 text-xs font-semibold uppercase tracking-wider text-subtle">Colours</h2>
          <ul className="mt-2 space-y-1.5">
            {TOKENS.map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <input type="color" value={draft.colors[t]} onChange={(e) => setColor(t, e.target.value)} aria-label={`${t} colour`}
                  className="size-8 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-0" />
                <span className="flex-1 text-sm">{t}</span>
                <input value={draft.colors[t]} aria-label={`${t} hex`} spellCheck="false"
                  onChange={(e) => { const v = e.target.value.trim(); if (isHex(v)) setColor(t, v.length === 4 ? `#${[...v.slice(1)].map((ch) => ch + ch).join('')}` : v) }}
                  className="w-24 rounded-md border border-border bg-bg px-2 py-1 font-mono text-xs text-text outline-none focus:border-primary" />
              </li>
            ))}
          </ul>

          <div className={`mt-5 rounded-xl border p-3 text-sm ${failing.length ? 'border-warning/40 bg-warning/10' : 'border-success/40 bg-success/10'}`}>
            {failing.length ? (
              <>
                <p className="font-medium">{failing.length} contrast target{failing.length > 1 ? 's' : ''} missed</p>
                <button type="button" onClick={fixContrast} className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary">
                  <SparkIcon size={14} /> Fix contrast for me
                </button>
              </>
            ) : <p className="font-medium text-success">Every contrast target met</p>}
          </div>
          <div className="mt-3 flex gap-2">
            <CopyButton text={typeof window === 'undefined' ? '' : window.location.href} label="Copy share link" />
          </div>
        </aside>

        {/* preview */}
        <div className="min-w-0 space-y-8">
          <ThemeScope theme={theme} className="overflow-hidden rounded-3xl border shadow-xl shadow-black/10" style={{ borderColor: 'var(--theme-border)' }}>
            <Showcase name={draft.name || 'My theme'} level={2} />
          </ThemeScope>
          <section aria-labelledby="checks">
            <h2 id="checks" className="text-xl font-bold tracking-tight">Contrast</h2>
            <div className="mt-4"><ContrastTable theme={theme} /></div>
          </section>
          <section aria-labelledby="export">
            <h2 id="export" className="text-xl font-bold tracking-tight">Export</h2>
            <CodeTabs className="mt-4" tabs={[
              { label: 'defineTheme', code: defineFor(theme) },
              { label: 'CSS variables', code: cssFor(theme) },
              { label: 'JSON', code: jsonFor(theme) },
            ]} />
          </section>
        </div>
      </div>
    </div>
  )
}
