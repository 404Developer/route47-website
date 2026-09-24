import type { CSSProperties } from 'react'
import { steps } from '../site'
import { Shield } from './Shield'
import './Process.css'

export function Process() {
  return (
    <section className="section process" id="process" aria-labelledby="process-title">
      <div className="container">
        <header className="section-head section-head--center" data-reveal>
          <p className="eyebrow">How it works</p>
          <h2 className="title" id="process-title">
            Four stops<span className="dot">.</span> No surprises<span className="dot">.</span>
          </h2>
        </header>

        <ol className="route">
          {steps.map((s, i) => (
            <li className="route__stop" key={s.title} data-reveal style={{ '--d': i } as CSSProperties}>
              <Shield className="route__marker" label={String(i + 1)} />
              <h3 className="route__title">{s.title}</h3>
              <p className="route__text">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
