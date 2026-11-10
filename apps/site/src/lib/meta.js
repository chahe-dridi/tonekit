// Page titles and descriptions, shared by the running site (useSEO) and the
// build-time prerender script, which bakes them into each route's HTML so
// crawlers and link previews see them without running JavaScript.
// Plain data only: no imports, so Node can load this file as is.

export const SITE_URL = 'https://tonekit-gamma.vercel.app'
export const SITE_NAME = 'tonekit'

export const ROUTES = {
  '/': {
    title: 'tonekit: 23 contrast-checked colour themes for any UI',
    description: '23 hand-tuned colour themes (Catppuccin, Nord, Tokyo Night, Gruvbox, Rosé Pine and more) with one shared shape of 13 tokens. Every theme passes WCAG contrast. CSS variables, Tailwind, React.',
  },
  '/themes': {
    title: 'All 23 themes, live | tonekit',
    description: 'Browse every tonekit theme on a real interface: filter by dark or light, mood and contrast, preview it on this site, and copy it as CSS, JSON or code.',
  },
  '/create': {
    title: 'Theme builder: make your own | tonekit',
    description: 'Start from any tonekit theme, change its 13 colours and watch buttons, forms, tables and charts update live, with WCAG contrast checks. Export as CSS, JSON or defineTheme().',
  },
  '/docs': {
    title: 'Docs: CSS, Tailwind, React and API | tonekit',
    description: 'Install tonekit and theme any site: plain CSS with data-theme, the Tailwind v4 preset, the React ThemeProvider and ThemePicker, the no-flash script and your own themes.',
  },
}

export const themeMeta = (theme) => ({
  title: `${theme.name}: a ${theme.mode} colour theme | tonekit`,
  description: `${theme.name} is a ${theme.tags.join(', ')} ${theme.mode} theme${theme.credit ? ` based on ${theme.credit.name}` : ''}, with 13 contrast-checked colour tokens. See it on real components and copy it as CSS variables, Tailwind or React.`,
})

export const DEFAULT_META = ROUTES['/']
