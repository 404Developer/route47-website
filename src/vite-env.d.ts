// Images imported with `?...&as=img` are resized by vite-imagetools at build time.
declare module '*&as=img' {
  const image: { src: string; w: number; h: number; srcset?: string }
  export default image
}
