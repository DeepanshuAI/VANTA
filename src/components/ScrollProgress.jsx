import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useScrollStore } from '../utils/store'

/**
 * Minimal scroll progress indicator.
 * Fixed right-edge vertical line with a moving dot.
 */

const SECTIONS = [
  { label: 'Hero', at: 0 },
  { label: 'Machine', at: 0.14 },
  { label: 'Aero', at: 0.28 },
  { label: 'Performance', at: 0.42 },
  { label: 'Interior', at: 0.57 },
  { label: 'Technology', at: 0.71 },
  { label: 'Configure', at: 0.85 },
  { label: 'Reserve', at: 0.95 },
]

export default function ScrollProgress() {
  const dotRef = useRef(null)
  const barRef = useRef(null)

  useEffect(() => {
    const unsub = useScrollStore.subscribe((state) => {
      const progress = state.progress
      if (dotRef.current) {
        gsap.to(dotRef.current, {
          top: `${progress * 100}%`,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: true,
        })
      }
      if (barRef.current) {
        gsap.to(barRef.current, {
          scaleY: progress,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: true,
        })
      }
    })
    return unsub
  }, [])

  return (
    <div className="scroll-progress-container">
      {/* Track line */}
      <div className="scroll-progress-track">
        {/* Fill bar */}
        <div ref={barRef} className="scroll-progress-fill" />
        {/* Active dot */}
        <div ref={dotRef} className="scroll-progress-dot" />
      </div>

      {/* Section markers */}
      <div className="scroll-progress-labels">
        {SECTIONS.map((s, i) => (
          <span
            key={i}
            className="scroll-progress-label"
            style={{ top: `${s.at * 100}%` }}
          >
            {s.label}
          </span>
        ))}
      </div>
    </div>
  )
}
