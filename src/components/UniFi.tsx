import { type CSSProperties, useEffect, useRef, useState } from 'react'
import gear from '../assets/unifi-gear.jpg?w=560;900&format=webp&as=img'
import { CheckIcon } from './Icons'
import './UniFi.css'

const points = [
  {
    title: 'Everything in one app',
    text: 'Wi-Fi, cameras, doorbells and your network live in one UniFi app you can check from anywhere.',
  },
  {
    title: 'Your video stays yours',
    text: 'Cameras record to a UniFi recorder at your place. No required monthly subscription.',
  },
  {
    title: 'Built to grow',
    text: 'Start with a few cameras or access points and add on later without starting over.',
  },
  {
    title: 'Set up right',
    text: 'Updated, secured and organized, with a walkthrough of the app before we leave.',
  },
]

// Positions are percentages of the photo.
const hotspots = [
  { x: 35, y: 16, label: 'UniFi gateway' },
  { x: 23, y: 40, label: 'PoE switches' },
  { x: 57, y: 30, label: 'Protect cameras' },
  { x: 39, y: 66, label: 'Wi-Fi access point' },
  { x: 76, y: 69, label: 'Speakers', flip: true },
]

export function UniFi() {
  const mediaRef = useRef<HTMLDivElement>(null)
  const hovering = useRef(false)
  const [active, setActive] = useState(-1)

  // Walk through the hotspots while the photo is on screen.
  useEffect(() => {
    const media = mediaRef.current
    if (!media) return
    let timer = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !timer) {
          setActive((a) => (a < 0 ? 0 : a))
          timer = window.setInterval(() => {
            if (!hovering.current) setActive((a) => (a + 1) % hotspots.length)
          }, 2600)
        } else if (!entry.isIntersecting && timer) {
          clearInterval(timer)
          timer = 0
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(media)
    return () => {
      observer.disconnect()
      clearInterval(timer)
    }
  }, [])

  return (
    <section className="section unifi" id="unifi" aria-labelledby="unifi-title">
      <div className="container unifi__grid">
        <div className="unifi__copy" data-reveal>
          <p className="eyebrow">Ubiquiti UniFi specialists</p>
          <h2 className="title" id="unifi-title">
            Pro-grade gear<span className="dot">.</span> One simple app<span className="dot">.</span>
          </h2>
          <p className="lead">
            UniFi is what we install and what we know best — the same platform businesses run on, sized right for
            your home, shop or office.
          </p>
          <ul className="unifi__points">
            {points.map((p) => (
              <li key={p.title}>
                <span className="unifi__check" aria-hidden="true">
                  <CheckIcon />
                </span>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="unifi__media" data-reveal style={{ '--d': 2 } as CSSProperties}>
          <div
            className="unifi__frame"
            ref={mediaRef}
            onPointerEnter={() => (hovering.current = true)}
            onPointerLeave={() => (hovering.current = false)}
          >
            <img
              src={gear.src}
              srcSet={gear.srcset}
              sizes="(min-width: 1000px) 600px, 100vw"
              width={gear.w}
              height={gear.h}
              alt="UniFi gateway, PoE switches, Wi-Fi access points, security cameras and speakers staged with Cat6 cable and tools"
              loading="lazy"
              decoding="async"
            />
            {hotspots.map((h, i) => (
              <span
                key={h.label}
                className={`hotspot${i === active ? ' is-active' : ''}${h.flip ? ' hotspot--flip' : ''}`}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                onPointerEnter={() => setActive(i)}
                aria-hidden="true"
              >
                <span className="hotspot__dot" />
                <span className="hotspot__label">{h.label}</span>
              </span>
            ))}
          </div>
          <div className="unifi__badge">
            <strong>No required monthly fees</strong>
            <span>Your camera footage stays on your own recorder.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
