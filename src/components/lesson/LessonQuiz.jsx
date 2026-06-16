import { useState } from 'react'

function QuestionBlock({ question, selectedId, checked, onSelect }) {
  const correct = selectedId === question.correctId

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {question.id === 'q1' ? 'Q1' : 'Q2'}
      </p>
      <p className="mt-1 text-lg font-bold text-slate-900">{question.promptSomali}</p>

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
              className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${optionClass} disabled:cursor-default`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      {checked && (
        <div
          className={`mt-4 rounded-xl px-3 py-2 text-sm ${
            correct ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-50 text-coral'
          }`}
        >
          <p className="font-semibold">
            {question.options.find((o) => o.id === question.correctId)?.label}
          </p>
          <p className="mt-0.5 text-slate-600">({question.explanation})</p>
        </div>
      )}
    </div>
  )
}

export default function LessonQuiz({ screen, onComplete }) {
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)

  const allAnswered = screen.questions.every((q) => answers[q.id])
  const allCorrect = screen.questions.every(
    (q) => answers[q.id] === q.correctId,
  )

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

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm leading-relaxed text-slate-700">{screen.body}</p>

      {screen.questions.map((q) => (
        <QuestionBlock
          key={q.id}
          question={q}
          selectedId={answers[q.id]}
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
          {screen.checkLabel}
        </button>
      )}

      {checked && !allCorrect && (
        <button
          type="button"
          onClick={() => {
            setAnswers({})
            setChecked(false)
          }}
          className="w-full rounded-xl border border-coral py-3 text-sm font-bold text-coral"
        >
          Try again
        </button>
      )}

      {checked && allCorrect && (
        <p className="text-center text-sm font-semibold text-emerald-600">
          Great! All answers correct.
        </p>
      )}
    </div>
  )
}
