import { Shield } from './Shield'
import './Logo.css'

type LogoProps = {
  className?: string
  href?: string
}

export function Logo({ className = '', href = '#top' }: LogoProps) {
  return (
    <a className={`logo ${className}`} href={href} aria-label="Route 47 Low Voltage, back to top">
      <Shield className="logo__shield" />
      <span className="logo__text" aria-hidden="true">
        <span className="logo__name">Route 47</span>
        <span className="logo__sub">Low Voltage</span>
      </span>
    </a>
  )
}
