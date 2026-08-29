import { useRef, useState, useEffect, useCallback, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import gsap from 'gsap'

import CarPlaceholder from './three/CarPlaceholder'
import { GroundPlane, StudioLighting, Particles } from './three/StudioEnvironment'
import CameraController from './three/CameraController'
import TechOverlays from './three/TechOverlays'
import Hotspots from './three/Hotspots'

/**
 * Inner scene content — all 3D objects live here.
 */
function SceneContent({
  lightIntensity,
  carIntro,
  particleCount,
  inspectMode,
  configMode,
  configCameraHint,
  vehicleConfig,
  focusTarget,
  onFocusComplete,
  onSelectHotspot,
  activeHotspotId,
  hoverBoost,
}) {
  return (
    <>
      <CameraController
        inspectMode={inspectMode}
        configMode={configMode}
        configCameraHint={configCameraHint}
        focusTarget={focusTarget}
        onFocusComplete={onFocusComplete}
      />
      <StudioLighting intensity={lightIntensity * (1 + hoverBoost * 0.15)} />
      <GroundPlane />
      <Particles count={particleCount} />

      <Environment preset="city" background={false} environmentIntensity={0.3} />

      <CarPlaceholder
        introProgress={carIntro}
        inspectMode={inspectMode}
        configMode={configMode}
        vehicleConfig={vehicleConfig}
      />
      <TechOverlays />
      <Hotspots
        inspectMode={inspectMode}
        onSelect={onSelectHotspot}
        activeHotspotId={activeHotspotId}
      />
    </>
  )
}

/**
 * ScrollStage — Persistent full-page R3F canvas.
 *
 * Fixed-position canvas that spans the viewport and remains visible
 * across Hero → Machine → Aero → Performance → Interior → Technology.
 * Fades out before Configurator/CTA sections (unless in inspect/config mode).
 */
export default function ScrollStage({
  visible,
  onSceneReady,
  inspectMode = false,
  configMode = false,
  configCameraHint = null,
  vehicleConfig = null,
  onHotspotSelect,
  activeHotspotId,
}) {
  const [lightIntensity, setLightIntensity] = useState(0)
  const [carIntro, setCarIntro] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [focusTarget, setFocusTarget] = useState(null)
  const [hoverBoost, setHoverBoost] = useState(0)
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

    tl.to(valuesRef.current, {
      light: 1,
      duration: 1.8,
      ease: 'power2.inOut',
    })

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

  // When a hotspot is selected, build focus target for camera
  const handleSelectHotspot = useCallback(
    (data) => {
      setFocusTarget({ pos: data.focusPos, look: data.focusLook })
      onHotspotSelect?.(data)
    },
    [onHotspotSelect]
  )

  const handleFocusComplete = useCallback(() => {}, [])

  // Clear focus target when exiting inspect mode
  useEffect(() => {
    if (!inspectMode) {
      setFocusTarget(null)
    }
  }, [inspectMode])

  const isElevated = inspectMode || configMode

  // Continuous cinematic canvas — persistent throughout all sections
  const canvasOpacity = 1

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: isElevated ? 5 : 0,
        opacity: canvasOpacity,
        pointerEvents: isElevated ? 'auto' : 'auto',
      }}
    >
      <Canvas
        shadows="basic"
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: 4,
          toneMappingExposure: 0.9,
        }}
        camera={{
          fov: isMobile ? 45 : 40,
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
            particleCount={particleCount}
            inspectMode={inspectMode}
            configMode={configMode}
            configCameraHint={configCameraHint}
            vehicleConfig={vehicleConfig}
            focusTarget={focusTarget}
            onFocusComplete={handleFocusComplete}
            onSelectHotspot={handleSelectHotspot}
            activeHotspotId={activeHotspotId}
            hoverBoost={hoverBoost}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
