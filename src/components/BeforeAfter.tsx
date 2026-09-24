import { type CSSProperties, type KeyboardEvent, type PointerEvent, useCallback, useEffect, useRef } from 'react'
import type { Img } from '../lib/content'
import './BeforeAfter.css'

type BeforeAfterProps = {
  before: Img
  after: Img
  title: string
  sizes?: string
}

type Drag = { id: number; x: number; y: number; active: boolean }

const clamp = (v: number) => Math.min(100, Math.max(0, v))
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

/**
 * Two photos stacked in one frame, with a draggable divider. Both images are
 * cropped to the same box (the shape of the "after" photo), so they always line
 * up at the same size and shape.
 */
export function BeforeAfter({ before, after, title, sizes = '(min-width: 1240px) 1160px, 100vw' }: BeforeAfterProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const pos = useRef(50)
  const drag = useRef<Drag | null>(null)
  const frame = useRef(0)
  const touched = useRef(false)

  const setPos = useCallback((value: number) => {
    const v = clamp(value)
    pos.current = v
    stageRef.current?.style.setProperty('--pos', `${v}%`)
    stageRef.current?.style.setProperty('--p', `${v}`)
    const handle = handleRef.current
    if (handle) {
      const rounded = Math.round(v)
      handle.setAttribute('aria-valuenow', String(rounded))
      handle.setAttribute('aria-valuetext', `${rounded}% before, ${100 - rounded}% after`)
    }
  }, [])

  const stopAnimation = () => {
    cancelAnimationFrame(frame.current)
    frame.current = 0
  }

  // Tween the divider through one or more stops.
  const animate = useCallback(
    (stops: Array<[target: number, ms: number]>) => {
      stopAnimation()
      let i = 0
      let from = pos.current
      let start = performance.now()
      const tick = (now: number) => {
        const [to, ms] = stops[i]
        const t = Math.min(1, (now - start) / ms)
        setPos(from + (to - from) * easeInOut(t))
        if (t < 1) {
          frame.current = requestAnimationFrame(tick)
        } else if (++i < stops.length) {
          from = to
          start = now
          frame.current = requestAnimationFrame(tick)
        } else {
          frame.current = 0
        }
      }
      frame.current = requestAnimationFrame(tick)
    },
    [setPos],
  )

  // A little "peek" the first time the slider scrolls into view, so it's obvious it moves.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        if (!touched.current) {
          animate([
            [30, 650],
            [70, 900],
            [50, 650],
          ])
        }
      },
      { threshold: 0.6 },
    )
    observer.observe(stage)
    return () => {
      observer.disconnect()
      stopAnimation()
    }
  }, [animate])

  const posFromEvent = (clientX: number) => {
    const rect = stageRef.current!.getBoundingClientRect()
    return ((clientX - rect.left) / rect.width) * 100
  }

  const startDragging = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    e.currentTarget.classList.add('is-dragging')
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    touched.current = true
    stopAnimation()
    const onHandle = (e.target as Element).closest('.ba__handle') !== null
    // Mouse drags start right away. Touch waits to see if the finger moves sideways,
    // so a vertical swipe still scrolls the page.
    const active = e.pointerType === 'mouse' || onHandle
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, active }
    if (active) {
      startDragging(e)
      if (!onHandle) setPos(posFromEvent(e.clientX))
    }
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    if (!d.active) {
      const dx = Math.abs(e.clientX - d.x)
      const dy = Math.abs(e.clientY - d.y)
      if (dy > 10 && dy > dx) {
        drag.current = null
        return
      }
      if (dx < 6) return
      d.active = true
      startDragging(e)
    }
    setPos(posFromEvent(e.clientX))
  }

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    // A tap without a drag glides the divider to where you tapped.
    if (!d.active && e.type === 'pointerup') animate([[clamp(posFromEvent(e.clientX)), 420]])
    drag.current = null
    e.currentTarget.classList.remove('is-dragging')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2
    const next: Record<string, number> = {
      ArrowLeft: pos.current - step,
      ArrowDown: pos.current - step,
      ArrowRight: pos.current + step,
      ArrowUp: pos.current + step,
      PageDown: pos.current - 10,
      PageUp: pos.current + 10,
      Home: 0,
      End: 100,
    }
    if (!(e.key in next)) return
    e.preventDefault()
    touched.current = true
    stopAnimation()
    setPos(next[e.key])
  }

  const ratio = after.w / after.h
  const style = { '--ar': ratio, '--pos': '50%', '--p': 50 } as CSSProperties

  return (
    <div
      className="ba"
      ref={stageRef}
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <img
        className="ba__img"
        src={after.src}
        srcSet={after.srcset}
        sizes={sizes}
        width={after.w}
        height={after.h}
        alt={`${title}, after`}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      <img
        className="ba__img ba__img--before"
        src={before.src}
        srcSet={before.srcset}
        sizes={sizes}
        width={before.w}
        height={before.h}
        alt={`${title}, before`}
        loading="lazy"
        decoding="async"
        draggable={false}
      />

      <span className="ba__tag ba__tag--before" aria-hidden="true">
        Before
      </span>
      <span className="ba__tag ba__tag--after" aria-hidden="true">
        After
      </span>

      <div
        className="ba__handle"
        ref={handleRef}
        role="slider"
        tabIndex={0}
        aria-label={`${title}: before and after`}
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={50}
        aria-valuetext="50% before, 50% after"
        onKeyDown={onKeyDown}
      >
        <span className="ba__knob">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M9 6 3 12l6 6M15 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </div>
  )
}
