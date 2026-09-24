import type { CSSProperties } from 'react'
import { services } from '../site'
import { ServiceIcon } from './Icons'
import './Services.css'

export function Services() {
  return (
    <section className="section services" id="services" aria-labelledby="services-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">What we do</p>
          <h2 className="title" id="services-title">
            Everything low voltage<span className="dot">.</span>
          </h2>
          <p className="lead">
            From a single network drop to a full camera system — we run the wire, mount the gear and set it all up
            so it works together. Homes, shops, farms and small businesses.
          </p>
        </header>

        <ul className="services__grid">
          {services.map((s, i) => (
            <li key={s.title} data-reveal style={{ '--d': i % 3 } as CSSProperties}>
              <article className="service">
                <span className="service__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="service__icon">
                  <ServiceIcon name={s.icon} />
                </div>
                <h3 className="service__title">{s.title}</h3>
                <p className="service__text">{s.text}</p>
                <ul className="service__tags" aria-label={`${s.title} includes`}>
                  {s.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
