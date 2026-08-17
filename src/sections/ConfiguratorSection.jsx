import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from '../components/MagneticButton'

gsap.registerPlugin(ScrollTrigger)

export default function ConfiguratorSection({ onOpenConfigurator }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: '50% center',
          scrub: 1,
        },
      })

      tl.fromTo('.config-label', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 })
      tl.fromTo(
        '.config-title',
        { opacity: 0, y: 80, clipPath: 'inset(100% 0 0 0)' },
        { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 0.5 },
        '-=0.1'
      )
      tl.fromTo(
        '.config-body',
        { opacity: 0, filter: 'blur(6px)' },
        { opacity: 1, filter: 'blur(0px)', duration: 0.3 },
        '-=0.2'
      )
      tl.fromTo(
        '.config-cta',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3 },
        '-=0.1'
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="configure" className="scroll-section section">
      <div className="section-content" style={{ textAlign: 'center' }}>
        <span className="config-label text-label">06 — Configurator</span>
        <h2
          className="config-title text-display-xl"
          style={{ marginTop: '1.5rem' }}
        >
          Make It<br />Yours
        </h2>
        <p
          className="config-body text-body"
          style={{ maxWidth: '480px', margin: '2rem auto 0' }}
        >
          Choose from an exacting palette of colors, materials, and
          performance options. Each VANTA is as individual as its owner.
        </p>

        <div className="config-cta" style={{ marginTop: '3rem' }}>
          <MagneticButton onClick={onOpenConfigurator}>
            Begin Configuration
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
