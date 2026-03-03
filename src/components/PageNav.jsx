import { Link } from 'react-router-dom'
import './PageNav.css'

const NAV_LINKS = [
  { to: '/', label: '← Inicio / Start', className: 'page-nav-link--inicio' },
  { to: '/artikel', label: 'Artículos / Artikel', className: 'page-nav-link--artikel' },
  { to: '/ueben', label: '→ Practicar / Üben', className: 'page-nav-link--ueben' },
  { to: '/grammatik', label: 'Grammatik', className: 'page-nav-link--grammatik' },
  { to: '/modalverben', label: 'Modalverben', className: 'page-nav-link--modalverben' },
  { to: '/verben', label: 'Verbos / Verben', className: 'page-nav-link--verben' },
]

export function PageNav({ className = '' }) {
  return (
    <nav className={`page-nav ${className}`.trim()} aria-label="Otras secciones">
      {NAV_LINKS.map(({ to, label, className: linkClass }) => (
        <Link key={to} to={to} className={`page-nav-link ${linkClass}`}>
          {label}
        </Link>
      ))}
    </nav>
  )
}
