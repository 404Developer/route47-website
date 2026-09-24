import type { CSSProperties } from 'react'
import { reasons } from '../site'
import { Dotted } from './Dotted'
import { ArrowIcon } from './Icons'
import './WhyUs.css'

export function WhyUs() {
  return (
    <section className="section why" id="why" aria-labelledby="why-title">
      <div className="container why__grid">
        <header className="why__head" data-reveal>
          <p className="eyebrow">Why Route 47</p>
          <h2 className="title" id="why-title">
            Small business service you can trust<span className="dot">.</span>
          </h2>
          <p className="lead">It's on every flyer and every quote we hand out, because it's how we work.</p>
          <a className="btn btn--dark why__cta" href="#contact">
            Book a consultation
            <ArrowIcon className="arrow" />
          </a>
        </header>

        <ol className="why__list">
          {reasons.map((r, i) => (
            <li className="why__item" key={r.word} data-reveal style={{ '--d': i } as CSSProperties}>
              <span className="why__mile" aria-hidden="true">
                <small>Mile</small>
                {i + 1}
              </span>
              <h3 className="why__word">
                <Dotted text={r.word} />
              </h3>
              <p className="why__text">{r.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
