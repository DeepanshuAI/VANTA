import { useMemo } from 'react'
import { Html } from '@react-three/drei'

/**
 * Floating technical UI labels positioned in 3D space around the car.
 * Visible during the Technology section scroll range (~0.70–0.85).
 */

const TECH_ITEMS = [
  {
    label: 'Neural Adaptive Damping',
    position: [-1.3, 0.35, -1.4],
    detail: 'Active Body Control • 1000Hz',
  },
  {
    label: 'Dual Widescreen Cockpit',
    position: [-0.45, 1.25, -0.4],
    detail: '12.3" OLED Digital Clusters',
  },
  {
    label: 'V2X Telemetry Network',
    position: [1.35, 0.85, 0.6],
    detail: '5G • Vehicle-to-Cloud Node',
  },
  {
    label: 'Keyless Touch Recognition',
    position: [-1.18, 0.78, 0.2],
    detail: 'Capacitive Flush Handles',
  },
  {
    label: 'Drive Pilot Level 3',
    position: [0.0, 1.48, -1.6],
    detail: 'LiDAR • Radar • Stereo Vision',
  },
]

function TechLabel({ item, opacity }) {
  return (
    <Html
      position={item.position}
      center
      style={{
        opacity,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '4px',
          padding: '10px 14px',
          background: 'rgba(10, 10, 10, 0.7)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '2px',
          minWidth: '160px',
          whiteSpace: 'nowrap',
        }}
      >
        {/* Connection dot */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '-6px',
            transform: 'translateY(-50%)',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: '#4488ff',
            boxShadow: '0 0 8px rgba(68, 136, 255, 0.6)',
          }}
        />
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '9px',
            fontWeight: 500,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#e0e0e0',
          }}
        >
          {item.label}
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '8px',
            fontWeight: 300,
            color: '#8a8a8a',
            letterSpacing: '0.05em',
          }}
        >
          {item.detail}
        </span>
      </div>
    </Html>
  )
}

export default function TechOverlays({ scrollProgress = 0 }) {
  // Visibility: fade in 0.72→0.76, fade out 0.83→0.87
  const opacity = useMemo(() => {
    if (scrollProgress < 0.72) return 0
    if (scrollProgress < 0.76) return (scrollProgress - 0.72) / 0.04
    if (scrollProgress < 0.83) return 1
    if (scrollProgress < 0.87) return 1 - (scrollProgress - 0.83) / 0.04
    return 0
  }, [scrollProgress])

  if (opacity <= 0) return null

  return (
    <group>
      {TECH_ITEMS.map((item, i) => (
        <TechLabel
          key={i}
          item={item}
          opacity={opacity * (0.6 + i * 0.1)} // staggered opacity
        />
      ))}
    </group>
  )
}
