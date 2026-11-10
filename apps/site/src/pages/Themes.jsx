import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TAGS, themes } from 'tonekit'
import { useTheme } from 'tonekit/react'
import { SearchIcon, ShuffleIcon } from '../components/Icons'
import ThemeCard, { minRatio } from '../components/ThemeCard'
import { ROUTES } from '../lib/meta'
import { useSEO } from '../lib/useSEO'

const SORTS = {
  default: ['Featured', (list) => list],
  name: ['Name', (list) => [...list].sort((a, b) => a.name.localeCompare(b.name))],
  contrast: ['Highest contrast', (list) => [...list].sort((a, b) => minRatio(b) - minRatio(a))],
}

export default function Themes() {
  useSEO({ ...ROUTES['/themes'], path: '/themes' })
  const [params, setParams] = useSearchParams()
  const { setTheme } = useTheme()
  const q = params.get('q') || ''
  const mode = params.get('mode') || 'all'
  const tags = (params.get('tags') || '').split(',').filter(Boolean)
  const sort = SORTS[params.get('sort')] ? params.get('sort') : 'default'
  const [compact, setCompact] = useState(false)

  // filters live in the URL, so a filtered view can be shared
  const update = (key, value) => {
    const next = new URLSearchParams(params)
    if (!value || value === 'all' || value === 'default') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }
  const toggleTag = (tag) => update('tags', (tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]).join(','))

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const list = themes.filter((t) => (mode === 'all' || t.mode === mode)
      && tags.every((tag) => t.tags.includes(tag))
      && (!needle || `${t.name} ${t.id} ${t.tags.join(' ')} ${t.credit?.name || ''}`.toLowerCase().includes(needle)))
    return SORTS[sort][1](list)
  }, [q, mode, tags.join(), sort])

  const surprise = () => {
    const pool = shown.length ? shown : themes
    setTheme(pool[Math.floor(Math.random() * pool.length)].id)
  }

  return (
    <div className="mx-auto max-w-[min(100%,110rem)] px-4 pb-10 pt-10 sm:px-6 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">All {themes.length} themes</h1>
          <p className="mt-2 max-w-2xl text-muted">Each card is a live interface in that theme. Open one for the full component set and its contrast report, or try it on this site.</p>
        </div>
        <button type="button" onClick={surprise} className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold transition hover:bg-surface-alt">
          <ShuffleIcon size={16} /> Surprise me
        </button>
      </header>

      {/* filters */}
      <div className="sticky top-16 z-30 -mx-4 mt-6 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex min-w-[14rem] flex-1 items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm sm:max-w-xs">
            <SearchIcon size={16} className="text-subtle" />
            <input value={q} onChange={(e) => update('q', e.target.value)} placeholder="Search themes…" aria-label="Search themes"
              className="w-full bg-transparent text-text outline-none placeholder:text-subtle" />
          </label>
          <div role="radiogroup" aria-label="Mode" className="flex rounded-xl border border-border bg-surface p-0.5">
            {['all', 'dark', 'light'].map((m) => (
              <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => update('mode', m)}
                className={`rounded-lg px-3 py-1.5 text-sm capitalize transition ${mode === m ? 'bg-surface-alt font-medium text-text' : 'text-muted hover:text-text'}`}>
                {m}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted">
            Sort
            <select value={sort} onChange={(e) => update('sort', e.target.value)} className="bg-transparent font-medium text-text outline-none">
              {Object.entries(SORTS).map(([key, [label]]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </label>
          <button type="button" onClick={() => setCompact(!compact)} aria-pressed={compact}
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted transition hover:text-text">
            {compact ? 'Larger cards' : 'More per row'}
          </button>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5" role="group" aria-label="Mood">
          {TAGS.map((tag) => (
            <button key={tag} type="button" onClick={() => toggleTag(tag)} aria-pressed={tags.includes(tag)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${tags.includes(tag) ? 'border-primary bg-primary/12 text-primary' : 'border-border text-muted hover:text-text'}`}>
              {tag}
            </button>
          ))}
          {(q || mode !== 'all' || tags.length > 0 || sort !== 'default') && (
            <button type="button" onClick={() => setParams({}, { replace: true })} className="ml-1 text-xs font-semibold text-primary">Clear all</button>
          )}
          <span className="ml-auto text-xs text-subtle" aria-live="polite">{shown.length} of {themes.length}</span>
        </div>
      </div>

      <h2 className="sr-only">Results</h2>
      {shown.length ? (
        <div className={`mt-6 grid gap-5 ${compact ? 'grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]' : 'grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]'}`}>
          {shown.map((t) => <ThemeCard key={t.id} theme={t} />)}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-lg font-semibold">No theme matches all of that.</p>
          <button type="button" onClick={() => setParams({}, { replace: true })} className="mt-3 text-sm font-semibold text-primary">Clear the filters</button>
        </div>
      )}
    </div>
  )
}
