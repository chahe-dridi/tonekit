// Records the media shown in the README (GitHub and npm both render GIFs and
// PNGs; npm does not play video), from the real built site in headless Chrome.
//
//   npm run build && npm run media
//
// Needs a local Chrome or Edge; set CHROME_PATH if it is not in the usual
// place. Output: .github/media/{switch.gif, gallery.png, theme.png}

import { mkdirSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import puppeteer from 'puppeteer-core'
import gifenc from 'gifenc'
import { PNG } from 'pngjs'
import { chromePath, serveDist } from './serve-dist.mjs'

const { GIFEncoder, quantize, applyPalette } = gifenc
const OUT = resolve(import.meta.dirname, '../.github/media')
const FPS = 8
const SPEED = 0.7 // playback speed: below 1 plays slower than real time, easier to follow
// the hero's theme chips, clicked in this order (by their label)
const SWITCH_TO = ['Catppuccin', 'Gruvbox', 'Catppuccin Latte', 'Tokyo Night', 'Flexoki Light', 'Midnight']
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function encode(frames, file) {
  const { width, height } = frames[0]
  const step = Math.max(1, Math.floor(frames.length / 12))
  const picked = frames.filter((_, i) => i % step === 0)
  const sample = new Uint8Array(picked.length * width * height * 4)
  picked.forEach((f, i) => sample.set(f.data, i * width * height * 4))
  const palette = quantize(sample, 256)
  const gif = GIFEncoder()
  for (const f of frames) gif.writeFrame(applyPalette(f.data, palette), width, height, { palette, delay: Math.round(1000 / FPS / SPEED) })
  gif.finish()
  writeFileSync(file, gif.bytes())
  console.log(`readme-media: ${file.split(/[\\/]/).pop()}  ${(statSync(file).size / 1024).toFixed(0)} KB, ${frames.length} frames`)
}

const site = serveDist()
const browser = await puppeteer.launch({ executablePath: chromePath(), headless: true, args: ['--force-device-scale-factor=1'] })
mkdirSync(OUT, { recursive: true })
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1100, height: 640, deviceScaleFactor: 0.75 })
  await page.evaluateOnNewDocument(() => { try { localStorage.clear() } catch { /* fresh visit */ } })

  // 1. the home page switching themes as the chips are clicked
  await page.goto(`${site.url}/`, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  await sleep(600)
  const frames = []
  const t0 = Date.now()
  const total = SWITCH_TO.length * 1.3
  const clicking = (async () => {
    for (const name of SWITCH_TO) {
      await sleep(1300)
      await page.evaluate((label) => {
        [...document.querySelectorAll('button[aria-pressed]')].find((b) => b.textContent.trim() === label)?.click()
      }, name)
    }
  })()
  for (let i = 0; i < total * FPS; i++) {
    const due = t0 + (i * 1000) / FPS
    if (Date.now() < due) await sleep(due - Date.now())
    frames.push(PNG.sync.read(Buffer.from(await page.screenshot({ type: 'png', optimizeForSpeed: true }))))
  }
  await clicking
  encode(frames, join(OUT, 'switch.gif'))
  if (process.env.SHEET) { // contact sheet of 8 frames, to check the clip without a GIF viewer
    const { width, height } = frames[0]
    const sheet = new PNG({ width: width * 2, height: height * 4 })
    for (let i = 0; i < 8; i++) PNG.bitblt(frames[Math.floor(((i + 0.5) / 8) * frames.length)], sheet, 0, 0, width, height, (i % 2) * width, Math.floor(i / 2) * height)
    writeFileSync(join(process.env.SHEET, 'switch-sheet.png'), PNG.sync.write(sheet))
  }

  // 2. still screenshots: the gallery and one theme page
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
  await page.goto(`${site.url}/themes`, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: join(OUT, 'gallery.png') })
  await page.goto(`${site.url}/themes/gruvbox`, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: join(OUT, 'theme.png') })
  console.log('readme-media: gallery.png, theme.png')
} finally {
  await browser.close()
  site.close()
}
