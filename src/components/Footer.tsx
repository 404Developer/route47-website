import { site } from '../site'
import { Logo } from './Logo'
import './Footer.css'

export function Footer() {
  return (
    <footer className="footer">
      <div className="road-stripe" aria-hidden="true" />
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo />
          <p className="footer__tagline">
            {site.tagline.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          <a href="#services">Services</a>
          <a href="#unifi">UniFi</a>
          <a href="#work">Our work</a>
          <a href="#why">Why us</a>
          <a href="#contact">Contact</a>
        </nav>

        <address className="footer__contact">
          {site.phones.map((p) => (
            <a key={p.tel} href={`tel:${p.tel}`}>
              {p.display}
            </a>
          ))}
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <span>{site.area}</span>
        </address>
      </div>

      <div className="container footer__base">
        <p>
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {site.name} · Security · Wi-Fi · Audio ·
          Video
        </p>
        <p>Specializing in Ubiquiti UniFi. Ubiquiti and UniFi are trademarks of Ubiquiti Inc.</p>
      </div>
    </footer>
  )
}
