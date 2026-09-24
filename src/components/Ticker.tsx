import './Ticker.css'

const items = [
  'Security cameras',
  'Wi-Fi',
  'Network drops',
  'Video doorbells',
  'Audio & video',
  'Starlink installs',
  'Rack cleanups',
  'Ubiquiti UniFi',
]

export function Ticker() {
  return (
    <div className="ticker">
      <div className="ticker__track">
        {[0, 1].map((copy) => (
          <ul className="ticker__list" key={copy} aria-hidden={copy === 1 ? true : undefined}>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
