import { useEffect, useState } from 'react'
import { primaryPhone } from '../site'
import { MessageIcon, PhoneIcon } from './Icons'
import './MobileCallBar.css'

/** Call / text buttons pinned to the bottom of small screens, hidden over the hero and contact sections. */
export function MobileCallBar() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('top')
    const contact = document.getElementById('contact')
    if (!hero || !contact) return
    const visible = new Map<Element, boolean>()
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) visible.set(entry.target, entry.isIntersecting)
      setShow(!visible.get(hero) && !visible.get(contact))
    })
    observer.observe(hero)
    observer.observe(contact)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`callbar${show ? ' is-visible' : ''}`} inert={!show}>
      <a className="btn btn--primary" href={`tel:${primaryPhone.tel}`}>
        <PhoneIcon />
        Call now
      </a>
      <a className="btn btn--dark" href={`sms:${primaryPhone.tel}`}>
        <MessageIcon />
        Text us
      </a>
    </div>
  )
}
