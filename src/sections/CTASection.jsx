import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from '../components/MagneticButton'

gsap.registerPlugin(ScrollTrigger)

export default function CTASection() {
  const sectionRef = useRef(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('reserve') // 'reserve' | 'viewing'
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 70%',
          once: true,
        },
      })

      tl.fromTo('.cta-label', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      tl.fromTo(
        '.cta-title-line',
        { opacity: 0, y: 100, rotateX: -90 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1, stagger: 0.2, ease: 'back.out(1.2)', transformOrigin: '50% 50% -50px' },
        '-=0.4'
      )
      tl.fromTo(
        '.cta-body',
        { opacity: 0, y: 20, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      )
      tl.fromTo(
        '.cta-buttons',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      )
      tl.fromTo(
        '.cta-footer',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.4'
      )
    }, el)

    return () => ctx.revert()
  }, [])

  const handleOpenModal = (mode) => {
    setModalMode(mode)
    setSubmitted(false)
    setModalOpen(true)
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="scroll-section section section-fullscreen"
    >
      <div className="section-content" style={{ textAlign: 'center' }}>
        <span className="cta-label text-label">Reserve</span>
        <h2 className="text-display-hero" style={{ marginTop: '1.5rem' }}>
          <span className="cta-title-line" style={{ display: 'block' }}>Own The</span>
          <span className="cta-title-line" style={{ display: 'block' }}>Darkness</span>
        </h2>
        <p
          className="cta-body text-body"
          style={{ maxWidth: '440px', margin: '2.5rem auto 0' }}
        >
          Limited to 500 units worldwide. Each one numbered. Each one
          irreplaceable.
        </p>
        <div
          className="cta-buttons"
          style={{
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            marginTop: '3rem',
            flexWrap: 'wrap',
          }}
        >
          <MagneticButton onClick={() => handleOpenModal('reserve')}>
            Reserve Allocation
          </MagneticButton>
          <MagneticButton onClick={() => handleOpenModal('viewing')}>
            Private Studio Viewing
          </MagneticButton>
        </div>

        {/* Footer */}
        <div
          className="cta-footer"
          style={{
            position: 'absolute',
            bottom: '3rem',
            left: '3rem',
            right: '3rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span className="text-body-sm">© 2026 VANTA Motors</span>
          <span className="text-body-sm" style={{ letterSpacing: '0.15em' }}>VANTA HYPER-GT</span>
        </div>
      </div>

      {/* Reservation Dialog Modal */}
      {modalOpen && (
        <div
          className="config-modal-backdrop"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="config-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="config-modal-close"
              onClick={() => setModalOpen(false)}
              data-cursor="pointer"
            >
              ×
            </button>
            <span className="text-label" style={{ color: 'var(--color-vanta-chrome)' }}>
              {modalMode === 'reserve' ? 'Production Allocation' : 'VIP Viewing'}
            </span>
            <h3 className="config-modal-title">
              {modalMode === 'reserve' ? 'Reserve Build Slot' : 'Schedule Private Viewing'}
            </h3>
            
            {submitted ? (
              <div style={{ padding: '1.5rem 0', textAlign: 'center' }}>
                <p className="text-body" style={{ color: 'var(--color-vanta-white)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  Allocation Requested
                </p>
                <p className="text-body-sm" style={{ color: 'var(--color-vanta-steel)' }}>
                  A VANTA Client Advisor will contact you within 24 hours to finalize your build configuration.
                </p>
                <div style={{ marginTop: '1.5rem' }}>
                  <MagneticButton onClick={() => setModalOpen(false)}>
                    Close
                  </MagneticButton>
                </div>
              </div>
            ) : (
              <>
                <p className="config-modal-desc">
                  {modalMode === 'reserve'
                    ? 'Secure your serial-numbered VANTA build allocation with prioritized factory delivery.'
                    : 'Experience the tactile bespoke craftsmanship of VANTA at our private design studio.'}
                </p>
                <div className="config-modal-spec-box">
                  <div className="config-modal-spec-item">
                    <span>Worldwide Production</span>
                    <strong>500 Units Total</strong>
                  </div>
                  <div className="config-modal-spec-item">
                    <span>Delivery Window</span>
                    <strong>Q4 2026 Allocation</strong>
                  </div>
                  <div className="config-modal-spec-item">
                    <span>Chassis Architecture</span>
                    <strong>Full Carbon Monocoque</strong>
                  </div>
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <MagneticButton onClick={() => setSubmitted(true)}>
                    Confirm Request
                  </MagneticButton>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
