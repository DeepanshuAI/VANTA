import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Hotspot definitions — each maps to a vehicle feature.
 * Positions are in the car's local coordinate space.
 * focusPos/focusLook define where the camera goes on click.
 */
export const HOTSPOT_DATA = [
  {
    id: 'headlights',
    label: 'Headlights',
    position: [0, 0.65, -1.95],
    focusPos: [0.8, 0.9, -3.8],
    focusLook: [0, 0.65, -1.9],
    title: 'Multibeam LED System',
    desc: 'Intelligent high-beam assist with 84 individually controllable LEDs per headlamp and Swarovski crystal daytime running light accents.',
    spec: '84 High-Precision LEDs',
  },
  {
    id: 'wheels',
    label: 'Wheels',
    position: [1.0, 0.35, -1.45],
    focusPos: [2.8, 0.5, -1.45],
    focusLook: [1.0, 0.35, -1.45],
    title: '21" Brabus Monoblock',
    desc: 'High-tech forged alloy wheels wrapped in ultra-high-performance tires with carbon-ceramic brake assemblies and red sport calipers.',
    spec: '420mm Carbon-Ceramic',
  },
  {
    id: 'aero',
    label: 'Aerodynamics',
    position: [0, 0.95, 2.22],
    focusPos: [1.6, 1.8, 4.0],
    focusLook: [0, 0.9, 2.2],
    title: 'Carbon Aero Package',
    desc: 'Aerodynamically optimized clear-coated exposed carbon-fiber components including front spoiler, side skirts, rear diffuser, and decklid wing.',
    spec: 'Exposed Carbon Weave',
  },
  {
    id: 'side',
    label: 'Side Profile',
    position: [-1.02, 0.65, 0],
    focusPos: [-4.2, 1.1, 0.2],
    focusLook: [0, 0.65, 0],
    title: 'Pillarless Coupe Stance',
    desc: 'Sculpted muscular flank architecture with pillarless greenhouse design, acoustic glass, and signature Brabus illuminated carbon badges.',
    spec: '5,027 mm Length',
  },
  {
    id: 'rear',
    label: 'Rear',
    position: [0, 0.68, 2.38],
    focusPos: [0, 1.1, 4.8],
    focusLook: [0, 0.68, 2.3],
    title: 'OLED Taillights & Exhaust',
    desc: '66 ultra-flat OLED wafer tail lights paired with a lightweight titanium sport exhaust featuring active butterfly flap sound management.',
    spec: 'Quad Titanium Exhaust',
  },
]

/**
 * Individual hotspot marker — pulsing ring with Html label.
 */
function HotspotMarker({ data, onSelect, activeId }) {
  const meshRef = useRef()
  const ringRef = useRef()
  const isActive = activeId === data.id
  const hoverRef = useRef(false)

  const rippleRef = useRef()

  useFrame((state) => {
    if (!ringRef.current) return
    const t = state.clock.elapsedTime
    // Primary pulse scale
    const pulse = 1 + Math.sin(t * 3.0 + data.position[0]) * 0.15
    ringRef.current.scale.setScalar(isActive ? 1.5 : hoverRef.current ? 1.35 : pulse)
    ringRef.current.rotation.z = t * 0.4

    // Secondary expanding ripple ring
    if (rippleRef.current) {
      const ripPhase = (t * 1.5 + data.position[1]) % 1
      rippleRef.current.scale.setScalar(1 + ripPhase * 1.8)
      rippleRef.current.material.opacity = (1 - ripPhase) * (isActive ? 0.8 : 0.4)
    }
  })

  return (
    <group position={data.position}>
      {/* Invisible sphere for easier raycasting */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(data)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          hoverRef.current = true
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          hoverRef.current = false
          document.body.style.cursor = ''
        }}
      >
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Secondary expanding ripple */}
      <mesh ref={rippleRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.09, 24]} />
        <meshBasicMaterial
          color={isActive ? '#ffffff' : '#4488ff'}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Pulsing ring */}
      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.07, 0.09, 24]} />
          <meshBasicMaterial
            color={isActive ? '#ffffff' : '#4488ff'}
            transparent
            opacity={isActive ? 0.95 : 0.75}
            side={THREE.DoubleSide}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {/* Inner dot */}
        <mesh>
          <sphereGeometry args={[0.032, 12, 12]} />
          <meshBasicMaterial
            color={isActive ? '#ffffff' : '#5599ff'}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Label with Tap to Inspect micro-tag */}
      <Html
        position={[0, 0.28, 0]}
        center
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          opacity: isActive ? 1 : 0.85,
          transition: 'all 0.3s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            background: 'rgba(10, 10, 14, 0.65)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${isActive ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '12px',
            padding: '3px 8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '8px',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: isActive ? '#ffffff' : '#dcdcdc',
            }}
          >
            {data.label}
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '6.5px',
              fontWeight: 400,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#88aaff',
            }}
          >
            Tap to Inspect
          </span>
        </div>
      </Html>
    </group>
  )
}

/**
 * Hotspots — interactive markers on the vehicle.
 * Only rendered when inspectMode is active.
 */
export default function Hotspots({ inspectMode, onSelect, activeHotspotId }) {
  if (!inspectMode) return null

  return (
    <group>
      {HOTSPOT_DATA.map((data) => (
        <HotspotMarker
          key={data.id}
          data={data}
          onSelect={onSelect}
          activeId={activeHotspotId}
        />
      ))}
    </group>
  )
}
