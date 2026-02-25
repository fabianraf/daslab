import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PRONOUN_ROWS, VERBS } from '../data/verbs'
import './Verben.css'

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

export default function Verben() {
  const [queryDe, setQueryDe] = useState('')
  const [queryEs, setQueryEs] = useState('')
  const [selected, setSelected] = useState(VERBS[0].infinitive)

  const filtered = useMemo(() => {
    const de = normalize(queryDe).trim()
    const es = normalize(queryEs).trim()
    return VERBS.filter((verb) => {
      const inf = normalize(verb.infinitive)
      const tr = normalize(verb.translation)
      return (!de || inf.includes(de)) && (!es || tr.includes(es))
    })
  }, [queryDe, queryEs])

  const selectedVerb = useMemo(() => {
    const inFiltered = filtered.find((v) => v.infinitive === selected)
    return inFiltered || filtered[0] || null
  }, [filtered, selected])

  return (
    <div className="verben-page">
      <header className="verben-header">
        <nav className="verben-nav" aria-label="Otras secciones">
          <Link to="/" className="verben-link verben-link--table">← Tabla / Artikel</Link>
          <Link to="/practicar" className="verben-link verben-link--practice">→ Practicar / Üben</Link>
          <Link to="/grammatik" className="verben-link verben-link--grammatik">Grammatik</Link>
        </nav>
        <h1 className="verben-title">Verbos / Verben</h1>
        <p className="verben-subtitle">Haz click en un verbo para ver la conjugación en presente (Präsens).</p>
      </header>

      <section className="verben-search">
        <label htmlFor="search-verb-de" className="verben-search-label">Buscar en alemán</label>
        <input
          id="search-verb-de"
          className="verben-search-input"
          type="search"
          value={queryDe}
          onChange={(e) => setQueryDe(e.target.value)}
          placeholder="z.B. sprechen, gehen..."
        />
        <label htmlFor="search-verb-es" className="verben-search-label">Buscar en español</label>
        <input
          id="search-verb-es"
          className="verben-search-input"
          type="search"
          value={queryEs}
          onChange={(e) => setQueryEs(e.target.value)}
          placeholder="ej. hablar, ir..."
        />
      </section>

      <main className="verben-main">
        <section className="verben-list" aria-label="Lista de verbos">
          {filtered.length === 0 ? (
            <p className="verben-empty">No hay verbos con ese filtro.</p>
          ) : (
            filtered.map((verb) => (
              <button
                key={verb.infinitive}
                type="button"
                className={`verb-item ${selectedVerb?.infinitive === verb.infinitive ? 'active' : ''}`}
                onClick={() => setSelected(verb.infinitive)}
              >
                <span className="verb-item-de">{verb.infinitive}</span>
                <span className="verb-item-es">{verb.translation}</span>
              </button>
            ))
          )}
        </section>

        <section className="verben-detail" aria-live="polite">
          {selectedVerb ? (
            <>
              <h2 className="verben-detail-title">
                <span>{selectedVerb.infinitive}</span>
                <small>{selectedVerb.translation}</small>
              </h2>
              <div className="verben-table-wrap">
                <table className="verben-table">
                  <thead>
                    <tr>
                      <th>Pronombre</th>
                      <th>Conjugación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRONOUN_ROWS.map((row) => (
                      <tr key={row.id}>
                        <td>{row.label}</td>
                        <td>{selectedVerb.conjugation[row.id]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="verben-empty">No hay verbos para mostrar.</p>
          )}
        </section>
      </main>
    </div>
  )
}
