import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { noFlashScript } from '../../packages/tonekit/src/dom.js'

const { version } = JSON.parse(readFileSync(new URL('../../packages/tonekit/package.json', import.meta.url), 'utf8'))
const lib = (p) => fileURLToPath(new URL(`../../packages/tonekit/src/${p}`, import.meta.url))

// The site imports the library straight from its source, so edits to a theme
// or a component show up here without a library build.
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      // tonekit's own no-flash script: the saved theme is on the page before it paints
      name: 'tonekit-no-flash',
      transformIndexHtml: (html) => html.replace('<!--no-flash-->', `<script>${noFlashScript({ storageKey: 'tonekit-site-theme' })}</script>`),
    },
  ],
  resolve: {
    alias: [
      { find: /^tonekit-themes\/react$/, replacement: lib('react.jsx') },
      { find: /^tonekit-themes$/, replacement: lib('index.js') },
    ],
  },
  define: {
    __TONEKIT_VERSION__: JSON.stringify(version),
  },
  // the manifest lets the prerender step preload each route's own chunks
  build: { sourcemap: false, manifest: true },
})
