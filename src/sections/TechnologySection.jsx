import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
  'Autonomous Driving Level 4',
  'Augmented Reality HUD',
  'Neural Adaptive Suspension',
  'Biometric Driver Recognition',
  'V2X Communication Protocol',
]

/**
 * TechnologySection — "Intelligent By Design"
 * Features list animates one-by-one with left border growth.
 * Title reveals with letter-spacing animation.
 */
export default function TechnologySection() {
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
        '.tech-label',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.3 }
      )

      // Title: letter-spacing wide → normal
      tl.fromTo(
        '.tech-title',
        { opacity: 0, letterSpacing: '0.3em', y: 40 },
        { opacity: 1, letterSpacing: '-0.03em', y: 0, duration: 0.5 },
        '-=0.1'
      )

      // Description blur-to-sharp
      tl.fromTo(
        '.tech-desc',
        { opacity: 0, filter: 'blur(6px)' },
        { opacity: 1, filter: 'blur(0px)', duration: 0.3 },
        '-=0.2'
      )

      // Features stagger in with left border animation
      tl.fromTo(
        '.tech-feature',
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.25, stagger: 0.08 },
        '-=0.1'
      )

      tl.fromTo(
        '.tech-feature-border',
        { scaleY: 0 },
        { scaleY: 1, transformOrigin: 'top', duration: 0.2, stagger: 0.06 },
        '-=0.6'
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="technology" className="scroll-section section">
      <div className="section-content">
        <div className="tech-grid">
          <div>
            <span className="tech-label text-label">05 — Technology</span>
            <h2
              className="tech-title text-display-xl"
              style={{ marginTop: '1.5rem' }}
            >
              Intelligent<br />By Design
            </h2>
          </div>

          <div style={{ paddingTop: '3rem' }}>
            <hr className="hr-accent" style={{ marginBottom: '1.5rem' }} />
            <p className="tech-desc text-body" style={{ marginBottom: '2rem' }}>
              A neural network of sensors creates a 360° awareness bubble around
              the vehicle. Over-the-air updates ensure the VANTA evolves long
              after it leaves the factory.
            </p>

            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="tech-feature"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 0',
                  position: 'relative',
                  borderBottom:
                    i < FEATURES.length - 1
                      ? '1px solid var(--color-vanta-steel)'
                      : 'none',
                }}
              >
                {/* Animated left border accent */}
                <div
                  className="tech-feature-border"
                  style={{
                    position: 'absolute',
                    left: '-1rem',
                    top: 0,
                    width: '2px',
                    height: '100%',
                    background: 'var(--color-vanta-chrome)',
                  }}
                />
                <span
                  className="text-label"
                  style={{
                    color: 'var(--color-vanta-ash)',
                    width: '2rem',
                    fontSize: '0.6rem',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="text-body-sm"
                  style={{ color: 'var(--color-vanta-chrome)' }}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .tech-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          align-items: start;
        }
        @media (max-width: 768px) {
          .tech-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>
    </section>
  )
}
