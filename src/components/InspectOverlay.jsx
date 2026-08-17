import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { HOTSPOT_DATA } from './three/Hotspots'

/**
 * InspectOverlay — full-screen UI shown during inspect mode.
 *
 * Contains:
 *   - Close button (top-right)
 *   - Mode label (top-left)
 *   - Hotspot navigation dots (bottom-center)
 *   - Edge vignette
 */
export default function InspectOverlay({
  active,
  activeHotspotId,
  onClose,
  onSelectHotspot,
}) {
  const overlayRef = useRef(null)

  useEffect(() => {
    if (!overlayRef.current) return

    if (active) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
      )
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      })
    }
  }, [active])

  // Support Escape key to close
  useEffect(() => {
    if (!active) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [active, onClose])

  if (!active) return null

  return (
    <div
      ref={overlayRef}
      className="inspect-overlay"
      style={{ opacity: 0 }}
    >
      {/* Vignette edges */}
      <div className="inspect-vignette" />

      {/* Top-left label */}
      <div className="inspect-mode-label">
        <span className="text-label" style={{ color: 'var(--color-vanta-accent)' }}>
          Explore
        </span>
        {activeHotspotId && (
          <span
            className="text-label"
            style={{
              color: 'var(--color-vanta-white)',
              marginLeft: '0.75rem',
            }}
          >
            {HOTSPOT_DATA.find((h) => h.id === activeHotspotId)?.label || ''}
          </span>
        )}
      </div>

      {/* Close button */}
      <button
        className="inspect-close-btn"
        onClick={(e) => {
          e.stopPropagation()
          onClose?.()
        }}
        data-cursor="pointer"
        aria-label="Back to experience"
      >
        <span className="inspect-close-label">Back to Experience</span>
        <span className="inspect-close-icon">×</span>
      </button>

      {/* Hotspot navigation dots */}
      <div className="inspect-nav-dots">
        {HOTSPOT_DATA.map((h) => (
          <button
            key={h.id}
            className={`inspect-dot ${activeHotspotId === h.id ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              onSelectHotspot(h)
            }}
            data-cursor="pointer"
            title={h.label}
          >
            <span className="inspect-dot-inner" />
            <span className="inspect-dot-label">{h.label}</span>
          </button>
        ))}
      </div>

      {/* Luxury Explore Hint Pill */}
      <div className="inspect-hint">
        <div className="inspect-hint-pill">
          <span className="inspect-hint-dot" />
          <span className="inspect-hint-text">
            Drag to Explore · Tap Hotspots to Inspect
          </span>
        </div>
      </div>
    </div>
  )
}
