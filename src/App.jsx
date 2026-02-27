import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, NOUNS, getCategory } from './data/nouns'
import { NounIcon } from './components/NounIcon'
import './App.css'

const GAME_TYPES = [
  {
    id: 'artikel',
    label: 'Artículos (Nominativ)',
    description: 'Solo der / die / das en singular.',
  },
  {
    id: 'cases',
    label: 'Casos (Nom / Akk / Dat)',
    description: 'Practica el artículo correcto por caso gramatical.',
  },
  {
    id: 'kein',
    label: 'ein / eine / kein / keine / -',
    description: 'Nominativ y Akkusativ con indefinido, negación y sin artículo.',
  },
]

const CASES = ['Nominativ', 'Akkusativ', 'Dativ']

const CASE_ARTICLE_BY_GENDER = {
  der: { Nominativ: 'der', Akkusativ: 'den', Dativ: 'dem' },
  die: { Nominativ: 'die', Akkusativ: 'die', Dativ: 'der' },
  das: { Nominativ: 'das', Akkusativ: 'das', Dativ: 'dem' },
}

const EIN_FORMS = {
  der: { Nominativ: 'ein', Akkusativ: 'einen' },
  die: { Nominativ: 'eine', Akkusativ: 'eine' },
  das: { Nominativ: 'ein', Akkusativ: 'ein' },
}

const KEIN_FORMS = {
  der: { Nominativ: 'kein', Akkusativ: 'keinen' },
  die: { Nominativ: 'keine', Akkusativ: 'keine' },
  das: { Nominativ: 'kein', Akkusativ: 'kein' },
}

const NO_ARTICLE = '__none__'

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

function buildCasesDeck(baseDeck) {
  return baseDeck.map((noun) => {
    const selectedCase = CASES[Math.floor(Math.random() * CASES.length)]
    const expected = CASE_ARTICLE_BY_GENDER[noun.article][selectedCase]
    const optionsByGender = {
      der: ['der', 'den', 'dem'],
      die: ['die', 'der', 'dem'],
      das: ['das', 'dem', 'den'],
    }

    return {
      noun,
      selectedCase,
      options: optionsByGender[noun.article],
      expected,
      phrase: `___ ${noun.word}`,
      solutionPhrase: `${expected} ${noun.word}`,
    }
  })
}

function buildKeinDeck(baseDeck) {
  const noPlural = baseDeck.filter((n) => n.plural === '—')
  const withPlural = baseDeck.filter((n) => n.plural && n.plural !== '—')
  const countableSingular = withPlural
  const cases = ['Nominativ', 'Akkusativ']

  function pickOptions(expected) {
    const all = ['ein', 'eine', 'einen', 'kein', 'keine', 'keinen', NO_ARTICLE]
    const distractors = shuffle(all.filter((item) => item !== expected)).slice(0, 3)
    return shuffle([expected, ...distractors])
  }

  return baseDeck.map((_, index) => {
    const selectedCase = cases[Math.floor(Math.random() * cases.length)]
    const kind = index % 5

    // Nominativ singular positivo: Das ist ein/eine...
    if (kind === 0 && countableSingular.length > 0) {
      const noun = countableSingular[Math.floor(Math.random() * countableSingular.length)]
      const expected = EIN_FORMS[noun.article].Nominativ
      return {
        noun,
        patternLabel: 'Nominativ / Singular',
        expected,
        options: pickOptions(expected),
        phrase: `Das ist ___ ${noun.word}.`,
        solutionPhrase: `Das ist ${expected} ${noun.word}.`,
      }
    }

    // Akkusativ singular positivo: Ich kaufe einen/eine/ein...
    if (kind === 1 && countableSingular.length > 0) {
      const noun = countableSingular[Math.floor(Math.random() * countableSingular.length)]
      const expected = EIN_FORMS[noun.article].Akkusativ
      return {
        noun,
        patternLabel: 'Akkusativ / Singular',
        expected,
        options: pickOptions(expected),
        phrase: `Ich kaufe ___ ${noun.word}.`,
        solutionPhrase: `Ich kaufe ${expected} ${noun.word}.`,
      }
    }

    // Akkusativ singular negativo: Ich kaufe keinen/keine/kein...
    if (kind === 2 && countableSingular.length > 0) {
      const noun = countableSingular[Math.floor(Math.random() * countableSingular.length)]
      const expected = KEIN_FORMS[noun.article].Akkusativ
      return {
        noun,
        patternLabel: 'Akkusativ / Negación singular',
        expected,
        options: pickOptions(expected),
        phrase: `Ich kaufe ___ ${noun.word}.`,
        solutionPhrase: `Ich kaufe ${expected} ${noun.word}.`,
      }
    }

    // Plural: sin artículo o "keine"
    if (kind === 3 && withPlural.length > 0) {
      const pluralNoun = withPlural[Math.floor(Math.random() * withPlural.length)]
      const isNegative = Math.random() > 0.5
      const expected = isNegative ? 'keine' : NO_ARTICLE
      return {
        noun: pluralNoun,
        patternLabel: 'Plural',
        expected,
        options: pickOptions(expected),
        phrase: `Ich kaufe ___ ${pluralNoun.plural}.`,
        solutionPhrase: isNegative
          ? `Ich kaufe keine ${pluralNoun.plural}.`
          : `Ich kaufe ${pluralNoun.plural}.`,
      }
    }

    // Nombres incontables: normalmente sin artículo o "kein/keine"
    if (noPlural.length > 0) {
      const bareNoun = noPlural[Math.floor(Math.random() * noPlural.length)]
      const isNegative = Math.random() > 0.5
      const expected = isNegative ? KEIN_FORMS[bareNoun.article].Akkusativ : NO_ARTICLE
      return {
        noun: bareNoun,
        patternLabel: 'Akkusativ / Incontable',
        expected,
        options: pickOptions(expected),
        phrase: `Ich brauche ___ ${bareNoun.word}.`,
        solutionPhrase: isNegative
          ? `Ich brauche ${expected} ${bareNoun.word}.`
          : `Ich brauche ${bareNoun.word}.`,
      }
    }

    // Fallback (si no hubiera incontables): singular positivo/negativo
    const noun = countableSingular[Math.floor(Math.random() * countableSingular.length)]
    const isNegative = Math.random() > 0.5
    const expected = isNegative
      ? KEIN_FORMS[noun.article][selectedCase]
      : EIN_FORMS[noun.article][selectedCase]

    const phrase = selectedCase === 'Nominativ'
      ? `Das ist ___ ${noun.word}.`
      : `Ich kaufe ___ ${noun.word}.`

    const solutionPhrase = selectedCase === 'Nominativ'
      ? `Das ist ${expected} ${noun.word}.`
      : `Ich kaufe ${expected} ${noun.word}.`

    return {
      noun,
      patternLabel: `${selectedCase} / Singular`,
      expected,
      options: pickOptions(expected),
      phrase,
      solutionPhrase,
    }
  })
}

function determinerLabel(value) {
  return value === NO_ARTICLE ? '-' : value
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
  const [gameType, setGameType] = useState('artikel')
  const [mode, setMode] = useState('all')
  const [categoryId, setCategoryId] = useState('lugares')
  const [deck, setDeck] = useState(() => buildDeck('all', 'lugares'))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [feedback, setFeedback] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showTranslation, setShowTranslation] = useState(false)

  const casesQuestions = useMemo(() => buildCasesDeck(deck), [deck])
  const keinQuestions = useMemo(() => buildKeinDeck(deck), [deck])

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
  }, [gameType])

  const current = deck[currentIndex]
  const currentCase = casesQuestions[currentIndex]
  const currentKein = keinQuestions[currentIndex]
  const activeNoun = gameType === 'kein'
    ? currentKein?.noun || current
    : gameType === 'cases'
      ? currentCase?.noun || current
      : current
  const isLast = currentIndex >= deck.length - 1
  const progress = deck.length ? ((currentIndex + 1) / deck.length) * 100 : 0

  const handleAnswer = (answer) => {
    if (feedback !== null) return
    const expected = gameType === 'artikel'
      ? current.article
      : gameType === 'cases'
        ? currentCase.expected
        : currentKein.expected
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
          <Link to="/" className="practice-section-link practice-section-link--inicio">
            ← Inicio / Start
          </Link>
          <Link to="/artikel" className="practice-section-link practice-section-link--table">
            Artículos / Artikel
          </Link>
          <Link to="/grammatik" className="practice-section-link practice-section-link--grammatik">
            Grammatik
          </Link>
          <Link to="/verben" className="practice-section-link practice-section-link--verben">
            Verbos / Verben
          </Link>
        </nav>

        <div className="mode-panel">
          <p className="mode-label">Juegos</p>
          <div className="practice-type-buttons" role="group" aria-label="Tipo de entrenamiento">
            {GAME_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`mode-btn ${gameType === t.id ? 'active' : ''}`}
                onClick={() => setGameType(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="game-description">
            {GAME_TYPES.find((g) => g.id === gameType)?.description}
          </p>

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
            {gameType === 'artikel'
              ? '¿Qué artículo lleva? / Welcher Artikel?'
              : gameType === 'cases'
                ? 'Completa según el caso / Ergänze nach Fall'
                : 'ein / eine / kein / keine / -'}
          </p>
          <div className="word-card-icon">
            <NounIcon name={activeNoun.icon} size={56} />
          </div>
          {gameType === 'artikel' ? (
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
          ) : gameType === 'cases' ? (
            <>
              <p className="word-row dativ-row">
                <span className="word dativ-phrase">{currentCase.phrase}</span>
                {feedback !== null ? (
                  <button
                    type="button"
                    className="speak-btn"
                    onClick={() => speakGerman(currentCase.solutionPhrase)}
                    aria-label={`Pronunciar ${currentCase.solutionPhrase} en alemán`}
                    title="Escuchar en alemán"
                  >
                    audio
                  </button>
                ) : null}
              </p>
              <p className="dativ-pattern">{currentCase.selectedCase}</p>
            </>
          ) : (
            <>
              <p className="word-row dativ-row">
                <span className="word dativ-phrase">{currentKein.phrase}</span>
                {feedback !== null ? (
                  <button
                    type="button"
                    className="speak-btn"
                    onClick={() => speakGerman(currentKein.solutionPhrase)}
                    aria-label={`Pronunciar ${currentKein.solutionPhrase} en alemán`}
                    title="Escuchar en alemán"
                  >
                    audio
                  </button>
                ) : null}
              </p>
              <p className="dativ-pattern">{currentKein.patternLabel}</p>
            </>
          )}
          {showTranslation && (
            <p className="translation">{activeNoun.translation}</p>
          )}
        </div>

        <div className="articles">
          {(gameType === 'artikel'
            ? [
              { id: 'der', label: 'der', color: 'var(--der)' },
              { id: 'die', label: 'die', color: 'var(--die)' },
              { id: 'das', label: 'das', color: 'var(--das)' },
            ]
            : gameType === 'cases'
              ? currentCase.options.map((opt) => ({ id: opt, label: opt, color: 'var(--accent)' }))
              : currentKein.options.map((opt) => ({ id: opt, label: opt, color: 'var(--accent)' }))).map(({ id, label, color }) => {
              const expected = gameType === 'artikel'
                ? current.article
                : gameType === 'cases'
                  ? currentCase.expected
                  : currentKein.expected
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
                  {determinerLabel(label)}
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
                {gameType === 'artikel' ? (
                  <>
                    Lo correcto es / Richtig ist <strong>{current.article}</strong> {activeNoun.word}
                  </>
                ) : (
                  <>
                    Lo correcto es / Richtig ist → <strong>{gameType === 'cases' ? currentCase.solutionPhrase : currentKein.solutionPhrase}</strong>
                  </>
                )}
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
