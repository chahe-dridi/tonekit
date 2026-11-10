import { Link, useParams } from 'react-router-dom'
import { themes, themesById } from 'tonekit'
import { ThemeScope, ThemeSwatch, useTheme } from 'tonekit/react'
import { CodeTabs, CopyButton } from '../components/Code'
import { ArrowIcon, ExternalIcon } from '../components/Icons'
import Showcase from '../components/Showcase'
import { ContrastTable, TokenTable } from '../components/Tables'
import ThemeCard, { Strip } from '../components/ThemeCard'
import { themeMeta } from '../lib/meta'
import { cssFor, defineFor, htmlFor, jsonFor, reactFor } from '../lib/snippets'
import { useSEO } from '../lib/useSEO'
import NotFound from './NotFound'

export default function ThemePage() {
  const { id } = useParams()
  const theme = themesById[id]
  if (!theme) return <NotFound />
  return <Theme theme={theme} />
}

function Theme({ theme }) {
  useSEO({ ...themeMeta(theme), path: `/themes/${theme.id}` })
  const { themeId, setTheme } = useTheme()
  const i = themes.indexOf(theme)
  const prev = themes[(i - 1 + themes.length) % themes.length]
  const next = themes[(i + 1) % themes.length]
  const related = themes.filter((t) => t.id !== theme.id && t.tags.some((tag) => theme.tags.includes(tag))).slice(0, 3)
  const applied = themeId === theme.id

  return (
    <div>
      {/* header, drawn in the theme itself */}
      <ThemeScope theme={theme} className="border-b" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="glow">
          <div className="mx-auto max-w-[min(100%,110rem)] px-4 pb-10 pt-8 sm:px-6 lg:px-10">
            <nav aria-label="Breadcrumb" className="text-sm text-muted">
              <Link to="/themes" className="hover:text-text">Themes</Link> <span aria-hidden="true">/</span> <span className="text-muted">{theme.name}</span>
            </nav>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <ThemeSwatch theme={theme} size={34} />
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{theme.name}</h1>
                </div>
                <p className="mt-3 max-w-2xl text-muted">
                  A {theme.tags.join(', ')} {theme.mode} theme
                  {theme.credit ? <>, following <a href={theme.credit.url} className="inline-flex items-center gap-1 font-medium text-primary">{theme.credit.name} <ExternalIcon size={13} /></a></> : ', an original tonekit palette'}.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-surface-alt px-2 py-0.5 text-xs font-medium capitalize text-muted">{theme.mode}</span>
                  {theme.tags.map((t) => <Link key={t} to={`/themes?tags=${t}`} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted hover:text-text">{t}</Link>)}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setTheme(theme.id)} aria-pressed={applied}
                  className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition hover:opacity-90">
                  {applied ? 'Using it on this site' : 'Use on this site'}
                </button>
                <CopyButton text={cssFor(theme)} label="Copy CSS" className="rounded-xl! px-4! py-2.5! text-sm!" />
              </div>
            </div>
            <Strip theme={theme} className="mt-8 h-4" />
          </div>
        </div>
        <Showcase name={theme.name} level={2} />
      </ThemeScope>

      <div className="mx-auto max-w-[min(100%,110rem)] space-y-16 px-4 pt-14 sm:px-6 lg:px-10">
        <section aria-labelledby="tokens">
          <h2 id="tokens" className="text-2xl font-bold tracking-tight">Tokens</h2>
          <p className="mt-1.5 text-muted">Click a value to copy it.</p>
          <div className="mt-5"><TokenTable theme={theme} /></div>
        </section>

        <section aria-labelledby="contrast">
          <h2 id="contrast" className="text-2xl font-bold tracking-tight">Contrast</h2>
          <p className="mt-1.5 text-muted">Each sample is drawn in the theme's own colours, with its WCAG ratio and the target it has to meet.</p>
          <div className="mt-5"><ContrastTable theme={theme} /></div>
        </section>

        <section aria-labelledby="use">
          <h2 id="use" className="text-2xl font-bold tracking-tight">Use it</h2>
          <p className="mt-1.5 text-muted">Pick the format your project uses. The <Link to="/docs" className="font-medium text-primary">docs</Link> cover each one.</p>
          <CodeTabs className="mt-5" tabs={[
            { label: 'CSS variables', code: cssFor(theme) },
            { label: 'HTML', code: htmlFor(theme) },
            { label: 'React', code: reactFor(theme) },
            { label: 'defineTheme', code: defineFor(theme) },
            { label: 'JSON', code: jsonFor(theme) },
          ]} />
        </section>

        {related.length > 0 && (
          <section aria-labelledby="related">
            <h2 id="related" className="text-2xl font-bold tracking-tight">Similar themes</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t) => <ThemeCard key={t.id} theme={t} />)}
            </div>
          </section>
        )}

        <nav aria-label="Other themes" className="flex flex-wrap justify-between gap-3 border-t border-border pt-6">
          <Link to={`/themes/${prev.id}`} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted hover:bg-surface-alt hover:text-text">
            <ArrowIcon size={15} className="rotate-180" /> <ThemeSwatch theme={prev} size={18} /> {prev.name}
          </Link>
          <Link to={`/create?from=${theme.id}`} className="rounded-xl px-3 py-2 text-sm font-semibold text-primary hover:bg-surface-alt">Remix this theme</Link>
          <Link to={`/themes/${next.id}`} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted hover:bg-surface-alt hover:text-text">
            {next.name} <ThemeSwatch theme={next} size={18} /> <ArrowIcon size={15} />
          </Link>
        </nav>
      </div>
    </div>
  )
}
