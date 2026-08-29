import { useRef, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { useScrollStore } from '../../utils/store'

/* ═══════════════════════════════════════════════════
   Camera Keyframes (scroll-driven mode)
   ═══════════════════════════════════════════════════ */

const KEYFRAMES = [
  // 0.00 – Hero: Classic dramatic 3/4 beauty view
  { at: 0.00, pos: [-0.6, 2.0, 6.2],    look: [0, 0.45, 0] },
  { at: 0.08, pos: [-0.4, 1.9, 5.8],    look: [0, 0.45, 0] },
  // 0.16 – The Machine: Clean side/3/4 composition showing muscular flanks
  { at: 0.16, pos: [-3.2, 1.45, 4.2],  look: [0, 0.52, 0.1] },
  { at: 0.24, pos: [-2.6, 1.40, 4.4],  look: [0, 0.52, 0.1] },
  // 0.32 – Aerodynamics: Elevated 3/4 top-biased wind-tunnel engineering camera
  { at: 0.32, pos: [-1.2, 3.4, 4.5],   look: [0, 0.55, 0.1] },
  { at: 0.40, pos: [-0.8, 3.2, 4.6],   look: [0, 0.55, 0.1] },
  // 0.48 – Performance: Low front 3/4 angle framing headlights and aggressive stance
  { at: 0.48, pos: [-1.8, 0.95, -3.8],  look: [0, 0.58, -1.8] },
  { at: 0.54, pos: [-1.4, 0.95, -3.6],  look: [0, 0.58, -1.8] },
  // 0.62 – Interior: Camera glides into cockpit framing dashboard and steering wheel
  { at: 0.62, pos: [-0.48, 1.04, 0.35], look: [-0.36, 0.85, -0.42] },
  { at: 0.68, pos: [-0.42, 1.00, 0.28], look: [-0.36, 0.85, -0.42] },
  // 0.76 – Technology: Elevated right 3/4 overview for HUD surrounds
  { at: 0.76, pos: [2.2, 2.1, 4.8],    look: [0, 0.55, 0.0] },
  { at: 0.84, pos: [1.8, 2.0, 5.0],    look: [0, 0.52, 0.0] },
  // 0.90 – Configurator Section: Centered hero showroom presentation
  { at: 0.90, pos: [0, 2.2, 5.8],      look: [0, 0.45, 0] },
  // 1.00 – Finale Climax: Camera slowly approaches front fascia with active illumination
  { at: 1.00, pos: [0, 1.45, 4.6],     look: [0, 0.50, -0.2] },
]

function interpolateKeyframes(progress) {
  const p = THREE.MathUtils.clamp(progress, 0, 1)
  
  let kfStart = KEYFRAMES[0]
  let kfEnd = KEYFRAMES[KEYFRAMES.length - 1]
  
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    if (p >= KEYFRAMES[i].at && p <= KEYFRAMES[i+1].at) {
      kfStart = KEYFRAMES[i]
      kfEnd = KEYFRAMES[i+1]
      break
    }
  }
  
  const segmentLength = kfEnd.at - kfStart.at
  let t = segmentLength === 0 ? 0 : (p - kfStart.at) / segmentLength
  
  // Use cubic ease-in-out to gently settle into keyframes (no sharp path corners)
  const easeT = t * t * (3 - 2 * t)
  
  const pos = new THREE.Vector3().fromArray(kfStart.pos).lerp(new THREE.Vector3().fromArray(kfEnd.pos), easeT)
  const look = new THREE.Vector3().fromArray(kfStart.look).lerp(new THREE.Vector3().fromArray(kfEnd.look), easeT)
  
  return { pos, look }
}

/* ═══════════════════════════════════════════════════
   Orbit math helpers
   ═══════════════════════════════════════════════════ */

function cartesianToSpherical(pos, center) {
  const dx = pos.x - center.x
  const dy = pos.y - center.y
  const dz = pos.z - center.z
  const r = Math.sqrt(dx * dx + dy * dy + dz * dz)
  const theta = Math.atan2(dx, dz) // azimuth
  const phi = Math.acos(THREE.MathUtils.clamp(dy / r, -1, 1)) // polar
  return { r, theta, phi }
}

function sphericalToCartesian(r, theta, phi, center) {
  return new THREE.Vector3(
    center.x + r * Math.sin(phi) * Math.sin(theta),
    center.y + r * Math.cos(phi),
    center.z + r * Math.sin(phi) * Math.cos(theta)
  )
}

/* ═══════════════════════════════════════════════════
   CameraController — tri-mode
   ═══════════════════════════════════════════════════ */

/**
 * Props:
 *   scrollProgress   — 0..1 global scroll
 *   inspectMode      — boolean, orbit controls active
 *   configMode       — boolean, configurator turntable active
 *   configCameraHint — { r, theta, phi } target for category switch
 *   focusTarget      — { pos: [x,y,z], look: [x,y,z] } or null
 *   onFocusComplete  — callback when camera reaches focus target
 */
export default function CameraController({
  inspectMode = false,
  configMode = false,
  configCameraHint = null,
  focusTarget = null,
  onFocusComplete,
}) {
  const { camera, gl } = useThree()

  // Scroll mode refs
  const mouseRef = useRef({ x: 0, y: 0 })
  const smoothMouse = useRef({ x: 0, y: 0 })
  // smoothProgress removed for direct scroll tracking

  // Orbit mode refs
  const orbitCenter = useRef(new THREE.Vector3(0, 0.4, 0))
  const orbitSpherical = useRef({ r: 7, theta: 0, phi: 1.2 })
  const targetSpherical = useRef({ r: 7, theta: 0, phi: 1.2 })
  const isDragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })
  const touchDist = useRef(0)

  // Transition refs
  const isTransitioning = useRef(false)
  const transitionTween = useRef(null)
  const modeRef = useRef({ inspect: inspectMode, config: configMode })

  // Config mode auto-orbit
  const configAutoTheta = useRef(0)

  // Track inspect mode changes
  useEffect(() => {
    const prev = modeRef.current.inspect
    modeRef.current.inspect = inspectMode

    if (inspectMode && !prev) {
      const sph = cartesianToSpherical(camera.position, orbitCenter.current)
      orbitSpherical.current = { ...sph }
      targetSpherical.current = { ...sph }
    }

    if (!inspectMode && prev && !configMode) {
      // Exiting inspect mode — animate back to scroll keyframe
      isTransitioning.current = true
      const scrollProgress = useScrollStore.getState().progress
      const { pos, look } = interpolateKeyframes(scrollProgress)
      const animValues = { px: camera.position.x, py: camera.position.y, pz: camera.position.z }
      if (transitionTween.current) transitionTween.current.kill()
      transitionTween.current = gsap.to(animValues, {
        px: pos.x, py: pos.y, pz: pos.z,
        duration: 0.8,
        ease: 'power2.inOut',
        onUpdate: () => { camera.position.set(animValues.px, animValues.py, animValues.pz); camera.lookAt(look) },
        onComplete: () => { isTransitioning.current = false },
      })
    }
  }, [inspectMode, camera, configMode])

  // Track configMode changes
  useEffect(() => {
    const prev = modeRef.current.config
    modeRef.current.config = configMode

    if (configMode && !prev) {
      // Entering config mode — set up orbit from current position
      orbitCenter.current.set(0, 0.4, 0)
      const sph = cartesianToSpherical(camera.position, orbitCenter.current)
      orbitSpherical.current = { ...sph }
      targetSpherical.current = { r: 7, theta: sph.theta, phi: 1.2 }
      configAutoTheta.current = sph.theta
    }

    if (!configMode && prev) {
      // Exiting config mode — animate back to scroll keyframe
      isTransitioning.current = true
      const scrollProgress = useScrollStore.getState().progress
      const { pos, look } = interpolateKeyframes(scrollProgress)
      const animValues = { px: camera.position.x, py: camera.position.y, pz: camera.position.z }
      if (transitionTween.current) transitionTween.current.kill()
      transitionTween.current = gsap.to(animValues, {
        px: pos.x, py: pos.y, pz: pos.z,
        duration: 0.8,
        ease: 'power2.inOut',
        onUpdate: () => { camera.position.set(animValues.px, animValues.py, animValues.pz); camera.lookAt(look) },
        onComplete: () => { isTransitioning.current = false },
      })
    }
  }, [configMode, camera])

  // Config camera hint changes (category switch)
  useEffect(() => {
    if (!configMode || !configCameraHint) return
    targetSpherical.current = {
      r: configCameraHint.r,
      theta: configCameraHint.theta,
      phi: configCameraHint.phi,
    }
  }, [configCameraHint, configMode])

  // Focus target changes (hotspot clicked)
  useEffect(() => {
    if (!inspectMode || !focusTarget) return

    const targetPos = new THREE.Vector3(...focusTarget.pos)
    const targetLook = new THREE.Vector3(...focusTarget.look)

    isTransitioning.current = true
    const animValues = {
      px: camera.position.x,
      py: camera.position.y,
      pz: camera.position.z,
    }
    if (transitionTween.current) transitionTween.current.kill()
    transitionTween.current = gsap.to(animValues, {
      px: targetPos.x,
      py: targetPos.y,
      pz: targetPos.z,
      duration: 0.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.position.set(animValues.px, animValues.py, animValues.pz)
        camera.lookAt(targetLook)
      },
      onComplete: () => {
        isTransitioning.current = false
        orbitCenter.current.copy(targetLook)
        const sph = cartesianToSpherical(camera.position, orbitCenter.current)
        orbitSpherical.current = { ...sph }
        targetSpherical.current = { ...sph }
        onFocusComplete?.()
      },
    })
  }, [focusTarget, inspectMode, camera, onFocusComplete])

  // Mouse move for parallax (scroll mode)
  useEffect(() => {
    const onMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  // Orbit drag handlers — active in inspectMode & configMode
  useEffect(() => {
    if (!inspectMode && !configMode) return
    const canvas = gl.domElement

    const onPointerDown = (e) => {
      if (isTransitioning.current) return
      isDragging.current = true
      lastPointer.current = { x: e.clientX, y: e.clientY }
      canvas.style.cursor = 'grabbing'
    }

    const onPointerMove = (e) => {
      if (!isDragging.current || isTransitioning.current) return
      const dx = e.clientX - lastPointer.current.x
      const dy = e.clientY - lastPointer.current.y
      lastPointer.current = { x: e.clientX, y: e.clientY }

      targetSpherical.current.theta -= dx * 0.005
      targetSpherical.current.phi = THREE.MathUtils.clamp(
        targetSpherical.current.phi + dy * 0.005, 0.3, Math.PI - 0.3
      )
    }

    const onPointerUp = () => { isDragging.current = false; canvas.style.cursor = 'grab' }

    const onWheel = (e) => {
      if (isTransitioning.current) return
      e.preventDefault()
      targetSpherical.current.r = THREE.MathUtils.clamp(
        targetSpherical.current.r + e.deltaY * 0.005, 2.5, 10
      )
    }

    const onTouchStart = (e) => {
      if (isTransitioning.current) return
      if (e.touches.length === 1) {
        isDragging.current = true
        lastPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      } else if (e.touches.length === 2) {
        isDragging.current = false
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        touchDist.current = Math.sqrt(dx * dx + dy * dy)
      }
    }

    const onTouchMove = (e) => {
      if (isTransitioning.current) return
      if (e.touches.length === 1 && isDragging.current) {
        const dx = e.touches[0].clientX - lastPointer.current.x
        const dy = e.touches[0].clientY - lastPointer.current.y
        lastPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        targetSpherical.current.theta -= dx * 0.005
        targetSpherical.current.phi = THREE.MathUtils.clamp(
          targetSpherical.current.phi + dy * 0.005, 0.3, Math.PI - 0.3
        )
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        const dist = Math.sqrt(dx * dx + dy * dy)
        const delta = touchDist.current - dist
        touchDist.current = dist
        targetSpherical.current.r = THREE.MathUtils.clamp(
          targetSpherical.current.r + delta * 0.02, 2.5, 10
        )
      }
    }

    const onTouchEnd = () => { isDragging.current = false }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointerleave', onPointerUp)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas.addEventListener('touchmove', onTouchMove, { passive: true })
    canvas.addEventListener('touchend', onTouchEnd)
    canvas.style.cursor = 'grab'

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointerleave', onPointerUp)
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
      canvas.style.cursor = ''
    }
  }, [inspectMode, configMode, gl])

  // Frame loop
  useFrame((_, delta) => {
    if (isTransitioning.current) return

    if (configMode) {
      // Config mode — smooth showroom target positioning with mobile framing
      const isMobile = window.innerWidth <= 768
      const rawLook = configCameraHint?.look || [0, 0.35, 0]
      const targetLookX = isMobile ? rawLook[0] : rawLook[0] - 0.15
      const targetLookY = isMobile ? Math.max(-0.1, rawLook[1] - 0.18) : rawLook[1]
      const targetLookZ = rawLook[2]

      orbitCenter.current.x += (targetLookX - orbitCenter.current.x) * 0.06
      orbitCenter.current.y += (targetLookY - orbitCenter.current.y) * 0.06
      orbitCenter.current.z += (targetLookZ - orbitCenter.current.z) * 0.06

      const s = orbitSpherical.current
      const t = targetSpherical.current
      s.r += (t.r - s.r) * 0.05
      s.theta += (t.theta - s.theta) * 0.05
      s.phi += (t.phi - s.phi) * 0.05

      const pos = sphericalToCartesian(s.r, s.theta, s.phi, orbitCenter.current)
      camera.position.copy(pos)
      camera.lookAt(orbitCenter.current)
    } else if (inspectMode) {
      // Orbit mode — smooth interpolation to target spherical coords
      const s = orbitSpherical.current
      const t = targetSpherical.current
      s.r += (t.r - s.r) * 0.08
      s.theta += (t.theta - s.theta) * 0.08
      s.phi += (t.phi - s.phi) * 0.08

      const pos = sphericalToCartesian(s.r, s.theta, s.phi, orbitCenter.current)
      camera.position.copy(pos)
      camera.lookAt(orbitCenter.current)
    } else {
      // Scroll mode — heavy cinematic camera on rails
      const scrollProgress = useScrollStore.getState().progress
      const { pos, look } = interpolateKeyframes(scrollProgress)
      
      const distance = pos.distanceTo(look)
      const parallaxStrength = Math.min(0.6, distance * 0.1)
      
      smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * 0.04
      smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * 0.04
      
      const mx = smoothMouse.current.x * parallaxStrength
      const my = smoothMouse.current.y * parallaxStrength * 0.3
      
      const targetPos = new THREE.Vector3(pos.x + mx, pos.y + my, pos.z)
      
      // Lerp actual camera to target pos to remove bounce and add physical weight
      camera.position.lerp(targetPos, 0.08)
      
      if (!camera.userData.currentLook) {
        camera.userData.currentLook = new THREE.Vector3().copy(look)
      }
      camera.userData.currentLook.lerp(look, 0.08)
      camera.lookAt(camera.userData.currentLook)
    }
  })

  return null
}
