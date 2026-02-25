import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { NOUNS, CATEGORIES, getCategory } from '../data/nouns'
import { NounIcon } from '../components/NounIcon'
import './Artikkles.css'

const LABELS = {
  der: { label: 'der', subtitle: 'masculino / männlich', className: 'art-der' },
  die: { label: 'die', subtitle: 'femenino / weiblich', className: 'art-die' },
  das: { label: 'das', subtitle: 'neutro / sächlich', className: 'art-das' },
}

function normalizeForSearch(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

export default function Artikkles() {
  const [categoryId, setCategoryId] = useState('todos')
  const [searchDe, setSearchDe] = useState('')
  const [searchEs, setSearchEs] = useState('')

  const filteredNouns = useMemo(() => {
    let list = categoryId === 'todos' ? NOUNS : NOUNS.filter((n) => getCategory(n) === categoryId)
    const de = normalizeForSearch(searchDe).trim()
    const es = normalizeForSearch(searchEs).trim()
    if (de) list = list.filter((n) => normalizeForSearch(n.word).includes(de) || normalizeForSearch(n.plural ?? '').includes(de))
    if (es) list = list.filter((n) => normalizeForSearch(n.translation).includes(es))
    return list
  }, [categoryId, searchDe, searchEs])

  const byArticle = useMemo(() => ({
    der: filteredNouns.filter((n) => n.article === 'der'),
    die: filteredNouns.filter((n) => n.article === 'die'),
    das: filteredNouns.filter((n) => n.article === 'das'),
  }), [filteredNouns])

  return (
    <div className="artikkles-page">
      <header className="artikkles-header">
        <nav className="artikkles-nav" aria-label="Otras secciones">
          <Link to="/practicar" className="artikkles-section-link artikkles-section-link--practicar">→ Practicar / Üben</Link>
          <Link to="/grammatik" className="artikkles-section-link artikkles-section-link--grammatik">Grammatik (Akkusativ, Dativ, Imperativ)</Link>
        </nav>
        <h1 className="artikkles-title">Artículos / Artikel</h1>
        <p className="artikkles-subtitle">Lista completa por tipo / Vollständige Liste (der / die / das)</p>
        <div className="artikkles-search">
          <label htmlFor="search-de" className="artikkles-search-label">Buscar en alemán</label>
          <input
            id="search-de"
            type="search"
            className="artikkles-search-input"
            placeholder="z.B. Apfel, Buch…"
            value={searchDe}
            onChange={(e) => setSearchDe(e.target.value)}
            aria-label="Buscar por palabra en alemán"
          />
          <label htmlFor="search-es" className="artikkles-search-label">Buscar en español</label>
          <input
            id="search-es"
            type="search"
            className="artikkles-search-input"
            placeholder="ej. manzana, libro…"
            value={searchEs}
            onChange={(e) => setSearchEs(e.target.value)}
            aria-label="Buscar por traducción en español"
          />
        </div>
        <div className="category-filter">
          <label htmlFor="category-select" className="category-label">Categoría / Kategorie:</label>
          <select
            id="category-select"
            className="category-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="artikkles-tables">
        {(['der', 'die', 'das']).map((art) => (
          <section key={art} className={`article-section ${LABELS[art].className}`}>
            <h2 className="section-title">
              <span className="section-article">{LABELS[art].label}</span>
              <span className="section-subtitle">{LABELS[art].subtitle}</span>
            </h2>
            <div className="table-wrap">
              <table className="nouns-table">
                <thead>
                  <tr>
                    <th className="col-icon" aria-label="Symbol" />
                    <th className="col-word">Substantiv</th>
                    <th className="col-article">Artikel</th>
                    <th className="col-plural">Plural</th>
                    <th className="col-translation">Übersetzung</th>
                  </tr>
                </thead>
                <tbody>
                  {byArticle[art].length === 0 ? (
                    <tr>
                      <td colSpan={5} className="empty-row">Ningún sustantivo en esta categoría / Keine Substantive in dieser Kategorie</td>
                    </tr>
                  ) : (
                    byArticle[art].map((noun) => (
                    <tr key={noun.word}>
                      <td className="col-icon">
                        <NounIcon name={noun.icon} size={24} className="row-icon" />
                      </td>
                      <td className="col-word">
                        <span className="word-main">{noun.word}</span>
                        <span className="word-translation-mobile">{noun.translation}</span>
                      </td>
                      <td className="col-article">{noun.article}</td>
                      <td className="col-plural">{noun.plural ?? '—'}</td>
                      <td className="col-translation">{noun.translation}</td>
                    </tr>
                  ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
