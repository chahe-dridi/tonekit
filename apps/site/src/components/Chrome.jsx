// Site frame: logo, navbar and footer.
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ThemePicker } from 'tonekit-themes/react'
import { GITHUB, INSTALL, NPM, VERSION } from '../lib/site'
import { CopyButton } from './Code'
import { CloseIcon, GitHubIcon, MenuIcon } from './Icons'

export function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className}`}>
      <span aria-hidden="true" className="relative inline-block size-6">
        <span className="absolute left-0 top-0 size-4 rounded-[5px] bg-primary" />
        <span className="absolute bottom-0 right-0 size-4 rounded-[5px] bg-accent mix-blend-normal opacity-90" />
        <span className="absolute left-1 top-1 size-4 rounded-[5px] border-2 border-text/80" />
      </span>
      tonekit
    </span>
  )
}

const LINKS = [['/themes', 'Themes'], ['/create', 'Create'], ['/docs', 'Docs']]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const link = ({ isActive }) => `rounded-lg px-3 py-1.5 text-sm font-medium transition ${isActive ? 'bg-surface-alt text-text' : 'text-muted hover:text-text'}`

  return (
    <header className={`sticky top-0 z-40 border-b transition ${scrolled ? 'border-border bg-bg/85 backdrop-blur-md' : 'border-transparent bg-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-[min(100%,110rem)] items-center gap-3 px-4 sm:px-6 lg:px-10">
        <Link to="/" className="mr-2 text-lg" aria-label="tonekit home"><Logo /></Link>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {LINKS.map(([to, label]) => <NavLink key={to} to={to} className={link}>{label}</NavLink>)}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemePicker label="Site theme" />
          <a href={GITHUB} className="hidden size-9 place-items-center rounded-lg text-muted transition hover:bg-surface-alt hover:text-text sm:grid" aria-label="tonekit on GitHub">
            <GitHubIcon />
          </a>
          <button type="button" className="grid size-9 place-items-center rounded-lg text-muted hover:bg-surface-alt hover:text-text md:hidden"
            aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-border bg-bg px-4 pb-4 pt-2 md:hidden">
          {LINKS.map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => `block ${link({ isActive })} py-2.5`}>{label}</NavLink>)}
          <a href={GITHUB} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted">GitHub</a>
        </nav>
      )}
    </header>
  )
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-bg-alt">
      <div className="mx-auto grid max-w-[min(100%,110rem)] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
        <div>
          <Logo className="text-lg" />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            23 contrast-checked colour themes with one shared shape. Plain CSS, Tailwind or React.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <code className="rounded-lg border border-border bg-surface px-3 py-1.5 font-mono text-xs text-text">{INSTALL}</code>
            <CopyButton text={INSTALL} />
          </div>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {[['/themes', 'All themes'], ['/create', 'Theme builder'], ['/docs', 'Docs']].map(([to, label]) => (
              <li key={to}><Link to={to} className="text-muted hover:text-text">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">Project</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href={GITHUB} className="text-muted hover:text-text">GitHub</a></li>
            <li><a href={NPM} className="text-muted hover:text-text">npm</a></li>
            <li><a href={`${GITHUB}/blob/main/CONTRIBUTING.md`} className="text-muted hover:text-text">Contributing</a></li>
            <li><a href={`${GITHUB}/blob/main/CHANGELOG.md`} className="text-muted hover:text-text">Changelog (v{VERSION})</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-[min(100%,110rem)] px-4 py-5 text-xs text-muted sm:px-6 lg:px-10">
          MIT licensed · Made by <a href="https://github.com/chahe-dridi" className="underline underline-offset-2 hover:text-text">Chaher Dridi</a>. Palettes credited to their original authors on each theme page.
        </p>
      </div>
    </footer>
  )
}
