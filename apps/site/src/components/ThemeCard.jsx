import { Link } from 'react-router-dom'
import { TOKENS, checkTheme } from 'tonekit'
import { ThemeScope, useTheme } from 'tonekit/react'
import MiniApp from './MiniApp'

/** The lowest contrast ratio a theme reaches across its checks. */
export const minRatio = (theme) => Math.min(...checkTheme(theme).results.map((r) => r.ratio))

export function Strip({ theme, className = '' }) {
  return (
    <div className={`flex h-3 overflow-hidden rounded-full ${className}`} aria-hidden="true">
      {TOKENS.map((t) => <span key={t} className="flex-1" style={{ background: theme.colors[t] }} />)}
    </div>
  )
}

export default function ThemeCard({ theme, size = 'md' }) {
  const { themeId, setTheme } = useTheme()
  const applied = themeId === theme.id
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10">
      <ThemeScope theme={theme} className={size === 'lg' ? 'aspect-[16/10]' : 'aspect-[16/9]'}>
        <MiniApp />
      </ThemeScope>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold tracking-tight">
              <Link to={`/themes/${theme.id}`} className="after:absolute after:inset-0 after:content-['']">{theme.name}</Link>
            </h3>
            <p className="mt-0.5 text-xs text-muted">{theme.credit ? `after ${theme.credit.name}` : 'original palette'}</p>
          </div>
          <span className="rounded-md bg-surface-alt px-2 py-0.5 text-xs font-medium capitalize text-muted">{theme.mode}</span>
        </div>
        <Strip theme={theme} />
        <div className="flex flex-wrap gap-1.5">
          {theme.tags.map((t) => <span key={t} className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted">{t}</span>)}
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="text-xs text-muted" title="Lowest contrast ratio across all checks">min contrast {minRatio(theme).toFixed(1)}:1</span>
          <button
            type="button"
            onClick={() => setTheme(theme.id)}
            className={`relative z-10 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${applied ? 'bg-primary text-on-primary' : 'border border-border text-text hover:bg-surface-alt'}`}
            aria-pressed={applied}
          >
            {applied ? 'On this site' : 'Try on this site'}
          </button>
        </div>
      </div>
    </article>
  )
}
