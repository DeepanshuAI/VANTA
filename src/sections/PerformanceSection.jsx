import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: '2.1', suffix: ' SEC', label: '0–100 km/h', align: 'left' },
  { value: '1,020', suffix: ' HP', label: 'Peak Power', align: 'right' },
  { value: '350', suffix: ' KM/H', label: 'Top Speed', align: 'left' },
]

/**
 * PerformanceSection — massive full-width stat counters.
 * Each stat slides in from alternating sides with number count-up.
 */
export default function PerformanceSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      // Section title
      const titleTl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: '25% center',
          scrub: 1,
        },
      })

      titleTl.fromTo(
        '.perf-label',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.3 }
      )
      titleTl.fromTo(
        '.perf-title',
        { opacity: 0, y: 60, clipPath: 'inset(100% 0 0 0)' },
        { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 0.5 },
        '-=0.1'
      )
      titleTl.fromTo(
        '.perf-desc',
        { opacity: 0, filter: 'blur(6px)' },
        { opacity: 1, filter: 'blur(0px)', duration: 0.3 },
        '-=0.2'
      )

      // Each stat row
      el.querySelectorAll('.perf-stat-row').forEach((row, i) => {
        const fromLeft = i % 2 === 0
        gsap.fromTo(
          row,
          {
            opacity: 0,
            x: fromLeft ? -120 : 120,
          },
          {
            opacity: 1,
            x: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: row,
              start: 'top 85%',
              end: 'top 55%',
              scrub: 1,
            },
          }
        )

        // Horizontal rule grows
        const rule = row.querySelector('.perf-rule')
        if (rule) {
          gsap.fromTo(
            rule,
            { scaleX: 0 },
            {
              scaleX: 1,
              transformOrigin: fromLeft ? 'left' : 'right',
              ease: 'none',
              scrollTrigger: {
                trigger: row,
                start: 'top 75%',
                end: 'top 45%',
                scrub: 1,
              },
            }
          )
        }
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="performance" className="scroll-section section">
      <div className="section-content">
        <div style={{ marginBottom: '4rem' }}>
          <span className="perf-label text-label">03 — Performance</span>
          <h2
            className="perf-title text-display-xl"
            style={{ marginTop: '1.5rem' }}
          >
            Relentless<br />Force
          </h2>
          <p
            className="perf-desc text-body"
            style={{ maxWidth: '500px', marginTop: '1.5rem' }}
          >
            Dual electric motors deliver instantaneous torque through an
            intelligent all-wheel-drive system. The result is acceleration
            that redefines expectation.
          </p>
        </div>

        {/* Massive stat rows */}
        <div className="perf-stats">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="perf-stat-row"
              style={{ textAlign: stat.align }}
            >
              <div className="perf-rule" />
              <div className="perf-stat-content">
                <span className="perf-stat-value">
                  {stat.value}
                  <span className="perf-stat-suffix">{stat.suffix}</span>
                </span>
                <span className="perf-stat-label text-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .perf-stats {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .perf-stat-row {
          padding: 2.5rem 0;
        }
        .perf-rule {
          height: 1px;
          background: var(--color-vanta-steel);
          margin-bottom: 2rem;
        }
        .perf-stat-content {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
        }
        .perf-stat-value {
          font-family: var(--font-display);
          font-size: clamp(3.5rem, 10vw, 9rem);
          font-weight: 200;
          line-height: 1;
          letter-spacing: -0.03em;
          color: var(--color-vanta-white);
          font-variant-numeric: tabular-nums;
        }
        .perf-stat-suffix {
          font-size: clamp(1.2rem, 3vw, 2.5rem);
          font-weight: 300;
          letter-spacing: 0.05em;
          color: var(--color-vanta-accent);
          margin-left: 0.3em;
        }
        .perf-stat-label {
          flex-shrink: 0;
        }
        @media (max-width: 768px) {
          .perf-stat-content {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </section>
  )
}
