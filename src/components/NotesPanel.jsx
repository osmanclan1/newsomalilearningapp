import { useEffect, useMemo, useRef, useState } from 'react'
import { notesSections } from '../data/notes'

function matchesQuery(item, query) {
  if (!query.trim()) return true
  const q = query.trim().toLowerCase()
  return (
    item.somali.toLowerCase().includes(q) || item.english.toLowerCase().includes(q)
  )
}

export default function NotesPanel({ open, onClose }) {
  const [query, setQuery] = useState('')
  const scrollRef = useRef(null)
  const itemRefs = useRef({})

  const filteredSections = useMemo(() => {
    if (!query.trim()) return notesSections
    return notesSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => matchesQuery(item, query)),
      }))
      .filter((section) => section.items.length > 0)
  }, [query])

  const firstMatchId = useMemo(() => {
    if (!query.trim()) return null
    for (const section of notesSections) {
      for (const item of section.items) {
        if (matchesQuery(item, query)) {
          return `${section.id}-${item.somali}`
        }
      }
    }
    return null
  }, [query])

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  useEffect(() => {
    if (!open || !firstMatchId) return
    const el = itemRefs.current[firstMatchId]
    const container = scrollRef.current
    if (!el || !container) return

    const frame = requestAnimationFrame(() => {
      const elTop = el.offsetTop
      const elBottom = elTop + el.offsetHeight
      const viewTop = container.scrollTop
      const viewBottom = viewTop + container.clientHeight
      if (elTop < viewTop || elBottom > viewBottom) {
        el.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [open, firstMatchId, query, filteredSections])

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity md:bg-black/20 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`fixed z-50 flex flex-col bg-white shadow-xl transition-transform duration-300 ease-out
          inset-x-0 bottom-0 top-auto max-h-[85vh] rounded-t-2xl
          md:inset-y-0 md:right-0 md:left-auto md:top-0 md:max-h-none md:w-80 md:rounded-none md:rounded-l-2xl
          ${open ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}
        `}
        role="dialog"
        aria-label="Study notes"
        aria-hidden={!open}
      >
        <div className="shrink-0 border-b border-slate-100 px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Notes</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Close notes"
            >
              ✕
            </button>
          </div>
          <label className="mt-3 block">
            <span className="sr-only">Search notes</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Somali or English…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </label>
        </div>

        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-3 pb-8 md:pb-4">
          {query.trim() && filteredSections.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">No matches found.</p>
          )}

          {(query.trim() ? filteredSections : notesSections).map((section) => (
            <section
              key={section.id}
              id={`notes-section-${section.id}`}
              className="mb-6 scroll-mt-4"
            >
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-brand">
                {section.title}
              </h3>
              <ul className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                {section.items.map((item) => {
                  const itemId = `${section.id}-${item.somali}`
                  const highlighted = query.trim() && matchesQuery(item, query)
                  return (
                    <li
                      key={item.somali}
                      ref={(node) => {
                        if (node) itemRefs.current[itemId] = node
                        else delete itemRefs.current[itemId]
                      }}
                      className={`flex items-center justify-between gap-3 px-3 py-2.5 transition-colors ${
                        highlighted ? 'bg-brand-soft' : ''
                      } ${firstMatchId === itemId ? 'ring-2 ring-inset ring-brand/40' : ''}`}
                    >
                      <span className="font-semibold text-slate-900">{item.somali}</span>
                      <span className="text-right text-sm text-slate-500">{item.english}</span>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
        <div className="mx-auto mb-2 h-1 w-10 shrink-0 rounded-full bg-slate-200 md:hidden" />
      </aside>
    </>
  )
}
