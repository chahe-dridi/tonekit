// Renders the link-preview images and icons into public/, from the built site:
//   og.png               the site card (1200×630)
//   og/<theme>.png       one card per theme, shown when a theme page is shared
//   favicon.ico          16, 32 and 48 px (asked for by browsers, bookmarks, search results)
//   icon-192/512.png, apple-touch-icon.png
// Run after a build: npm run og -w @tonekit/site
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import puppeteer from 'puppeteer-core'
import { themes } from '../../../packages/tonekit/src/themes.js'
import { chromePath, serveDist } from '../../../scripts/serve-dist.mjs'

const pub = resolve(import.meta.dirname, '../public')

// an .ico file is a small header plus PNG images, one per size
function ico(pngs) {
  const header = Buffer.alloc(6 + 16 * pngs.length)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(pngs.length, 4)
  let offset = header.length
  pngs.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i
    header.writeUInt8(size >= 256 ? 0 : size, e)
    header.writeUInt8(size >= 256 ? 0 : size, e + 1)
    header.writeUInt16LE(1, e + 4) // colour planes
    header.writeUInt16LE(32, e + 6) // bits per pixel
    header.writeUInt32LE(data.length, e + 8)
    header.writeUInt32LE(offset, e + 12)
    offset += data.length
  })
  return Buffer.concat([header, ...pngs.map((p) => p.data)])
}

const site = serveDist()
const browser = await puppeteer.launch({ executablePath: chromePath(), headless: true })
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630 })
  const card = async (query, file) => {
    await page.goto(`${site.url}/og${query}`, { waitUntil: 'networkidle0' })
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: file, type: 'png' })
  }
  await card('', join(pub, 'og.png'))
  mkdirSync(join(pub, 'og'), { recursive: true })
  for (const t of themes) await card(`?theme=${t.id}`, join(pub, 'og', `${t.id}.png`))

  const svg = readFileSync(join(pub, 'favicon.svg'), 'utf8')
  const render = async (size) => {
    await page.setViewport({ width: size, height: size })
    await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`)
    return Buffer.from(await page.screenshot({ omitBackground: true, type: 'png' }))
  }
  for (const [file, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]]) writeFileSync(join(pub, file), await render(size))
  const sizes = []
  for (const size of [16, 32, 48]) sizes.push({ size, data: await render(size) })
  writeFileSync(join(pub, 'favicon.ico'), ico(sizes))
  console.log(`og.png, ${themes.length} theme cards, favicon.ico and app icons written to public/`)
} finally {
  await browser.close()
  site.close()
}
