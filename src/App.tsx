import { useEffect } from 'react'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { MobileCallBar } from './components/MobileCallBar'
import { Nav } from './components/Nav'
import { Process } from './components/Process'
import { Services } from './components/Services'
import { Ticker } from './components/Ticker'
import { UniFi } from './components/UniFi'
import { WhyUs } from './components/WhyUs'
import { Work } from './components/Work'

// Fade sections up as they scroll into view. Elements opt in with `data-reveal`.
function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

export default function App() {
  useScrollReveal()

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Ticker />
        <Services />
        <UniFi />
        <Work />
        <WhyUs />
        <Process />
        <Contact />
      </main>
      <Footer />
      <MobileCallBar />
    </>
  )
}
