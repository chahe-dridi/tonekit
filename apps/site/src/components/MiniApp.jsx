// A small dashboard used as a theme's thumbnail. Purely decorative: every
// colour comes from the surrounding theme's variables (render it inside a
// <ThemeScope>).

const BARS = [42, 68, 55, 80, 62, 92, 74]

export default function MiniApp({ className = '' }) {
  return (
    <div aria-hidden="true" className={`flex h-full select-none gap-2 bg-bg p-2.5 text-[9px] ${className}`}>
      {/* sidebar */}
      <div className="flex w-[22%] flex-col gap-1.5 rounded-md bg-bg-alt p-1.5">
        <div className="mb-1 h-2 w-3/4 rounded-sm bg-primary" />
        {[1, 0, 0, 0].map((on, i) => (
          <div key={i} className={`h-1.5 rounded-sm ${on ? 'bg-primary/40' : 'bg-border'}`} />
        ))}
      </div>
      {/* main */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="h-2 w-2/5 rounded-sm bg-text" />
          <div className="flex gap-1">
            <div className="h-3 w-7 rounded-sm bg-surface-alt" />
            <div className="h-3 w-7 rounded-sm bg-primary" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {['bg-success', 'bg-warning', 'bg-danger'].map((c) => (
            <div key={c} className="flex flex-col gap-1 rounded-md border border-border bg-surface p-1.5">
              <div className="h-1 w-1/2 rounded-sm bg-subtle" />
              <div className="h-1.5 w-3/4 rounded-sm bg-text" />
              <div className={`h-1 w-1/3 rounded-sm ${c}`} />
            </div>
          ))}
        </div>
        <div className="flex flex-1 items-end gap-1 rounded-md border border-border bg-surface p-1.5">
          {BARS.map((h, i) => (
            <div key={i} className={`flex-1 rounded-sm ${i % 3 === 2 ? 'bg-accent' : 'bg-primary'}`} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
