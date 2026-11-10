// Source of the 1200×630 social cards: `npm run og -w @tonekit/site` screenshots
// /og for the site card and /og?theme=<id> for each theme's own card.
import { useSearchParams } from 'react-router-dom'
import { TOKENS, checkTheme, themes, themesById } from 'tonekit-themes'
import { ThemeScope } from 'tonekit-themes/react'
import { Logo } from '../components/Chrome'
import MiniApp from '../components/MiniApp'
import { useSEO } from '../lib/useSEO'

const CARDS = ['tokyo-night', 'catppuccin-latte', 'gruvbox', 'rose-pine', 'nord', 'flexoki-light']

function SiteCard() {
  return (
    <ThemeScope theme="midnight" className="glow relative flex h-[630px] w-[1200px] overflow-hidden">
      <div className="flex w-[520px] shrink-0 flex-col justify-center pl-16">
        <Logo className="text-3xl" />
        <p className="mt-8 text-5xl font-bold leading-[1.08] tracking-tight">
          {themes.length} colour themes that <span className="text-gradient">read well</span>.
        </p>
        <p className="mt-5 text-xl text-muted">Contrast-checked. One shape. CSS, Tailwind, React.</p>
      </div>
      <div className="grid flex-1 grid-cols-2 content-center gap-4 pr-12">
        {CARDS.map((id) => (
          <ThemeScope key={id} theme={id} className="aspect-[16/10] overflow-hidden rounded-xl border shadow-xl" style={{ borderColor: 'var(--theme-border)' }}>
            <MiniApp />
          </ThemeScope>
        ))}
      </div>
    </ThemeScope>
  )
}

// one theme's card, drawn in the theme itself: its name, mood, swatches and a preview
function ThemeCard({ theme }) {
  const ratio = Math.min(...checkTheme(theme).results.map((r) => r.ratio))
  return (
    <ThemeScope theme={theme} className="glow relative flex h-[630px] w-[1200px] overflow-hidden">
      <div className="flex w-[560px] shrink-0 flex-col justify-center pl-16 pr-8">
        <Logo className="text-2xl" />
        <p className="mt-10 text-7xl font-bold tracking-tight">{theme.name}</p>
        <p className="mt-4 text-2xl text-muted">
          A {theme.tags.slice(0, 2).join(', ')} {theme.mode} theme{theme.credit ? `, after ${theme.credit.name}` : ''}.
        </p>
        <div className="mt-8 flex h-8 overflow-hidden rounded-full border border-border">
          {TOKENS.map((t) => <span key={t} className="flex-1" style={{ background: theme.colors[t] }} />)}
        </div>
        <p className="mt-6 text-lg text-muted">13 tokens · every contrast target met · min {ratio.toFixed(1)}:1</p>
      </div>
      <div className="flex flex-1 items-center pr-14">
        <div className="aspect-[16/11] w-full overflow-hidden rounded-2xl border border-border shadow-2xl">
          <MiniApp />
        </div>
      </div>
    </ThemeScope>
  )
}

export default function Og() {
  useSEO({ title: 'tonekit', description: 'Social card source', path: '/og', noindex: true })
  const [params] = useSearchParams()
  const theme = themesById[params.get('theme')]
  return theme ? <ThemeCard theme={theme} /> : <SiteCard />
}
