import { useEffect, useRef, useState } from 'react'
import {
  motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform,
} from 'framer-motion'
import './perspective-tunnel-hero.css'
import ChromaGrid from './ChromaGrid'

const PROJECTS = [
  { id: 'projeto-01', title: 'Projeto 01', alt: 'Mockup de website para construtora em notebook e celular', src: '/assets/images/projects/project-01.jpg' },
  { id: 'projeto-02', title: 'Projeto 02', alt: 'Apresentação da identidade visual Venovra em um monitor, em uma sala escura', src: '/assets/images/projects/project-02.jpg' },
  { id: 'projeto-03', title: 'Projeto 03', alt: 'Peças digitais da Jacto exibidas em um smartphone', src: '/assets/images/projects/project-03.jpg' },
  { id: 'projeto-04', title: 'Projeto 04', alt: 'Arte promocional da Milplacas com fachada comercial exibida em um tablet', src: '/assets/images/projects/project-04.jpg' },
  { id: 'projeto-05', title: 'Projeto 05', alt: 'Apresentação de website institucional em diferentes telas', src: '/assets/images/projects/project-05.jpg' },
]

const EXTRA_ARTWORKS = ['jpg', 'png'].flatMap((extension) =>
  [1, 2, 3].map((number) => ({
    image: `/assets/images/artwork/artwork-0${number}.${extension}`,
    title: `Arte ${number} (${extension})`,
    alt: [
      'Composição de campanha digital da Milplacas apresentada em um smartphone',
      'Arte da Milplacas com fachada comercial apresentada em um tablet',
      'Mockup de website da Milplacas exibido em um notebook',
    ][number - 1],
    accent: '#EC368D',
  })))

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
      <img src={project.src} alt={project.alt} loading="lazy" draggable="false" />
    </motion.figure>
  )
}

export default function PerspectiveTunnelHero({ projects = PROJECTS }) {
  const [showMoreArtworks, setShowMoreArtworks] = useState(false)
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
    <section id="projetos" aria-labelledby="projects-title">
      <div className={`projects${reduced ? ' projects--reduced' : ''}`} ref={containerRef}>
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
      </div>
      <article className="project-feature" aria-labelledby="milplacas-title">
        <div className="project-feature__layout">
          <div className="project-feature__image">
            <img src="/assets/images/projects/project-05.jpg" alt="Mockup do website institucional da Milplacas em um notebook" loading="lazy" decoding="async" />
            <img className="project-feature__hover-image" src="/assets/images/projects/project-05-hover.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
          </div>
          <div className="project-feature__content">
            <h3 id="milplacas-title">Projeto destaque - Milplacas</h3>
            <p>
              Este projeto apresenta o website institucional responsivo da Milplacas, empresa de
              Marília especializada na construção de fachadas e esquadrias, com 26 anos de atuação
              no mercado. O site apresenta a trajetória e as soluções da empresa em uma identidade
              visual renovada e está no ar.
            </p>
            <h4>Tecnologias utilizadas</h4>
            <ul className="project-feature__tags">
              {['React', 'JavaScript', 'CSS', 'Vite'].map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
            <a className="project-feature__link" href="https://www.milplacas.com.br/" target="_blank" rel="noopener noreferrer" aria-label="Visitar o website da Milplacas (abre em nova aba)">
              Visitar o website da Milplacas <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </article>
      <div className="projects-gallery" aria-label="Galeria de projetos">
        <h3 className="projects-videos__title">Criativos<span>.</span></h3>
        <ChromaGrid
          items={projects.filter((project) => project.id !== 'projeto-05').map((project) => ({
            image: project.src,
            title: project.title,
            alt: project.alt,
            accent: '#EC368D',
          }))}
          columns={2}
          minCardWidth={260}
          gap={24}
          radius={300}
          theme="light"
          aspectRatio="16 / 10"
          cardRadius={24}
          showInfo={false}
        />
        <div id="extra-artworks" className="projects-gallery__extra" hidden={!showMoreArtworks}>
          {showMoreArtworks && (
            <ChromaGrid items={EXTRA_ARTWORKS} columns={2} minCardWidth={260} gap={24}
              radius={300} theme="light" aspectRatio="16 / 10" cardRadius={24} showInfo={false} />
          )}
        </div>
        <div className="projects-gallery__actions">
          <button type="button" className="projects-gallery__toggle"
            aria-expanded={showMoreArtworks} aria-controls="extra-artworks"
            onClick={() => setShowMoreArtworks((current) => !current)}>
            {showMoreArtworks ? 'Ver menos' : 'Ver mais'}
            <span aria-hidden="true">{showMoreArtworks ? '−' : '+'}</span>
          </button>
        </div>
      </div>
      <section className="projects-gallery projects-videos" aria-labelledby="videos-title">
        <h3 id="videos-title" className="projects-videos__title">Vídeos<span>.</span></h3>
        <p className="projects-videos__description">
          Projetos em vídeo criados com <strong>After Effects</strong> e <strong>CapCut</strong>,
          utilizando <strong>inteligência artificial como ferramenta de apoio</strong> no processo criativo.
        </p>
        <ChromaGrid
          items={[
            { video: '/assets/videos/medalhas-01.mp4', poster: '/assets/videos/medalhas-01-poster.jpg', title: 'Vídeo de medalhas 01', accent: '#EC368D' },
            { video: '/assets/videos/medalhas-02.mp4', title: 'Vídeo de medalhas 02', accent: '#EC368D' },
          ]}
          columns={2}
          minCardWidth={260}
          gap={24}
          theme="light"
          aspectRatio="9 / 16"
          cardRadius={24}
          showInfo={false}
        />
      </section>
    </section>
  )
}
