import './App.css'

function App() {
  return (
    <main className="hero">
      <nav className="hero__navigation" aria-label="Navegação principal">
        <a href="#sobre">Sobre</a>
        <a href="#contato">Contato</a>
      </nav>

      <section className="hero__intro" aria-label="Apresentação">
        <p className="hero__greeting">Olá, eu sou</p>
        <h1 className="hero__name">Matheus Brian</h1>
        <p className="hero__tagline">
          Ideias que conectam design
          <br />
          tecnologia e criatividade.
        </p>
      </section>
    </main>
  )
}

export default App
