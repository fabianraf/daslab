import { Link } from 'react-router-dom'
import './Grammatik.css'

const AKKUSATIV_ARTICLES = [
  { nom: 'der', akk: 'den', genre: 'masc.' },
  { nom: 'die', akk: 'die', genre: 'fem.' },
  { nom: 'das', akk: 'das', genre: 'neutro' },
  { nom: 'die', akk: 'die', genre: 'plural' },
]

const AKKUSATIV_INDEF = [
  { nom: 'ein', akk: 'einen', genre: 'masc.' },
  { nom: 'eine', akk: 'eine', genre: 'fem.' },
  { nom: 'ein', akk: 'ein', genre: 'neutro' },
]

const AKKUSATIV_PRONOUNS = [
  { nom: 'ich', akk: 'mich' },
  { nom: 'du', akk: 'dich' },
  { nom: 'er', akk: 'ihn' },
  { nom: 'sie', akk: 'sie' },
  { nom: 'es', akk: 'es' },
  { nom: 'wir', akk: 'uns' },
  { nom: 'ihr', akk: 'euch' },
  { nom: 'sie', akk: 'sie' },
  { nom: 'Sie', akk: 'Sie' },
]

const DATIV_ARTICLES = [
  { nom: 'der', dat: 'dem', genre: 'masc.' },
  { nom: 'die', dat: 'der', genre: 'fem.' },
  { nom: 'das', dat: 'dem', genre: 'neutro' },
  { nom: 'die', dat: 'den', genre: 'plural (+ n)' },
]

const DATIV_INDEF = [
  { nom: 'ein', dat: 'einem', genre: 'masc.' },
  { nom: 'eine', dat: 'einer', genre: 'fem.' },
  { nom: 'ein', dat: 'einem', genre: 'neutro' },
]

const DATIV_PRONOUNS = [
  { nom: 'ich', dat: 'mir' },
  { nom: 'du', dat: 'dir' },
  { nom: 'er', dat: 'ihm' },
  { nom: 'sie', dat: 'ihr' },
  { nom: 'es', dat: 'ihm' },
  { nom: 'wir', dat: 'uns' },
  { nom: 'ihr', dat: 'euch' },
  { nom: 'sie', dat: 'ihnen' },
  { nom: 'Sie', dat: 'Ihnen' },
]

const IMPERATIV_EXAMPLES = [
  { infinitiv: 'kommen', du: 'Komm(e)!', ihr: 'Kommt!', Sie: 'Kommen Sie!' },
  { infinitiv: 'sprechen', du: 'Sprich!', ihr: 'Sprecht!', Sie: 'Sprechen Sie!' },
  { infinitiv: 'lesen', du: 'Lies!', ihr: 'Lest!', Sie: 'Lesen Sie!' },
  { infinitiv: 'schlafen', du: 'Schlaf(e)!', ihr: 'Schlaft!', Sie: 'Schlafen Sie!' },
  { infinitiv: 'sein', du: 'Sei!', ihr: 'Seid!', Sie: 'Seien Sie!' },
  { infinitiv: 'haben', du: 'Hab(e)!', ihr: 'Habt!', Sie: 'Haben Sie!' },
]

export default function Grammatik() {
  return (
    <div className="grammatik-page">
      <header className="grammatik-header">
        <nav className="grammatik-nav" aria-label="Otras secciones">
          <Link to="/" className="grammatik-section-link grammatik-section-link--table">← Inicio / Start</Link>
          <Link to="/ueben" className="grammatik-section-link grammatik-section-link--practice">→ Practicar / Üben</Link>
          <Link to="/verben" className="grammatik-section-link grammatik-section-link--verben">Verbos / Verben</Link>
        </nav>
        <h1 className="grammatik-title">Grammatik</h1>
        <p className="grammatik-subtitle">Akkusativ, Dativ, Imperativ</p>
      </header>

      <div className="grammatik-sections">
        {/* Akkusativ */}
        <section className="grammatik-section section-akk">
          <h2 className="section-heading">Akkusativ <span className="section-hint">(wen? was? — objeto directo / Akkusativobjekt)</span></h2>
          <div className="tables-row">
            <div className="table-block">
              <h3>Artículo definido / Bestimmter Artikel</h3>
              <table className="gramm-table">
                <thead>
                  <tr>
                    <th>Nominativ</th>
                    <th>Akkusativ</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {AKKUSATIV_ARTICLES.map((row, i) => (
                    <tr key={i}>
                      <td>{row.nom}</td>
                      <td className="highlight">{row.akk}</td>
                      <td className="muted">{row.genre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-block">
              <h3>Artículo indefinido / Unbestimmter Artikel</h3>
              <table className="gramm-table">
                <thead>
                  <tr>
                    <th>Nominativ</th>
                    <th>Akkusativ</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {AKKUSATIV_INDEF.map((row, i) => (
                    <tr key={i}>
                      <td>{row.nom}</td>
                      <td className="highlight">{row.akk}</td>
                      <td className="muted">{row.genre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="table-block">
            <h3>Pronombres personales / Personalpronomen (Akkusativ)</h3>
            <table className="gramm-table">
              <thead>
                <tr>
                  <th>Nominativ</th>
                  <th>Akkusativ</th>
                </tr>
              </thead>
              <tbody>
                {AKKUSATIV_PRONOUNS.map((row, i) => (
                  <tr key={i}>
                    <td>{row.nom}</td>
                    <td className="highlight">{row.akk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Dativ */}
        <section className="grammatik-section section-dat">
          <h2 className="section-heading">Dativ <span className="section-hint">(wem? — objeto indirecto / Dativobjekt)</span></h2>
          <div className="tables-row">
            <div className="table-block">
              <h3>Artículo definido / Bestimmter Artikel</h3>
              <table className="gramm-table">
                <thead>
                  <tr>
                    <th>Nominativ</th>
                    <th>Dativ</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {DATIV_ARTICLES.map((row, i) => (
                    <tr key={i}>
                      <td>{row.nom}</td>
                      <td className="highlight">{row.dat}</td>
                      <td className="muted">{row.genre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-block">
              <h3>Artículo indefinido / Unbestimmter Artikel</h3>
              <table className="gramm-table">
                <thead>
                  <tr>
                    <th>Nominativ</th>
                    <th>Dativ</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {DATIV_INDEF.map((row, i) => (
                    <tr key={i}>
                      <td>{row.nom}</td>
                      <td className="highlight">{row.dat}</td>
                      <td className="muted">{row.genre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="table-block">
            <h3>Pronombres personales / Personalpronomen (Dativ)</h3>
            <table className="gramm-table">
              <thead>
                <tr>
                  <th>Nominativ</th>
                  <th>Dativ</th>
                </tr>
              </thead>
              <tbody>
                {DATIV_PRONOUNS.map((row, i) => (
                  <tr key={i}>
                    <td>{row.nom}</td>
                    <td className="highlight">{row.dat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Imperativ */}
        <section className="grammatik-section section-imp">
          <h2 className="section-heading">Imperativ <span className="section-hint">(mandatos / Befehle)</span></h2>
          <p className="imperativ-intro">
            <strong>Du:</strong> raíz / Stamm + (e) — <strong>Ihr:</strong> Stamm + t — <strong>Sie:</strong> Infinitiv + Sie
          </p>
          <div className="table-block">
            <table className="gramm-table imperativ-table">
              <thead>
                <tr>
                  <th>Infinitiv</th>
                  <th>Du</th>
                  <th>Ihr</th>
                  <th>Sie</th>
                </tr>
              </thead>
              <tbody>
                {IMPERATIV_EXAMPLES.map((row, i) => (
                  <tr key={i}>
                    <td>{row.infinitiv}</td>
                    <td className="highlight">{row.du}</td>
                    <td className="highlight">{row.ihr}</td>
                    <td className="highlight">{row.Sie}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
