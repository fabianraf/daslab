import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, NOUNS, getCategory } from './data/nouns'
import { NounIcon } from './components/NounIcon'
import './App.css'

const ARTICLES = [
  { id: 'der', label: 'der', color: 'var(--der)' },
  { id: 'die', label: 'die', color: 'var(--die)' },
  { id: 'das', label: 'das', color: 'var(--das)' },
]

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function buildDeck(mode, categoryId) {
  if (mode === 'all') return shuffle(NOUNS)
  if (mode === 'random20') return shuffle(NOUNS).slice(0, Math.min(20, NOUNS.length))

  const categoryNouns = NOUNS.filter((n) => getCategory(n) === categoryId)
  return shuffle(categoryNouns).slice(0, Math.min(20, categoryNouns.length))
}

export default function App() {
  const [mode, setMode] = useState('all')
  const [categoryId, setCategoryId] = useState('lugares')
  const [deck, setDeck] = useState(() => buildDeck('all', 'lugares'))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [feedback, setFeedback] = useState(null)
  const [showTranslation, setShowTranslation] = useState(false)

  useEffect(() => {
    setDeck(buildDeck(mode, categoryId))
    setCurrentIndex(0)
    setScore({ correct: 0, total: 0 })
    setFeedback(null)
    setShowTranslation(false)
  }, [mode, categoryId])

  const current = deck[currentIndex]
  const isLast = currentIndex >= deck.length - 1
  const progress = deck.length ? ((currentIndex + 1) / deck.length) * 100 : 0

  const handleAnswer = (article) => {
    if (feedback !== null) return
    const correct = article === current.article
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
    setFeedback(correct ? 'correct' : 'wrong')
    setShowTranslation(true)
  }

  const nextWord = () => {
    setFeedback(null)
    setShowTranslation(false)
    if (isLast) {
      setDeck(buildDeck(mode, categoryId))
      setCurrentIndex(0)
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  if (!current) {
    return (
      <div className="app">
        <p className="loading">Cargando… / Laden…</p>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">
          <span className="title-der">der</span>
          <span className="title-die">die</span>
          <span className="title-das">das</span>
          <span className="title-lab">Lab</span>
        </h1>
        <p className="subtitle">Practica los artículos en alemán / Artikel üben</p>
        <nav className="practice-nav" aria-label="Otras secciones">
          <Link to="/" className="practice-section-link practice-section-link--table">
            ← Tabla / Artikel
          </Link>
          <Link to="/grammatik" className="practice-section-link practice-section-link--grammatik">
            Grammatik
          </Link>
        </nav>

        <div className="mode-panel">
          <p className="mode-label">Modo de práctica</p>
          <div className="mode-buttons" role="group" aria-label="Modo de práctica">
            <button
              type="button"
              className={`mode-btn ${mode === 'random20' ? 'active' : ''}`}
              onClick={() => setMode('random20')}
            >
              20 randómico
            </button>
            <button
              type="button"
              className={`mode-btn ${mode === 'category20' ? 'active' : ''}`}
              onClick={() => setMode('category20')}
            >
              20 por categoría
            </button>
            <button
              type="button"
              className={`mode-btn ${mode === 'all' ? 'active' : ''}`}
              onClick={() => setMode('all')}
            >
              Completo
            </button>
          </div>

          {mode === 'category20' && (
            <div className="mode-category">
              <label htmlFor="practice-category" className="mode-category-label">
                Categoría:
              </label>
              <select
                id="practice-category"
                className="mode-category-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {CATEGORIES.filter((c) => c.id !== 'todos').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="stats">
          <span className="stat">
            <strong>{score.correct}</strong> / {score.total} correctas / richtig
          </span>
          <span className="stat progress-label">
            {currentIndex + 1} / {deck.length}
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="practice">
        <div className="word-card">
          <p className="word-label">¿Qué artículo lleva? / Welcher Artikel?</p>
          <div className="word-card-icon">
            <NounIcon name={current.icon} size={56} />
          </div>
          <p className="word">{current.word}</p>
          {showTranslation && (
            <p className="translation">{current.translation}</p>
          )}
        </div>

        <div className="articles">
          {ARTICLES.map(({ id, label, color }) => (
            <button
              key={id}
              type="button"
              className={`article-btn ${feedback !== null ? 'disabled' : ''} ${
                feedback === 'wrong' && current.article === id ? 'reveal-correct' : ''
              } ${feedback === 'correct' && id === current.article ? 'correct' : ''} ${
                feedback === 'wrong' && id === current.article ? 'wrong' : ''
              }`}
              style={{ '--article-color': color }}
              onClick={() => handleAnswer(id)}
              disabled={feedback !== null}
            >
              {label}
            </button>
          ))}
        </div>

        {feedback !== null && (
          <div className={`feedback ${feedback}`}>
            {feedback === 'correct' ? (
              <p>✓ Correcto / Richtig</p>
            ) : (
              <p>Lo correcto es / Richtig ist <strong>{current.article}</strong> {current.word}</p>
            )}
            <button type="button" className="next-btn" onClick={nextWord}>
              {isLast ? 'Empezar de nuevo / Von vorn' : 'Siguiente / Weiter'}
            </button>
          </div>
        )}
      </main>

      <footer className="footer">
        <button
          type="button"
          className="hint-btn"
          onClick={() => setShowTranslation((v) => !v)}
        >
          {showTranslation ? 'Ocultar / ausblenden' : 'Mostrar / zeigen'} Übersetzung
        </button>
      </footer>
    </div>
  )
}
