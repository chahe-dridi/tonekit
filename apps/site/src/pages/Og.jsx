// Source of the 1200×630 social card: `npm run og -w @tonekit/site` screenshots it.
import { themes } from 'tonekit'
import { ThemeScope } from 'tonekit/react'
import { Logo } from '../components/Chrome'
import MiniApp from '../components/MiniApp'
import { useSEO } from '../lib/useSEO'

const CARDS = ['tokyo-night', 'catppuccin-latte', 'gruvbox', 'rose-pine', 'nord', 'flexoki-light']

export default function Og() {
  useSEO({ title: 'tonekit', description: 'Social card source', path: '/og', noindex: true })
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
