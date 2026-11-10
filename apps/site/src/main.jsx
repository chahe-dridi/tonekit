import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'tonekit/react'
// Self-hosted fonts (latin only): no render-blocking third-party stylesheet
import '@fontsource-variable/inter/wght.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import '@fontsource/jetbrains-mono/latin-600.css'
import App from './App'
import { STORAGE_KEY } from './lib/site'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* the site is themed by tonekit itself, with the same key as the no-flash script */}
    <ThemeProvider storageKey={STORAGE_KEY}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
