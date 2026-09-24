import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { imagetools } from 'vite-imagetools'

// Asset file names come from the source file name, and job photos are often named
// things like "Garage camera install.jpg". Spaces would break `srcset`, so slugify.
const slug = (name: string) =>
  name
    .normalize('NFKD')
    .replace(/[^\w-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'asset'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    imagetools({
      // The default filter is case-sensitive, and phones and cameras love `.JPG`.
      // Anything that slips past this would be published as the original file,
      // location data and all.
      include: /^[^?]+\.(avif|gif|heif|jpeg|jpg|png|tiff|webp)(\?.*)?$/i,
    }),
  ],
  build: {
    rolldownOptions: {
      output: {
        assetFileNames: ({ names }) =>
          `assets/${slug((names[0] ?? 'asset').replace(/\.[^.]+$/, ''))}-[hash][extname]`,
      },
    },
  },
})
