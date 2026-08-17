import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * InfoPanel — minimal technical detail card shown when a hotspot is focused.
 * Positioned at bottom-left, glass-card aesthetic.
 */
export default function InfoPanel({ hotspot, onClose }) {
  const panelRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    if (!panelRef.current) return

    if (hotspot) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.3 }
      )
    } else {
      gsap.to(panelRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: 'power2.in',
      })
    }
  }, [hotspot])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cardRef.current || !hotspot) return
      
      const rect = cardRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const x = (e.clientX - centerX) / 40
      const y = (e.clientY - centerY) / 40
      
      gsap.to(cardRef.current, {
        x: x,
        y: y,
        rotateX: -y,
        rotateY: x,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto'
      })
    }

    if (hotspot) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [hotspot])

  if (!hotspot) return null

  return (
    <div ref={panelRef} className="info-panel-container" style={{ opacity: 0 }}>
      <div ref={cardRef} className="info-panel-card" style={{ transformPerspective: 1000 }}>
        {/* Close button */}
        <button
          className="info-panel-close"
          onClick={onClose}
          data-cursor="pointer"
        >
          ×
        </button>

        {/* Spec badge */}
        <div className="info-panel-spec">
          {hotspot.spec}
        </div>

        {/* Title */}
        <h4 className="info-panel-title">
          {hotspot.title}
        </h4>

        {/* Description */}
        <p className="info-panel-desc">
          {hotspot.desc}
        </p>

        {/* Label */}
        <span className="info-panel-label">
          {hotspot.label}
        </span>
      </div>
    </div>
  )
}
