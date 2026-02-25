import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, NOUNS, getCategory } from './data/nouns'
import { NounIcon } from './components/NounIcon'
import './App.css'

const ARTICLES = [
  { id: 'der', label: 'der', color: 'var(--der)' },
  { id: 'die', label: 'die', color: 'var(--die)' },
  { id: 'das', label: 'das', color: 'var(--das)' },
]

const PRACTICE_TYPES = [
  { id: 'artikel', label: 'Artículos (der / die / das)' },
  { id: 'dativ', label: 'Dativ (dem/der + ein/kein)' },
]

const DATIV_PATTERNS = [
  {
    id: 'definite',
    label: 'Definido: der/die/das',
    options: ['dem', 'der'],
    getExpected: (article) => (article === 'die' ? 'der' : 'dem'),
  },
  {
    id: 'indefinite',
    label: 'Indefinido: ein/eine',
    options: ['einem', 'einer'],
    getExpected: (article) => (article === 'die' ? 'einer' : 'einem'),
  },
  {
    id: 'negative',
    label: 'Negación: kein/keine',
    options: ['keinem', 'keiner'],
    getExpected: (article) => (article === 'die' ? 'keiner' : 'keinem'),
  },
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

function buildDativDeck(baseDeck) {
  return baseDeck.map((noun) => {
    const pattern = DATIV_PATTERNS[Math.floor(Math.random() * DATIV_PATTERNS.length)]
    const expected = pattern.getExpected(noun.article)
    return {
      noun,
      patternId: pattern.id,
      patternLabel: pattern.label,
      options: pattern.options,
      expected,
      phrase: `mit ___ ${noun.word}`,
      solutionPhrase: `mit ${expected} ${noun.word}`,
    }
  })
}

function speakGerman(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'de-DE'
  utterance.rate = 0.9
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

export default function App() {
  const [practiceType, setPracticeType] = useState('artikel')
  const [mode, setMode] = useState('all')
  const [categoryId, setCategoryId] = useState('lugares')
  const [deck, setDeck] = useState(() => buildDeck('all', 'lugares'))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [feedback, setFeedback] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showTranslation, setShowTranslation] = useState(false)

  const dativQuestions = useMemo(() => buildDativDeck(deck), [deck])

  useEffect(() => {
    setDeck(buildDeck(mode, categoryId))
    setCurrentIndex(0)
    setScore({ correct: 0, total: 0 })
    setFeedback(null)
    setSelectedAnswer(null)
    setShowTranslation(false)
  }, [mode, categoryId])

  useEffect(() => {
    setCurrentIndex(0)
    setScore({ correct: 0, total: 0 })
    setFeedback(null)
    setSelectedAnswer(null)
    setShowTranslation(false)
  }, [practiceType])

  const current = deck[currentIndex]
  const currentDativ = dativQuestions[currentIndex]
  const isLast = currentIndex >= deck.length - 1
  const progress = deck.length ? ((currentIndex + 1) / deck.length) * 100 : 0

  const handleAnswer = (answer) => {
    if (feedback !== null) return
    const expected = practiceType === 'artikel' ? current.article : currentDativ.expected
    const correct = answer === expected
    setSelectedAnswer(answer)
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
    setFeedback(correct ? 'correct' : 'wrong')
    setShowTranslation(true)
  }

  const nextWord = () => {
    setFeedback(null)
    setSelectedAnswer(null)
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
          <Link to="/artikel" className="practice-section-link practice-section-link--table">
            ← Tabla / Artikel
          </Link>
          <Link to="/grammatik" className="practice-section-link practice-section-link--grammatik">
            Grammatik
          </Link>
          <Link to="/verben" className="practice-section-link practice-section-link--verben">
            Verbos / Verben
          </Link>
        </nav>

        <div className="mode-panel">
          <p className="mode-label">Entrenamiento</p>
          <div className="practice-type-buttons" role="group" aria-label="Tipo de entrenamiento">
            {PRACTICE_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`mode-btn ${practiceType === t.id ? 'active' : ''}`}
                onClick={() => setPracticeType(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

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
          <p className="word-label">
            {practiceType === 'artikel'
              ? '¿Qué artículo lleva? / Welcher Artikel?'
              : 'Completa en Dativ / Ergänze im Dativ'}
          </p>
          <div className="word-card-icon">
            <NounIcon name={current.icon} size={56} />
          </div>
          {practiceType === 'artikel' ? (
            <p className="word-row">
              <span className="word">{current.word}</span>
              {feedback !== null ? (
                <button
                  type="button"
                  className="speak-btn"
                  onClick={() => speakGerman(`${current.article} ${current.word}`)}
                  aria-label={`Pronunciar ${current.article} ${current.word} en alemán`}
                  title="Escuchar en alemán"
                >
                  audio
                </button>
              ) : null}
            </p>
          ) : (
            <>
              <p className="word-row dativ-row">
                <span className="word dativ-phrase">{currentDativ.phrase}</span>
                {feedback !== null ? (
                  <button
                    type="button"
                    className="speak-btn"
                    onClick={() => speakGerman(currentDativ.solutionPhrase)}
                    aria-label={`Pronunciar ${currentDativ.solutionPhrase} en alemán`}
                    title="Escuchar en alemán"
                  >
                    audio
                  </button>
                ) : null}
              </p>
              <p className="dativ-pattern">{currentDativ.patternLabel}</p>
            </>
          )}
          {showTranslation && (
            <p className="translation">{current.translation}</p>
          )}
        </div>

        <div className="articles">
          {(practiceType === 'artikel'
            ? ARTICLES.map(({ id, label, color }) => ({ id, label, color }))
            : currentDativ.options.map((opt) => ({ id: opt, label: opt, color: 'var(--accent)' }))).map(({ id, label, color }) => {
              const expected = practiceType === 'artikel' ? current.article : currentDativ.expected
              const isSelectedWrong = feedback === 'wrong' && selectedAnswer === id && id !== expected
              const isExpected = id === expected

              return (
                <button
                  key={id}
                  type="button"
                  className={`article-btn ${feedback !== null ? 'disabled' : ''} ${
                    feedback === 'wrong' && isExpected ? 'reveal-correct' : ''
                  } ${feedback === 'correct' && isExpected ? 'correct' : ''} ${
                    isSelectedWrong ? 'wrong' : ''
                  }`}
                  style={{ '--article-color': color }}
                  onClick={() => handleAnswer(id)}
                  disabled={feedback !== null}
                >
                  {label}
                </button>
              )
            })}
        </div>

        {feedback !== null && (
          <div className={`feedback ${feedback}`}>
            {feedback === 'correct' ? (
              <p>✓ Correcto / Richtig</p>
            ) : (
              <p>
                Lo correcto es / Richtig ist{' '}
                <strong>{practiceType === 'artikel' ? current.article : currentDativ.expected}</strong>{' '}
                {current.word}
                {practiceType === 'dativ' ? (
                  <>
                    {' '}→ <strong>{currentDativ.solutionPhrase}</strong>
                  </>
                ) : null}
              </p>
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
