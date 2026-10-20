import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import './ScrollControls.css'

export default function ScrollControls({ enabled }) {
  const lenisRef = useRef(null)
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const { scrollY, scrollYProgress } = useScroll()

  useMotionValueEvent(scrollY, 'change', (position) => {
    setVisible(position > 300)
  })

  useEffect(() => {
    if (!enabled || reduced) return
    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      syncTouch: true,
      lerp: 0.055,
      wheelMultiplier: 0.85,
      syncTouchLerp: 0.05,
      anchors: { duration: 1.6 },
      prevent: (node) => Boolean(node.closest('[popover], video')),
    })
    lenisRef.current = lenis
    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [enabled, reduced])

  const goToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.4 })
    } else {
      window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' })
    }
  }

  return (
    <button className={`back-to-top${visible && enabled ? ' back-to-top--visible' : ''}`}
      type="button" onClick={goToTop} aria-label="Voltar ao início"
      tabIndex={visible && enabled ? 0 : -1} aria-hidden={!visible || !enabled}>
      <svg className="back-to-top__progress" viewBox="0 0 56 56" aria-hidden="true">
        <circle cx="28" cy="28" r="25" fill="none" stroke="#271c4020" strokeWidth="2" />
        <motion.circle cx="28" cy="28" r="25" fill="none" stroke="#271C40" strokeWidth="2"
          strokeLinecap="round" style={{ pathLength: scrollYProgress }} />
      </svg>
      <span aria-hidden="true">↑</span>
    </button>
  )
}
