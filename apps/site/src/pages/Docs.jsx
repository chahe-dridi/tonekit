import { Link } from 'react-router-dom'
import { CONTRAST_CHECKS, TOKENS, themes, tokenToVar } from 'tonekit-themes'
import { CodeBlock } from '../components/Code'
import { ROUTES } from '../lib/meta'
import { INSTALL } from '../lib/site'
import { useSEO } from '../lib/useSEO'

const SECTIONS = [
  ['install', 'Install'],
  ['css', 'Plain CSS'],
  ['tokens', 'Tokens'],
  ['react', 'React'],
  ['tailwind', 'Tailwind CSS'],
  ['javascript', 'JavaScript'],
  ['no-flash', 'No flash on load'],
  ['custom', 'Your own themes'],
  ['contrast', 'Contrast rules'],
  ['api', 'API reference'],
]

const API = [
  ['themes', 'All built-in themes: { id, name, mode, tags, credit?, colors }.'],
  ['themesById / getTheme(id)', 'Look a theme up by id (getTheme throws on unknown ids).'],
  ['TAGS · TOKENS', 'The mood tags and the 13 token names.'],
  ['applyTheme(theme, { root?, prefix? })', 'Set the variables, data-theme, a dark/light class and color-scheme on <html> or any element.'],
  ['saveTheme(theme | "system") · loadTheme()', 'Remember a choice in localStorage and read it back.'],
  ['resolveTheme({ dark?, light? })', 'The saved theme, else the default for the OS light/dark setting.'],
  ['noFlashScript(options)', 'An inline <head> script that applies the saved theme before first paint.'],
  ['themeToVars(theme, { prefix? })', 'The CSS variables as an object (handy for style={…}).'],
  ['themeToCss(theme, { selector?, prefix? }) · themesToCss()', 'One theme or many as CSS rules.'],
  ['defineTheme({ id, name?, mode?, colors, base? })', 'Make a theme; missing colours come from base, all are checked to be hex.'],
  ['checkTheme(theme)', '{ pass, results }: every contrast target with its ratio.'],
  ['contrast(a, b) · readableOn(hex) · mix(a, b, w)', 'Colour helpers: WCAG ratio, black-or-white text, blending.'],
]

const REACT_API = [
  ['<ThemeProvider>', 'Applies and remembers the theme. Props: defaultTheme ("system" or an id), themes, dark, light, storageKey, persist, prefix.'],
  ['useTheme()', '{ theme, themeId, choice, followSystem, themes, setTheme(id | "system"), preview(id), endPreview() }'],
  ['<ThemePicker>', 'Accessible theme menu with live preview. Props: label, systemLabel, showSystem, align.'],
  ['<ThemeScope theme="nord">', 'Renders its children in another theme, whatever the page uses. Props: as, bare, prefix.'],
  ['<ThemeSwatch theme="nord">', 'A small picture of a theme for your own menus.'],
]

function H2({ id, children }) {
  return <h2 id={id} className="scroll-mt-24 text-2xl font-bold tracking-tight">{children}</h2>
}

export default function Docs() {
  useSEO({ ...ROUTES['/docs'], path: '/docs' })
  return (
    <div className="mx-auto grid max-w-[min(100%,110rem)] gap-10 px-4 pt-10 sm:px-6 lg:grid-cols-[14rem_1fr] lg:px-10">
      <nav aria-label="On this page" className="self-start lg:sticky lg:top-24">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">On this page</p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm lg:block lg:space-y-1.5">
          {SECTIONS.map(([id, label]) => <li key={id}><a href={`#${id}`} className="text-muted hover:text-text">{label}</a></li>)}
        </ul>
      </nav>

      <article className="min-w-0 max-w-3xl space-y-12 leading-relaxed">
        <header>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Docs</h1>
          <p className="mt-2 text-muted">tonekit is {themes.length} colour themes that share one shape, plus small helpers to use them with plain CSS, Tailwind or React. Pick the section that matches your project.</p>
        </header>

        <section className="space-y-4">
          <H2 id="install">Install</H2>
          <CodeBlock title="terminal" code={INSTALL} />
          <p className="text-muted">ESM, zero runtime dependencies. React is only needed for <code className="font-mono text-sm text-text">tonekit-themes/react</code>.</p>
        </section>

        <section className="space-y-4">
          <H2 id="css">Plain CSS</H2>
          <p className="text-muted">Load the stylesheet with every theme, then choose one with <code className="font-mono text-sm text-text">data-theme</code>. Without it, the page follows the visitor's light or dark setting.</p>
          <CodeBlock title="styles.css" code={`@import "tonekit-themes/themes.css";

.card {
  background: var(--theme-surface);
  color: var(--theme-text);
  border: 1px solid var(--theme-border);
}
.button {
  background: var(--theme-primary);
  color: var(--theme-on-primary);
}
.badge {
  /* every colour also has an -rgb triple for tints */
  background: rgba(var(--theme-primary-rgb), 0.15);
}`} />
          <CodeBlock title="index.html" code={'<html data-theme="tokyo-night">'} />
        </section>

        <section className="space-y-4">
          <H2 id="tokens">Tokens</H2>
          <p className="text-muted">Every theme defines the same {TOKENS.length} colours, plus <code className="font-mono text-sm text-text">--theme-on-primary</code>, <code className="font-mono text-sm text-text">-on-accent</code>, <code className="font-mono text-sm text-text">-on-success</code>, <code className="font-mono text-sm text-text">-on-warning</code> and <code className="font-mono text-sm text-text">-on-danger</code> (black or white text for solid buttons and badges) and <code className="font-mono text-sm text-text">-rgb</code> triples.</p>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-xs uppercase tracking-wider text-muted">
                <tr><th scope="col" className="px-4 py-2.5 font-medium">Token</th><th scope="col" className="px-4 py-2.5 font-medium">CSS variable</th><th scope="col" className="px-4 py-2.5 font-medium">Now</th></tr>
              </thead>
              <tbody>
                {TOKENS.map((t) => (
                  <tr key={t} className="border-t border-border">
                    <td className="px-4 py-2 font-medium">{t}</td>
                    <td className="px-4 py-2 font-mono text-xs text-muted">--theme-{tokenToVar(t)}</td>
                    <td className="px-4 py-2"><span className="block size-6 rounded-md border border-border" style={{ background: `var(--theme-${tokenToVar(t)})` }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <H2 id="react">React</H2>
          <p className="text-muted"><code className="font-mono text-sm text-text">ThemeProvider</code> applies the theme to the page and remembers it; <code className="font-mono text-sm text-text">ThemePicker</code> is a ready-made, keyboard-accessible menu with live preview.</p>
          <CodeBlock title="App.jsx" code={`import { ThemeProvider, ThemePicker, useTheme } from 'tonekit-themes/react'

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" dark="tokyo-night" light="catppuccin-latte">
      <header>
        <ThemePicker />
      </header>
      <Page />
    </ThemeProvider>
  )
}

function Page() {
  const { theme, setTheme } = useTheme()
  return <button onClick={() => setTheme('nord')}>Now: {theme.name}</button>
}`} />
          <p className="text-muted">Show part of a page in a different theme, for previews or a contrasting section:</p>
          <CodeBlock title="Preview.jsx" code={`import { ThemeScope } from 'tonekit-themes/react'

<ThemeScope theme="gruvbox" className="rounded-xl p-6">
  <Card />  {/* sees gruvbox's --theme-* variables */}
</ThemeScope>`} />
        </section>

        <section className="space-y-4">
          <H2 id="tailwind">Tailwind CSS</H2>
          <p className="text-muted">The v4 preset turns every token into a colour utility that follows the active theme, and points <code className="font-mono text-sm text-text">dark:</code> at the theme's mode.</p>
          <CodeBlock title="app.css" code={`@import "tailwindcss";
@import "tonekit-themes/tailwind.css";`} />
          <CodeBlock title="Card.jsx" code={`<div className="rounded-xl border border-border bg-surface p-6 text-text">
  <h2 className="font-semibold">Plan</h2>
  <p className="text-muted">Billed monthly.</p>
  <button className="bg-primary text-on-primary">Upgrade</button>
  <span className="bg-success/15 text-success">Active</span>
</div>`} />
          <p className="text-sm text-muted">Utilities: bg, bg-alt, surface, surface-alt, border, text, muted, subtle, primary, accent, success, warning, danger, and on-primary, on-accent, on-success, on-warning, on-danger for text on those.</p>
        </section>

        <section className="space-y-4">
          <H2 id="javascript">JavaScript</H2>
          <p className="text-muted">No framework? Apply and remember themes with plain functions.</p>
          <CodeBlock title="main.js" code={`import { applyTheme, saveTheme, resolveTheme } from 'tonekit-themes'

applyTheme(resolveTheme())          // saved choice, or the OS default

picker.addEventListener('change', (e) => {
  applyTheme(e.target.value)
  saveTheme(e.target.value)          // or saveTheme('system')
})`} />
        </section>

        <section className="space-y-4">
          <H2 id="no-flash">No flash on load</H2>
          <p className="text-muted">A page rendered before JavaScript runs would show the default colours for a moment. <code className="font-mono text-sm text-text">noFlashScript()</code> returns a tiny script for your <code className="font-mono text-sm text-text">&lt;head&gt;</code> that applies the saved theme first. This site uses it.</p>
          <CodeBlock title="build step / server" code={`import { noFlashScript } from 'tonekit-themes'

const head = \`<script>\${noFlashScript({ dark: 'tokyo-night', light: 'catppuccin-latte' })}</script>\`
// with <ThemeProvider>, pass the same storageKey to both`} />
        </section>

        <section className="space-y-4">
          <H2 id="custom">Your own themes</H2>
          <p className="text-muted">Give your brand colours and borrow the rest from a built-in theme. Try it live in the <Link to="/create" className="font-medium text-primary">theme builder</Link>, which also fixes contrast for you.</p>
          <CodeBlock title="brand.js" code={`import { defineTheme, checkTheme } from 'tonekit-themes'

export const brand = defineTheme({
  id: 'brand',
  name: 'Brand',
  base: 'midnight',
  colors: { primary: '#ff5a5f', accent: '#00a699' },
})

checkTheme(brand).pass   // check it before shipping

<ThemeProvider themes={[...themes, brand]} defaultTheme="brand">`} />
        </section>

        <section className="space-y-4">
          <H2 id="contrast">Contrast rules</H2>
          <p className="text-muted">Every built-in theme meets these WCAG 2 targets; the test suite checks them on each change.</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {CONTRAST_CHECKS.map(([fg, bg, min, label]) => (
              <li key={`${fg}${bg}`} className="rounded-xl border border-border bg-surface px-3 py-2 text-sm"><b>{label}</b><span className="block text-xs text-muted">{fg} on {bg}: at least {min}:1</span></li>
            ))}
            <li className="rounded-xl border border-border bg-surface px-3 py-2 text-sm"><b>Button text on primary</b><span className="block text-xs text-muted">on-primary on primary: at least 4.5:1</span></li>
          </ul>
        </section>

        <section className="space-y-4">
          <H2 id="api">API reference</H2>
          <h3 className="font-semibold">tonekit</h3>
          <dl className="divide-y divide-border rounded-2xl border border-border">
            {API.map(([name, text]) => (
              <div key={name} className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] sm:gap-4">
                <dt className="break-words font-mono text-[13px] text-text">{name}</dt>
                <dd className="text-sm text-muted">{text}</dd>
              </div>
            ))}
          </dl>
          <h3 className="pt-2 font-semibold">tonekit-themes/react</h3>
          <dl className="divide-y divide-border rounded-2xl border border-border">
            {REACT_API.map(([name, text]) => (
              <div key={name} className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] sm:gap-4">
                <dt className="break-words font-mono text-[13px] text-text">{name}</dt>
                <dd className="text-sm text-muted">{text}</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-muted">Full TypeScript definitions ship with the package.</p>
        </section>
      </article>
    </div>
  )
}
