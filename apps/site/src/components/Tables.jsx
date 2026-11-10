import { TOKENS, checkTheme, readableOn, tokenToVar } from 'tonekit-themes'
import { useCopy } from './Code'
import { CheckIcon, CloseIcon } from './Icons'

const ROLES = {
  bg: 'Page background',
  bgAlt: 'Alternate sections',
  surface: 'Cards, panels, inputs',
  surfaceAlt: 'Raised or hovered surfaces',
  border: 'Hairlines and outlines',
  text: 'Body text and headings',
  textMuted: 'Secondary text',
  textSubtle: 'Captions, placeholders',
  primary: 'Links, buttons, active states',
  accent: 'Highlights, gradients',
  success: 'Success states',
  warning: 'Warnings',
  danger: 'Errors, destructive actions',
}

function HexButton({ hex }) {
  const [copied, copy] = useCopy()
  return (
    <button type="button" onClick={() => copy(hex)} className="rounded-md px-1.5 py-0.5 font-mono text-xs text-muted transition hover:bg-surface-alt hover:text-text" aria-label={`Copy ${hex}`}>
      {copied ? 'copied' : hex}
    </button>
  )
}

/** Every token of a theme: swatch, name, CSS variable, role and hex (click to copy). */
export function TokenTable({ theme, onChange }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[36rem] text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wider text-muted">
          <tr>
            <th scope="col" className="px-4 py-2.5 font-medium">Token</th>
            <th scope="col" className="px-4 py-2.5 font-medium">CSS variable</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Used for</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">Value</th>
          </tr>
        </thead>
        <tbody>
          {TOKENS.map((t) => (
            <tr key={t} className="border-t border-border">
              <td className="px-4 py-2">
                <span className="flex items-center gap-2.5">
                  {onChange ? (
                    <input type="color" value={theme.colors[t]} onChange={(e) => onChange(t, e.target.value)} aria-label={`${t} colour`}
                      className="size-7 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-0" />
                  ) : (
                    <span className="size-7 shrink-0 rounded-md border border-border" style={{ background: theme.colors[t] }} />
                  )}
                  <span className="font-medium">{t}</span>
                </span>
              </td>
              <td className="px-4 py-2 font-mono text-xs text-muted">--theme-{tokenToVar(t)}</td>
              <td className="px-4 py-2 text-muted">{ROLES[t]}</td>
              <td className="px-4 py-2 text-right"><HexButton hex={theme.colors[t]} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const level = (ratio) => (ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA large' : 'fail')

/** Every WCAG check for a theme, drawn as a live sample with its ratio. */
export function ContrastTable({ theme }) {
  const { results, pass } = checkTheme(theme)
  const c = { ...theme.colors, onPrimary: readableOn(theme.colors.primary) }
  return (
    <div>
      <p className={`mb-3 flex items-center gap-2 text-sm font-medium ${pass ? 'text-success' : 'text-danger'}`}>
        {pass ? <CheckIcon size={16} /> : <CloseIcon size={16} />}
        {pass ? `All ${results.length} contrast targets met` : `${results.filter((r) => !r.pass).length} of ${results.length} contrast targets missed`}
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {results.map((r) => (
          <li key={`${r.fg}-${r.bg}`} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-2.5">
            {/* large bold sample (24px): the size WCAG allows 3:1 for, so every pair is shown as it may be used */}
            <span className="grid h-12 w-16 shrink-0 place-items-center rounded-lg border border-border text-2xl font-bold" style={{ background: c[r.bg], color: c[r.fg] }}>Aa</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{r.label}</span>
              <span className="block truncate text-xs text-muted">{r.fg} on {r.bg} · needs {r.min}:1</span>
            </span>
            <span className="text-right">
              <span className="block font-mono text-sm font-semibold">{r.ratio.toFixed(2)}</span>
              <span className={`text-[11px] font-semibold ${r.pass ? 'text-success' : 'text-danger'}`}>{level(r.ratio)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
