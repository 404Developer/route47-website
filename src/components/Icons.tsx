import type { ReactNode } from 'react'
import type { ServiceIconName } from '../site'

type IconProps = { className?: string }

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: 'false' as const,
}

export const PhoneIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <path d="M5 4h3.2l1.6 4-2 1.3a11 11 0 0 0 5 5l1.3-2 4 1.6V17a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
)

export const MessageIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5Z" />
    <path d="M8 8.5h8M8 12h5" />
  </svg>
)

export const MailIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </svg>
)

export const ArrowIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const ChevronIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <path d="m9 5 7 7-7 7" />
  </svg>
)

export const CloseIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const PinIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
)

export const CheckIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)

export const ExpandIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" {...base}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </svg>
)

// Larger line icons for the service cards (48px grid).
const serviceIcons: Record<ServiceIconName, ReactNode> = {
  plug: (
    <>
      <rect x="13" y="5" width="22" height="23" rx="3" />
      <path d="M18 5v6M22 5v6M26 5v6M30 5v6" className="icon-accent" />
      <path d="M19 28v5h10v-5" />
      <path d="M24 33v3c0 4 3 6 7 6h6" />
    </>
  ),
  wifi: (
    <>
      <path d="M7 19a24 24 0 0 1 34 0" className="icon-wave icon-wave--3" />
      <path d="M12.5 24.5a16 16 0 0 1 23 0" className="icon-wave icon-wave--2" />
      <path d="M18 30a8 8 0 0 1 12 0" className="icon-wave icon-wave--1" />
      <circle cx="24" cy="36" r="2.4" className="icon-accent icon-fill" />
    </>
  ),
  camera: (
    <>
      <path d="M6 14h4v14H6z" />
      <path d="M10 21h5l3-3" />
      <rect x="15" y="10" width="25" height="13" rx="6.5" transform="rotate(14 27 16)" />
      <circle cx="36" cy="18.5" r="2.6" className="icon-accent" />
      <circle cx="21" cy="14" r="1" className="icon-led icon-fill" />
    </>
  ),
  doorbell: (
    <>
      <rect x="15" y="5" width="18" height="38" rx="9" />
      <circle cx="24" cy="15" r="4" className="icon-accent" />
      <circle cx="24" cy="32" r="4.5" />
      <path d="M38 12a8 8 0 0 1 0 10M41.5 9a13 13 0 0 1 0 16" className="icon-wave icon-wave--1" />
    </>
  ),
  speaker: (
    <>
      <rect x="10" y="5" width="22" height="38" rx="4" />
      <circle cx="21" cy="30" r="6.5" />
      <circle cx="21" cy="30" r="1.8" className="icon-accent icon-fill" />
      <circle cx="21" cy="14" r="3" />
      <path d="M37 21a6 6 0 0 1 0 9" className="icon-wave icon-wave--1" />
      <path d="M40.5 17a12 12 0 0 1 0 17" className="icon-wave icon-wave--2" />
    </>
  ),
  dish: (
    <>
      <rect x="9" y="12" width="24" height="15" rx="3" transform="rotate(-24 21 19.5)" />
      <path d="M22 27v12M15 43h14" />
      <path d="M33 7a6 6 0 0 1 5 5M34 2.5a11 11 0 0 1 9 9" className="icon-accent icon-wave icon-wave--1" />
    </>
  ),
}

export function ServiceIcon({ name, className }: { name: ServiceIconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" {...base} strokeWidth={2.2}>
      {serviceIcons[name]}
    </svg>
  )
}
