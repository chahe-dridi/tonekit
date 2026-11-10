import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Footer, Navbar } from './components/Chrome'
import Home from './pages/Home'

// Home ships in the main bundle; the other pages load when visited
const Themes = lazy(() => import('./pages/Themes'))
const ThemePage = lazy(() => import('./pages/ThemePage'))
const Create = lazy(() => import('./pages/Create'))
const Docs = lazy(() => import('./pages/Docs'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Og = lazy(() => import('./pages/Og'))

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  // the social-card source renders bare, without the site chrome
  if (pathname === '/og') return <Suspense fallback={null}><Og /></Suspense>

  return (
    <div className="theme-fade flex min-h-dvh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-on-primary">
        Skip to content
      </a>
      <ScrollToTop />
      <Navbar />
      <main id="main" className="flex-1">
        {/* the placeholder fills the screen, so the footer never jumps when a page arrives */}
        <Suspense fallback={<div className="min-h-dvh" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/themes" element={<Themes />} />
            <Route path="/themes/:id" element={<ThemePage />} />
            <Route path="/create" element={<Create />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
