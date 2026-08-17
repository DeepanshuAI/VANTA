import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import {
  EXTERIOR_COLORS,
  WHEEL_STYLES,
  INTERIOR_TRIMS,
  getConfigOption,
} from '../config/configData'
import MagneticButton from './MagneticButton'

const CATEGORIES = [
  { id: 'exterior', label: 'Exterior' },
  { id: 'wheels', label: 'Wheels' },
  { id: 'interior', label: 'Interior' },
]

/**
 * ConfiguratorUI — Mobile-first luxury showroom glass sheet & desktop drawer.
 */
export default function ConfiguratorUI({
  active,
  vehicleConfig,
  onConfigChange,
  onResetConfig,
  onClose,
  onCategoryChange,
}) {
  const [activeCategory, setActiveCategory] = useState('exterior')
  const [modalType, setModalType] = useState(null) // 'quote' | 'showroom' | null
  const panelRef = useRef(null)
  const optionsRef = useRef(null)
  const modalRef = useRef(null)

  // Support Escape key to close modal or configurator
  useEffect(() => {
    if (!active) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (modalType) {
          setModalType(null)
        } else {
          onClose?.()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [active, modalType, onClose])

  // Panel entrance / exit animation with mobile sheet awareness
  useEffect(() => {
    if (!panelRef.current) return
    const isMobile = window.innerWidth <= 768

    if (active) {
      if (isMobile) {
        gsap.fromTo(
          panelRef.current,
          { y: '100%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 0.5, ease: 'power3.out' }
        )
      } else {
        gsap.fromTo(
          panelRef.current,
          { x: '100%', opacity: 0 },
          { x: '0%', opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.05 }
        )
      }
    } else {
      if (isMobile) {
        gsap.to(panelRef.current, {
          y: '100%',
          opacity: 0,
          duration: 0.35,
          ease: 'power2.in',
        })
      } else {
        gsap.to(panelRef.current, {
          x: '100%',
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
        })
      }
      setModalType(null)
    }
  }, [active])

  // Animate options on category switch
  useEffect(() => {
    if (!optionsRef.current || !active) return
    const items = optionsRef.current.querySelectorAll('.config-option')
    gsap.fromTo(
      items,
      { opacity: 0, scale: 0.95, y: 10 },
      { opacity: 1, scale: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out' }
    )
  }, [activeCategory, active])

  const handleCategorySwitch = useCallback(
    (catId) => {
      setActiveCategory(catId)
      onCategoryChange?.(catId)
    },
    [onCategoryChange]
  )

  const handleOptionClick = useCallback(
    (category, optionId) => {
      onConfigChange?.(category, optionId)
      // When user clicks an option, ensure the camera re-hints to the category focus
      onCategoryChange?.(category)
    },
    [onConfigChange, onCategoryChange]
  )

  if (!active) return null

  const currentOptions =
    activeCategory === 'exterior'
      ? EXTERIOR_COLORS
      : activeCategory === 'wheels'
        ? WHEEL_STYLES
        : INTERIOR_TRIMS

  const selectedId = vehicleConfig?.[activeCategory]
  const currentSelectedOption = currentOptions.find((opt) => opt.id === selectedId)

  // Summary data
  const extOption = getConfigOption('exterior', vehicleConfig?.exterior)
  const whlOption = getConfigOption('wheels', vehicleConfig?.wheels)
  const intOption = getConfigOption('interior', vehicleConfig?.interior)

  const extLabel = extOption?.label || '—'
  const whlLabel = whlOption?.label || '—'
  const intLabel = intOption?.label || '—'

  return (
    <div className="configurator-overlay">
      {/* Panel */}
      <div
        ref={panelRef}
        className="configurator-panel"
        style={{ opacity: 0 }}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Mobile handle indicator */}
        <div className="configurator-drag-handle" />

        {/* Close Button */}
        <button
          className="configurator-close"
          onClick={(e) => {
            e.stopPropagation()
            onClose?.()
          }}
          data-cursor="pointer"
          aria-label="Close configurator"
        >
          ×
        </button>

        {/* Header */}
        <div className="configurator-header">
          <div className="configurator-header-top">
            <span className="text-label" style={{ color: 'var(--color-vanta-chrome)', letterSpacing: '0.22em' }}>
              Bespoke Studio
            </span>
            <div className="configurator-active-pill">
              {currentSelectedOption?.label}
            </div>
          </div>
          <h3 className="configurator-title">
            Tailor Your VANTA
          </h3>
        </div>

        {/* Category Segmented Tabs */}
        <div className="configurator-tabs-wrapper">
          <div className="configurator-tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`configurator-tab ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleCategorySwitch(cat.id)}
                data-cursor="pointer"
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Option Selection Strip */}
        <div ref={optionsRef} className="configurator-options">
          {currentOptions.map((opt) => {
            const isSelected = selectedId === opt.id
            return (
              <button
                key={opt.id}
                className={`config-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleOptionClick(activeCategory, opt.id)}
                data-cursor="pointer"
              >
                {/* Visual Swatch / Wheel Icon */}
                <div className="config-option-swatch-wrap">
                  {activeCategory === 'wheels' ? (
                    <div className="config-option-wheel-icon">
                      <svg viewBox="0 0 24 24" width="28" height="28">
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          fill="none"
                          stroke={isSelected ? '#ffffff' : '#666666'}
                          strokeWidth="1.5"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="4"
                          fill="none"
                          stroke={isSelected ? '#ffffff' : '#666666'}
                          strokeWidth="1"
                        />
                        {opt.spokeCount > 0 &&
                          Array.from({ length: opt.spokeCount }).map((_, i) => {
                            const angle = (i * 360) / opt.spokeCount
                            const rad = (angle * Math.PI) / 180
                            return (
                              <line
                                key={i}
                                x1={12 + 4 * Math.cos(rad)}
                                y1={12 + 4 * Math.sin(rad)}
                                x2={12 + 10 * Math.cos(rad)}
                                y2={12 + 10 * Math.sin(rad)}
                                stroke={isSelected ? '#ffffff' : '#666666'}
                                strokeWidth="1"
                              />
                            )
                          })}
                      </svg>
                    </div>
                  ) : (
                    <div
                      className={`config-option-swatch ${isSelected ? 'selected' : ''}`}
                      style={{
                        backgroundColor: opt.color || opt.seatColor,
                        boxShadow: isSelected
                          ? `0 0 14px ${opt.color || opt.seatColor}88, inset 0 0 4px rgba(255,255,255,0.4)`
                          : 'none',
                      }}
                    />
                  )}
                </div>

                <div className="config-option-info">
                  <span className="config-option-label">{opt.label}</span>
                  {opt.desc && (
                    <span className="config-option-desc">{opt.desc}</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Live Summary Ribbon */}
        <div className="configurator-summary">
          <div className="configurator-summary-header">
            <span className="configurator-summary-title">Specification Summary</span>
            <button
              className="configurator-reset"
              onClick={onResetConfig}
              data-cursor="pointer"
              title="Reset to default build"
            >
              Reset Build
            </button>
          </div>
          <div className="configurator-summary-tags">
            <div className="config-tag">
              <span className="config-tag-label">Paint:</span>
              <span className="config-tag-val">{extLabel}</span>
            </div>
            <div className="config-tag">
              <span className="config-tag-label">Wheels:</span>
              <span className="config-tag-val">{whlLabel}</span>
            </div>
            <div className="config-tag">
              <span className="config-tag-label">Interior:</span>
              <span className="config-tag-val">{intLabel}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="configurator-actions">
          <div className="configurator-cta-group">
            <MagneticButton onClick={() => setModalType('quote')}>
              Request a Quote
            </MagneticButton>
            <MagneticButton onClick={() => setModalType('showroom')}>
              Book a Showroom
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Modal Dialog for Quote / Showroom */}
      {modalType && (
        <div
          ref={modalRef}
          className="config-modal-backdrop"
          onClick={() => setModalType(null)}
        >
          <div
            className="config-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="config-modal-close"
              onClick={() => setModalType(null)}
              data-cursor="pointer"
            >
              ×
            </button>
            <span className="text-label" style={{ color: 'var(--color-vanta-chrome)' }}>
              {modalType === 'quote' ? 'Bespoke Quote' : 'Private Viewing'}
            </span>
            <h3 className="config-modal-title">
              {modalType === 'quote'
                ? 'Your Custom Specification'
                : 'Schedule a Private Experience'}
            </h3>
            <p className="config-modal-desc">
              {modalType === 'quote'
                ? 'Our concierge team will prepare a formal build allocation and pricing proposal for your customized VANTA.'
                : 'Experience the VANTA in person at our flagship studio with an automotive engineer.'}
            </p>

            <div className="config-modal-spec-box">
              <div className="config-modal-spec-item">
                <span>Exterior Paint</span>
                <strong>{extLabel}</strong>
              </div>
              <div className="config-modal-spec-item">
                <span>Wheel Configuration</span>
                <strong>{whlLabel}</strong>
              </div>
              <div className="config-modal-spec-item">
                <span>Interior Tailoring</span>
                <strong>{intLabel}</strong>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <MagneticButton onClick={() => setModalType(null)}>
                Confirm & Submit
              </MagneticButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
