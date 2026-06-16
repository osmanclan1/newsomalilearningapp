import { useState } from 'react'
import { Link } from 'react-router-dom'
import LessonProgress from '../components/lesson/LessonProgress'
import PatternChallenge from '../components/lesson/PatternChallenge'
import { lesson1a } from '../data/lessons/unit1-lesson1a'
import { useProgressStore } from '../store/progressStore'

const accentStyles = {
  teal: {
    card: 'border-teal-200 bg-teal-50/50',
    verb: 'text-teal-700',
  },
  violet: {
    card: 'border-violet-200 bg-violet-50/50',
    verb: 'text-violet-700',
  },
}

function highlightEnding(text, ending) {
  const idx = text.indexOf(ending)
  if (idx === -1) return <span>{text}</span>
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-extrabold underline decoration-2">{ending}</span>
      {text.slice(idx + ending.length)}
    </>
  )
}

function PatternRow({ row, style }) {
  const prefix = row.connector ? `${row.subject} ${row.connector} ` : `${row.subject} `

  return (
    <div className="rounded-xl border border-white/80 bg-white px-3 py-3 shadow-sm">
      <p className="font-mono text-sm text-slate-900">
        {prefix}
        <span className={`font-extrabold ${style.verb}`}>{row.verb}</span>
        <span className="text-slate-400">...</span>
      </p>
      <p className="mt-2 text-sm text-slate-600">= {row.english}</p>
    </div>
  )
}

function ConnectedPatternCard({ pattern }) {
  const style = accentStyles[pattern.accent]

  return (
    <div className={`rounded-2xl border p-4 ${style.card}`}>
      <div className="flex items-start gap-2">
        <span aria-hidden>{pattern.icon}</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-slate-900">{pattern.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{pattern.note}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {pattern.rows.map((row) => (
          <PatternRow
            key={`${row.subject}-${row.verb}`}
            row={row}
            style={{
              verb: style.verb,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function SpotPatternsScreen({ screen }) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm leading-relaxed text-slate-700">{screen.intro}</p>

      <section>
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden>
            {screen.step1.emoji}
          </span>
          <h2 className="text-base font-bold text-slate-900">{screen.step1.title}</h2>
        </div>
        <div className="mt-3 grid gap-2">
          {screen.step1.markers.map((marker) => (
            <div
              key={marker.somali}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="rounded-lg bg-brand-soft px-2 py-0.5 font-mono text-sm font-extrabold text-brand">
                  {marker.somali}
                </span>
                <span className="text-sm font-bold text-slate-800">= {marker.label}</span>
              </div>
              <p className="mt-1.5 text-sm text-slate-500">({marker.note})</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden>
            {screen.step2.emoji}
          </span>
          <h2 className="text-base font-bold text-slate-900">{screen.step2.title}</h2>
        </div>
        <div className="mt-3 flex flex-col gap-4">
          {screen.step2.patterns.map((pattern) => (
            <ConnectedPatternCard key={pattern.id} pattern={pattern} />
          ))}
        </div>
      </section>
    </div>
  )
}

function BuildingSentencesScreen({ screen }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm leading-relaxed text-slate-700">{screen.intro}</p>
      <div className="flex flex-col gap-3">
        {screen.examples.map((ex) => (
          <div
            key={ex.somali}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <p className="flex-1 font-mono text-sm font-semibold text-slate-900">
                {highlightEnding(ex.somali, ex.highlight)}
              </p>
              <span className="hidden text-brand sm:inline" aria-hidden>
                ➡️
              </span>
              <p className="flex-1 text-sm font-medium text-slate-600">{ex.english}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Lesson1AScreen() {
  const [step, setStep] = useState(0)
  const [quizPassed, setQuizPassed] = useState(false)
  const [finished, setFinished] = useState(false)
  const completeLesson = useProgressStore((s) => s.completeLesson)

  const screens = lesson1a.screens
  const screen = screens[step]
  const isLast = step === screens.length - 1
  const isQuiz = screen.id === 'pattern-challenge'

  const handleNext = () => {
    if (isLast && quizPassed) {
      completeLesson(lesson1a.unitId, lesson1a.id)
      setFinished(true)
      return
    }
    if (step < screens.length - 1) setStep((s) => s + 1)
  }

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1)
      if (screens[step].id === 'pattern-challenge') setQuizPassed(false)
    }
  }

  if (finished) {
    return (
      <div className="mx-auto flex min-h-[100dvh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <span className="text-5xl" aria-hidden>
          🎉
        </span>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Lesson complete!</h1>
        <p className="mt-2 text-sm text-slate-600">
          You spotted the patterns — imid, timid, nimid and ahay, tahay, nahay.
        </p>
        <Link
          to="/"
          className="mt-8 rounded-xl bg-brand px-8 py-3 text-sm font-bold text-white"
        >
          Back to home
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-lg flex-col">
      <header className="shrink-0 border-b border-slate-200 bg-white px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-sm font-medium text-brand">
            ← Back
          </Link>
          <p className="text-xs font-semibold text-slate-500">{lesson1a.lessonLabel}</p>
        </div>
        <div className="mt-3">
          <LessonProgress current={step} total={screens.length} />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          Unit {lesson1a.unitId}: {lesson1a.unitTitle}
        </p>
        <div className="mt-2 flex items-start gap-2">
          <span className="text-2xl" aria-hidden>
            {screen.emoji}
          </span>
          <h1 className="text-xl font-bold text-slate-900">{screen.title}</h1>
        </div>

        <div className="mt-4">
          {screen.id === 'spot-patterns' && <SpotPatternsScreen screen={screen} />}
          {screen.id === 'building' && <BuildingSentencesScreen screen={screen} />}
          {screen.id === 'pattern-challenge' && (
            <PatternChallenge screen={screen} onComplete={() => setQuizPassed(true)} />
          )}
        </div>
      </main>

      <footer className="shrink-0 border-t border-slate-200 bg-white px-4 py-4">
        <div className="flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700"
            >
              Back
            </button>
          )}
          {!isQuiz && (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 rounded-xl bg-brand py-3 text-sm font-bold text-white"
            >
              {isLast ? 'Finish' : 'Next →'}
            </button>
          )}
          {isQuiz && quizPassed && (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 rounded-xl bg-brand py-3 text-sm font-bold text-white"
            >
              Finish lesson
            </button>
          )}
        </div>
        {isQuiz && !quizPassed && (
          <p className="mt-2 text-center text-xs text-slate-400">
            Answer all 5 questions to finish the lesson
          </p>
        )}
      </footer>
    </div>
  )
}
