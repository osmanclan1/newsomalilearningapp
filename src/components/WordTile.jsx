import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { getWordTranslation } from '../data/notes'

export default function WordTile({ id, word, variant = 'bank', onClick }) {
  const english = getWordTranslation(word)
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { word, variant },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  const inZone = variant === 'zone'

  return (
    <button
      ref={setNodeRef}
      type="button"
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`cursor-grab touch-manipulation rounded-xl border px-3 py-2 text-sm font-semibold shadow-sm transition active:cursor-grabbing ${
        inZone
          ? 'border-brand bg-brand text-white'
          : 'border-slate-200 bg-white text-slate-800 hover:border-violet-200'
      }`}
    >
      <span className="block leading-tight">{word}</span>
      {english && (
        <span
          className={`mt-0.5 block text-xs font-normal leading-tight ${
            inZone ? 'text-violet-200' : 'text-slate-500'
          }`}
        >
          {english}
        </span>
      )}
    </button>
  )
}
