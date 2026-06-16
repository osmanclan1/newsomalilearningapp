export default function LessonProgress({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            i === current
              ? 'w-8 bg-brand'
              : i < current
                ? 'w-2 bg-emerald-400'
                : 'w-2 bg-slate-200'
          }`}
          aria-hidden
        />
      ))}
      <span className="sr-only">
        Screen {current + 1} of {total}
      </span>
    </div>
  )
}
