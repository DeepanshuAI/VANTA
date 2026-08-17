import { useRef, useState, useEffect, useCallback, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import gsap from 'gsap'

import CarPlaceholder from './three/CarPlaceholder'
import { GroundPlane, StudioLighting, Particles } from './three/StudioEnvironment'
import CameraController from './three/CameraController'

/**
 * Inner scene content — all 3D objects live here.
 */
function SceneContent({ lightIntensity, carIntro, scrollProgress, particleCount }) {
  return (
    <>
      <CameraController scrollProgress={scrollProgress} />
      <StudioLighting intensity={lightIntensity} />
      <GroundPlane />
      <Particles count={particleCount} />

      {/* Environment map for reflections */}
      <Environment preset="city" background={false} environmentIntensity={0.3} />

      {/* Car */}
      <CarPlaceholder introProgress={carIntro} />
    </>
  )
}

/**
 * HeroScene — Full-screen R3F canvas with cinematic entrance.
 *
 * Entrance sequence:
 *   1. Complete darkness (black)
 *   2. Lights fade in
 *   3. Car scales up from 0 → 1
 *   4. (Text is animated externally by HeroSection)
 *
 * Props:
 *   - visible: triggers the entrance animation
 *   - scrollProgress: 0..1 for camera push
 *   - onSceneReady: callback when entrance finishes
 */
export default function HeroScene({ visible, scrollProgress = 0, onSceneReady }) {
  const [lightIntensity, setLightIntensity] = useState(0)
  const [carIntro, setCarIntro] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const valuesRef = useRef({ light: 0, car: 0 })

  // Detect mobile
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Cinematic entrance
  useEffect(() => {
    if (!visible) return

    const tl = gsap.timeline({
      onUpdate: () => {
        setLightIntensity(valuesRef.current.light)
        setCarIntro(valuesRef.current.car)
      },
      onComplete: () => onSceneReady?.(),
    })

    // Phase 1: Lights fade in from darkness
    tl.to(valuesRef.current, {
      light: 1,
      duration: 1.8,
      ease: 'power2.inOut',
    })

    // Phase 2: Car materializes (scale 0 → 1)
    tl.to(
      valuesRef.current,
      {
        car: 1,
        duration: 1.4,
        ease: 'power3.out',
      },
      '-=1.0'
    )

    return () => tl.kill()
  }, [visible, onSceneReady])

  const particleCount = isMobile ? 40 : 120

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
      }}
    >
      <Canvas
        shadows="basic"
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: 4, // ACESFilmicToneMapping
          toneMappingExposure: 0.9,
        }}
        camera={{
          fov: isMobile ? 55 : 40,
          near: 0.1,
          far: 100,
          position: [0, 2.5, 7],
        }}
        style={{ background: '#0a0a0a' }}
      >
        <fog attach="fog" args={['#0a0a0a', 12, 30]} />
        <Suspense fallback={null}>
          <SceneContent
            lightIntensity={lightIntensity}
            carIntro={carIntro}
            scrollProgress={scrollProgress}
            particleCount={particleCount}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
