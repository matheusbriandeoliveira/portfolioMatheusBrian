import { useEffect, useRef, useState } from 'react'
import {
  motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform,
} from 'framer-motion'
import './perspective-tunnel-hero.css'

const PROJECTS = [
  { id: 'projeto-01', title: 'Projeto 01', src: '/imgProjetos/imgProjeto01.jpg' },
  { id: 'projeto-02', title: 'Projeto 02', src: '/imgProjetos/imgProjeto02.jpg' },
  { id: 'projeto-03', title: 'Projeto 03', src: '/imgProjetos/imgProjetos03.jpg' },
  { id: 'projeto-04', title: 'Projeto 04', src: '/imgProjetos/imgProjetos04.jpg' },
  { id: 'projeto-05', title: 'Projeto 05', src: '/imgProjetos/imgProjetos05.jpg' },
]

function TunnelCard({ project, index, total, progress, pointer, stage, reduced }) {
  const start = (index / Math.max(total - 1, 1)) * 0.45
  const local = useTransform(progress, [start, start + 0.55], [0, 1])
  const z = useTransform(local, [0, 1], [-1500, 500])
  const opacity = useTransform(local, [0, 0.16, 0.8, 1], [0, 1, 1, 0])
  const angle = index * 137.5 * Math.PI / 180
  const mobile = stage.width < 768
  const baseX = Math.cos(angle) * stage.width * (mobile ? 0.32 : 0.3)
  const baseY = Math.sin(angle) * stage.height * 0.32
  const transform = useTransform([z, pointer.x, pointer.y], ([depth, x, y]) =>
    `translate3d(calc(-50% + ${baseX - x * 35}px), calc(-50% + ${baseY - y * 35}px), ${depth}px) rotateZ(${index % 2 ? -7 : 7}deg)`)

  return (
    <motion.figure className="projects__card" style={reduced ? undefined : { transform, opacity }}>
      <img src={project.src} alt={project.title} loading="lazy" draggable="false" />
    </motion.figure>
  )
}

export default function PerspectiveTunnelHero({ projects = PROJECTS }) {
  const containerRef = useRef(null)
  const stageRef = useRef(null)
  const reduced = useReducedMotion()
  const [stage, setStage] = useState({ width: 1440, height: 900 })
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 30 })
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 60, damping: 25 })
  const y = useSpring(rawY, { stiffness: 60, damping: 25 })
  const titleScale = useTransform(progress, [0, 1], [0.95, 1.15])
  const promptOpacity = useTransform(progress, [0, 0.15], [1, 0])

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setStage({ width: entry.contentRect.width, height: entry.contentRect.height })
    })
    if (stageRef.current) observer.observe(stageRef.current)
    return () => observer.disconnect()
  }, [])

  const onPointerMove = (event) => {
    if (reduced || event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    rawX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2)
    rawY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2)
  }

  return (
    <section className={`projects${reduced ? ' projects--reduced' : ''}`} ref={containerRef} id="projetos" aria-labelledby="projects-title">
      <div className="projects__stage" ref={stageRef} onPointerMove={onPointerMove}
        onPointerLeave={() => { rawX.set(0); rawY.set(0) }}>
        <div className="projects__guides" aria-hidden="true" />
        <motion.header className="projects__heading" style={reduced ? undefined : { scale: titleScale }}>
          <p className="projects__eyebrow">DO CONCEITO À CRIAÇÃO</p>
          <h2 id="projects-title">Projetos<span>.</span></h2>
          <p>Uma seleção dos meus trabalhos em desenvolvimento web, interfaces digitais e projetos criativos, onde design e tecnologia se encontram.</p>
        </motion.header>
        <div className="projects__tunnel">
          {projects.map((project, index) => (
            <TunnelCard key={project.id} project={project} index={index} total={projects.length}
              progress={progress} pointer={{ x, y }} stage={stage} reduced={reduced} />
          ))}
        </div>
        <motion.p className="projects__prompt" style={reduced ? undefined : { opacity: promptOpacity }}>
          Role para explorar <span aria-hidden="true">↓</span>
        </motion.p>
      </div>
    </section>
  )
}
