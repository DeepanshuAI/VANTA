import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * AeroSection — "Sculpted By Air"
 * Title scales in, stats count up, horizontal rule expands.
 * All driven by scrub ScrollTrigger.
 */
export default function AeroSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: '60% center',
          scrub: 1,
        },
      })

      // Label
      tl.fromTo(
        '.aero-label',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.3 }
      )

      // Title scales in from 130%
      tl.fromTo(
        '.aero-title',
        { opacity: 0, scale: 1.3, filter: 'blur(6px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.5 },
        '-=0.1'
      )

      // Body text
      tl.fromTo(
        '.aero-body',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3 },
        '-=0.2'
      )

      // Horizontal rule expands from center
      tl.fromTo(
        '.aero-rule',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.3, transformOrigin: 'center' },
        '-=0.1'
      )

      // Stats stagger in
      tl.fromTo(
        '.aero-stat',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.1 },
        '-=0.1'
      )
    }, el)

    // Number count-up animation (separate trigger)
    const statEls = el.querySelectorAll('.aero-stat-value')
    statEls.forEach((statEl) => {
      const target = statEl.dataset.value
      const isFloat = target.includes('.')

      ScrollTrigger.create({
        trigger: statEl,
        start: 'top 85%',
        end: 'top 50%',
        scrub: 1,
        onUpdate: (self) => {
          const num = parseFloat(target) * self.progress
          statEl.textContent = isFloat ? num.toFixed(3) : Math.round(num).toString()
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="aerodynamics" className="scroll-section section">
      <div className="section-content" style={{ textAlign: 'center' }}>
        <span className="aero-label text-label">02 — Aerodynamics</span>
        <h2
          className="aero-title text-display-xl"
          style={{ marginTop: '1.5rem' }}
        >
          Sculpted<br />By Air
        </h2>
        <p
          className="aero-body text-body"
          style={{ maxWidth: '560px', margin: '2.5rem auto 0' }}
        >
          Every curve is validated in the wind tunnel. Active aerodynamic
          surfaces adapt in real time — balancing downforce and efficiency with
          surgical precision.
        </p>

        <hr
          className="aero-rule"
          style={{
            width: '120px',
            height: '1px',
            background: 'var(--color-vanta-ash)',
            border: 'none',
            margin: '3rem auto',
          }}
        />

        {/* Stats */}
        <div className="aero-stats-grid">
          {[
            { value: '0.208', label: 'Drag Coefficient' },
            { value: '340', label: 'Peak Downforce (kg)' },
            { value: '7', label: 'Active Aero Surfaces' },
          ].map((stat, i) => (
            <div key={i} className="aero-stat" style={{ textAlign: 'center' }}>
              <span
                className="aero-stat-value text-display-lg"
                data-value={stat.value}
                style={{
                  fontWeight: 200,
                  fontVariantNumeric: 'tabular-nums',
                  display: 'block',
                }}
              >
                0
              </span>
              <span
                className="text-label"
                style={{ display: 'block', marginTop: '0.75rem' }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .aero-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
        @media (max-width: 768px) {
          .aero-stats-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }
      `}</style>
    </section>
  )
}
