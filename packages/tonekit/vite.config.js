import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Library build: ESM only, React external. The core entry has no React in it,
// so vanilla, Vue or Svelte projects never download it.
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: { index: 'src/index.js', react: 'src/react.jsx' },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: { chunkFileNames: 'chunks/[name]-[hash].js' },
    },
    sourcemap: false,
    minify: true,
    target: 'es2020',
  },
  test: {
    environment: 'node',
  },
})
