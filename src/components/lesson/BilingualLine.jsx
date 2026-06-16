export default function BilingualLine({ primary, secondary, reverse = false }) {
  return (
    <div
      className={`rounded-xl border border-slate-100 bg-white px-4 py-3 ${
        reverse ? 'text-right' : ''
      }`}
    >
      <p className="text-base font-semibold text-slate-900">{primary}</p>
      {secondary && (
        <p className="mt-1 text-sm text-slate-500">{secondary}</p>
      )}
    </div>
  )
}
