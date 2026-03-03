import { Link } from 'react-router-dom'
import { PageNav } from '../components/PageNav'
import './Modalverben.css'

const MODALVERBEN = [
  {
    infinitive: 'können',
    translation: 'poder / saber (capacidad)',
    conjugation: { ich: 'kann', du: 'kannst', erSieEs: 'kann', wir: 'können', ihr: 'könnt', sieSie: 'können' },
  },
  {
    infinitive: 'müssen',
    translation: 'tener que / deber (obligación)',
    conjugation: { ich: 'muss', du: 'musst', erSieEs: 'muss', wir: 'müssen', ihr: 'müsst', sieSie: 'müssen' },
  },
  {
    infinitive: 'wollen',
    translation: 'querer (voluntad)',
    conjugation: { ich: 'will', du: 'willst', erSieEs: 'will', wir: 'wollen', ihr: 'wollt', sieSie: 'wollen' },
  },
  {
    infinitive: 'mögen',
    translation: 'gustar / querer (preferencia)',
    conjugation: { ich: 'mag', du: 'magst', erSieEs: 'mag', wir: 'mögen', ihr: 'mögt', sieSie: 'mögen' },
  },
]

const ROWS = [
  { key: 'ich', label: 'ich' },
  { key: 'du', label: 'du' },
  { key: 'erSieEs', label: 'er / sie / es' },
  { key: 'wir', label: 'wir' },
  { key: 'ihr', label: 'ihr' },
  { key: 'sieSie', label: 'sie / Sie' },
]

export default function Modalverben() {
  return (
    <div className="modalverben-page">
      <header className="modalverben-header">
        <PageNav />
        <h1 className="modalverben-title">Modalverben</h1>
        <p className="modalverben-subtitle">können · müssen · wollen · mögen</p>
        <p className="modalverben-structure">
          Sujeto + verbo modal (posición 2) + complemento + verbo principal en infinitivo (al final)
        </p>
      </header>

      <div className="modalverben-sections">
        <section className="modalverben-section modalverben-intro">
          <h2 className="modalverben-heading">¿Qué son los Modalverben?</h2>
          <p>
            Los verbos modales expresan <strong>capacidad</strong> (können), <strong>obligación</strong> (müssen) o <strong>voluntad</strong> (wollen).
            Van con otro verbo en infinitivo, que va <strong>al final de la oración</strong> (Satzklammer).
          </p>
          <p className="modalverben-example">
            <strong>Ejemplo:</strong> Ich <em>kann</em> heute nicht ins Kino <em>gehen</em>. (Puedo ir hoy al cine. / No puedo ir hoy al cine.)
          </p>
        </section>

        <section className="modalverben-section modalverben-tables">
          <h2 className="modalverben-heading">Conjugación en presente (Präsens)</h2>
          {MODALVERBEN.map((verb) => (
            <div key={verb.infinitive} className="modalverben-table-block">
              <h3 className="modalverben-verb-title">
                <span className="modalverben-infinitive">{verb.infinitive}</span>
                <span className="modalverben-translation">{verb.translation}</span>
              </h3>
              <table className="modalverben-table">
                <thead>
                  <tr>
                    <th>Pronombre</th>
                    <th>Forma</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => (
                    <tr key={row.key}>
                      <td className="modalverben-pronoun">{row.label}</td>
                      <td className="modalverben-form">{verb.conjugation[row.key]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </section>
      </div>

      <p className="modalverben-footer">Erstellt von Fabián Aguirre · 2026</p>
    </div>
  )
}
