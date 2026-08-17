import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toggleSound, isSoundEnabled, playClick, playModeSwitch } from '../utils/audio'

const NAV_ITEMS = ['Experience', 'Technology', 'Configure', 'Contact']

export default function Navigation({ visible, onOpenShowroom }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [soundOn, setSoundOn] = useState(isSoundEnabled())

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSoundToggle = () => {
    const next = toggleSound()
    setSoundOn(next)
  }

  const handleShowroomClick = () => {
    playModeSwitch()
    setMobileOpen(false)
    onOpenShowroom?.()
  }

  return (
    <>
      <motion.nav
        className={`nav-fixed ${scrolled ? 'nav-scrolled' : ''}`}
        initial={{ opacity: 0, y: -20 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      >
        <div className="nav-left">
          <a className="nav-logo" href="#" onClick={playClick}>
            VANTA
          </a>
          <div className="nav-telemetry">
            <span className="nav-telemetry-dot" />
            <span className="nav-telemetry-text">SYS 001 · ONLINE</span>
          </div>
        </div>

        <ul className="nav-links">
          {NAV_ITEMS.map((item) => (
            <li key={item}>
              <a
                className="nav-link"
                href={`#${item.toLowerCase()}`}
                onClick={playClick}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          {/* Sound Toggle Button */}
          <button
            className={`nav-sound-btn ${soundOn ? 'active' : ''}`}
            onClick={handleSoundToggle}
            aria-label={soundOn ? 'Mute sound' : 'Unmute sound'}
            title={soundOn ? 'Mute audio' : 'Enable luxury sound feedback'}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              {soundOn ? (
                <>
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </>
              ) : (
                <>
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </>
              )}
            </svg>
            <span className="nav-sound-label">{soundOn ? 'SOUND ON' : 'SOUND'}</span>
          </button>

          {/* Showroom quick button */}
          <button
            className="nav-showroom-btn"
            onClick={handleShowroomClick}
            data-cursor="pointer"
          >
            Showroom
          </button>

          {/* Mobile menu hamburger */}
          <button
            className={`nav-mobile-toggle ${mobileOpen ? 'active' : ''}`}
            onClick={() => {
              playClick()
              setMobileOpen(!mobileOpen)
            }}
            aria-label="Toggle menu"
          >
            <span />
            <span />
          </button>
        </div>
      </motion.nav>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="nav-mobile-menu open"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.35 }}
          >
            <div className="nav-mobile-content">
              <div className="nav-mobile-telemetry">
                <span className="nav-telemetry-dot" />
                <span>VANTA HYPER-GT · CHASSIS 001</span>
              </div>

              <div className="nav-mobile-links">
                {NAV_ITEMS.map((item, i) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ delay: i * 0.06, duration: 0.4, ease: 'easeOut' }}
                    onClick={() => {
                      playClick()
                      setMobileOpen(false)
                    }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>

              <div className="nav-mobile-actions">
                <button
                  className="btn-magnetic"
                  style={{ width: '100%', marginBottom: '1rem' }}
                  onClick={handleShowroomClick}
                >
                  Enter Showroom Studio
                </button>
                <button
                  className={`nav-sound-btn ${soundOn ? 'active' : ''}`}
                  onClick={handleSoundToggle}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {soundOn ? 'AUDIO ACTIVE (TAP TO MUTE)' : 'ENABLE SOUND EXPERIENCE'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
