import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { getConfigOption } from '../../config/configData'
import AeroLines from './AeroLines'

const MODEL_PATH = '/mercedes-benz_s63_coupe_brabus_800.glb'

// Preload model asset
useGLTF.preload(MODEL_PATH)

/* ═══════════════════════════════════════════════════
   Exploded view easing & vehicle rotation helpers
   ═══════════════════════════════════════════════════ */

function getExplodeAmount(scrollProgress) {
  if (scrollProgress < 0.26 || scrollProgress > 0.42) return 0
  if (scrollProgress < 0.32) {
    const t = (scrollProgress - 0.26) / 0.06
    return Math.sin((t * Math.PI) / 2) // smooth ease in to 1
  }
  if (scrollProgress <= 0.36) return 1
  // 0.36 -> 0.42 smooth ease out to 0
  const t = (scrollProgress - 0.36) / 0.06
  return Math.cos((t * Math.PI) / 2)
}

function getTargetVehicleRotation(sp) {
  if (sp < 0.12) return null // Hero slow auto-drift
  if (sp < 0.26) {
    // Settle into Machine stable 3/4 angle
    const t = (sp - 0.12) / 0.14
    return THREE.MathUtils.lerp(0.28, 0.24, t)
  }
  if (sp < 0.42) {
    // Settle into straight-ahead wind tunnel pose for Aero engineering
    const t = (sp - 0.26) / 0.16
    return THREE.MathUtils.lerp(0.24, 0.0, t)
  }
  if (sp < 0.56) {
    // Settle into planted aggressive performance stance
    const t = (sp - 0.42) / 0.14
    return THREE.MathUtils.lerp(0.0, -0.06, t)
  }
  if (sp < 0.70) {
    // Interior: vehicle holds steady for precise cockpit camera glide
    const t = (sp - 0.56) / 0.14
    return THREE.MathUtils.lerp(-0.06, 0.0, t)
  }
  if (sp < 0.86) {
    // Technology: stable 3/4 angle for holographic HUD
    const t = (sp - 0.70) / 0.16
    return THREE.MathUtils.lerp(0.0, 0.14, t)
  }
  // Configurator / Finale: settle into hero studio presentation
  const t = Math.min(1, (sp - 0.86) / 0.14)
  return THREE.MathUtils.lerp(0.14, 0.22, t)
}

const _tmpColor = new THREE.Color()
function lerpMaterialColor(material, targetHex, speed = 0.08) {
  if (!material || !material.color) return
  _tmpColor.set(targetHex)
  material.color.lerp(_tmpColor, speed)
}

/* ═══════════════════════════════════════════════════
   Main Realistic Vehicle Component
   ═══════════════════════════════════════════════════ */

export default function CarPlaceholder({
  introProgress = 1,
  scrollProgress = 0,
  inspectMode = false,
  configMode = false,
  vehicleConfig = null,
  ...props
}) {
  const groupRef = useRef()
  const carWrapperRef = useRef()

  // Load realistic GLB model
  const { scene } = useGLTF(MODEL_PATH)

  // Clone scene instance for isolated runtime manipulation
  const clonedScene = useMemo(() => scene.clone(true), [scene])

  // Refs for explodeable components and material groups
  const explodeNodes = useRef({})
  const materialGroups = useRef({
    paint: [],
    rims: [],
    rimBlack: [],
    interiorSeats: [],
    interiorTrim: [],
    glass: [],
    carbon: [],
    headlights: [],
    taillights: [],
  })

  // Target material values for smooth lerping
  const targetBody = useRef({
    color: '#0d0d0d',
    metalness: 0.95,
    roughness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
  })
  const targetWheel = useRef({ color: '#d5d5d5', metalness: 0.98, roughness: 0.12 })
  const targetInterior = useRef({ color: '#111111' })
  const targetGlassTint = useRef('#111111')

  // Light sweep on paint color change
  const sweepLightRef = useRef()
  const sweepProgress = useRef(1)
  const prevExterior = useRef(vehicleConfig?.exterior)
  const headlightBeamRef = useRef()

  // Internal smooth animation refs
  const smoothScroll = useRef(0)
  const autoRotation = useRef(0)

  // Initialize and isolate materials + explodeable nodes
  useEffect(() => {
    if (!clonedScene) return

    const matMap = new Map()
    const mats = {
      paint: [],
      rims: [],
      rimBlack: [],
      interiorSeats: [],
      interiorTrim: [],
      glass: [],
      carbon: [],
      headlights: [],
      taillights: [],
    }
    const nodes = {}

    // Find and map nodes & materials
    clonedScene.traverse((child) => {
      // Explodeable / movable nodes
      const nName = child.name
      if (nName === 's63amg21_hood_cf') nodes.hood = { node: child, basePos: child.position.clone() }
      if (nName === 's63amg21_roof_cf') nodes.roof = { node: child, basePos: child.position.clone() }
      if (nName === 's63amg21_door_L_cf') nodes.doorL = { node: child, basePos: child.position.clone() }
      if (nName === 's63amg21_door_R_cf') nodes.doorR = { node: child, basePos: child.position.clone() }
      if (nName === 's63amg21_trunk') nodes.trunk = { node: child, basePos: child.position.clone() }
      if (nName === 's63amg21_spoiler_d') nodes.spoiler = { node: child, basePos: child.position.clone() }
      if (nName === 's63amg21_bumper_F_lip_a2') nodes.lip = { node: child, basePos: child.position.clone() }
      if (nName === 's63amg21_diffusor_b') nodes.diffuser = { node: child, basePos: child.position.clone() }

      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true

        // Clone material so this instance has unique isolated shaders
        if (child.material) {
          if (!matMap.has(child.material)) {
            let clonedMat = child.material.clone()
            const mName = clonedMat.name

            // 1. Body Paint Materials
            if (mName === 'S63_Coloured' || mName === 'S63_Coloured.001' || mName === 'S63_Base') {
              // Upgrade to physical material for clearcoat brilliance
              clonedMat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color('#0d0d0d'),
                metalness: 0.95,
                roughness: 0.15,
                clearcoat: 1.0,
                clearcoatRoughness: 0.04,
                envMapIntensity: 1.8,
                reflectivity: 1.0,
                name: mName,
              })
              mats.paint.push(clonedMat)
            }
            // 2. Wheel Rims
            else if (mName === 'Brabus_rim_specmap' || mName === 'brabus_rim_logo') {
              clonedMat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color('#d5d5d5'),
                metalness: 0.98,
                roughness: 0.12,
                clearcoat: 0.6,
                envMapIntensity: 1.8,
                name: mName,
              })
              mats.rims.push(clonedMat)
            } else if (mName === 'brabus_black') {
              clonedMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color('#161616'),
                metalness: 0.9,
                roughness: 0.25,
                envMapIntensity: 1.2,
                name: mName,
              })
              mats.rimBlack.push(clonedMat)
            }
            // 3. Interior Leathers
            else if (mName === 'S63_InteriorColourZone' || mName === 'S63_InteriorTillingColourZone') {
              clonedMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color('#111111'),
                metalness: 0.1,
                roughness: 0.75,
                envMapIntensity: 0.8,
                name: mName,
              })
              mats.interiorSeats.push(clonedMat)
            } else if (
              mName === 'S63_Interior_Zone1' ||
              mName === 'S63_Interior_Zone2' ||
              mName === 'S63_InteriorA' ||
              mName === 'S63_InteriorA_Zone1' ||
              mName === 'S63_InteriorA_Zone2' ||
              mName === 'S63_Interior'
            ) {
              clonedMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color('#181818'),
                metalness: 0.2,
                roughness: 0.8,
                envMapIntensity: 0.6,
                name: mName,
              })
              mats.interiorTrim.push(clonedMat)
            }
            // 4. Glass & Windows
            else if (mName === 's63amg21_glass_int' || mName === 's63amg21_glass') {
              clonedMat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color('#111111'),
                metalness: 0.1,
                roughness: 0.05,
                transmission: 0.65,
                thickness: 0.2,
                transparent: true,
                opacity: 0.65,
                envMapIntensity: 2.0,
                name: mName,
              })
              mats.glass.push(clonedMat)
            }
            // 5. Carbon Fiber
            else if (mName === 'S63_Carbon1' || mName === 'S63_Carbon1.001') {
              clonedMat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color('#151515'),
                metalness: 0.85,
                roughness: 0.2,
                clearcoat: 0.9,
                clearcoatRoughness: 0.08,
                envMapIntensity: 1.4,
                name: mName,
              })
              mats.carbon.push(clonedMat)
            }
            // 6. Lights
            else if (
              mName === 's63amg21_headlight' ||
              mName === 's63amg21_runninglight.001' ||
              mName === 's63amg21_foglight' ||
              mName === 'S63_Light.001'
            ) {
              clonedMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color('#ffffff'),
                emissive: new THREE.Color('#ffffff'),
                emissiveIntensity: 0.6,
                metalness: 0.8,
                roughness: 0.2,
                name: mName,
              })
              mats.headlights.push(clonedMat)
            } else if (
              mName === 's63amg21_taillight' ||
              mName === 's63amg21_runninglight' ||
              mName === 'S63_Light' ||
              mName === 's63amg21_chmsl'
            ) {
              clonedMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color('#ca0015'),
                emissive: new THREE.Color('#ff1a1a'),
                emissiveIntensity: 0.8,
                metalness: 0.8,
                roughness: 0.2,
                name: mName,
              })
              mats.taillights.push(clonedMat)
            }

            matMap.set(child.material, clonedMat)
          }
          child.material = matMap.get(child.material)
        }
      }
    })

    explodeNodes.current = nodes
    materialGroups.current = mats
  }, [clonedScene])

  // Apply configurator changes to targets
  useEffect(() => {
    if (!vehicleConfig) return

    if (prevExterior.current && prevExterior.current !== vehicleConfig.exterior) {
      sweepProgress.current = 0 // trigger light sweep
    }
    prevExterior.current = vehicleConfig.exterior

    // 1. Exterior Paint
    const ext = getConfigOption('exterior', vehicleConfig.exterior)
    if (ext) {
      targetBody.current = {
        color: ext.color,
        metalness: ext.metalness,
        roughness: ext.roughness,
        clearcoat: ext.clearcoat,
        clearcoatRoughness: ext.clearcoatRoughness,
      }
    }

    // 2. Wheels
    if (vehicleConfig.wheels === 'aero') {
      targetWheel.current = { color: '#161616', metalness: 0.95, roughness: 0.25 }
    } else if (vehicleConfig.wheels === 'sport') {
      targetWheel.current = { color: '#d8d8d8', metalness: 0.98, roughness: 0.12 }
    } else if (vehicleConfig.wheels === 'carbon') {
      targetWheel.current = { color: '#1e1e1e', metalness: 0.88, roughness: 0.2 }
    }

    // 3. Interior
    const intr = getConfigOption('interior', vehicleConfig.interior)
    if (intr) {
      targetInterior.current = { color: intr.seatColor }
      targetGlassTint.current = intr.glassTint
    }
  }, [vehicleConfig])

  const isInteractive = inspectMode || configMode

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // ── Paint change light-sweep animation ──
    if (sweepProgress.current < 1) {
      sweepProgress.current += delta * 1.6
      if (sweepLightRef.current) {
        const z = THREE.MathUtils.lerp(-3.5, 3.5, sweepProgress.current)
        sweepLightRef.current.position.set(0, 1.6, z)
        const sinPeak = Math.sin(sweepProgress.current * Math.PI)
        sweepLightRef.current.intensity = sinPeak * 45
      }
    } else if (sweepLightRef.current && sweepLightRef.current.intensity > 0) {
      sweepLightRef.current.intensity = 0
    }

    // ── Smooth material color lerping ──
    const mats = materialGroups.current
    if (mats.paint.length > 0) {
      mats.paint.forEach((m) => {
        lerpMaterialColor(m, targetBody.current.color)
        m.metalness += (targetBody.current.metalness - m.metalness) * 0.08
        m.roughness += (targetBody.current.roughness - m.roughness) * 0.08
        if (m.clearcoat !== undefined) {
          m.clearcoat += (targetBody.current.clearcoat - m.clearcoat) * 0.08
          m.clearcoatRoughness += (targetBody.current.clearcoatRoughness - m.clearcoatRoughness) * 0.08
        }
      })
    }
    if (mats.rims.length > 0) {
      mats.rims.forEach((m) => {
        lerpMaterialColor(m, targetWheel.current.color)
        m.metalness += (targetWheel.current.metalness - m.metalness) * 0.08
        m.roughness += (targetWheel.current.roughness - m.roughness) * 0.08
      })
    }
    if (mats.interiorSeats.length > 0) {
      mats.interiorSeats.forEach((m) => {
        lerpMaterialColor(m, targetInterior.current.color)
      })
    }
    if (mats.glass.length > 0) {
      mats.glass.forEach((m) => {
        lerpMaterialColor(m, targetGlassTint.current)
      })
    }

    // ── Finale Headlight Ignition ──
    smoothScroll.current += (scrollProgress - smoothScroll.current) * 0.06
    const sp = smoothScroll.current
    const isFinalScene = sp > 0.86 && !isInteractive
    const headlightPower = isFinalScene ? Math.min(1, (sp - 0.86) / 0.08) : 0

    if (mats.headlights.length > 0) {
      mats.headlights.forEach((m) => {
        m.emissiveIntensity = 0.6 + headlightPower * 4.0
      })
    }
    if (headlightBeamRef.current) {
      headlightBeamRef.current.intensity = headlightPower * 35
    }

    // ── Rotation / Motion Choreography ──
    if (isInteractive) {
      if (configMode) {
        autoRotation.current += (0 - autoRotation.current) * 0.02
      } else {
        autoRotation.current += (0 - autoRotation.current) * 0.04
      }
      groupRef.current.rotation.y = autoRotation.current

      // Reset exploded panels
      const nodes = explodeNodes.current
      if (nodes.hood) nodes.hood.node.position.lerp(nodes.hood.basePos, 0.08)
      if (nodes.roof) nodes.roof.node.position.lerp(nodes.roof.basePos, 0.08)
      if (nodes.doorL) nodes.doorL.node.position.lerp(nodes.doorL.basePos, 0.08)
      if (nodes.doorR) nodes.doorR.node.position.lerp(nodes.doorR.basePos, 0.08)
      if (nodes.trunk) nodes.trunk.node.position.lerp(nodes.trunk.basePos, 0.08)
      if (nodes.spoiler) nodes.spoiler.node.position.lerp(nodes.spoiler.basePos, 0.08)
      if (nodes.lip) nodes.lip.node.position.lerp(nodes.lip.basePos, 0.08)
      if (nodes.diffuser) nodes.diffuser.node.position.lerp(nodes.diffuser.basePos, 0.08)
      return
    }

    const targetY = getTargetVehicleRotation(sp)
    if (targetY === null) {
      autoRotation.current += delta * 0.035
      groupRef.current.rotation.y = autoRotation.current
    } else {
      autoRotation.current += (targetY - autoRotation.current) * 0.04
      groupRef.current.rotation.y = autoRotation.current
    }

    // ── Exploded Aerodynamics Animation ──
    const explode = getExplodeAmount(sp)
    const e = explode * 0.85
    const nodes = explodeNodes.current

    if (nodes.hood) {
      nodes.hood.node.position.y = nodes.hood.basePos.y + e * 0.7
      nodes.hood.node.position.z = nodes.hood.basePos.z - e * 0.4
    }
    if (nodes.roof) {
      nodes.roof.node.position.y = nodes.roof.basePos.y + e * 0.9
    }
    if (nodes.doorL) {
      nodes.doorL.node.position.x = nodes.doorL.basePos.x - e * 0.6
      nodes.doorL.node.position.y = nodes.doorL.basePos.y + e * 0.1
    }
    if (nodes.doorR) {
      nodes.doorR.node.position.x = nodes.doorR.basePos.x + e * 0.6
      nodes.doorR.node.position.y = nodes.doorR.basePos.y + e * 0.1
    }
    if (nodes.trunk) {
      nodes.trunk.node.position.y = nodes.trunk.basePos.y + e * 0.6
      nodes.trunk.node.position.z = nodes.trunk.basePos.z + e * 0.4
    }
    if (nodes.spoiler) {
      nodes.spoiler.node.position.y = nodes.spoiler.basePos.y + e * 0.8
      nodes.spoiler.node.position.z = nodes.spoiler.basePos.z + e * 0.5
    }
    if (nodes.lip) {
      nodes.lip.node.position.z = nodes.lip.basePos.z - e * 0.3
    }
    if (nodes.diffuser) {
      nodes.diffuser.node.position.z = nodes.diffuser.basePos.z + e * 0.3
    }
  })

  return (
    <group
      ref={groupRef}
      {...props}
      scale={introProgress}
      position={[0, 0, 0]}
      dispose={null}
    >
      <primitive ref={carWrapperRef} object={clonedScene} />

      {/* ── Synchronized Vehicle-Local Aerodynamic Streamlines ── */}
      <AeroLines scrollProgress={scrollProgress} />

      {/* ── Contact Shadow Grounding Disc ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0.06]}>
        <planeGeometry args={[2.4, 5.2]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </mesh>

      {/* ── Dynamic paint-change light sweep ── */}
      <pointLight
        ref={sweepLightRef}
        position={[0, 1.6, -3.5]}
        color="#ffffff"
        intensity={0}
        distance={7}
        decay={2}
      />

      {/* ── Final Scene Headlight Beam Projection ── */}
      <spotLight
        ref={headlightBeamRef}
        position={[0, 0.65, -1.95]}
        target-position={[0, 0, -8]}
        angle={0.65}
        penumbra={0.8}
        intensity={0}
        color="#edf4ff"
        distance={16}
        decay={2}
      />
    </group>
  )
}
