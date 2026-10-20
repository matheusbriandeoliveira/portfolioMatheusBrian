import { useEffect, useRef, useState } from 'react'
import './App.css'
import PerspectiveTunnelHero from './components/ui/perspective-tunnel-hero'

function App() {
  const heroRef = useRef(null)
  const [preloader, setPreloader] = useState('loading')

  useEffect(() => {
    let cancelled = false
    let exitTimer
    let minimumTimer
    let maximumTimer
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const minimumDuration = new Promise((resolve) => {
      minimumTimer = window.setTimeout(resolve, 1200)
    })
    const background = new Image()
    const backgroundReady = new Promise((resolve) => {
      background.onload = resolve
      background.onerror = resolve
      background.src = '/bg.png'
    })
    const assetsReady = Promise.all([
      backgroundReady,
      document.fonts.load('400 64px "Drinks Fruit"').catch(() => {}),
    ])
    const maximumDuration = new Promise((resolve) => {
      maximumTimer = window.setTimeout(resolve, 4500)
    })

    Promise.all([minimumDuration, Promise.race([assetsReady, maximumDuration])]).then(() => {
      if (cancelled) return
      setPreloader('exiting')
      exitTimer = window.setTimeout(() => {
        setPreloader('hidden')
        document.body.style.overflow = previousOverflow
      }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 150 : 1000)
    })

    return () => {
      cancelled = true
      window.clearTimeout(minimumTimer)
      window.clearTimeout(maximumTimer)
      window.clearTimeout(exitTimer)
      background.onload = null
      background.onerror = null
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const texts = heroRef.current.querySelectorAll('[data-scroll-fade]')
    let frameId = null

    const updateParallax = () => {
      frameId = null
      const hero = heroRef.current
      if (!hero) return

      const offset = motionPreference.matches
        ? 0
        : Math.max(0, -hero.getBoundingClientRect().top) * 0.2
      hero.style.setProperty('--parallax-offset', `${offset}px`)

      const viewportHeight = window.innerHeight
      const fadeDistance = Math.min(viewportHeight * 0.22, 160)
      const edgeInset = viewportHeight * 0.12

      texts.forEach((text) => {
        const bounds = text.getBoundingClientRect()
        const center = bounds.top + bounds.height / 2
        const visibility = Math.max(0, Math.min(
          1,
          (center - edgeInset) / fadeDistance,
          (viewportHeight - edgeInset - center) / fadeDistance,
        ))
        const opacity = motionPreference.matches
          ? 1
          : visibility * visibility * (3 - 2 * visibility)
        text.style.setProperty('--scroll-opacity', String(opacity))
      })
    }

    const scheduleUpdate = () => {
      if (frameId === null) frameId = window.requestAnimationFrame(updateParallax)
    }

    updateParallax()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    motionPreference.addEventListener('change', scheduleUpdate)
    document.fonts.ready.then(scheduleUpdate)

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      motionPreference.removeEventListener('change', scheduleUpdate)
      if (frameId !== null) window.cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <main className="portfolio">
      {preloader !== 'hidden' && (
        <div className={`preloader preloader--${preloader}`} role="status" aria-label="Carregando portfólio">
          <p className="preloader__name">Matheus Brian<span>.</span></p>
        </div>
      )}
      <section className="hero" ref={heroRef} aria-label="Início">
      <nav className="hero__navigation" aria-label="Navegação principal">
        <a href="#sobre">Sobre</a>
        <a href="#contato">Contato</a>
      </nav>

      <section className="hero__intro" aria-label="Apresentação" data-scroll-fade>
        <p className="hero__greeting">Olá, eu sou</p>
        <h1 className="hero__name">Matheus Brian<span>.</span></h1>
        <p className="hero__tagline">
          Ideias que conectam design
          <br />
          tecnologia e criatividade.
        </p>
      </section>

      <div className="hero__profile" data-scroll-fade>
        <p className="hero__about">
          Gosto de <strong>explorar ideias</strong>,
          {' '}<strong>experimentar possibilidades</strong>
          <br />
          e <strong>aprender coisas novas</strong>.
        </p>
        <img
          className="hero__portrait"
          src="/frontEu.png"
          alt="Matheus Brian"
          width="1254"
          height="1254"
        />
      </div>
      </section>
      <section className="about" id="sobre" aria-labelledby="about-title">
        <div className="about__layout">
          <div className="about__portraits" aria-label="Retratos de Matheus Brian">
            <img className="about__portrait about__portrait--back" src="/retrato01.png" alt="Retrato de Matheus Brian" width="450" height="675" loading="lazy" />
            <img className="about__portrait about__portrait--front" src="/retrato02.png" alt="Segundo retrato de Matheus Brian" width="385" height="578" loading="lazy" />
          </div>
          <div className="about__text">
            <header className="about__header">
              <h2 className="about__title" id="about-title"><span className="about__title-intro">Um pouco mais</span><span>sobre mim.</span></h2>
              <p className="about__subtitle">
                Conheça um pouco da minha história, minhas habilidades e o que me inspira a criar experiências digitais.
              </p>
            </header>
            <div className="about__bio">
              <p>
                Olá! Sou <strong>Matheus Brian de Oliveira</strong>, tenho 22 anos e moro em Marília, no interior de São Paulo. Sou <strong>desenvolvedor web</strong>, formado em <strong>Análise e Desenvolvimento de Sistemas</strong>, e apaixonado por <strong>tecnologia, design e criatividade</strong>.
              </p>
              <p>
                Trabalho com <strong>desenvolvimento web, criação de interfaces e prototipação no Figma</strong>. Também utilizo ferramentas como <strong>Photoshop, Illustrator e inteligência artificial</strong> para transformar ideias em experiências digitais que unem <strong>estética e funcionalidade</strong>.
              </p>
              <p>
                Sou uma pessoa curiosa, gosto de <strong>aprender, explorar novas possibilidades</strong> e acompanhar a evolução da tecnologia. Estou sempre buscando <strong>aprimorar minhas habilidades</strong> e desenvolver <strong>projetos cada vez mais criativos</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>
      <PerspectiveTunnelHero />
    </main>
  )
}

export default App
