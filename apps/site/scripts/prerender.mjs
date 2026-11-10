// After `vite build`: give every route its own HTML file with the right
// <title>, description, canonical URL and social tags baked in, plus a short
// text summary for crawlers, then write sitemap.xml and robots.txt.
// The app still boots as a SPA; this only makes each URL meaningful before
// JavaScript runs (search engines, link previews, no-JS visitors).
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { TOKENS } from '../../../packages/tonekit/src/tokens.js'
import { themes } from '../../../packages/tonekit/src/themes.js'
import { ROUTES, SITE_URL, themeMeta } from '../src/lib/meta.js'

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const template = readFileSync(join(dist, 'index.html'), 'utf8')

// Each route's own lazy page chunk (and what it imports) gets a
// modulepreload hint, so it downloads in parallel with the main bundle.
const manifestPath = join(dist, '.vite', 'manifest.json')
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {}
const PAGE_OF = { '/themes': 'Themes', '/create': 'Create', '/docs': 'Docs', '/theme': 'ThemePage' }
function chunksOf(key, seen = new Set()) {
  const entry = manifest[key]
  if (!entry || seen.has(key)) return seen
  seen.add(key)
  for (const dep of entry.imports || []) chunksOf(dep, seen)
  return seen
}
function preloadsFor(path) {
  const page = PAGE_OF[path.startsWith('/themes/') ? '/theme' : path]
  const pageKey = page && Object.keys(manifest).find((k) => k.endsWith(`src/pages/${page}.jsx`))
  if (!pageKey) return ''
  const main = Object.values(manifest).find((e) => e.isEntry)
  const already = new Set([main?.file, ...(main?.imports || []).map((k) => manifest[k]?.file)])
  return [...chunksOf(pageKey)].map((k) => manifest[k].file).filter((f) => f && !already.has(f))
    .map((f) => `<link rel="modulepreload" crossorigin href="/${f}">`).join('\n    ')
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function render(path, { title, description }, summary) {
  const url = `${SITE_URL}${path}`
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(description)}$2`)
  const preloads = preloadsFor(path)
  if (preloads) html = html.replace('</head>', `    ${preloads}\n  </head>`)
  // Crawler-readable summary inside #root; React replaces it on first render
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"><div style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)"><h1>${esc(title)}</h1><p>${esc(description)}</p>${summary || ''}</div></div>`,
  )
  const file = path === '/' ? join(dist, 'index.html') : join(dist, path, 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
}

const themeLinks = `<ul>${themes.map((t) => `<li><a href="/themes/${t.id}">${esc(t.name)}</a>: ${esc(`${t.mode}, ${t.tags.join(', ')}`)}</li>`).join('')}</ul>`

for (const [path, meta] of Object.entries(ROUTES)) render(path, meta, path === '/' || path === '/themes' ? themeLinks : '')
for (const t of themes) {
  const colors = `<h2>Colours</h2><ul>${TOKENS.map((k) => `<li>${k}: ${t.colors[k]}</li>`).join('')}</ul>`
  const credit = t.credit ? `<p>Based on <a href="${t.credit.url}">${esc(t.credit.name)}</a>.</p>` : ''
  render(`/themes/${t.id}`, themeMeta(t), credit + colors)
}

const today = new Date().toISOString().slice(0, 10)
const urls = [...Object.keys(ROUTES), ...themes.map((t) => `/themes/${t.id}`)]
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc><lastmod>${today}</lastmod><priority>${u === '/' ? '1.0' : u.startsWith('/themes/') ? '0.6' : '0.8'}</priority></url>`).join('\n')}
</urlset>
`)
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /og\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)

// the manifest is a build artefact, not something to serve
rmSync(join(dist, '.vite'), { recursive: true, force: true })

console.log(`prerendered ${urls.length} routes, sitemap.xml and robots.txt`)
