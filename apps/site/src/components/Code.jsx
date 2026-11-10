import { useEffect, useRef, useState } from 'react'
import { CheckIcon, CopyIcon } from './Icons'

/** Copy text to the clipboard; `copied` is true for a moment afterwards. */
export function useCopy() {
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1400)
    } catch { /* clipboard blocked: nothing to show */ }
  }
  return [copied, copy]
}

export function CopyButton({ text, label = 'Copy', className = '' }) {
  const [copied, copy] = useCopy()
  return (
    <button
      type="button"
      onClick={() => copy(text)}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-muted transition hover:bg-surface-alt hover:text-text ${className}`}
    >
      {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
      <span aria-live="polite">{copied ? 'Copied' : label}</span>
    </button>
  )
}

/** A code block with an optional title and a copy button. */
export function CodeBlock({ code, title, className = '' }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-border bg-bg-alt ${className}`}>
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
        <span className="font-mono text-xs text-subtle">{title || 'code'}</span>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-text"><code>{code}</code></pre>
    </div>
  )
}

/** Code blocks behind tabs: [{ label, code }] */
export function CodeTabs({ tabs, className = '' }) {
  const [i, setI] = useState(0)
  const tab = tabs[i]
  return (
    <div className={`overflow-hidden rounded-xl border border-border bg-bg-alt ${className}`}>
      <div className="flex items-center justify-between gap-2 border-b border-border px-2">
        <div role="tablist" aria-label="Code examples" className="flex overflow-x-auto">
          {tabs.map((t, n) => (
            <button
              key={t.label}
              role="tab"
              type="button"
              aria-selected={n === i}
              onClick={() => setI(n)}
              className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-xs font-semibold transition ${n === i ? 'border-primary text-text' : 'border-transparent text-subtle hover:text-muted'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <CopyButton text={tab.code} />
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-text"><code>{tab.code}</code></pre>
    </div>
  )
}
