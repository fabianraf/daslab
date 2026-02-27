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

function speakGerman(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'de-DE'
  utterance.rate = 0.9
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

const EXERCISE_QUESTIONS = 10

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function buildQuestion(pool) {
  const safePool = pool.length > 0 ? pool : VERBS
  const verb = pickRandom(safePool)
  const pronoun = pickRandom(PRONOUN_ROWS)
  const correct = verb.conjugation[pronoun.id]

  // Distractores del mismo verbo (distintos pronombres) para subir dificultad.
  const sameVerbForms = [...new Set(PRONOUN_ROWS.map((row) => verb.conjugation[row.id]).filter(Boolean))]
  const distractors = shuffle(sameVerbForms.filter((form) => form !== correct)).slice(0, 3)

  const options = shuffle([correct, ...distractors])

  return { verb, pronoun, correct, options }
}

function buildExercise(pool) {
  return Array.from({ length: EXERCISE_QUESTIONS }, () => buildQuestion(pool))
}

export default function Verben() {
  const [queryDe, setQueryDe] = useState('')
  const [queryEs, setQueryEs] = useState('')
  const [selected, setSelected] = useState(VERBS[0].infinitive)
  const [exercise, setExercise] = useState(() => buildExercise(VERBS))
  const [questionIndex, setQuestionIndex] = useState(0)
  const [exerciseScore, setExerciseScore] = useState({ correct: 0, total: 0 })
  const [exerciseFeedback, setExerciseFeedback] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)

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

  const currentQuestion = exercise[questionIndex]
  const isLastQuestion = questionIndex >= exercise.length - 1
  const isExerciseDone = exerciseFeedback === 'done'

  const resetExercise = () => {
    setExercise(buildExercise(filtered.length > 0 ? filtered : VERBS))
    setQuestionIndex(0)
    setExerciseScore({ correct: 0, total: 0 })
    setExerciseFeedback(null)
    setSelectedOption(null)
  }

  const handleExerciseAnswer = (option) => {
    if (!currentQuestion || exerciseFeedback) return
    const isCorrect = option === currentQuestion.correct
    setSelectedOption(option)
    setExerciseScore((s) => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }))
    setExerciseFeedback(isCorrect ? 'correct' : 'wrong')
  }

  const nextQuestion = () => {
    if (isLastQuestion) {
      setExerciseFeedback('done')
      return
    }
    setQuestionIndex((i) => i + 1)
    setExerciseFeedback(null)
    setSelectedOption(null)
  }

  return (
    <div className="verben-page">
      <header className="verben-header">
        <nav className="verben-nav" aria-label="Otras secciones">
          <Link to="/" className="verben-link verben-link--inicio">← Inicio / Start</Link>
          <Link to="/artikel" className="verben-link verben-link--table">Artículos / Artikel</Link>
          <Link to="/ueben" className="verben-link verben-link--practice">→ Practicar / Üben</Link>
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
              <div key={verb.infinitive} className={`verb-item ${selectedVerb?.infinitive === verb.infinitive ? 'active' : ''}`}>
                <button
                  type="button"
                  className="verb-select-btn"
                  onClick={() => setSelected(verb.infinitive)}
                >
                  <span className="verb-item-de">{verb.infinitive}</span>
                  <span className="verb-item-es">{verb.translation}</span>
                </button>
                <button
                  type="button"
                  className="verb-speak-btn"
                  onClick={() => speakGerman(verb.infinitive)}
                  aria-label={`Pronunciar ${verb.infinitive} en alemán`}
                  title="Escuchar en alemán"
                >
                  audio
                </button>
              </div>
            ))
          )}
        </section>

        <section className="verben-detail" aria-live="polite">
          {selectedVerb ? (
            <>
              <h2 className="verben-detail-title">
                <span>{selectedVerb.infinitive}</span>
                <small>{selectedVerb.translation}</small>
                <button
                  type="button"
                  className="verb-speak-btn"
                  onClick={() => speakGerman(selectedVerb.infinitive)}
                  aria-label={`Pronunciar ${selectedVerb.infinitive} en alemán`}
                  title="Escuchar en alemán"
                >
                  audio
                </button>
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
                        <td>
                          <span>{selectedVerb.conjugation[row.id]}</span>
                          <button
                            type="button"
                            className="verb-speak-btn"
                            onClick={() => speakGerman(`${row.label} ${selectedVerb.conjugation[row.id]}`)}
                            aria-label={`Pronunciar ${row.label} ${selectedVerb.conjugation[row.id]} en alemán`}
                            title="Escuchar en alemán"
                          >
                            audio
                          </button>
                        </td>
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

      <section className="verben-exercise">
        <div className="verben-exercise-head">
          <h2>Ejercicios rápidos / Schnelltraining</h2>
          <p>
            Conjuga en presente. {filtered.length > 0 ? 'Usa tu lista filtrada actual.' : 'Usa todos los verbos.'}
          </p>
        </div>

        {currentQuestion && !isExerciseDone ? (
          <>
            <div className="exercise-progress">
              <span>Pregunta {questionIndex + 1} / {exercise.length}</span>
              <span>{exerciseScore.correct} correctas</span>
            </div>
            <p className="exercise-prompt">
              <strong>{currentQuestion.pronoun.label}</strong> + <strong>{currentQuestion.verb.infinitive}</strong>
              <span> ({currentQuestion.verb.translation})</span>
              {exerciseFeedback ? (
                <button
                  type="button"
                  className="verb-speak-btn"
                  onClick={() => speakGerman(`${currentQuestion.pronoun.label} ${currentQuestion.correct}`)}
                  aria-label="Pronunciar la respuesta correcta en alemán"
                  title="Escuchar en alemán"
                >
                  audio
                </button>
              ) : null}
            </p>
            <div className="exercise-options">
              {currentQuestion.options.map((option) => {
                const isCorrect = option === currentQuestion.correct
                const isSelectedWrong = exerciseFeedback === 'wrong' && selectedOption === option && !isCorrect
                return (
                  <button
                    key={option}
                    type="button"
                    className={`exercise-option ${
                      exerciseFeedback === 'correct' && isCorrect ? 'correct' : ''
                    } ${exerciseFeedback === 'wrong' && isCorrect ? 'reveal-correct' : ''} ${
                      isSelectedWrong ? 'wrong' : ''
                    }`}
                    onClick={() => handleExerciseAnswer(option)}
                    disabled={Boolean(exerciseFeedback)}
                  >
                    {option}
                  </button>
                )
              })}
            </div>

            {exerciseFeedback && exerciseFeedback !== 'done' ? (
              <div className={`exercise-feedback ${exerciseFeedback}`}>
                {exerciseFeedback === 'correct' ? (
                  <p>✓ Correcto / Richtig</p>
                ) : (
                  <p>
                    Correcto: <strong>{currentQuestion.correct}</strong>
                  </p>
                )}
                <button type="button" className="exercise-next" onClick={nextQuestion}>
                  {isLastQuestion ? 'Ver resultado final' : 'Siguiente'}
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="exercise-result">
            <p>
              Resultado: <strong>{exerciseScore.correct} / {exercise.length}</strong>
            </p>
            <button type="button" className="exercise-next" onClick={resetExercise}>
              Nuevo ejercicio
            </button>
          </div>
        )}
      </section>
      <p className="made-by-footer">Erstellt von Fabián Aguirre · 2026</p>
    </div>
  )
}
