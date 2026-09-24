import { useState } from 'react'
import { photos, photosAreSamples, transformations, transformationsAreSamples } from '../lib/content'
import { BeforeAfter } from './BeforeAfter'
import { Gallery } from './Gallery'
import './Work.css'

export function Work() {
  const [active, setActive] = useState(0)
  const project = transformations[active]
  const usingSamples = (project && transformationsAreSamples) || (photos.length > 0 && photosAreSamples)

  return (
    <section className="section section--dark work" id="work" aria-labelledby="work-title">
      <div className="work__glow" aria-hidden="true" />
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">Our work</p>
          <h2 className="title" id="work-title">
            See the difference<span className="dot">.</span>
          </h2>
          <p className="lead">
            Real jobs from around the area. Drag the slider to flip between before and after — clean installs
            speak for themselves.
          </p>
        </header>

        {project && (
          <div className="work__showcase" data-reveal>
            <BeforeAfter key={project.id} before={project.before} after={project.after} title={project.title} />

            <div className="work__project">
              <div>
                <h3 className="work__project-title">{project.title}</h3>
                {project.caption && <p className="work__project-caption">{project.caption}</p>}
              </div>

              {transformations.length > 1 && (
                <div className="work__picker" role="group" aria-label="Choose a project">
                  {transformations.map((t, i) => (
                    <button
                      key={t.id}
                      type="button"
                      className="work__pick"
                      aria-pressed={i === active}
                      aria-label={t.title}
                      onClick={() => setActive(i)}
                    >
                      <img src={t.after.src} srcSet={t.after.srcset} sizes="120px" alt="" loading="lazy" decoding="async" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {photos.length > 0 && (
          <div className="work__gallery">
            <h3 className="work__subtitle" data-reveal>
              Job gallery
            </h3>
            <Gallery photos={photos} />
          </div>
        )}

        {usingSamples && (
          <p className="work__note">Sample illustrations shown — photos from real Route 47 jobs are on the way.</p>
        )}
      </div>
    </section>
  )
}
