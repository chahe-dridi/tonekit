// A tiny static server for the built site (apps/site/dist), used by the
// social-card and README-media scripts. Prerendered routes resolve to their
// own index.html; anything else falls back to the SPA shell.
import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json' }

export function serveDist(root = resolve(import.meta.dirname, '../apps/site/dist')) {
  if (!existsSync(join(root, 'index.html'))) throw new Error('build the site first: npm run build')
  const server = createServer((req, res) => {
    let f = join(root, decodeURIComponent(req.url.split('?')[0]))
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html')
    if (!f.startsWith(root) || !existsSync(f)) f = join(root, 'index.html')
    res.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' })
    res.end(readFileSync(f))
  }).listen(0)
  return { url: `http://localhost:${server.address().port}`, close: () => server.close() }
}

export const chromePath = () => process.env.CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((p) => existsSync(p))
