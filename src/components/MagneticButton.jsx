import { useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

export default function MagneticButton({
  children,
  className = '',
  href,
  onClick,
  strength = 0.3,
  ...props
}) {
  const btnRef = useRef(null)
  const textRef = useRef(null)

  const handleMouseMove = useCallback(
    (e) => {
      const btn = btnRef.current
      if (!btn) return
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      gsap.to(btn, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: 'power2.out',
      })
      
      if (textRef.current) {
        gsap.to(textRef.current, {
          x: x * (strength * 0.5),
          y: y * (strength * 0.5),
          duration: 0.4,
          ease: 'power2.out'
        })
      }
    },
    [strength]
  )

  const handleMouseLeave = useCallback(() => {
    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
    })
    
    if (textRef.current) {
      gsap.to(textRef.current, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      })
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (textRef.current) {
      gsap.to(textRef.current, { scale: 1.05, duration: 0.3, ease: 'power2.out' })
    }
  }, [])
  
  const handleMouseLeaveOuter = useCallback((e) => {
    handleMouseLeave(e)
    if (textRef.current) {
      gsap.to(textRef.current, { scale: 1, duration: 0.3, ease: 'power2.out' })
    }
  }, [handleMouseLeave])

  const Tag = href ? motion.a : motion.button

  return (
    <Tag
      ref={btnRef}
      className={`btn-magnetic ${className}`}
      href={href}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeaveOuter}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <span ref={textRef} className="btn-magnetic-text" style={{ display: 'inline-block' }}>{children}</span>
    </Tag>
  )
}
