import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import './PortfolioFooter.css'

export default function PortfolioFooter() {
  const footerRef = useRef(null)
  const reduced = useReducedMotion()
  const curveTarget = useMotionValue(156)
  const curve = useSpring(curveTarget, { stiffness: 85, damping: 9, mass: 1.2 })
  const path = useTransform(curve, (depth) =>
    `M0 0 C464 ${depth},675 ${depth},1139 ${depth} S2278 0,2278 0 V683 H0 Z`)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      curveTarget.set(entry.isIntersecting ? 0 : 156)
    }, { threshold: 0.05 })
    if (footerRef.current) observer.observe(footerRef.current)
    return () => observer.disconnect()
  }, [curveTarget])

  return (
    <footer className="portfolio-footer" ref={footerRef}>
      <svg className="portfolio-footer__wave" viewBox="0 0 2278 683" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="portfolio-footer-gradient" x1="0" y1="0" x2="0" y2="683" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#3568f5" />
            <stop offset="1" stopColor="#f68ee6" />
          </linearGradient>
        </defs>
        <motion.path fill="url(#portfolio-footer-gradient)" d={reduced ? 'M0 0 H2278 V683 H0 Z' : path} />
      </svg>
      <div className="portfolio-footer__content">
        <a className="portfolio-footer__name" href="#inicio" aria-label="Matheus Brian — voltar ao início">
          Matheus Brian<span>.</span>
        </a>
        <nav className="portfolio-footer__navigation" aria-label="Navegação do rodapé">
          <a href="#sobre">Sobre</a>
          <a href="#projetos">Projetos</a>
          <a href="#contato">Contato</a>
        </nav>
        <div className="portfolio-footer__bottom">
          <small>© {new Date().getFullYear()} Matheus Brian de Oliveira.</small>
          <a href="#inicio">Voltar ao topo <span aria-hidden="true">↑</span></a>
        </div>
      </div>
    </footer>
  )
}
