import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Aerodynamics Airflow Visualization — Vehicle-Local Coordinates.
 *
 * Defined in the exact local coordinate space of the realistic vehicle:
 *   - Z: -2.35 (front bumper) -> +2.48 (rear diffuser)
 *   - Y: 0.0 (ground) -> 1.34 (roof peak)
 *   - X: -1.0 (left flank) -> +1.0 (right flank)
 *
 * Placed inside the vehicle's rotated local group so all airflow curves
 * automatically rotate, move, and scale with the vehicle 1:1.
 */

const LOCAL_FLOW_PATHS = [
  // 1. Centerline Streamline (Splitter -> Hood -> Windshield -> Roof -> Spoiler -> Wake)
  {
    points: [
      [0, 0.22, -3.2],
      [0, 0.42, -2.35],
      [0, 0.82, -1.45],
      [0, 1.10, -0.45],
      [0, 1.34, 0.6],
      [0, 1.20, 1.5],
      [0, 0.94, 2.25],
      [0, 0.80, 3.8],
    ],
    color: '#4da6ff',
    speed: 1.4,
    radius: 0.014,
  },
  // 2. Left Hood & Greenhouse Line (Left Intake -> Headlight -> A-Pillar -> C-Pillar -> Wake)
  {
    points: [
      [-0.55, 0.32, -3.2],
      [-0.65, 0.65, -1.95],
      [-0.62, 0.85, -1.35],
      [-0.56, 1.12, -0.4],
      [-0.52, 1.32, 0.7],
      [-0.60, 1.04, 1.6],
      [-0.72, 0.86, 2.3],
      [-0.82, 0.78, 3.8],
    ],
    color: '#3b82f6',
    speed: 1.2,
    radius: 0.012,
  },
  // 3. Right Hood & Greenhouse Line (Right Intake -> Headlight -> A-Pillar -> C-Pillar -> Wake)
  {
    points: [
      [0.55, 0.32, -3.2],
      [0.65, 0.65, -1.95],
      [0.62, 0.85, -1.35],
      [0.56, 1.12, -0.4],
      [0.52, 1.32, 0.7],
      [0.60, 1.04, 1.6],
      [0.72, 0.86, 2.3],
      [0.82, 0.78, 3.8],
    ],
    color: '#3b82f6',
    speed: 1.2,
    radius: 0.012,
  },
  // 4. Left Flank & Haunch Streamline (Fender Vent -> Door Channel -> Rear Fender -> Diffuser)
  {
    points: [
      [-1.12, 0.32, -3.0],
      [-1.02, 0.52, -1.5],
      [-0.96, 0.62, 0.0],
      [-1.02, 0.70, 1.3],
      [-0.94, 0.62, 2.35],
      [-0.82, 0.52, 3.8],
    ],
    color: '#60a5fa',
    speed: 1.5,
    radius: 0.011,
  },
  // 5. Right Flank & Haunch Streamline (Fender Vent -> Door Channel -> Rear Fender -> Diffuser)
  {
    points: [
      [1.12, 0.32, -3.0],
      [1.02, 0.52, -1.5],
      [0.96, 0.62, 0.0],
      [1.02, 0.70, 1.3],
      [0.94, 0.62, 2.35],
      [0.82, 0.52, 3.8],
    ],
    color: '#60a5fa',
    speed: 1.5,
    radius: 0.011,
  },
  // 6. Underbody Ground-Effect Venturi Tunnel
  {
    points: [
      [0, 0.08, -3.0],
      [0, 0.06, -1.5],
      [0, 0.06, 0.0],
      [0, 0.08, 1.5],
      [0, 0.16, 2.4],
      [0, 0.26, 3.8],
    ],
    color: '#2563eb',
    speed: 1.8,
    radius: 0.013,
  },
  // 7. Lower Front Splitter Vortex Left
  {
    points: [
      [-0.85, 0.15, -2.6],
      [-0.95, 0.22, -1.8],
      [-0.98, 0.25, -0.5],
      [-0.96, 0.22, 1.2],
      [-0.90, 0.26, 2.4],
      [-0.80, 0.32, 3.6],
    ],
    color: '#38bdf8',
    speed: 1.3,
    radius: 0.010,
  },
  // 8. Lower Front Splitter Vortex Right
  {
    points: [
      [0.85, 0.15, -2.6],
      [0.95, 0.22, -1.8],
      [0.98, 0.25, -0.5],
      [0.96, 0.22, 1.2],
      [0.90, 0.26, 2.4],
      [0.80, 0.32, 3.6],
    ],
    color: '#38bdf8',
    speed: 1.3,
    radius: 0.010,
  },
]

function createFlowCurve(points) {
  return new THREE.CatmullRomCurve3(
    points.map((p) => new THREE.Vector3(...p)),
    false,
    'catmullrom',
    0.3
  )
}

function FlowLine({ curve, color, speed, radius, opacity }) {
  const meshRef = useRef()
  const matRef = useRef()
  const flowOffset = useRef(Math.random() * 10)

  const geometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 72, radius, 8, false)
  }, [curve, radius])

  useFrame((_, delta) => {
    if (!matRef.current) return
    flowOffset.current += delta * speed
    // Subtle pulse
    const pulse = 0.85 + Math.sin(flowOffset.current * 3) * 0.15
    matRef.current.opacity = opacity * pulse * 0.75
  })

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial
        ref={matRef}
        color={color}
        transparent
        opacity={opacity * 0.75}
        side={THREE.DoubleSide}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}

export default function AeroLines({ scrollProgress = 0 }) {
  const curves = useMemo(
    () =>
      LOCAL_FLOW_PATHS.map((fp) => ({
        ...fp,
        curve: createFlowCurve(fp.points),
      })),
    []
  )

  // Visibility timing:
  // Fades in smoothly as car stabilizes at 0.27 -> 0.30
  // Holds solid 0.30 -> 0.38
  // Fades out smoothly 0.38 -> 0.42
  const opacity = useMemo(() => {
    if (scrollProgress < 0.26 || scrollProgress > 0.43) return 0
    if (scrollProgress < 0.30) return (scrollProgress - 0.26) / 0.04
    if (scrollProgress <= 0.38) return 1
    return 1 - (scrollProgress - 0.38) / 0.05
  }, [scrollProgress])

  if (opacity <= 0) return null

  return (
    <group name="vehicle-aero-lines">
      {curves.map((item, i) => (
        <FlowLine
          key={i}
          curve={item.curve}
          color={item.color}
          speed={item.speed}
          radius={item.radius}
          opacity={opacity}
        />
      ))}
    </group>
  )
}
