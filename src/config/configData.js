/**
 * Vehicle configuration data — single source of truth.
 *
 * When swapping in a real .glb model, map the model's material slot names
 * to these config entries. The configurator UI + camera logic stays untouched.
 */

export const EXTERIOR_COLORS = [
  {
    id: 'obsidian-black',
    label: 'Obsidian Black',
    color: '#0d0d0d',
    metalness: 0.95,
    roughness: 0.15,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
  },
  {
    id: 'titanium-silver',
    label: 'Titanium Silver',
    color: '#8a8a8a',
    metalness: 0.92,
    roughness: 0.2,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
  },
  {
    id: 'pearl-white',
    label: 'Pearl White',
    color: '#e8e4df',
    metalness: 0.6,
    roughness: 0.25,
    clearcoat: 0.9,
    clearcoatRoughness: 0.08,
  },
  {
    id: 'deep-blue',
    label: 'Deep Blue',
    color: '#0a1628',
    metalness: 0.9,
    roughness: 0.18,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
  },
]

export const WHEEL_STYLES = [
  {
    id: 'aero',
    label: 'Aero',
    spokeCount: 0,
    rimColor: '#1a1a1a',
    desc: 'Closed aerodynamic covers for maximum efficiency',
  },
  {
    id: 'sport',
    label: 'Sport',
    spokeCount: 5,
    rimColor: '#0a0a0a',
    desc: '21" 5-spoke forged alloy wheels',
  },
  {
    id: 'carbon',
    label: 'Carbon',
    spokeCount: 7,
    rimColor: '#151515',
    desc: '21" 7-spoke carbon fiber composite',
  },
]

export const INTERIOR_TRIMS = [
  {
    id: 'black',
    label: 'Black',
    seatColor: '#0a0a0a',
    trimColor: '#111111',
    glassTint: '#111111',
    desc: 'Full black Alcantara with piano black accents',
  },
  {
    id: 'tan',
    label: 'Tan',
    seatColor: '#8b6914',
    trimColor: '#5a4a2f',
    glassTint: '#1a1510',
    desc: 'Natural tan leather with dark walnut inlays',
  },
  {
    id: 'carbon',
    label: 'Carbon',
    seatColor: '#1a1a1a',
    trimColor: '#2a2a2a',
    glassTint: '#0e0e0e',
    desc: 'Carbon weave seats with titanium hardware',
  },
]

export const DEFAULT_CONFIG = {
  exterior: 'obsidian-black',
  wheels: 'sport',
  interior: 'black',
}

/**
 * Camera angle hints per configurator category.
 * Used by CameraController to focus on specific features during configuration.
 */
export const CONFIG_CAMERA_HINTS = {
  exterior: {
    r: 6.4,
    theta: 0.45,
    phi: 1.24,
    look: [0, 0.3, 0],
  },
  wheels: {
    r: 4.2,
    theta: 1.32,
    phi: 1.44,
    look: [-0.5, 0.15, -0.6],
  },
  interior: {
    r: 3.2,
    theta: 0.35,
    phi: 1.08,
    look: [0, 0.55, 0.1],
  },
}

/** Helper: look up a config option by category + id */
export function getConfigOption(category, id) {
  const map = {
    exterior: EXTERIOR_COLORS,
    wheels: WHEEL_STYLES,
    interior: INTERIOR_TRIMS,
  }
  return map[category]?.find((opt) => opt.id === id) || null
}
