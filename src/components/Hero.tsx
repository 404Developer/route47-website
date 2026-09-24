import { type CSSProperties, useEffect, useRef } from 'react'
import { primaryPhone, site } from '../site'
import { Dotted } from './Dotted'
import { ArrowIcon, PhoneIcon, PinIcon } from './Icons'
import { Shield } from './Shield'
import { startRoadScene } from './roadScene'
import './Hero.css'

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return startRoadScene(canvas, { reducedMotion })
  }, [])

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <canvas className="hero__canvas" ref={canvasRef} aria-hidden="true" />
      <div className="hero__shade" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__content">
          <Shield className="hero__shield" ring title="Route 47 Low Voltage" />

          <p className="hero__eyebrow">Low voltage · Ubiquiti UniFi specialists</p>

          <h1 className="hero__title" id="hero-title">
            {site.tagline.map((line, i) => (
              <span className="hero__line" key={line} style={{ '--i': i } as CSSProperties}>
                <span>
                  <Dotted text={line} />
                </span>
              </span>
            ))}
          </h1>

          <p className="hero__lead">
            Security cameras, Wi-Fi, network drops, doorbells, audio and video for homes and small businesses
            around Marengo — installed clean and done right.
          </p>

          <div className="hero__actions">
            <a className="btn btn--primary" href={`tel:${primaryPhone.tel}`}>
              <PhoneIcon />
              Call {primaryPhone.display}
            </a>
            <a className="btn btn--ghost" href="#work">
              See our work
              <ArrowIcon className="arrow" />
            </a>
          </div>

          <ul className="hero__pillars" aria-label="What we do">
            {site.pillars.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="hero__footer container">
        <p className="hero__area">
          <PinIcon />
          Serving {site.area}
        </p>
        <a className="hero__scroll" href="#services" aria-label="Scroll to services">
          <span />
        </a>
      </div>
    </section>
  )
}
