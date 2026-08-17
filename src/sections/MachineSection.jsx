import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * MachineSection — "Born From Obsession"
 * Typography clips in from bottom with stagger, body text blur-to-sharp.
 * All animations reversible via scrub.
 */
export default function MachineSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'center center',
          scrub: 1,
        },
      })

      // Label slide up
      tl.fromTo(
        '.machine-label',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.3 }
      )

      // Title lines clip in from bottom with stagger
      tl.fromTo(
        '.machine-title-line',
        { opacity: 0, y: 100, clipPath: 'inset(100% 0 0 0)' },
        {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0% 0 0 0)',
          duration: 0.5,
          stagger: 0.15,
        },
        '-=0.1'
      )

      // Accent line grows
      tl.fromTo(
        '.machine-accent',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.3, transformOrigin: 'left' },
        '-=0.2'
      )

      // Body text: blur-to-sharp
      tl.fromTo(
        '.machine-body',
        { opacity: 0, y: 30, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4, stagger: 0.1 },
        '-=0.2'
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="experience" className="scroll-section section">
      <div className="section-content">
        <div className="machine-grid">
          <div>
            <span className="machine-label text-label">01 — The Machine</span>
            <h2 className="text-display-xl" style={{ marginTop: '1.5rem' }}>
              <span className="machine-title-line" style={{ display: 'block' }}>Born</span>
              <span className="machine-title-line" style={{ display: 'block' }}>From</span>
              <span className="machine-title-line" style={{ display: 'block' }}>Obsession</span>
            </h2>
          </div>

          <div>
            <hr className="machine-accent hr-accent" />
            <p className="machine-body text-body" style={{ marginBottom: '1.5rem' }}>
              Every component exists for a reason. No ornamentation. No
              compromise. The VANTA is a machine distilled to its purest
              expression — where engineering and art become indistinguishable.
            </p>
            <p className="machine-body text-body-sm">
              Carbon-fiber monocoque construction. Aerospace-grade aluminum
              subframes. A symphony of materials chosen not for tradition, but
              for purpose.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .machine-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        @media (max-width: 768px) {
          .machine-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>
    </section>
  )
}
