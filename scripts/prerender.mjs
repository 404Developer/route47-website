// Renders the React app to static HTML and injects it into dist/index.html, so the
// page shows up instantly and search engines see the full content without running JS.
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)
const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8')
const markup = render()

const placeholder = '<div id="root"></div>'
if (!template.includes(placeholder)) throw new Error(`prerender: ${placeholder} not found in dist/index.html`)

// Preload the fonts the hero needs so the headline doesn't swap in late.
const assets = await fs.readdir(path.join(dist, 'assets'))
const preloads = assets
  .filter((f) => /^barlow-(condensed-latin-800|latin-400)-normal-.+\.woff2$/.test(f))
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ')

// Replacer functions, so a "$" in the page copy is never read as a replacement pattern.
const html = template
  .replace(placeholder, () => `<div id="root">${markup}</div>`)
  .replace('</title>', () => `</title>\n    ${preloads}`)

await fs.writeFile(path.join(dist, 'index.html'), html)
await fs.rm(ssrDir, { recursive: true, force: true })

console.log(`prerendered dist/index.html (${(markup.length / 1024).toFixed(1)} kB of markup, ${preloads ? preloads.split('\n').length : 0} font preloads)`)
