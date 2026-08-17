import { useRef, useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from '../components/MagneticButton'

gsap.registerPlugin(ScrollTrigger)

/**
 * HeroSection — text overlay on top of the persistent 3D canvas.
 * Text fades out as user scrolls away.
 */
export default function HeroSection({ visible, sceneReady, onExploreVehicle }) {
  const heroRef = useRef(null)

  // Text entrance — fires after the 3D scene entrance completes
  useEffect(() => {
    if (!sceneReady) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 })

      tl.fromTo(
        '.hero-label',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
        .fromTo(
          '.hero-title-char',
          { opacity: 0, y: 100, rotateX: -90 },
          { opacity: 1, y: 0, rotateX: 0, duration: 1, stagger: 0.1, ease: 'back.out(1.2)', transformOrigin: '50% 50% -50px' },
          '-=0.4'
        )
        .fromTo(
          '.hero-subtitle-word',
          { opacity: 0, y: 20, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.15, ease: 'power2.out' },
          '-=0.5'
        )
        .fromTo(
          '.hero-cta',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          '.hero-scroll-indicator',
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: 'power2.out' },
          '-=0.2'
        )
    }, heroRef)

    return () => ctx.revert()
  }, [sceneReady])

  // Scroll-driven fade-out
  useEffect(() => {
    if (!visible) return

    const ctx = gsap.context(() => {
      gsap.to('.hero-text-overlay', {
        opacity: 0,
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '60% top',
          scrub: true,
        },
      })

      gsap.to('.hero-scroll-indicator', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: '10% top',
          end: '30% top',
          scrub: true,
        },
      })
    }, heroRef)

    return () => ctx.revert()
  }, [visible])

  return (
    <section
      ref={heroRef}
      id="hero"
      className="scroll-section"
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
      }}
    >
      {/* Hero text overlay */}
      <div
        className="hero-text-overlay"
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <p
          className="hero-label text-label"
          style={{ marginBottom: '1.5rem', opacity: 0 }}
        >
          Introducing
        </p>

        <div style={{ overflow: 'hidden' }}>
          <h1
            className="hero-title text-display-hero"
            style={{ display: 'block' }}
          >
            {"VANTA".split('').map((char, i) => (
              <span key={i} className="hero-title-char" style={{ display: 'inline-block', opacity: 0 }}>
                {char}
              </span>
            ))}
          </h1>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <p
            className="hero-subtitle"
            style={{
              marginTop: '0.5rem',
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(0.9rem, 2vw, 1.5rem)',
              fontWeight: 300,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--color-vanta-accent)',
            }}
          >
            {"The Future, Engineered.".split(' ').map((word, i) => (
              <span key={i} className="hero-subtitle-word" style={{ display: 'inline-block', opacity: 0, marginRight: '0.25em' }}>
                {word}
              </span>
            ))}
          </p>
        </div>

        <div
          className="hero-cta"
          style={{
            marginTop: '2.5rem',
            pointerEvents: 'all',
            opacity: 0,
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <MagneticButton href="#experience">Explore</MagneticButton>
          <MagneticButton onClick={onExploreVehicle}>
            Explore Vehicle
          </MagneticButton>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="hero-scroll-indicator"
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          opacity: 0,
        }}
      >
        <span className="text-label" style={{ fontSize: '0.6rem' }}>
          Scroll
        </span>
        <div
          style={{
            width: '1px',
            height: '40px',
            background: 'var(--color-vanta-steel)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'var(--color-vanta-accent)',
              animation: 'scrollPulse 2s ease-in-out infinite',
            }}
          />
        </div>
        <style>{`
          @keyframes scrollPulse {
            0%, 100% { transform: translateY(-100%); }
            50% { transform: translateY(100%); }
          }
        `}</style>
      </div>
    </section>
  )
}
