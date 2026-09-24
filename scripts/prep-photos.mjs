// Cleans up job photos before they are committed:
//   - rotates them upright (phones store sideways photos plus an "orientation" flag)
//   - shrinks anything larger than 2400px, which is plenty for the website
//   - strips ALL metadata, including the GPS location of the job site
//
//   npm run photos            clean everything in src/content/gallery and src/content/before-after
//   npm run photos -- --check only report what would change
//
// The website build strips metadata from the images it publishes regardless; this keeps
// the originals in the repository small and free of customers' locations too.
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const MAX = 2400
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const folders = ['src/content/gallery', 'src/content/before-after'].map((f) => path.join(root, f))
const checkOnly = process.argv.includes('--check')

async function* walk(dir) {
  let entries
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

const kb = (n) => `${(n / 1024).toFixed(0)} kB`
let cleaned = 0
let saved = 0
let problems = 0

for (const folder of folders) {
  for await (const file of walk(folder)) {
    const rel = path.relative(root, file)
    const ext = path.extname(file).toLowerCase()

    if (ext === '.heic' || ext === '.heif') {
      console.warn(`! ${rel}: HEIC photos can't be used. Export or AirDrop it as a JPG instead.`)
      problems++
      continue
    }
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue
    if (/[#%?]/.test(path.basename(file))) {
      console.warn(`! ${rel}: rename this file without #, % or ? in the name.`)
      problems++
    }

    const meta = await sharp(file).metadata()
    const reasons = []
    if (meta.exif || meta.xmp || meta.iptc) reasons.push('metadata')
    if ((meta.orientation ?? 1) !== 1) reasons.push('rotation')
    if ((meta.width ?? 0) > MAX || (meta.height ?? 0) > MAX) reasons.push(`${meta.width}×${meta.height}`)
    if (reasons.length === 0) continue

    if (checkOnly) {
      console.log(`· ${rel} (${reasons.join(', ')})`)
      cleaned++
      continue
    }

    let image = sharp(file).autoOrient().resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
    if (ext === '.png') image = image.png({ compressionLevel: 9 })
    else if (ext === '.webp') image = image.webp({ quality: 86 })
    else image = image.jpeg({ quality: 86, mozjpeg: true })

    const before = (await fs.stat(file)).size
    const tmp = `${file}.tmp`
    await image.toFile(tmp)
    await fs.rename(tmp, file)
    const after = (await fs.stat(file)).size
    saved += before - after
    cleaned++
    console.log(`✓ ${rel}  ${kb(before)} → ${kb(after)}  (${reasons.join(', ')})`)
  }
}

if (checkOnly) {
  console.log(cleaned ? `\n${cleaned} photo(s) need cleaning. Run: npm run photos` : 'All photos are clean.')
} else {
  console.log(cleaned ? `\nCleaned ${cleaned} photo(s), saved ${kb(saved)}.` : 'All photos are already clean.')
}
if (problems) process.exitCode = 1
