import { Link } from 'react-router-dom'
import { themes } from 'tonekit-themes'
import { ThemeSwatch } from 'tonekit-themes/react'
import { useSEO } from '../lib/useSEO'

export default function NotFound() {
  useSEO({ title: 'Page not found | tonekit', description: 'This page does not exist.', path: '/404', noindex: true })
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <div className="flex -space-x-2" aria-hidden="true">
        {themes.slice(0, 5).map((t) => <ThemeSwatch key={t.id} theme={t} size={36} />)}
      </div>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">404: no colour here</h1>
      <p className="mt-3 text-muted">This page does not exist. Maybe it was a theme that got renamed.</p>
      <div className="mt-6 flex gap-3">
        <Link to="/" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary">Home</Link>
        <Link to="/themes" className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-surface-alt">All themes</Link>
      </div>
    </div>
  )
}
