/**
 * Web Audio Synthesizer for tactile luxury automotive sound effects.
 * 100% synthesized — 0 external audio files needed.
 * Muted by default; enabled when the user taps the sound toggle.
 */

let audioCtx = null
let soundEnabled = false

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (AudioContext) {
      audioCtx = new AudioContext()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export function isSoundEnabled() {
  return soundEnabled
}

export function toggleSound(forcedState) {
  soundEnabled = typeof forcedState === 'boolean' ? forcedState : !soundEnabled
  if (soundEnabled) {
    getAudioContext()
    playClick()
  }
  return soundEnabled
}

/** Soft micro-click for buttons & tabs */
export function playClick() {
  if (!soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(800, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.02)

  gain.gain.setValueAtTime(0.06, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start()
  osc.stop(ctx.currentTime + 0.02)
}

/** Resonant low-frequency sub sweep for mode transitions (Showroom/Inspect) */
export function playModeSwitch() {
  if (!soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(140, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.4)

  gain.gain.setValueAtTime(0.12, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start()
  osc.stop(ctx.currentTime + 0.4)
}

/** Swatch paint change sound: crisp metallic shimmer */
export function playPaintSweep() {
  if (!soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'triangle'
  osc.frequency.setValueAtTime(450, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15)
  osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.3)

  gain.gain.setValueAtTime(0.05, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start()
  osc.stop(ctx.currentTime + 0.3)
}

/** Headlight power surge hum for final scene */
export function playHeadlightIgnition() {
  if (!soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(60, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.5)

  gain.gain.setValueAtTime(0.08, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start()
  osc.stop(ctx.currentTime + 0.5)
}
