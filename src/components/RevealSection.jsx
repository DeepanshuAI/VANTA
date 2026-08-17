import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Reusable scroll-triggered reveal wrapper.
 * Wraps children and animates them into view.
 */
export default function RevealSection({
  children,
  className = '',
  id,
  direction = 'up',
  delay = 0,
  stagger = 0.12,
}) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const targets = el.querySelectorAll('.reveal-item')
    if (targets.length === 0) return

    const yVal = direction === 'up' ? 60 : direction === 'down' ? -60 : 0
    const xVal = direction === 'left' ? 60 : direction === 'right' ? -60 : 0

    gsap.set(targets, { opacity: 0, y: yVal, x: xVal })

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 1,
          delay,
          stagger,
          ease: 'power3.out',
        })
      },
    })

    return () => trigger.kill()
  }, [direction, delay, stagger])

  return (
    <section ref={sectionRef} id={id} className={className}>
      {children}
    </section>
  )
}
