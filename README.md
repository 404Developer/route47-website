# Route 47 Low Voltage website

The website for Route 47 Low Voltage. It's a single page built with React and Vite, pre-rendered to plain HTML
at build time, and hosted on Cloudflare as static files (no server to run or pay for).

## Adding job photos

Everything lives in `src/content`. Drop photos in, run the clean-up script, commit, push; Cloudflare rebuilds the site.

**Gallery**: `src/content/gallery/`

```
src/content/gallery/
  Cameras/
    01 Driveway camera, Marengo.jpg
    02 Barn camera.jpg
  Wi-Fi/
    Shop access point.jpg
  Network/
    IMG_2034.jpg
```

- Each sub-folder becomes a filter button (Cameras, Wi-Fi, ...).
- The file name becomes the caption. Leading numbers (`01 `) only set the order and are hidden.
  Camera-style names like `IMG_2034.jpg` just get no caption.

**Before & after sliders**: `src/content/before-after/`

```
src/content/before-after/
  01 Basement network closet/
    before.jpg
    after.jpg
    caption.txt        (optional)
```

- One folder per job. The folder name is the title; `caption.txt` is an optional sentence or two about it.
- Both photos are shown in the same frame at the same size and shape, so take them from the same spot.

**Then run:**

```sh
npm run photos
```

This rotates photos upright, shrinks anything over 2400px, and **strips GPS location and all other metadata**
from the originals, so customers' addresses never end up in the repository. The build also strips metadata from
everything it publishes, but run this before every commit anyway.

Tips:
- JPG, PNG and WebP work. iPhone HEIC files don't; export or AirDrop them as JPG (or set
  *Settings → Camera → Formats → Most Compatible*).
- Keep `#`, `%` and `?` out of file names.
- Until real photos are added, the site shows the sample illustrations in `src/content/samples/`. Once your own photos
  are in, you can delete that folder.

## Editing text

Phone numbers, email, service area, the services list, the "why us" points and the process steps are all in
**`src/site.ts`**. Section headings and paragraphs live in the components under `src/components/`.

## Logo files

`brand/` holds the business-card logo (the "ROUTE / 47 / IL" shield) rebuilt as clean vector artwork:

| File | Use |
| --- | --- |
| `shield.pdf` | Vector PDF, 2" wide, for the printer (business cards, stickers, vehicle graphics) |
| `shield.svg` | Vector master for design apps and the web |
| `shield-1024.png`, `shield-3000.png` | Transparent PNGs |
| `shield-dark-bg.svg` | With a light sign-style border, for dark backgrounds |
| `logo-horizontal.svg`, `logo-horizontal-2400.png` | Shield + "Route 47 / Low Voltage", for light backgrounds |
| `logo-horizontal-light.svg`, `logo-horizontal-light-2400.png` | Same, white text for dark backgrounds |
| `og-image.svg` | Source of the image shown when the site is shared on social media / in texts |
| `business-cards/` | Print-ready Vistaprint business card (front + back PDF). See its README |

- Colors: tan `#DBAB72`, sage `#9FAEA3`, black `#1A1612`.
- "ROUTE" and "IL" are set in **Overpass ExtraBold** (free, SIL Open Font License), the open-source version of
  Highway Gothic, the lettering on US road signs. The "47" is traced from the card artwork. All text is converted to
  outlines, so the files don't need the font installed.

The site draws the same artwork from `src/components/shieldArt.ts` via `src/components/Shield.tsx`.

## Running it locally

Requires Node 22+.

```sh
npm install
npm run dev          # live-reloading dev server at http://localhost:5173
npm run build        # production build into dist/
npm run preview:cf   # build, then serve dist/ with Cloudflare's own runtime at http://localhost:8787
```

## Deploying to Cloudflare

The site deploys as a static-assets-only Cloudflare Worker (see `wrangler.jsonc`). Pick one:

**A. Automatic deploys from GitHub (recommended).** Push this repo to GitHub, then in the Cloudflare dashboard go to
*Workers & Pages → Create → Import a repository* and pick it. Use:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

Keep the Worker's name as `route47-website` (it has to match `wrangler.jsonc`). Every push to `main` then rebuilds and
redeploys, so adding photos is just commit and push.

**B. From your computer.** `npx wrangler login` once, then `npm run deploy`.

**Custom domain.** In the dashboard open the Worker → *Settings → Domains & Routes → Add → Custom domain* and enter
`route47lowvoltage.com` (and `www.route47lowvoltage.com`). The domain has to be on your Cloudflare account. There's also a
commented-out `routes` block in `wrangler.jsonc` if you'd rather keep it in code.

**Cloudflare Pages also works.** Build command `npm run build`, output directory `dist`. `_headers` and the 404 page
behave the same there.

## What's in here

```
index.html             page shell: title, description, social tags, business schema for Google
src/site.ts            business details and page copy
src/components/        one component (and stylesheet) per section; roadScene.ts is the animated hero
src/lib/content.ts     finds the photos in src/content and builds the gallery + sliders
src/content/           your photos (and the samples)
public/                favicons, social image, robots.txt, sitemap, _headers, 404.html
scripts/prerender.mjs  renders the page to static HTML after the build
scripts/prep-photos.mjs  the `npm run photos` clean-up script
brand/                 logo files
wrangler.jsonc         Cloudflare config
```
