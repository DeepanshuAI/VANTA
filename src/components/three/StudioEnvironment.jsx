import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Reflective ground plane for the studio environment.
 */
export function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshPhysicalMaterial
        color="#080808"
        metalness={0.6}
        roughness={0.35}
        envMapIntensity={0.5}
      />
    </mesh>
  )
}

/**
 * Dramatic studio lighting rig.
 * Three-point lighting + dual side rims + accent fills.
 */
export function StudioLighting({ intensity = 1 }) {
  return (
    <group>
      {/* Key light — high front-left */}
      <spotLight
        position={[-6, 8, -4]}
        angle={0.38}
        penumbra={0.8}
        intensity={95 * intensity}
        color="#edf2ff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />

      {/* Fill light — softer, front-right */}
      <spotLight
        position={[5, 6, -3]}
        angle={0.5}
        penumbra={1}
        intensity={28 * intensity}
        color="#d8e0f0"
      />

      {/* Rear Rim light — behind, creates edge definition */}
      <spotLight
        position={[0, 6, 6.5]}
        angle={0.42}
        penumbra={0.75}
        intensity={85 * intensity}
        color="#d5dff5"
      />

      {/* Left flank rim light — sharp vehicle contour line */}
      <spotLight
        position={[-7, 3.5, 0]}
        angle={0.45}
        penumbra={0.8}
        intensity={40 * intensity}
        color="#c8d8f8"
      />

      {/* Right flank rim light — sharp vehicle contour line */}
      <spotLight
        position={[7, 3.5, 0]}
        angle={0.45}
        penumbra={0.8}
        intensity={40 * intensity}
        color="#c8d8f8"
      />

      {/* Top accent — overhead studio softbox wash */}
      <pointLight
        position={[0, 9, 0]}
        intensity={20 * intensity}
        color="#e0e8f8"
        distance={25}
        decay={2}
      />

      {/* Low fills for wheel and underside visibility */}
      <pointLight
        position={[-4, 0.6, -1.5]}
        intensity={6 * intensity}
        color="#b0c0d8"
        distance={10}
        decay={2}
      />
      <pointLight
        position={[4, 0.6, 1.5]}
        intensity={6 * intensity}
        color="#b0c0d8"
        distance={10}
        decay={2}
      />

      {/* Ambient — subtle neutral base */}
      <ambientLight intensity={0.25 * intensity} color="#8590a5" />
    </group>
  )
}

/**
 * Floating atmospheric particles.
 * Subtle dust motes catching light in the studio space.
 */
export function Particles({ count = 120 }) {
  const meshRef = useRef()

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sz = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = Math.random() * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
      sz[i] = Math.random() * 0.03 + 0.01
    }
    return [pos, sz]
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return
    const posArray = meshRef.current.geometry.attributes.position.array
    const time = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Gentle drift
      posArray[i3] += Math.sin(time * 0.1 + i * 0.5) * 0.001
      posArray[i3 + 1] += Math.sin(time * 0.15 + i * 0.3) * 0.0008
      posArray[i3 + 2] += Math.cos(time * 0.1 + i * 0.7) * 0.001

      // Wrap Y
      if (posArray[i3 + 1] > 8) posArray[i3 + 1] = 0
      if (posArray[i3 + 1] < 0) posArray[i3 + 1] = 8
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ffffff"
        transparent
        opacity={0.25}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
