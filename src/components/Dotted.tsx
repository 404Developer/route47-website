/** Renders text with every period painted amber, the way the tagline is set. */
export function Dotted({ text }: { text: string }) {
  return text.split(/(\.)/).map((part, i) =>
    part === '.' ? (
      <span className="dot" key={i}>
        .
      </span>
    ) : (
      part
    ),
  )
}
