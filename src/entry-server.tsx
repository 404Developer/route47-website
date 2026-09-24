import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'

// Used at build time to pre-render the page to static HTML (scripts/prerender.mjs).
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
