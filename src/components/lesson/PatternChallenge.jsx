import { useState } from 'react'

function QuestionBlock({ question, selectedId, checked, onSelect }) {
  const correct = selectedId === question.correctId

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-brand">
        {question.label}
      </p>
      {question.promptSomali && (
        <p className="mt-1 font-mono text-base font-bold text-slate-900">
          {question.promptSomali}
        </p>
      )}
      {question.promptText && (
        <p className="mt-1 text-sm font-semibold text-slate-800">{question.promptText}</p>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {question.options.map((opt) => {
          const isSelected = selectedId === opt.id
          const isCorrectOption = opt.id === question.correctId

          let optionClass =
            'border-slate-200 bg-slate-50 text-slate-800 hover:border-violet-200'

          if (isSelected && !checked) {
            optionClass = 'border-brand bg-brand-soft text-brand'
          } else if (checked && isCorrectOption) {
            optionClass = 'border-emerald-400 bg-emerald-50 text-emerald-800'
          } else if (checked && isSelected && !correct) {
            optionClass = 'border-coral bg-orange-50 text-coral'
          }

          return (
            <button
              key={opt.id}
              type="button"
              disabled={checked}
              onClick={() => onSelect(question.id, opt.id)}
              className={`rounded-xl border px-4 py-3 text-left transition ${optionClass} disabled:cursor-default`}
            >
              <span className="text-sm font-semibold">{opt.label}</span>
              {opt.sublabel && (
                <span className="mt-0.5 block text-xs font-normal opacity-80">
                  ({opt.sublabel})
                </span>
              )}
            </button>
          )
        })}
      </div>

      {checked && (
        <div
          className={`mt-3 rounded-xl px-3 py-2 text-sm ${
            correct ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-50 text-coral'
          }`}
        >
          <p className="font-semibold">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}

function RoundSection({ round, questions, answers, checked, onSelect }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg" aria-hidden>
          {round.emoji}
        </span>
        <h2 className="text-sm font-bold text-slate-900">{round.title}</h2>
      </div>
      <div className="flex flex-col gap-3">
        {questions.map((q) => (
          <QuestionBlock
            key={q.id}
            question={q}
            selectedId={answers[q.id]}
            checked={checked}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  )
}

export default function PatternChallenge({ screen, onComplete }) {
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)

  const allAnswered = screen.questions.every((q) => answers[q.id])
  const allCorrect = screen.questions.every(
    (q) => answers[q.id] === q.correctId,
  )
  const score = screen.questions.filter(
    (q) => answers[q.id] === q.correctId,
  ).length

  const handleSelect = (questionId, optionId) => {
    if (checked) return
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }

  const handleCheck = () => {
    if (!allAnswered) return
    setChecked(true)
    if (allCorrect) {
      onComplete?.()
    }
  }

  const questionsByRound = screen.rounds.map((round) => ({
    round,
    questions: screen.questions.filter((q) => q.roundId === round.id),
  }))

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm leading-relaxed text-slate-700">{screen.intro}</p>

      {questionsByRound.map(({ round, questions }) => (
        <RoundSection
          key={round.id}
          round={round}
          questions={questions}
          answers={answers}
          checked={checked}
          onSelect={handleSelect}
        />
      ))}

      {!checked && (
        <button
          type="button"
          disabled={!allAnswered}
          onClick={handleCheck}
          className="w-full rounded-xl bg-brand py-3 text-sm font-bold text-white transition enabled:hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-40"
        >
          👀 {screen.checkLabel}
          <span className="mt-0.5 block text-xs font-normal text-violet-200">
            ({screen.checkLabelSomali})
          </span>
        </button>
      )}

      {checked && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-center text-lg font-bold text-slate-900">
            {score}/{screen.questions.length} correct
          </p>
          {!allCorrect && (
            <button
              type="button"
              onClick={() => {
                setAnswers({})
                setChecked(false)
              }}
              className="mt-3 w-full rounded-xl border border-coral py-3 text-sm font-bold text-coral"
            >
              Try again
            </button>
          )}
          {allCorrect && (
            <p className="mt-2 text-center text-sm font-semibold text-emerald-600">
              Perfect score! You mastered the patterns.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
