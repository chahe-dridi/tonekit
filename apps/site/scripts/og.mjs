// Renders the 1200×630 social card (the /og page) and the app icons
// (from favicon.svg) into public/. Run after a build: npm run og -w @tonekit/site
import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import puppeteer from 'puppeteer-core'
import { chromePath, serveDist } from '../../../scripts/serve-dist.mjs'

const pub = resolve(import.meta.dirname, '../public')
const site = serveDist()
const browser = await puppeteer.launch({ executablePath: chromePath(), headless: true })
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630 })
  await page.goto(`${site.url}/og`, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: join(pub, 'og.png') })

  const svg = readFileSync(join(pub, 'favicon.svg'), 'utf8')
  for (const [file, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]]) {
    await page.setViewport({ width: size, height: size })
    await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`)
    await page.screenshot({ path: join(pub, file), omitBackground: true })
  }
  console.log('og.png and app icons written to public/')
} finally {
  await browser.close()
  site.close()
}
