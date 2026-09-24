import { type CSSProperties, useMemo, useState } from 'react'
import type { Photo } from '../lib/content'
import { ExpandIcon } from './Icons'
import { Lightbox } from './Lightbox'
import './Gallery.css'

const ALL = 'All'

export function Gallery({ photos }: { photos: Photo[] }) {
  const [filter, setFilter] = useState(ALL)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const categories = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of photos) if (p.category) counts.set(p.category, (counts.get(p.category) ?? 0) + 1)
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b, 'en'))
  }, [photos])

  const visible = filter === ALL ? photos : photos.filter((p) => p.category === filter)

  if (photos.length === 0) return null

  return (
    <div className="gallery">
      {categories.length > 1 && (
        <div className="gallery__filters" role="group" aria-label="Filter photos by type of job">
          {[[ALL, photos.length] as const, ...categories].map(([name, n]) => (
            <button
              key={name}
              type="button"
              className="chip"
              aria-pressed={filter === name}
              onClick={() => setFilter(name)}
            >
              {name}
              <span className="chip__count">{n}</span>
            </button>
          ))}
        </div>
      )}

      <ul className="gallery__grid" key={filter}>
        {visible.map((p, i) => (
          <li className="gallery__item" key={p.id} style={{ '--i': Math.min(i, 10) } as CSSProperties}>
            <button
              type="button"
              className="tile"
              onClick={() => setOpenIndex(i)}
              aria-label={`Open photo${p.caption ? `: ${p.caption}` : ''}`}
            >
              <img
                src={p.src}
                srcSet={p.srcset}
                sizes="(min-width: 1240px) 380px, (min-width: 900px) 31vw, (min-width: 560px) 47vw, 100vw"
                width={p.w}
                height={p.h}
                alt=""
                loading="lazy"
                decoding="async"
              />
              {(p.caption || p.category) && (
                <span className="tile__meta">
                  {p.category && <span className="tile__cat">{p.category}</span>}
                  {p.caption && <span className="tile__caption">{p.caption}</span>}
                </span>
              )}
              <span className="tile__zoom" aria-hidden="true">
                <ExpandIcon />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Lightbox photos={visible} index={openIndex} onIndex={setOpenIndex} onClose={() => setOpenIndex(null)} />
    </div>
  )
}
