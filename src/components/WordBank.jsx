import { useDroppable } from '@dnd-kit/core'
import WordTile from './WordTile'

export default function WordBank({ bankTiles, onTileClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'word-bank' })

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border border-transparent p-1 transition-colors ${
        isOver ? 'bg-slate-100' : ''
      }`}
    >
      <div className="flex flex-wrap justify-center gap-2">
        {bankTiles.map((tile) => (
          <WordTile
            key={tile.id}
            id={tile.id}
            word={tile.word}
            variant="bank"
            onClick={() => onTileClick(tile.id)}
          />
        ))}
      </div>
    </div>
  )
}
