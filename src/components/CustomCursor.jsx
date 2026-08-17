import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const dotRef = useRef(null)
  const labelRef = useRef(null)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    // Detect touch device robustly
    const mq = window.matchMedia('(pointer: coarse)')
    setIsTouch(mq.matches)
    
    const handleTouchChange = (e) => {
      setIsTouch(e.matches)
    }
    mq.addEventListener('change', handleTouchChange)

    if (mq.matches) {
      return () => {
        mq.removeEventListener('change', handleTouchChange)
      }
    }

    // Hide default cursor
    document.body.style.cursor = 'none'

    const cursor = cursorRef.current
    const dot = dotRef.current
    const label = labelRef.current

    let mouse = { x: -100, y: -100 }
    let dotPos = { x: -100, y: -100 }
    let ringPos = { x: -100, y: -100 }
    let hoveredEl = null
    const magneticForce = 0.5 // Pull strength

    const onMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const onMouseEnterInteractive = (e) => {
      hoveredEl = e.currentTarget
      cursor.classList.add('hovering')
      
      const labelText = hoveredEl.getAttribute('data-cursor-label')
      if (labelText && label) {
        label.textContent = labelText
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.5)' })
        cursor.classList.add('has-label')
      }
    }

    const onMouseLeaveInteractive = (e) => {
      hoveredEl = null
      cursor.classList.remove('hovering')
      cursor.classList.remove('has-label')
      
      if (label) {
        gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.2 })
      }

      // Reset magnetic element position
      const el = e.currentTarget
      if (el.classList.contains('magnetic') || el.getAttribute('data-magnetic') === 'true') {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
      }
    }

    const render = () => {
      let targetX = mouse.x
      let targetY = mouse.y

      if (hoveredEl && (hoveredEl.classList.contains('magnetic') || hoveredEl.getAttribute('data-magnetic') === 'true')) {
        const rect = hoveredEl.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        // Distance from mouse to center
        const distX = mouse.x - centerX
        const distY = mouse.y - centerY
        
        // Pull cursor towards center
        targetX = centerX + distX * (1 - magneticForce)
        targetY = centerY + distY * (1 - magneticForce)

        // Move the element slightly
        gsap.to(hoveredEl, {
          x: distX * 0.3,
          y: distY * 0.3,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto'
        })
      }

      // Quick lag for dot
      dotPos.x += (targetX - dotPos.x) * 0.8
      dotPos.y += (targetY - dotPos.y) * 0.8
      
      // Slower lag for ring
      ringPos.x += (targetX - ringPos.x) * 0.15
      ringPos.y += (targetY - ringPos.y) * 0.15

      gsap.set(dot, { x: dotPos.x, y: dotPos.y })
      gsap.set(cursor, { x: ringPos.x, y: ringPos.y })
      
      if (label) {
        gsap.set(label, { x: ringPos.x, y: ringPos.y - 45 })
      }
    }

    gsap.ticker.add(render)

    const addListeners = () => {
      const targets = document.querySelectorAll(
        'a, button, [data-cursor="pointer"], .magnetic, [data-magnetic="true"]'
      )
      targets.forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterInteractive)
        el.addEventListener('mouseleave', onMouseLeaveInteractive)
      })
      return targets
    }

    window.addEventListener('mousemove', onMouseMove)

    let targets = addListeners()
    const observer = new MutationObserver(() => {
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive)
        el.removeEventListener('mouseleave', onMouseLeaveInteractive)
      })
      targets = addListeners()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.body.style.cursor = ''
      window.removeEventListener('mousemove', onMouseMove)
      gsap.ticker.remove(render)
      observer.disconnect()
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive)
        el.removeEventListener('mouseleave', onMouseLeaveInteractive)
      })
      mq.removeEventListener('change', handleTouchChange)
    }
  }, [isTouch])

  if (isTouch) return null

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={labelRef} className="custom-cursor-label" />
    </>
  )
}
