import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TOKENS, themes, themesById, tokenToVar } from 'tonekit-themes'
import { ThemeScope, ThemeSwatch, useTheme } from 'tonekit-themes/react'
import { CodeTabs, CopyButton } from '../components/Code'
import { ArrowIcon, BoltIcon, BrushIcon, CodeIcon, EyeIcon, LayersIcon, ShieldIcon } from '../components/Icons'
import MiniApp from '../components/MiniApp'
import Showcase from '../components/Showcase'
import { ROUTES } from '../lib/meta'
import { INSTALL } from '../lib/site'
import { useSEO } from '../lib/useSEO'

const HERO_CHIPS = ['midnight', 'catppuccin', 'tokyo-night', 'gruvbox', 'rose-pine', 'nord', 'everforest', 'retro-82', 'catppuccin-latte', 'flexoki-light']
const FAN = ['tokyo-night', 'catppuccin-latte', 'gruvbox']
const SHOWCASE = ['catppuccin', 'nord', 'flexoki-light', 'retro-82', 'everforest']

const FEATURES = [
  [ShieldIcon, 'Contrast-checked', 'Every theme meets 9 WCAG targets: body text 7:1, links 4.5:1, captions 3:1, button text 4.5:1. The tests fail if one slips.'],
  [LayersIcon, 'One shape', 'All 23 themes share the same 13 tokens, so switching is a one-line change and your components never need theme-specific CSS.'],
  [CodeIcon, 'CSS, Tailwind or React', 'A plain stylesheet with data-theme, a Tailwind v4 preset, or a React provider with an accessible theme picker. Pick one.'],
  [BoltIcon, 'Small and fast', 'About 6 kB gzipped with all 23 themes, zero runtime dependencies, and a no-flash script so the right theme is there on the first paint.'],
  [BrushIcon, 'Make your own', 'defineTheme() turns your brand colours into a full theme, and the builder shows it on real components with live contrast checks.'],
  [EyeIcon, 'Familiar favourites', 'Catppuccin, Nord, Tokyo Night, Gruvbox, Rosé Pine, Everforest, Kanagawa, Flexoki and originals like Retro 82 and Lumon.'],
]

const QUICK_START = [
  {
    label: 'CSS',
    code: `/* 1. load every theme as CSS variables */
@import "tonekit-themes/themes.css";

/* 2. pick one */
<html data-theme="nord">

/* 3. use the tokens */
.card {
  background: var(--theme-surface);
  color: var(--theme-text);
  border: 1px solid var(--theme-border);
}`,
  },
  {
    label: 'React',
    code: `import { ThemeProvider, ThemePicker } from 'tonekit-themes/react'

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <ThemePicker />
      {/* your app reads var(--theme-*) */}
    </ThemeProvider>
  )
}`,
  },
  {
    label: 'Tailwind v4',
    code: `/* app.css */
@import "tailwindcss";
@import "tonekit-themes/tailwind.css";

<div class="bg-surface text-text border border-border">
  <button class="bg-primary text-on-primary">Save</button>
  <p class="text-muted">Follows whatever theme is active.</p>
</div>`,
  },
  {
    label: 'JavaScript',
    code: `import { applyTheme, saveTheme, checkTheme } from 'tonekit-themes'

applyTheme('gruvbox')          // sets --theme-* on <html>
saveTheme('gruvbox')           // remembered on the next visit
checkTheme('gruvbox').pass     // true: every contrast target met`,
  },
]

export default function Home() {
  useSEO({ ...ROUTES['/'], path: '/' })
  const { themeId, setTheme, theme } = useTheme()
  // null = follow the site theme; a tab pins a specific theme until the site theme changes again
  const [pinned, setPinned] = useState(null)
  useEffect(() => setPinned(null), [themeId])
  const shown = pinned || themeId
  const tabs = [themeId, ...SHOWCASE.filter((id) => id !== themeId)]

  return (
    <>
      {/* hero */}
      <section className="glow">
        <div className="mx-auto grid max-w-[min(100%,110rem)] items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-10 lg:pb-24 lg:pt-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-medium text-muted">
              <span className="size-1.5 rounded-full bg-success" /> {themes.length} themes · every one WCAG contrast-checked
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl">
              Colour themes that <span className="text-gradient">read well</span>, on every interface.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              tonekit gives you {themes.length} hand-tuned themes with one shared shape of {TOKENS.length} colour tokens.
              Drop them into plain CSS, Tailwind or React and switch with a single line.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/themes" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-on-primary shadow-lg shadow-primary/25 transition hover:opacity-90">
                Browse the themes <ArrowIcon size={16} />
              </Link>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2">
                <code className="font-mono text-sm">{INSTALL}</code>
                <CopyButton text={INSTALL} />
              </div>
            </div>
            <div className="mt-9">
              <p className="text-sm font-medium text-muted">Click a theme: this whole page switches.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {HERO_CHIPS.map((id) => {
                  const t = themesById[id]
                  const on = themeId === id
                  return (
                    <button key={id} type="button" onClick={() => setTheme(id)} aria-pressed={on}
                      className={`inline-flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm transition ${on ? 'border-primary bg-primary/10 font-medium text-text' : 'border-border bg-surface text-muted hover:text-text'}`}>
                      <ThemeSwatch theme={t} size={20} /> {t.name}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* three themes fanned out */}
          <div className="relative mx-auto aspect-[5/4] w-full max-w-xl" aria-hidden="true">
            {FAN.map((id, i) => (
              <ThemeScope key={id} theme={id}
                className="absolute w-[78%] overflow-hidden rounded-2xl border shadow-2xl shadow-black/25"
                style={{ left: `${i * 11}%`, top: `${i * 15}%`, zIndex: i, borderColor: 'var(--theme-border)', transform: `rotate(${(i - 1) * 3}deg)` }}>
                <div className="flex items-center gap-1.5 border-b border-border bg-bg-alt px-3 py-2">
                  <span className="size-2 rounded-full bg-danger" /><span className="size-2 rounded-full bg-warning" /><span className="size-2 rounded-full bg-success" />
                  <span className="ml-2 text-[10px] text-muted">{themesById[id].name}</span>
                </div>
                <div className="aspect-[16/10]"><MiniApp /></div>
              </ThemeScope>
            ))}
          </div>
        </div>
      </section>

      {/* every theme, scrolling */}
      <section aria-label="All themes" className="overflow-hidden border-y border-border bg-bg-alt py-4">
        <div className="marquee flex w-max gap-3">
          {[...themes, ...themes].map((t, i) => (
            <Link key={`${t.id}-${i}`} to={`/themes/${t.id}`} tabIndex={i >= themes.length ? -1 : undefined} aria-hidden={i >= themes.length || undefined}
              className="flex items-center gap-2.5 rounded-xl border border-border bg-surface py-1.5 pl-1.5 pr-4 text-sm font-medium text-muted transition hover:text-text">
              <ThemeSwatch theme={t} size={26} /> {t.name}
            </Link>
          ))}
        </div>
      </section>

      {/* features */}
      <section className="mx-auto max-w-[min(100%,110rem)] px-4 py-20 sm:px-6 lg:px-10">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pick a theme, not a fight with contrast.</h2>
          <p className="mt-3 text-muted">Beautiful palettes often fail the basics: grey text you can barely read, links that vanish. tonekit keeps the look and fixes the numbers.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {FEATURES.map(([Icon, title, text]) => (
            <div key={title} className="rounded-2xl border border-border bg-surface p-6">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary"><Icon size={20} /></span>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* the 13 tokens, in the current theme */}
      <section className="border-y border-border bg-bg-alt">
        <div className="mx-auto max-w-[min(100%,110rem)] px-4 py-20 sm:px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">One shape: {TOKENS.length} tokens.</h2>
              <p className="mt-3 leading-relaxed text-muted">
                Backgrounds, surfaces, three levels of text, a brand pair and three status colours. Name them once in your CSS and every theme just works.
                Right now you are looking at <b className="text-text">{theme.name}</b>.
              </p>
              <Link to="/docs#tokens" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">Read about the tokens <ArrowIcon size={15} /></Link>
            </div>
            <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
              {TOKENS.map((t) => (
                <li key={t} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-2.5">
                  <span className="size-9 shrink-0 rounded-lg border border-border" style={{ background: `var(--theme-${tokenToVar(t)})` }} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{t}</span>
                    <span className="block truncate font-mono text-[11px] text-subtle">--theme-{tokenToVar(t)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* a full interface in a few themes */}
      <section className="mx-auto max-w-[min(100%,110rem)] px-4 py-20 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Real components, any theme.</h2>
            <p className="mt-3 text-muted">The same dashboard, drawn only with the {TOKENS.length} tokens. It follows the site theme; the tabs show it in others.</p>
          </div>
          <div role="tablist" aria-label="Preview theme" className="flex flex-wrap gap-1.5 rounded-xl border border-border bg-surface p-1">
            {tabs.map((id) => (
              <button key={id} role="tab" type="button" aria-selected={shown === id} onClick={() => setPinned(id === themeId ? null : id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition ${shown === id ? 'bg-surface-alt font-medium text-text' : 'text-muted hover:text-text'}`}>
                <ThemeSwatch theme={id} size={16} /> {themesById[id]?.name || id}
                {id === themeId && <span className="rounded bg-primary/15 px-1.5 text-[10px] font-semibold uppercase tracking-wide text-text">site</span>}
              </button>
            ))}
          </div>
        </div>
        <ThemeScope theme={shown} className="mt-8 overflow-hidden rounded-3xl border shadow-2xl shadow-black/15" style={{ borderColor: 'var(--theme-border)' }}>
          <Showcase />
        </ThemeScope>
        <p className="mt-4 text-center text-sm text-muted">
          <Link to={`/themes/${shown}`} className="font-semibold text-primary">See {themesById[shown].name} in detail</Link> or <Link to="/themes" className="font-semibold text-primary">compare all {themes.length}</Link>.
        </p>
      </section>

      {/* quick start */}
      <section className="mx-auto grid max-w-[min(100%,110rem)] gap-10 px-4 pb-8 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Up and running in a minute.</h2>
          <p className="mt-3 leading-relaxed text-muted">Install it, load the themes the way your project already works, and style with the tokens. Your users get a theme picker and you get accessible colours for free.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/docs" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:opacity-90">Read the docs <ArrowIcon size={16} /></Link>
            <Link to="/create" className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold transition hover:bg-surface-alt">Build your own theme</Link>
          </div>
        </div>
        <CodeTabs tabs={QUICK_START} />
      </section>
    </>
  )
}
