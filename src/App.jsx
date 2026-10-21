import { useEffect, useRef, useState } from 'react'
import './App.css'
import PerspectiveTunnelHero from './components/ui/perspective-tunnel-hero'
import PortfolioFooter from './components/ui/PortfolioFooter'
import ScrollControls from './components/ui/ScrollControls'

function App() {
  const heroRef = useRef(null)
  const portfolioRef = useRef(null)
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
      background.src = '/assets/images/backgrounds/background.png'
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
      const fadeDistance = Math.min(viewportHeight * 0.2, 140)
      const edgeInset = viewportHeight * 0.025
      const texts = portfolioRef.current.querySelectorAll('[data-scroll-fade], h2, h3, h4, p')

      texts.forEach((text) => {
        if (text.closest('.preloader, [popover]')) return
        if (!text.hasAttribute('data-scroll-fade') && text.closest('[data-scroll-fade]')) return
        const bounds = text.getBoundingClientRect()
        const visibility = Math.max(0, Math.min(
          1,
          (bounds.bottom - edgeInset) / fadeDistance,
          (viewportHeight - edgeInset - bounds.top) / fadeDistance,
        ))
        const opacity = motionPreference.matches
          ? 1
          : visibility * visibility * (3 - 2 * visibility)
        text.style.setProperty('--scroll-opacity', String(opacity))
        text.style.setProperty('--scroll-blur', `${(1 - opacity) * 5}px`)
        text.setAttribute('data-scroll-text', '')
      })

      portfolioRef.current.querySelectorAll('.about__portraits, .about__text, .creative-tools__list, .project-feature__image, .project-feature__content, .projects-gallery > .chroma-grid, .contact__content').forEach((section) => {
        // Use layout coordinates so the animated translation cannot feed back into its own target.
        let documentTop = 0
        let ancestor = section
        while (ancestor) {
          documentTop += ancestor.offsetTop
          ancestor = ancestor.offsetParent
        }
        const top = documentTop - window.scrollY
        const bottom = top + section.offsetHeight
        const entry = Math.max(0, Math.min(1, (viewportHeight - top) / (viewportHeight * 0.35)))
        const exit = Math.max(0, Math.min(1, bottom / (viewportHeight * 0.2)))
        section.setAttribute('data-scroll-section', '')
        section.style.setProperty('--section-offset', motionPreference.matches ? '0px' : `${(1 - entry) * 40 - (1 - exit) * 20}px`)
      })
    }

    const scheduleUpdate = () => {
      if (frameId === null) frameId = window.requestAnimationFrame(updateParallax)
    }

    updateParallax()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    motionPreference.addEventListener('change', scheduleUpdate)
    const observer = new MutationObserver(scheduleUpdate)
    observer.observe(portfolioRef.current, { childList: true, subtree: true })
    document.fonts.ready.then(scheduleUpdate)

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      motionPreference.removeEventListener('change', scheduleUpdate)
      observer.disconnect()
      if (frameId !== null) window.cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <main className="portfolio" ref={portfolioRef}>
      <a className="skip-link" href="#sobre">Pular para o conteúdo principal</a>
      {preloader !== 'hidden' && (
        <div className={`preloader preloader--${preloader}`} role="status" aria-label="Carregando portfólio">
          <p className="preloader__name">Matheus Brian<span>.</span></p>
        </div>
      )}
      <section className="hero" ref={heroRef} id="inicio" aria-label="Início">
      <a className="hero__logo" href="#inicio" aria-label="Matheus Brian — início">MB<span>.</span></a>
      <nav className="hero__navigation" aria-label="Navegação principal">
        <a href="#sobre">Sobre</a>
        <a href="#contato">Contato</a>
      </nav>

      <section className="hero__intro" aria-label="Apresentação" data-scroll-fade>
        <p className="hero__greeting">Olá, eu sou</p>
        <h1 className="hero__name">Matheus <br className="hero__name-break" />Brian<span>.</span></h1>
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
          src="/assets/images/profile/front.png"
          alt="Matheus Brian"
          width="1254"
          height="1254"
          fetchPriority="high"
          decoding="async"
        />
      </div>
      </section>
      <section className="about" id="sobre" aria-labelledby="about-title">
        <div className="about__layout">
          <div className="about__portraits" aria-label="Retratos de Matheus Brian">
            <img className="about__portrait about__portrait--back" src="/assets/images/profile/portrait-01.png" alt="Retrato de Matheus Brian" width="450" height="675" loading="lazy" decoding="async" />
            <img className="about__portrait about__portrait--front" src="/assets/images/profile/portrait-02.png" alt="Segundo retrato de Matheus Brian" width="385" height="578" loading="lazy" decoding="async" />
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
      <section className="creative-tools" aria-labelledby="creative-tools-title">
        <div className="creative-tools__inner">
          <h2 id="creative-tools-title">Minhas ferramentas <span>criativas.</span></h2>
          <p>As tecnologias e ferramentas que utilizo para transformar ideias em projetos reais.</p>
          <ul className="creative-tools__list">
            {[
              { name: 'React', icon: '/assets/images/tools/react.svg', description: 'Utilizo o React para desenvolver websites e interfaces interativas, criando componentes reutilizáveis e experiências responsivas.' },
              { name: 'Figma', icon: '/assets/images/tools/figma.svg', description: 'Utilizo o Figma para planejar interfaces, criar layouts e protótipos e explorar a experiência de navegação antes do desenvolvimento.' },
              { name: 'Photoshop', icon: '/assets/images/tools/photoshop.svg', description: 'Utilizo o Photoshop para editar e tratar imagens, criar composições visuais e preparar artes para projetos digitais.' },
              { name: 'Illustrator', icon: '/assets/images/tools/illustrator.svg', description: 'Utilizo o Illustrator para criar ilustrações vetoriais, elementos gráficos e peças de identidade visual que mantêm a qualidade em diferentes tamanhos.' },
              { name: 'After Effects', icon: '/assets/images/tools/after-effects.svg', description: 'Utilizo o After Effects para dar movimento às ideias, criando animações, efeitos visuais e composições para vídeos.' },
              { name: 'CorelDRAW', icon: '/assets/images/tools/coreldraw.svg', description: 'Utilizo o CorelDRAW para desenvolver artes vetoriais, diagramar peças gráficas e preparar arquivos para impressão.' },
            ].map((tool, index) => (
              <li key={tool.name}>
                <button type="button" className="creative-tools__item" popoverTarget={`tool-${index}`}
                  aria-label={`Como utilizo ${tool.name}`} aria-haspopup="dialog" aria-controls={`tool-${index}`}>
                  <img src={tool.icon} alt="" width="64" height="64" loading="lazy" />
                  <span>{tool.name}</span>
                </button>
                <div className="creative-tools__popover" id={`tool-${index}`} popover="auto" role="dialog"
                  aria-labelledby={`tool-title-${index}`}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') event.currentTarget.hidePopover()
                  }}>
                  <button type="button" className="creative-tools__close" popoverTarget={`tool-${index}`} popoverTargetAction="hide" aria-label="Fechar">×</button>
                  <img src={tool.icon} alt="" width="64" height="64" />
                  <h3 id={`tool-title-${index}`}>{tool.name}</h3>
                  <p>{tool.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <PerspectiveTunnelHero />
      <section className="contact" id="contato" aria-labelledby="contact-title">
        <div className="contact__sky" aria-hidden="true">
          <span className="contact__cloud contact__cloud--one" />
          <span className="contact__cloud contact__cloud--two" />
          <span className="contact__cloud contact__cloud--three" />
          <span className="contact__cloud contact__cloud--four" />
        </div>
        <div className="contact__content">
          <h2 id="contact-title">Vamos criar algo <span>incrível juntos?</span></h2>
          <p>Boas ideias começam com uma conversa.</p>
          <a className="contact__whatsapp" href="https://wa.me/5514991752130" target="_blank" rel="noopener noreferrer">
            Vamos conversar no WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
      <PortfolioFooter />
      <ScrollControls enabled={preloader === 'hidden'} />
    </main>
  )
}

export default App
