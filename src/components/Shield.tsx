import { useId } from 'react'
import { BAR_H, BAR_Y, COLORS, FORTY_SEVEN, IL, OUTLINE, ROUTE, SHIELD_H, SHIELD_W, STEP, STEP_NUMBERS, STROKE } from './shieldArt'

type ShieldProps = {
  className?: string
  /** Accessible name. Without one the shield is treated as decoration. */
  title?: string
  /** Light outer border, like a real road sign, for dark backgrounds. */
  ring?: boolean
  /** Show "STEP n" instead of "ROUTE 47 IL" (the numbered markers in "How it works"). */
  step?: number
}

const RING = 34

export function Shield({ className, title, ring = false, step }: ShieldProps) {
  const clipId = `shield-${useId().replace(/[^\w-]/g, '')}`
  const pad = ring ? RING : 0

  return (
    <svg
      className={className}
      viewBox={`${-pad} ${-pad} ${SHIELD_W + pad * 2} ${SHIELD_H + pad * 2}`}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={OUTLINE} />
        </clipPath>
      </defs>
      {ring && <path d={OUTLINE} fill="none" stroke="#f7f5f0" strokeWidth={RING * 2} strokeLinejoin="round" />}
      <g clipPath={`url(#${clipId})`}>
        <rect width={SHIELD_W} height={SHIELD_H} fill={COLORS.body} />
        <rect width={SHIELD_W} height={BAR_Y} fill={COLORS.band} />
        <rect y={BAR_Y - BAR_H / 2} width={SHIELD_W} height={BAR_H} fill={COLORS.ink} />
        {/* The border is an inside stroke: twice as wide, with the outer half clipped away. */}
        <path d={OUTLINE} fill="none" stroke={COLORS.ink} strokeWidth={STROKE * 2} strokeMiterlimit={20} />
      </g>
      <g fill={COLORS.ink}>
        {step === undefined ? (
          <>
            <path d={ROUTE} />
            <path d={FORTY_SEVEN} fillRule="evenodd" />
            <path d={IL} />
          </>
        ) : (
          <>
            <path d={STEP} />
            <path d={STEP_NUMBERS[step - 1]} />
          </>
        )}
      </g>
    </svg>
  )
}
