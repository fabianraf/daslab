import { Link } from 'react-router-dom'
import './Home.css'

const SECTIONS = [
  {
    to: '/artikel',
    title: 'Artículos / Artikel',
    subtitle: 'Tabla completa de sustantivos con der / die / das',
    className: 'home-card--artikel',
  },
  {
    to: '/ueben',
    title: 'Practicar / Üben',
    subtitle: 'Juegos separados: artículos, casos y ein/kein',
    className: 'home-card--practice',
  },
  {
    to: '/grammatik',
    title: 'Grammatik',
    subtitle: 'Akkusativ, Dativ e Imperativ',
    className: 'home-card--grammatik',
  },
  {
    to: '/verben',
    title: 'Verbos / Verben',
    subtitle: 'Lista de verbos y ejercicios de conjugación',
    className: 'home-card--verben',
  },
]

export default function Home() {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-title">Deutsch Dashboard</h1>
        <p className="home-subtitle">Elige una sección para estudiar</p>
      </header>

      <main className="home-grid">
        {SECTIONS.map((section) => (
          <Link key={section.to} to={section.to} className={`home-card ${section.className}`}>
            <span className="home-card-title">{section.title}</span>
            <span className="home-card-subtitle">{section.subtitle}</span>
          </Link>
        ))}
      </main>
      <p className="made-by-footer">Erstellt von Fabián Aguirre · 2026</p>
    </div>
  )
}
