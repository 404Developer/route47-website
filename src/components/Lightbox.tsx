import { type PointerEvent, useEffect, useRef } from 'react'
import type { Photo } from '../lib/content'
import { ChevronIcon, CloseIcon } from './Icons'
import './Lightbox.css'

type LightboxProps = {
  photos: Photo[]
  index: number | null
  onIndex: (index: number) => void
  onClose: () => void
}

const SIZES = '(min-width: 1400px) 1400px, 100vw'

export function Lightbox({ photos, index, onIndex, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const swipe = useRef<{ x: number; y: number } | null>(null)
  const photo = index === null ? null : photos[index]
  const count = photos.length

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (photo && !dialog.open) dialog.showModal()
    if (!photo && dialog.open) dialog.close()
  }, [photo])

  // Warm up the neighbours so arrowing through feels instant.
  useEffect(() => {
    if (index === null || count < 2) return
    for (const i of [index + 1, index - 1]) {
      const p = photos[(i + count) % count]
      const img = new Image()
      img.sizes = SIZES
      if (p.srcset) img.srcset = p.srcset
      img.src = p.src
    }
  }, [index, count, photos])

  const go = (delta: number) => {
    if (index !== null) onIndex((index + delta + count) % count)
  }

  const onPointerDown = (e: PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY }
  }

  const onPointerUp = (e: PointerEvent) => {
    const start = swipe.current
    swipe.current = null
    if (!start || count < 2) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) go(dx < 0 ? 1 : -1)
  }

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label="Photo viewer"
      onClose={onClose}
      onClick={(e) => {
        // Clicks that land on the dim background (not the photo or a button) close it.
        if (e.target === e.currentTarget) e.currentTarget.close()
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1)
        if (e.key === 'ArrowLeft') go(-1)
      }}
    >
      {photo && (
        <>
          <button type="button" className="lightbox__close" onClick={() => dialogRef.current?.close()} aria-label="Close">
            <CloseIcon />
          </button>

          <figure className="lightbox__figure">
            <img
              key={photo.id}
              className="lightbox__img"
              src={photo.src}
              srcSet={photo.srcset}
              sizes={SIZES}
              width={photo.w}
              height={photo.h}
              alt={photo.caption || `${photo.category || 'Job'} photo`}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              draggable={false}
            />
            <figcaption className="lightbox__caption">
              {photo.category && <span className="lightbox__cat">{photo.category}</span>}
              {photo.caption && <span>{photo.caption}</span>}
              {count > 1 && (
                <span className="lightbox__count">
                  {index! + 1} / {count}
                </span>
              )}
            </figcaption>
          </figure>

          {count > 1 && (
            <>
              <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={() => go(-1)} aria-label="Previous photo">
                <ChevronIcon />
              </button>
              <button type="button" className="lightbox__nav lightbox__nav--next" onClick={() => go(1)} aria-label="Next photo">
                <ChevronIcon />
              </button>
            </>
          )}
        </>
      )}
    </dialog>
  )
}
