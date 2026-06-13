import { useDroppable } from '@dnd-kit/core'
import WordTile from './WordTile'

export default function DropZone({ zoneTiles, onTileClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'drop-zone' })

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[72px] rounded-xl border-2 border-dashed px-3 py-3 transition-colors ${
        isOver ? 'border-brand bg-brand-soft/60' : 'border-slate-300 bg-white/80'
      }`}
    >
      {zoneTiles.length === 0 ? (
        <p className="py-4 text-center text-sm text-slate-400">
          Tap or drag words here
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {zoneTiles.map((tile) => (
            <WordTile
              key={tile.id}
              id={tile.id}
              word={tile.word}
              variant="zone"
              onClick={() => onTileClick(tile.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
