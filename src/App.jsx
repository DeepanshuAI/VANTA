import { useState, useEffect, useCallback, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import LoadingScreen from './components/LoadingScreen'
import Navigation from './components/Navigation'
import CustomCursor from './components/CustomCursor'
import ScrollStage from './components/ScrollStage'
import ScrollProgress from './components/ScrollProgress'
import InfoPanel from './components/InfoPanel'
import InspectOverlay from './components/InspectOverlay'
import ConfiguratorUI from './components/ConfiguratorUI'

import HeroSection from './sections/HeroSection'
import MachineSection from './sections/MachineSection'
import AeroSection from './sections/AeroSection'
import PerformanceSection from './sections/PerformanceSection'
import InteriorSection from './sections/InteriorSection'
import TechnologySection from './sections/TechnologySection'
import ConfiguratorSection from './sections/ConfiguratorSection'
import CTASection from './sections/CTASection'

import { DEFAULT_CONFIG, CONFIG_CAMERA_HINTS } from './config/configData'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [loading, setLoading] = useState(true)
  const [appReady, setAppReady] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [inspectMode, setInspectMode] = useState(false)
  const [activeHotspot, setActiveHotspot] = useState(null)
  const [configMode, setConfigMode] = useState(false)
  const [vehicleConfig, setVehicleConfig] = useState({ ...DEFAULT_CONFIG })
  const [configCameraHint, setConfigCameraHint] = useState(null)
  const lenisRef = useRef(null)
  const mainRef = useRef(null)

  const handleLoadingComplete = useCallback(() => {
    setLoading(false)
    setTimeout(() => setAppReady(true), 100)
  }, [])

  const handleSceneReady = useCallback(() => {
    setSceneReady(true)
  }, [])

  // Toggle inspect mode
  const handleToggleInspect = useCallback(
    (enter) => {
      setInspectMode(enter)

      if (enter) {
        lenisRef.current?.stop()
        if (mainRef.current) {
          gsap.to(mainRef.current, {
            opacity: 0.05,
            duration: 0.6,
            ease: 'power2.out',
          })
        }
      } else {
        setActiveHotspot(null)
        lenisRef.current?.start()
        if (mainRef.current) {
          gsap.to(mainRef.current, {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
          })
        }
      }
    },
    []
  )

  // Toggle configurator mode
  const handleToggleConfig = useCallback(
    (enter) => {
      setConfigMode(enter)

      if (enter) {
        lenisRef.current?.stop()
        setConfigCameraHint(CONFIG_CAMERA_HINTS.exterior)
        if (mainRef.current) {
          gsap.to(mainRef.current, {
            opacity: 0.05,
            duration: 0.6,
            ease: 'power2.out',
          })
        }
      } else {
        setConfigCameraHint(null)
        lenisRef.current?.start()
        if (mainRef.current) {
          gsap.to(mainRef.current, {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
          })
        }
      }
    },
    []
  )

  // Config option change
  const handleConfigChange = useCallback((category, optionId) => {
    setVehicleConfig((prev) => ({ ...prev, [category]: optionId }))
  }, [])

  // Config category change (camera hint)
  const handleConfigCategoryChange = useCallback((category) => {
    setConfigCameraHint(CONFIG_CAMERA_HINTS[category] || CONFIG_CAMERA_HINTS.exterior)
  }, [])

  // Reset config
  const handleResetConfig = useCallback(() => {
    setVehicleConfig({ ...DEFAULT_CONFIG })
  }, [])

  const handleHotspotSelect = useCallback((data) => {
    setActiveHotspot(data)
  }, [])

  const handleCloseInfoPanel = useCallback(() => {
    setActiveHotspot(null)
  }, [])

  // Initialize Lenis smooth scrolling + global scroll tracking
  useEffect(() => {
    if (loading) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })

    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    lenis.on('scroll', ({ progress }) => {
      setScrollProgress(progress)
    })

    const updateLenis = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(updateLenis)
    }
  }, [loading])

  const isOverlayActive = inspectMode || configMode

  return (
    <>
      <CustomCursor />

      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {!loading && (
        <Navigation
          visible={appReady}
          onOpenShowroom={() => handleToggleConfig(true)}
        />
      )}

      {/* Persistent 3D Canvas — fixed, behind all sections */}
      {!loading && (
        <ScrollStage
          visible={appReady}
          scrollProgress={scrollProgress}
          onSceneReady={handleSceneReady}
          inspectMode={inspectMode}
          configMode={configMode}
          configCameraHint={configCameraHint}
          vehicleConfig={vehicleConfig}
          onHotspotSelect={handleHotspotSelect}
          activeHotspotId={activeHotspot?.id || null}
        />
      )}

      {/* Scroll progress indicator — hidden in overlay modes */}
      {!loading && !isOverlayActive && (
        <ScrollProgress progress={scrollProgress} />
      )}

      {/* Inspect mode overlay */}
      {!loading && (
        <InspectOverlay
          active={inspectMode}
          activeHotspotId={activeHotspot?.id || null}
          onClose={() => handleToggleInspect(false)}
          onSelectHotspot={(h) => handleHotspotSelect(h)}
        />
      )}

      {/* Hotspot info panel */}
      {!loading && (
        <InfoPanel
          hotspot={activeHotspot}
          onClose={handleCloseInfoPanel}
        />
      )}

      {/* Configurator UI */}
      {!loading && (
        <ConfiguratorUI
          active={configMode}
          vehicleConfig={vehicleConfig}
          onConfigChange={handleConfigChange}
          onResetConfig={handleResetConfig}
          onClose={() => handleToggleConfig(false)}
          onCategoryChange={handleConfigCategoryChange}
        />
      )}

      <main
        ref={mainRef}
        style={{
          position: 'relative',
          zIndex: 1,
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.6s ease',
        }}
      >
        <HeroSection
          visible={appReady}
          sceneReady={sceneReady}
          onExploreVehicle={() => handleToggleInspect(true)}
        />

        <MachineSection />
        <AeroSection />
        <PerformanceSection />
        <InteriorSection />
        <TechnologySection />

        {/* Divider before non-3D sections */}
        <div className="section-divider" />
        <ConfiguratorSection onOpenConfigurator={() => handleToggleConfig(true)} />

        <div className="section-divider" />
        <CTASection />
      </main>

      {/* Subtle noise texture overlay */}
      <div className="noise-overlay" />
    </>
  )
}
