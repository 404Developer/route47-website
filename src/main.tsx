import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'

// Scroll-reveal styles only kick in once JS is running, so the page never hides content without it.
document.documentElement.classList.add('js')

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production builds ship pre-rendered HTML (see scripts/prerender.mjs); dev starts empty.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
