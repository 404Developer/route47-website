import { useId, useState } from 'react'
import { primaryPhone, site } from '../site'
import { MailIcon, MessageIcon, PhoneIcon, PinIcon } from './Icons'
import { Shield } from './Shield'
import './Contact.css'

const needs = [
  'Security cameras',
  'Wi-Fi',
  'Network drops',
  'Doorbell',
  'Audio / video',
  'Starlink',
  'Rack cleanup',
  'Something else',
]

function composeMessage(name: string, town: string, picked: string[], details: string) {
  const who = `${name.trim() ? `, this is ${name.trim()}` : ''}${town.trim() ? ` in ${town.trim()}` : ''}`
  const lines = [`Hi Route 47${who}.`]
  if (picked.length) lines.push(`I'm interested in: ${picked.join(', ')}.`)
  if (details.trim()) lines.push(details.trim())
  if (!picked.length && !details.trim()) lines.push("I'd like to set up a local consultation.")
  return lines.join('\n\n')
}

export function Contact() {
  const id = useId()
  const [name, setName] = useState('')
  const [town, setTown] = useState('')
  const [picked, setPicked] = useState<string[]>([])
  const [details, setDetails] = useState('')

  const message = composeMessage(name, town, picked, details)
  const subject = `Consultation request${name.trim() ? ` from ${name.trim()}` : ''}`
  // `?&body=` is the form that both iOS and Android understand.
  const smsHref = `sms:${primaryPhone.tel}?&body=${encodeURIComponent(message)}`
  const mailHref = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`

  const toggle = (need: string) =>
    setPicked((current) => (current.includes(need) ? current.filter((n) => n !== need) : [...current, need]))

  return (
    <section className="section section--dark contact" id="contact" aria-labelledby="contact-title">
      <Shield className="contact__watermark" />
      <div className="container contact__grid">
        <div className="contact__copy" data-reveal>
          <p className="eyebrow">Get in touch</p>
          <h2 className="title" id="contact-title">
            Call for a local consultation<span className="dot">.</span>
          </h2>
          <p className="lead">
            Tell us what you're working with. We'll come out, take a look and give you a straight answer.
          </p>

          <ul className="contact__phones">
            {site.phones.map((p) => (
              <li key={p.tel}>
                <a className="contact__number" href={`tel:${p.tel}`}>
                  <PhoneIcon />
                  {p.display}
                </a>
                <a className="contact__text" href={`sms:${p.tel}`} aria-label={`Text ${p.display}`}>
                  <MessageIcon />
                  Text
                </a>
              </li>
            ))}
          </ul>

          <a className="contact__email" href={`mailto:${site.email}`}>
            <MailIcon />
            {site.email}
          </a>
          <p className="contact__area">
            <PinIcon />
            Serving {site.area}
          </p>
        </div>

        <form className="contact__card" data-reveal onSubmit={(e) => e.preventDefault()} aria-labelledby={`${id}-title`}>
          <h3 className="contact__card-title" id={`${id}-title`}>
            Quick request
          </h3>
          <p className="contact__card-sub">Fill in what you like — it opens a text or email with it all written out.</p>

          <div className="field-row">
            <label className="field">
              <span>Your name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="First & last" />
            </label>
            <label className="field">
              <span>Town</span>
              <input value={town} onChange={(e) => setTown(e.target.value)} autoComplete="address-level2" placeholder="Marengo" />
            </label>
          </div>

          <fieldset className="field picks">
            <legend>What do you need?</legend>
            <div className="picks__list">
              {needs.map((need) => (
                <label className="pick" key={need}>
                  <input type="checkbox" checked={picked.includes(need)} onChange={() => toggle(need)} />
                  <span>{need}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="field">
            <span>Details</span>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              placeholder="Number of cameras, rooms that need Wi-Fi, best time to reach you…"
            />
          </label>

          <div className="contact__send">
            <a className="btn btn--primary" href={smsHref}>
              <MessageIcon />
              Send as text
            </a>
            <a className="btn btn--dark" href={mailHref}>
              <MailIcon />
              Send as email
            </a>
          </div>
          <p className="contact__fineprint">Nothing is sent until you hit send in your messages or email app.</p>
        </form>
      </div>
    </section>
  )
}
