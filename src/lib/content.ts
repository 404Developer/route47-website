// Job photos are picked up automatically from src/content (see README.md):
//
//   src/content/gallery/<Category>/<Caption>.jpg        -> job gallery
//   src/content/before-after/<Project>/before.jpg        -> before/after slider
//                                     /after.jpg
//                                     /caption.txt       (optional)
//
// Every photo is resized into responsive WebP at build time and its metadata
// (including GPS location) is stripped. Until real photos are added, the
// example images in src/content/samples are shown instead.

export type Img = { src: string; w: number; h: number; srcset?: string }

export type Photo = Img & {
  id: string
  caption: string
  category: string
}

export type Transformation = {
  id: string
  title: string
  caption: string
  before: Img
  after: Img
}

type ImgModules = Record<string, Img>
type TextModules = Record<string, string>

const galleryPhotos = import.meta.glob<Img>(
  '/src/content/gallery/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true, import: 'default', query: '?w=480;960;1600;2400&format=webp&as=img' },
)
const sampleGalleryPhotos = import.meta.glob<Img>(
  '/src/content/samples/gallery/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true, import: 'default', query: '?w=480;960;1600;2400&format=webp&as=img' },
)
const beforeAfterPhotos = import.meta.glob<Img>(
  '/src/content/before-after/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true, import: 'default', query: '?w=640;1000;1600;2400&format=webp&as=img' },
)
const sampleBeforeAfterPhotos = import.meta.glob<Img>(
  '/src/content/samples/before-after/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true, import: 'default', query: '?w=640;1000;1600;2400&format=webp&as=img' },
)
const beforeAfterText = import.meta.glob<string>('/src/content/before-after/*/*.txt', {
  eager: true,
  import: 'default',
  query: '?raw',
})
const sampleBeforeAfterText = import.meta.glob<string>('/src/content/samples/before-after/*/*.txt', {
  eager: true,
  import: 'default',
  query: '?raw',
})

// "01 ", "2-", "2026-09-12 " style prefixes only control ordering; they are never shown.
const ORDER_PREFIX = /^(?:\d{4}-\d{2}-\d{2}|\d+)[\s._-]+/
// Names straight off a phone or camera make poor captions, so they get none.
const CAMERA_NAME = /^(?:img|pxl|dsc|dscn|dcim|mvimg|photo|image|screenshot)[\s._-]*\d|^\d{8}[_-]\d{6}/i

const stripExtension = (file: string) => file.replace(/\.[^.]+$/, '')

export function cleanLabel(name: string) {
  const label = name.replace(ORDER_PREFIX, '').replace(/_+/g, ' ').replace(/\s+/g, ' ').trim()
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function captionFromFile(file: string) {
  const name = stripExtension(file).trim()
  if (CAMERA_NAME.test(name)) return ''
  // "garage-camera-install" reads better as "Garage camera install", but keep
  // hyphens in names that already use spaces ("Wi-Fi upgrade at the shop").
  return cleanLabel(name.includes(' ') ? name : name.replace(/-+/g, ' '))
}

// Natural sort ("2" before "10") that behaves the same on the server and in every browser.
function naturalCompare(a: string, b: string) {
  const ax = a.toLowerCase().match(/\d+|\D+/g) ?? []
  const bx = b.toLowerCase().match(/\d+|\D+/g) ?? []
  for (let i = 0; i < Math.min(ax.length, bx.length); i++) {
    const x = ax[i]
    const y = bx[i]
    if (x === y) continue
    const nx = Number(x)
    const ny = Number(y)
    if (!Number.isNaN(nx) && !Number.isNaN(ny)) return nx - ny
    return x < y ? -1 : 1
  }
  return ax.length - bx.length
}

const fileName = (path: string) => path.slice(path.lastIndexOf('/') + 1)

function buildGallery(modules: ImgModules, root: string): Photo[] {
  return Object.entries(modules)
    .sort(([a], [b]) => naturalCompare(fileName(a), fileName(b)) || naturalCompare(a, b))
    .map(([path, img]) => {
      const parts = path.slice(root.length).split('/')
      return {
        ...img,
        id: path,
        caption: captionFromFile(fileName(path)),
        category: parts.length > 1 ? cleanLabel(parts[0]) : '',
      }
    })
}

function buildTransformations(modules: ImgModules, text: TextModules, root: string): Transformation[] {
  const folders = new Map<string, { before?: Img; after?: Img; caption: string }>()

  for (const [path, img] of Object.entries(modules)) {
    const [folder, file] = path.slice(root.length).split('/')
    const role = stripExtension(file).toLowerCase()
    if (role !== 'before' && role !== 'after') continue
    const entry = folders.get(folder) ?? { caption: '' }
    entry[role] = img
    folders.set(folder, entry)
  }

  for (const [path, value] of Object.entries(text)) {
    const [folder] = path.slice(root.length).split('/')
    const entry = folders.get(folder)
    if (entry) entry.caption = value.trim()
  }

  const result: Transformation[] = []
  for (const [folder, entry] of folders) {
    if (!entry.before || !entry.after) {
      if (import.meta.env.DEV) {
        console.warn(`[before-after] "${folder}" needs both a before and an after photo — skipping it.`)
      }
      continue
    }
    result.push({
      id: folder,
      title: cleanLabel(folder),
      caption: entry.caption,
      before: entry.before,
      after: entry.after,
    })
  }
  return result.sort((a, b) => naturalCompare(a.id, b.id))
}

const realPhotos = buildGallery(galleryPhotos, '/src/content/gallery/')
const realTransformations = buildTransformations(beforeAfterPhotos, beforeAfterText, '/src/content/before-after/')

export const photosAreSamples = realPhotos.length === 0
export const transformationsAreSamples = realTransformations.length === 0

export const photos = photosAreSamples
  ? buildGallery(sampleGalleryPhotos, '/src/content/samples/gallery/')
  : realPhotos

export const transformations = transformationsAreSamples
  ? buildTransformations(sampleBeforeAfterPhotos, sampleBeforeAfterText, '/src/content/samples/before-after/')
  : realTransformations
