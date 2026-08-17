import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const MATERIALS = [
  'Full-grain Nappa Leather',
  'Machined Aluminum Controls',
  'Alcantara Headliner',
  'Ambient Light Architecture',
]

/**
 * InteriorSection — "The Sanctuary"
 * Clip-path title reveal, staggered material items from right.
 */
export default function InteriorSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: '55% center',
          scrub: 1,
        },
      })

      // Label
      tl.fromTo(
        '.interior-label',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.3 }
      )

      // Title with clip-path bottom→top
      tl.fromTo(
        '.interior-title-line',
        { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
        { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 0.5, stagger: 0.12 },
        '-=0.1'
      )

      // Body text blur-to-sharp
      tl.fromTo(
        '.interior-body',
        { opacity: 0, filter: 'blur(6px)', y: 20 },
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.4 },
        '-=0.2'
      )

      // Material items stagger from right
      tl.fromTo(
        '.interior-material',
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.08 },
        '-=0.2'
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="interior" className="scroll-section section">
      <div className="section-content" style={{ textAlign: 'center' }}>
        <span className="interior-label text-label">04 — Interior</span>
        <h2 className="text-display-xl" style={{ marginTop: '1.5rem' }}>
          <span className="interior-title-line" style={{ display: 'block' }}>The</span>
          <span className="interior-title-line" style={{ display: 'block' }}>Sanctuary</span>
        </h2>
        <p
          className="interior-body text-body"
          style={{ maxWidth: '520px', margin: '2rem auto 0' }}
        >
          Hand-stitched leather meets precision-machined aluminum. Every
          surface you touch has been considered. Every detail serves the
          driver.
        </p>

        {/* Material highlights */}
        <div className="interior-materials-grid">
          {MATERIALS.map((item, i) => (
            <div
              key={i}
              className="interior-material"
              style={{
                padding: '2rem 1rem',
                borderTop: '1px solid var(--color-vanta-steel)',
              }}
            >
              <span className="text-label" style={{ fontSize: '0.65rem' }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .interior-materials-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          margin-top: 4rem;
        }
        @media (max-width: 768px) {
          .interior-materials-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </section>
  )
}
