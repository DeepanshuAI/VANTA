import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const STATUSES = [
  'INITIALIZING SYSTEMS',
  'LOADING ASSETS',
  'CALIBRATING ENGINE',
  'RENDERING INTERFACE',
  'READY',
]

export default function LoadingScreen({ onComplete }) {
  const screenRef = useRef(null)
  const logoRef = useRef(null)
  const progressRef = useRef(null)
  const statusRef = useRef(null)
  const [statusText, setStatusText] = useState(STATUSES[0])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Fade out the loading screen
          gsap.to(screenRef.current, {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: () => onComplete(),
          })
        },
      })

      // Animate each letter in
      const letters = logoRef.current.querySelectorAll('span')
      tl.set(letters, { y: 80, opacity: 0 })
      tl.to(letters, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
      })

      // Progress bar
      tl.to(
        progressRef.current,
        {
          scaleX: 1,
          duration: 2.2,
          ease: 'power2.inOut',
        },
        '-=0.3'
      )

      // Cycle status text
      STATUSES.forEach((status, i) => {
        tl.call(
          () => setStatusText(status),
          null,
          i === 0 ? '<' : `<+=${2.2 / STATUSES.length}`
        )
      })

      // Hold briefly
      tl.to({}, { duration: 0.3 })
    }, screenRef)

    return () => ctx.revert()
  }, [onComplete])

  return (
    <div ref={screenRef} className="loader-screen">
      <div ref={logoRef} className="loader-logo" aria-label="VANTA">
        {'VANTA'.split('').map((char, i) => (
          <span key={i}>{char}</span>
        ))}
      </div>
      <div className="loader-progress-track">
        <div ref={progressRef} className="loader-progress-fill" />
      </div>
      <div ref={statusRef} className="loader-status">
        {statusText}
      </div>
    </div>
  )
}
