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

export default function Artikkles() {
  const [categoryId, setCategoryId] = useState('todos')

  const filteredNouns = useMemo(() => {
    if (categoryId === 'todos') return NOUNS
    return NOUNS.filter((n) => getCategory(n) === categoryId)
  }, [categoryId])

  const byArticle = useMemo(() => ({
    der: filteredNouns.filter((n) => n.article === 'der'),
    die: filteredNouns.filter((n) => n.article === 'die'),
    das: filteredNouns.filter((n) => n.article === 'das'),
  }), [filteredNouns])

  return (
    <div className="artikkles-page">
      <header className="artikkles-header">
        <div className="artikkles-nav">
          <Link to="/practicar" className="back-link">→ Practicar / Üben</Link>
          <Link to="/grammatik" className="back-link">Grammatik (Akkusativ, Dativ, Imperativ)</Link>
        </div>
        <h1 className="artikkles-title">Artículos / Artikel</h1>
        <p className="artikkles-subtitle">Lista completa por tipo / Vollständige Liste (der / die / das)</p>
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
