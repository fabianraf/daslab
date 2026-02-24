import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NOUNS } from './data/nouns'
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

export default function App() {
  const [deck, setDeck] = useState(() => shuffle(NOUNS))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [feedback, setFeedback] = useState(null)
  const [showTranslation, setShowTranslation] = useState(false)

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
      setDeck(shuffle(NOUNS))
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
        <Link to="/" className="nav-link">← Ver tabla de artículos / Tabelle</Link>
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
