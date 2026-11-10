// A realistic UI kit drawn only with the 13 tonekit tokens, so it shows how a
// theme looks on real components. Render it inside a <ThemeScope> to see a
// theme other than the page's.
import { useState } from 'react'
import { BellIcon, ChartIcon, CheckIcon, GearIcon, HomeIcon, SearchIcon, UsersIcon } from './Icons'

const Card = ({ title, level = 3, children, className = '' }) => {
  const H = `h${level}`
  return (
    <section className={`rounded-2xl border border-border bg-surface p-4 ${className}`}>
      {title && <H className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">{title}</H>}
      {children}
    </section>
  )
}

const BARS = [38, 56, 44, 72, 63, 85, 70, 92, 66, 78, 58, 88]
const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
const ROWS = [
  ['Amira B.', 'Design system', 'Active', 'success'],
  ['Youssef K.', 'Billing API', 'Review', 'warning'],
  ['Lina M.', 'Mobile app', 'Blocked', 'danger'],
  ['Omar T.', 'Docs site', 'Active', 'success'],
]
const BADGE = {
  success: 'bg-success/15 text-text before:bg-success',
  warning: 'bg-warning/15 text-text before:bg-warning',
  danger: 'bg-danger/15 text-text before:bg-danger',
}
const badge = (tone) => `inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xs font-semibold before:size-1.5 before:rounded-full before:content-[''] ${BADGE[tone]}`

function Toggle({ label, defaultOn = false }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-text">
      {label}
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn(!on)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? 'bg-primary' : 'bg-surface-alt ring-1 ring-border'}`}
      >
        <span className={`absolute top-0.5 size-5 rounded-full shadow transition-all ${on ? 'left-5.5 bg-on-primary' : 'left-0.5 bg-subtle'}`} />
      </button>
    </label>
  )
}

export default function Showcase({ name = 'tonekit', level = 3 }) {
  const Sub = `h${Math.min(level + 1, 6)}`
  const [tab, setTab] = useState('Overview')
  const [checked, setChecked] = useState(true)
  const [plan, setPlan] = useState('pro')

  return (
    <div className="theme-fade bg-bg p-3 font-sans text-text sm:p-5">
      {/* app bar */}
      <header className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-bg-alt px-4 py-3">
        <div className="flex items-center gap-2 font-semibold">
          <span className="grid size-7 place-items-center rounded-lg bg-primary text-xs font-bold text-on-primary">{name[0].toUpperCase()}</span>
          {name}
        </div>
        <nav aria-label="Example navigation" className="order-3 flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto">
          {[['Overview', HomeIcon], ['Analytics', ChartIcon], ['Team', UsersIcon], ['Settings', GearIcon]].map(([label, Icon]) => (
            <button
              key={label}
              type="button"
              onClick={() => setTab(label)}
              aria-current={tab === label ? 'page' : undefined}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition ${tab === label ? 'bg-surface-alt font-medium text-text' : 'text-muted hover:text-text'}`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <label className="hidden items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-sm text-subtle md:flex">
            <SearchIcon size={15} />
            <input aria-label="Search" placeholder="Search…" className="w-28 bg-transparent text-text outline-none placeholder:text-subtle" />
          </label>
          <button type="button" aria-label="Notifications" className="relative grid size-8 place-items-center rounded-lg text-muted hover:bg-surface-alt hover:text-text">
            <BellIcon size={17} />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-danger" />
          </button>
          <span className="grid size-8 place-items-center rounded-full bg-accent text-xs font-semibold text-on-accent">CD</span>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* stats */}
        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-3">
          {[
            ['Revenue', '$48.2k', '+12.4%', 'success'],
            ['Active users', '3,912', '+4.1%', 'success'],
            ['Churn', '2.3%', '+0.6%', 'danger'],
          ].map(([label, value, delta, tone]) => (
            <Card level={level} key={label}>
              <p className="text-sm text-muted">{label}</p>
              <div className="mt-1 flex items-end justify-between gap-2">
                <p className="text-2xl font-semibold tracking-tight">{value}</p>
                <span className={badge(tone)}>{delta}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* chart */}
        <Card level={level} title="Monthly sales" className="lg:col-span-2">
          <div className="flex h-40 items-end gap-1.5">
            {BARS.map((h, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center gap-1">
                {/* the bar is pinned to the bottom of a box with a real height, so its % height resolves */}
                <div className="relative w-full flex-1">
                  <div className={`absolute inset-x-0 bottom-0 rounded-t-md ${i === 7 ? 'bg-accent' : 'bg-primary/80'}`} style={{ height: `${h}%` }} />
                </div>
                <span className="text-[10px] text-muted">{MONTHS[i]}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-primary/80" />Sales</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-accent" />Best month</span>
          </div>
        </Card>

        {/* progress */}
        <Card level={level} title="Goals">
          {[['Design', 82, 'bg-primary'], ['Build', 64, 'bg-accent'], ['Test', 41, 'bg-success'], ['Launch', 18, 'bg-warning']].map(([label, v, c]) => (
            <div key={label} className="mb-3 last:mb-0">
              <div className="mb-1 flex justify-between text-sm"><span>{label}</span><span className="text-muted">{v}%</span></div>
              <div className="h-2 rounded-full bg-surface-alt"><div className={`h-2 rounded-full ${c}`} style={{ width: `${v}%` }} /></div>
            </div>
          ))}
        </Card>

        {/* form */}
        <Card level={level} title="Create project">
          <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
            <label className="text-sm">
              <span className="mb-1 block text-muted">Project name</span>
              <input defaultValue="Aurora" className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text outline-none placeholder:text-subtle focus:border-primary focus:ring-2 focus:ring-primary/25" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-muted">Email</span>
              <input placeholder="you@company.com" className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text outline-none placeholder:text-subtle focus:border-primary focus:ring-2 focus:ring-primary/25" />
            </label>
            <fieldset className="flex gap-2 text-sm">
              <legend className="mb-1 text-muted">Plan</legend>
              {['free', 'pro', 'team'].map((p) => (
                <button key={p} type="button" aria-pressed={plan === p} onClick={() => setPlan(p)}
                  className={`flex-1 rounded-lg border px-2 py-1.5 capitalize transition ${plan === p ? 'border-primary bg-primary/10 font-semibold text-text' : 'border-border text-muted hover:text-text'}`}>
                  {p}
                </button>
              ))}
            </fieldset>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <button type="button" role="checkbox" aria-checked={checked} onClick={() => setChecked(!checked)}
                className={`grid size-5 place-items-center rounded-md border transition ${checked ? 'border-primary bg-primary text-on-primary' : 'border-border bg-bg'}`}>
                {checked && <CheckIcon size={13} />}
              </button>
              Send me product updates
            </label>
            <Toggle label="Public project" defaultOn />
            <div className="mt-1 flex gap-2">
              <button type="submit" className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-on-primary transition hover:opacity-90">Create</button>
              <button type="button" className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-text transition hover:bg-surface-alt">Cancel</button>
            </div>
          </form>
        </Card>

        {/* alerts and buttons */}
        <Card level={level} title="Feedback">
          <div className="flex flex-col gap-2.5 text-sm">
            <div role="status" className="rounded-lg border border-success/30 border-l-4 border-l-success bg-success/10 px-3 py-2 text-text"><b>Saved.</b> Your changes are live.</div>
            <div role="status" className="rounded-lg border border-warning/30 border-l-4 border-l-warning bg-warning/10 px-3 py-2 text-text"><b>Heads up.</b> Your trial ends in 3 days.</div>
            <div role="status" className="rounded-lg border border-danger/30 border-l-4 border-l-danger bg-danger/10 px-3 py-2 text-text"><b>Error.</b> The payment was declined.</div>
            <div role="status" className="rounded-lg border border-primary/30 border-l-4 border-l-primary bg-primary/10 px-3 py-2 text-text"><b>Tip.</b> Press <kbd className="rounded border border-border bg-surface-alt px-1 font-mono text-xs">/</kbd> to search.</div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-on-primary">Primary</button>
            <button type="button" className="rounded-lg bg-surface-alt px-3 py-1.5 text-sm font-medium text-text">Secondary</button>
            <button type="button" className="rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10">Ghost</button>
            <button type="button" className="rounded-lg bg-danger px-3 py-1.5 text-sm font-semibold text-on-danger">Delete</button>
          </div>
        </Card>

        {/* typography */}
        <Card level={level} title="Typography">
          <Sub className="text-xl font-semibold tracking-tight">Readable by default</Sub>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Every theme keeps body text above 7:1 contrast and links above 4.5:1, so long reads stay comfortable. <a href="#top" onClick={(e) => e.preventDefault()} className="font-medium text-primary underline decoration-primary/40 underline-offset-2">Learn more</a>
          </p>
          <blockquote className="mt-3 border-l-2 border-accent pl-3 text-sm italic text-text">“Colour is a power which directly influences the soul.”</blockquote>
          <p className="mt-2 text-xs text-muted">Caption text stays readable too.</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {['React', 'CSS', 'Tailwind'].map((t) => <span key={t} className="rounded-full bg-surface-alt px-2.5 py-0.5 text-xs font-medium text-muted">{t}</span>)}
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-on-accent">New</span>
          </div>
        </Card>

        {/* table */}
        <Card level={level} title="Team activity" className="overflow-hidden lg:col-span-2">
          <div className="-mx-4 overflow-x-auto">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
                  <th scope="col" className="px-4 py-2 font-medium">Member</th>
                  <th scope="col" className="px-4 py-2 font-medium">Project</th>
                  <th scope="col" className="px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([who, what, status, tone]) => (
                  <tr key={who} className="border-b border-border last:border-0 hover:bg-surface-alt/60">
                    <td className="px-4 py-2.5 font-medium">{who}</td>
                    <td className="px-4 py-2.5 text-muted">{what}</td>
                    <td className="px-4 py-2.5"><span className={badge(tone)}>{status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* code */}
        <Card level={level} title="Code">
          {/* syntax colours limited to the ones every theme guarantees at 4.5:1 on bg */}
          <pre className="overflow-x-auto rounded-lg border border-border bg-bg p-3 font-mono text-xs leading-relaxed">
            <code>
              <span className="italic text-muted">{'// pick a theme'}</span>{'\n'}
              <span className="text-primary">import</span>{' { applyTheme } '}<span className="text-primary">from</span>{' '}<span className="text-muted">'tonekit'</span>{'\n\n'}
              <span className="font-semibold">applyTheme</span>{'('}<span className="text-muted">'nord'</span>{')\n'}
              <span className="text-primary">const</span>{' ratio = '}<span className="text-primary">7.2</span>
            </code>
          </pre>
        </Card>
      </div>
    </div>
  )
}
