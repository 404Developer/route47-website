import { useEffect, useState } from 'react'
import { primaryPhone, site } from '../site'
import { CloseIcon, MailIcon, MessageIcon, PhoneIcon } from './Icons'
import { Logo } from './Logo'
import './Nav.css'

const links = [
  { href: '#services', label: 'Services' },
  { href: '#unifi', label: 'UniFi' },
  { href: '#work', label: 'Our Work' },
  { href: '#why', label: 'Why Us' },
  { href: '#contact', label: 'Contact' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  // Solid background once scrolled, and highlight the link for the last section whose
  // top has passed the middle of the screen.
  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector<HTMLElement>(l.href))
      .filter((el): el is HTMLElement => el !== null)
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > 24)
      const line = window.innerHeight * 0.45
      const current = sections.filter((s) => s.getBoundingClientRect().top <= line).pop()
      setActive(current ? `#${current.id}` : '')
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className={`nav${scrolled ? ' nav--scrolled' : ''}${open ? ' nav--open' : ''}`}>
        <div className="container nav__bar">
          <Logo className="nav__logo" />

          <nav className="nav__links" aria-label="Main">
            {links.map((l) => (
              <a key={l.href} href={l.href} aria-current={active === l.href ? 'true' : undefined}>
                {l.label}
              </a>
            ))}
          </nav>

          <a className="btn btn--primary nav__call" href={`tel:${primaryPhone.tel}`} aria-label={`Call ${primaryPhone.display}`}>
            <PhoneIcon />
            <span>{primaryPhone.display}</span>
          </a>

          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <CloseIcon /> : <span className="nav__burger" />}
          </button>
        </div>
      </header>

      {/* Kept outside the header on purpose: the header's backdrop blur becomes the containing
          block for fixed-position children in Safari, which squashed this panel into a sliver. */}
      <div id="mobile-menu" className={`nav__drawer${open ? ' is-open' : ''}`} inert={!open}>
        <nav aria-label="Mobile">
          {links.map((l, i) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ transitionDelay: `${80 + i * 45}ms` }}>
              <span>0{i + 1}</span>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav__drawer-actions">
          <a className="btn btn--primary" href={`tel:${primaryPhone.tel}`}>
            <PhoneIcon />
            Call {primaryPhone.display}
          </a>
          <div className="nav__drawer-row">
            <a className="btn btn--ghost" href={`sms:${primaryPhone.tel}`}>
              <MessageIcon />
              Text
            </a>
            <a className="btn btn--ghost" href={`mailto:${site.email}`}>
              <MailIcon />
              Email
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
